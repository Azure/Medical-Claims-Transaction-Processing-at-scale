using Bogus;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.Publisher.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreClaims.Publisher.Helpers
{
    public class DataGenerator
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IPayerRepository _payerRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly IClaimProcedureRepository _claimParticularRepository;

        public DataGenerator(
            IMemberRepository memberRepository,
            IPayerRepository payerRepository,
            IProviderRepository providerRepository,
            IClaimProcedureRepository claimParticularRepository)
        {
            _memberRepository = memberRepository;
            _payerRepository = payerRepository;
            _providerRepository = providerRepository;
            _claimParticularRepository = claimParticularRepository;
        }

        public async Task<IEnumerable<ClaimDetail>> GenerateClaimsDataAsync(int numOfLineItems)
        {
            var generatedClaims = new List<ClaimDetail>();

            var members = await _memberRepository.ListMembers();
            var payers = await _payerRepository.ListPayers();
            var providers = await _providerRepository.ListProviders();
            var claimProcedures = await _claimParticularRepository.ListClaimProcedures();

            // Generate claim line items.
            var lineItems = this.GenerateLineItem(claimProcedures, Math.Max(1, numOfLineItems));

            // Generate claims data.
            var options = new ClaimGeneratorOptions
            {
                Members = members,
                Payers = payers,
                Providers = providers,
                LineItems = lineItems
            };
            var claims = this.GenerateClaim(options);

            // Add generated claims data to response list.
            generatedClaims.AddRange(claims);
            
            return generatedClaims;
        }

        private IEnumerable<LineItem> GenerateLineItem(
            IEnumerable<ClaimProcedure> claimProcedures,
            int numberOfLineItems = 1)
        {
            int num = 1;
            int daysInterval = 2;
            var fakeLineItems = new Faker<LineItem>()
                .RuleFor(cl => cl.LineItemNo, _ => num++)
                .RuleFor(cl => cl.ProcedureCode, f => f.PickRandom(claimProcedures).Id)
                .RuleFor(cl => cl.Description, f => f.Commerce.ProductDescription())
                .RuleFor(cl => cl.Amount, f => f.Finance.Amount(0, 1000))
                .RuleFor(cl => cl.Discount, f => 0)
                .RuleFor(cl => cl.ServiceDate, _ => DateTime.Now.AddDays(-new Random().Next(daysInterval)));

            return fakeLineItems.Generate(new Random().Next(1, numberOfLineItems));
        }

        private IEnumerable<ClaimDetail> GenerateClaim(ClaimGeneratorOptions options)
        {
            int daysInterval = 1;
            var fakeClaims = new Faker<ClaimDetail>()
                .RuleFor(c => c.ClaimId, _ => Guid.NewGuid().ToString())
                .RuleFor(c => c.PayerId, f => f.PickRandom(options.Payers).Id)
                .RuleFor(c => c.ProviderId, f => f.PickRandom(options.Providers).Id)
                .RuleFor(c => c.TotalAmount, _ => options.LineItems.Sum(l => l.Amount - l.Discount))
                .RuleFor(c => c.FilingDate, _ => DateTime.Now.AddDays(-new Random().Next(daysInterval)))
                .RuleFor(c => c.LineItems, _ => options.LineItems);

            if (options.HasMember)
            {
                fakeClaims.RuleFor(c => c.MemberId, f => f.PickRandom(options.Members).Id);
            }

            if (options.IsResubmitted)
            {
                fakeClaims.RuleFor(c => c.ClaimStatus, _ => ClaimStatus.Resubmitted);
            }

            return fakeClaims.Generate(options.NumberOfClaims);
        }
    }
}
