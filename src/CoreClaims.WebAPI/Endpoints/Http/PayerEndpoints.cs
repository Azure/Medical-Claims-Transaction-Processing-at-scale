using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.WebAPI.Components;
using Microsoft.Extensions.Options;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class PayerEndpoints : EndpointsBase
    {
        private readonly IPayerRepository _repository;

        public PayerEndpoints(IPayerRepository repository,
            ILogger<PayerEndpoints> logger)
        {
            _repository = repository;
            Logger = logger;
            UrlFragment = "api/payers";
        }

        public override void AddRoutes(WebApplication app)
        {
            app.MapGet($"/{UrlFragment}", async (HttpRequest req) => await Get(req))
                .WithName("ListPayers");
        }

        protected virtual async Task<IResult> Get(HttpRequest req)
        {
            using (Logger.BeginScope("ListPayers"))
            {
                var (offset, limit) = req.GetPagingQuery();

                var result = await _repository.ListPayers(offset, limit);
                return Results.Ok(result);
            }
        }
    }
}
