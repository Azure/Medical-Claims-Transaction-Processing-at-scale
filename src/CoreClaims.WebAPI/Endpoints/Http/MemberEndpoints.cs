using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.WebAPI.Components;
using Microsoft.Extensions.Options;
using System.Net;

namespace CoreClaims.WebAPI.Endpoints.Http
{
    public class MemberEndpoints : EndpointsBase
    {
        private readonly IMemberRepository _repository;

        public MemberEndpoints(IMemberRepository repository,
            IOptions<BusinessRuleOptions> options,
            ILogger<MemberEndpoints> logger)
        {
            _repository = repository;
            Logger = logger;
            UrlFragment = "api/member";
        }

        public override void AddRoutes(WebApplication app)
        {
            app.MapGet($"/{UrlFragment}/{{memberId}}/claims", async (string memberId, HttpRequest request) => await ListMemberClaims(memberId, request))
                .WithName("ListMemberClaims");
            app.MapGet($"/{UrlFragment}/{{memberId}}", async (string memberId) => await GetMember(memberId))
                .WithName("GetMember");
            app.MapGet($"/{UrlFragment}s", async (HttpRequest request) => await ListMembers(request))
                .WithName("ListMembers");
            app.MapGet($"/{UrlFragment}/{{memberId}}/coverage", async (string memberId) => await GetMemberCoverage(memberId))
                .WithName("GetMemberCoverage");
        }

        protected virtual async Task<IResult> ListMemberClaims(string memberId, HttpRequest req)
        {
            using (Logger.BeginScope("ListMemberClaims"))
            {
                var (offset, limit) = req.GetPagingQuery();
                var (startDate, endDate) = req.GetDateRangeQuery();

                var result = await _repository.ListMemberClaims(memberId, offset, limit, startDate, endDate);
                return Results.Ok(result);
            }
        }

        protected virtual async Task<IResult> GetMember(string memberId)
        {
            using (Logger.BeginScope("GetMember"))
            {
                var result = await _repository.Get(memberId);
                if (result == null) return Results.NotFound();
                return Results.Ok(result);
            }
        }

        protected virtual async Task<IResult> ListMembers(HttpRequest req)
        {
            using (Logger.BeginScope("ListMembers"))
            {
                var (offset, limit) = req.GetPagingQuery();

                var result = await _repository.ListMembers(offset, limit);
                return Results.Ok(result);
            }
        }

        protected virtual async Task<IResult> GetMemberCoverage(string memberId)
        {
            using (Logger.BeginScope("GetMemberCoverage"))
            {
                var result = await _repository.GetMemberCoverage(memberId);
                var coverage = result.FirstOrDefault();
                return Results.Ok(coverage);
            }
        }
    }
}
