using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IClaimProcedureRepository
    {
        Task<IEnumerable<ClaimProcedure>> ListClaimProcedures(int offset = 0, int limit = Constants.DefaultPageSize);
    }
}
