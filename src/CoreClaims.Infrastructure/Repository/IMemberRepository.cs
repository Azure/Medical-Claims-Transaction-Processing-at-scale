using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Models;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IMemberRepository
    {
        Task<IPageResult<ClaimHeader>> ListMemberClaims(string memberId, int offset, int limit, DateTime? startDate = null, DateTime? endDate = null, bool includeDenied = false,
            string sortColumn = "_ts",
            string sortDirection = "asc");

        Task<IEnumerable<Coverage>> GetMemberCoverage(string memberId);

        Task<IPageResult<Member>> ListMembers(int offset = 0, int limit = Constants.DefaultPageSize,
            string sortColumn = "_ts",
            string sortDirection = "asc");

        Task<Member> IncrementMemberTotals(string memberId, int count, decimal amount);

        Task UpsertClaim(ClaimHeader claim);

        Task<Member> Get(string memberId);
    }
}
