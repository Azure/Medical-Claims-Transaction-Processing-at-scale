using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Models;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IPayerRepository
    {
        Task<IPageResult<Payer>> ListPayers(int offset = 0, int limit = Constants.DefaultPageSize);

        Task<Payer> GetPayer(string payerId);
    }
}
