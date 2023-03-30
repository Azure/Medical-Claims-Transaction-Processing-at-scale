using Bogus;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Publisher.Model;

namespace CoreClaims.Publisher.Helpers
{
    public class DataGenerator
    {
        private readonly IReadOnlyList<string> _memberIds;
        private readonly IReadOnlyList<string> _payerIds;
        private readonly IReadOnlyList<string> _providerIds;
        private readonly IReadOnlyList<ClaimProcedure> _claimProcedures;

        public DataGenerator(IReadOnlyList<string> memberIds, IReadOnlyList<string> payerIds, IReadOnlyList<string> providerIds, IReadOnlyList<ClaimProcedure> claimProcedures)
        {
            _memberIds = memberIds;
            _payerIds = payerIds;
            _providerIds = providerIds;
            _claimProcedures = claimProcedures;
        }

        public IList<CreateClaim> GenerateClaims(GeneratorOptions options)
        {
            var fakeClaims = new Faker<CreateClaim>()
                .RuleFor(c => c.ClaimId,
                    _ => options.ClaimId ?? Guid.NewGuid().ToString())
                .RuleFor(c => c.ClaimStatus,
                    f => string.IsNullOrEmpty(options.ClaimId) ? ClaimStatus.Initial : ClaimStatus.Resubmitted)
                .RuleFor(c => c.PayerId, f => f.PickRandom<string>(_payerIds))
                .RuleFor(c => c.ProviderId, f => f.PickRandom<string>(_providerIds))
                .RuleFor(c => c.FilingDate, f => f.Date.Recent(30))
                .RuleFor(c => c.MemberId, f => f.Random.Number(0, 100) == 1 ? null : f.PickRandom<string>(_memberIds))
                .RuleFor(c => c.LineItems, f => f.PickRandom(_claimProcedures, 10).Select((p, i) => new LineItem
                {
                    LineItemNo = i + 1,
                    Amount = f.Finance.Amount(),
                    Discount = 0,
                    Description = p.Description,
                    ProcedureCode = p.Code,
                    ServiceDate = f.Date.Recent(30)
                }));

            return fakeClaims.Generate(options.BatchSize);
        }
    }
}
