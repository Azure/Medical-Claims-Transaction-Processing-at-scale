using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Cosmos;

namespace CoreClaims.Infrastructure.Repository
{
    public class PayerRepository : CosmosDbRepository, IPayerRepository
    {
        public PayerRepository(CosmosClient client) :
            base(client, "Payer")
        {
        }

        public Task<IEnumerable<Payer>> ListPayers(int offset = 0, int limit = Constants.DefaultPageSize)
        {
            var query = new QueryDefinition("SELECT * FROM c OFFSET @offset LIMIT @limit")
                .WithParameter("@limit", limit)
                .WithParameter("@offset", offset);

            return Query<Payer>(query);
        }

        public Task<Payer?> GetPayer(string payerId)
        {
            return ReadItem<Payer>(payerId, payerId);
        }
    }
}
