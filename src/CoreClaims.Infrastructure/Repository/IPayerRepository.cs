using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IPayerRepository
    {
        Task<(IEnumerable<Payer>, int)> ListPayers(int offset = 0, int limit = Constants.DefaultPageSize);

        Task<Payer> GetPayer(string payerId);
    }
}
