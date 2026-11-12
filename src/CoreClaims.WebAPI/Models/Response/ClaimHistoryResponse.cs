using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.WebAPI.Models.Response
{
    public class ClaimHistoryResponse
    {
        public required ClaimHeader Header { get; set; }

        public required IEnumerable<ClaimDetail> History { get; set; }
    }
}
