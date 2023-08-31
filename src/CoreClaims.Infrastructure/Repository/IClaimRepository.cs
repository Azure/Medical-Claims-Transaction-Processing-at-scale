using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Models;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IClaimRepository
    {
        Task<ClaimDetail> GetClaim(string claimId, int? adjustmentId = null);

        Task<ClaimHeader> GetClaimHeader(string claimId);

        Task<IPageResult<ClaimDetail>> GetClaimDetails(string claimId, int offset = 0, int limit = Constants.DefaultPageSize);

        Task<ClaimHeader> CreateClaim(ClaimDetail detail);

        Task<ClaimHeader> UpdateClaim(ClaimDetail detail);

        Task<(ClaimHeader, IEnumerable<ClaimDetail>)> GetClaimHistory(string claimId);
    }
}
