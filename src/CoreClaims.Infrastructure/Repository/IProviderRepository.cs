using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Models;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IProviderRepository
    {
        Task<IPageResult<Provider>> ListProviders(int offset = 0, int limit = Constants.DefaultPageSize,
            string sortColumn = "_ts",
            string sortDirection = "asc");

        Task<Provider> GetProvider(string providerId);
    }
}
