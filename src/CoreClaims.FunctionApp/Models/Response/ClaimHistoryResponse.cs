using System.Collections.Generic;
using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.FunctionApp.Models.Response
{
    public class ClaimHistoryResponse
    {
        public ClaimHeader Header { get; set; }

        public IEnumerable<ClaimDetail> History { get; set; }
    }
}
