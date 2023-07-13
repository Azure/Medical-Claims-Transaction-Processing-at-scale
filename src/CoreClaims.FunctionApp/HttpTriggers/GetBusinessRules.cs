using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using CoreClaims.FunctionApp.HttpTriggers.Claims;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.BusinessRules;
using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CoreClaims.FunctionApp.HttpTriggers
{
    public class GetBusinessRules
    {
        private readonly IOptions<BusinessRuleOptions> _options;

        public GetBusinessRules(IOptions<BusinessRuleOptions> options)
        {
            _options = options;
        }
        
        [Function("GetBusinessRules")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "business-rules")] HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger<GetBusinessRules>();
            using (logger.BeginScope("HttpTrigger: GetBusinessRules"))
            {
                if (_options == null) return req.CreateResponse(HttpStatusCode.NotFound);

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(_options.Value);
                return response;
            }
        }
    }
}
