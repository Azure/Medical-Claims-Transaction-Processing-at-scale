using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IClaimRepository
    {
        Task<ClaimDetail?> GetClaim(string claimId, int? adjustmentId = null);

        Task<ClaimHeader?> GetClaimHeader(string claimId);

        Task<IEnumerable<ClaimDetail>> GetClaimDetails(string claimId, int offset = 0, int limit = Constants.DefaultPageSize);

        Task<ClaimHeader> CreateClaim(ClaimDetail detail);

        Task<ClaimHeader> UpdateClaim(ClaimDetail detail);
    }
}
