using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.WebAPI.Components;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using Azure;
using CoreClaims.WebAPI;
using CoreClaims.Infrastructure;
using CoreClaims.WebAPI.Models.Response;
using CoreClaims.Infrastructure.Events;
using CoreClaims.SemanticKernel;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class AdjudicatorEndpoints : EndpointsBase
    {
        private readonly IAdjudicatorRepository _repository;

        public AdjudicatorEndpoints(IAdjudicatorRepository repository,
            ILogger<AdjudicatorEndpoints> logger)
        {
            _repository = repository;
            Logger = logger;
            UrlFragment = "api/adjudicator";
        }

        public override void AddRoutes(WebApplication app)
        {
            app.MapGet($"/{UrlFragment}/{{adjudicatorId}}/claims", async (string adjudicatorId, HttpRequest req) => await ListAssignedClaims(adjudicatorId, req))
                .WithName("ListAssignedClaims");
        }

        protected virtual async Task<IResult> ListAssignedClaims(string adjudicatorId, HttpRequest req)
        {
            using (Logger.BeginScope("ListAssignedClaims"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var (sortColumn, sortDirection) = req.GetSortQuery();

                var result = await _repository.GetAssignedClaims(adjudicatorId, offset, limit, sortColumn, sortDirection);
                return Results.Ok(result);
            }
        }
    
    }
}
