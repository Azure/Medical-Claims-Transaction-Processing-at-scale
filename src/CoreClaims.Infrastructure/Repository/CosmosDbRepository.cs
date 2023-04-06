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

        protected async Task<IEnumerable<TEntity>> Query<TEntity>(QueryDefinition queryDefinition, PartitionKey? partitionKey = null) where TEntity : new()
        {
            var resultList = new List<TEntity>();
            var resultIterator = Container.GetItemQueryIterator<TEntity>(
                queryDefinition,
                requestOptions: new QueryRequestOptions { PartitionKey = partitionKey });

            while (resultIterator.HasMoreResults)
            {
                var response = await resultIterator.ReadNextAsync();
                resultList.AddRange(response);
            }

            return resultList;
        }

        protected async Task<TEntity> ReadItem<TEntity>(string partitionKey, string itemId) where TEntity : BaseEntity
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
