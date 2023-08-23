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
    public class ClaimProcedureEndpoints : EndpointsBase
    {
        private readonly IClaimProcedureRepository _repository;

        public ClaimProcedureEndpoints(IClaimProcedureRepository repository,
            ILogger<ClaimProcedureEndpoints> logger)
        {
            _repository = repository;
            Logger = logger;
            UrlFragment = "api/claim-procedures";
        }

        public override void AddRoutes(WebApplication app)
        {
            app.MapGet($"/{UrlFragment}", async (HttpRequest req) => await Get(req))
                .WithName("ListClaimProcedures");
        }

        protected virtual async Task<IResult> Get(HttpRequest req)
        {
            using (Logger.BeginScope("ListClaimProcedures"))
            {
                var (offset, limit) = req.GetPagingQuery();

                var result = await _repository.ListClaimProcedures(offset, limit);
                return Results.Ok(result);
            }
        }
    
    }
}
