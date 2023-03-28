using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IPayerRepository
    {
        Task<IEnumerable<Payer>> ListPayers(int offset = 0, int limit = Constants.DefaultPageSize);

        Task<Payer?> GetPayer(string payerId);
    }
}
