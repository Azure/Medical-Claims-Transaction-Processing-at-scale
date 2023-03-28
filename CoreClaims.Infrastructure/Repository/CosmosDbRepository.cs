using CoreClaims.Infrastructure.Domain;
using Microsoft.Azure.Cosmos;
using System.Net;

namespace CoreClaims.Infrastructure.Repository
{
    public class CosmosDbRepository
    {
        private readonly CosmosClient _client;
        private readonly Database _database;

        protected Container Container { get; }

        public CosmosDbRepository(CosmosClient client, string containerName)
        {
            _client = client;
            _database = _client.GetDatabase(Constants.Connections.CosmosDbName);

            Container = _database.GetContainer(containerName);
        }

        protected async Task<IEnumerable<TEntity>> Query<TEntity>(QueryDefinition queryDefinition) where TEntity : BaseEntity
        {
            List<TEntity> resultList = new List<TEntity>();
            FeedIterator<TEntity> resultIterator = this.Container.GetItemQueryIterator<TEntity>(queryDefinition);
            while (resultIterator.HasMoreResults)
            {
                FeedResponse<TEntity> response = await resultIterator.ReadNextAsync();
                resultList.AddRange(response);
            }
            return resultList;
        }

        protected async Task<TEntity?> ReadItem<TEntity>(string partitionKey, string itemId) where TEntity : BaseEntity
        {
            try
            {
                return await Container.ReadItemAsync<TEntity>(itemId, new PartitionKey(partitionKey));
            }
            catch (CosmosException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    return null;
                }

                throw;
            }
        }
    }
}
