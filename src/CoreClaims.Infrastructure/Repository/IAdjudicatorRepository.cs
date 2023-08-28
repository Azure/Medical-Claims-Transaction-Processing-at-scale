using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IAdjudicatorRepository
    {
        Task<(IEnumerable<ClaimHeader>, int)> GetAssignedClaims(string adjudicatorId, int offset = 0, int limit = Constants.DefaultPageSize);

        Task<Adjudicator> GetRandomAdjudicator(string role = "Adjudicator", int offset = 0, int limit = Constants.DefaultPageSize);

        Task<Adjudicator> GetAdjudicator(string adjudicatorId);

        Task UpsertClaim(ClaimHeader claim);
    }
}
