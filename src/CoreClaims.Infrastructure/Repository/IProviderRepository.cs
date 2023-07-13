using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IProviderRepository
    {
        Task<IEnumerable<Provider>> ListProviders(int offset = 0, int limit = Constants.DefaultPageSize);

        Task<Provider> GetProvider(string providerId);
    }
}
