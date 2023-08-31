using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.WebAPI.Components;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class ProviderEndpoints : EndpointsBase
    {
        private readonly IProviderRepository _repository;
        
        public ProviderEndpoints(IProviderRepository repository,
            ILogger<ProviderEndpoints> logger)
        {
            _repository = repository;
            Logger = logger;
            UrlFragment = "api/providers";
        }

        public override void AddRoutes(WebApplication app)
        {
            app.MapGet($"/{UrlFragment}", async (HttpRequest req) => await Get(req))
                .WithName("ListProviders");
        }

        protected virtual async Task<IResult> Get(HttpRequest req)
        {
            using (Logger.BeginScope("ListProviders"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var (sortColumn, sortDirection) = req.GetSortQuery();

                var result = await _repository.ListProviders(offset, limit, sortColumn, sortDirection);
                return Results.Ok(result);
            }
        }
    }
}
