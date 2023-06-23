using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.HttpTriggers.Claims;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace CoreClaims.FunctionApp.HttpTriggers
{
    public class GetMember
    {
        [Function("GetMember")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "member/{memberId}")] HttpRequestData req,
            [CosmosDBInput(
                databaseName: Constants.Connections.CosmosDbName, 
                containerName: "Member", 
                Connection = Constants.Connections.CosmosDb,
                PartitionKey = "{memberId}", Id = "{memberId}")] Member member,
            FunctionContext context)
        {
            var logger = context.GetLogger<GetMember>();
            using (logger.BeginScope("HttpTrigger: GetMember"))
            {
                if (member == null) return req.CreateResponse(System.Net.HttpStatusCode.NotFound);

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(member);
                return response;
            }
        }
    }
}
