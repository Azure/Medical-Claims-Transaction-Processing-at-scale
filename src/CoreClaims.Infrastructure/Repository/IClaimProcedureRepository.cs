using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Models;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IClaimProcedureRepository
    {
        Task<IPageResult<ClaimProcedure>> ListClaimProcedures(int offset = 0, int limit = Constants.DefaultPageSize);
    }
}
