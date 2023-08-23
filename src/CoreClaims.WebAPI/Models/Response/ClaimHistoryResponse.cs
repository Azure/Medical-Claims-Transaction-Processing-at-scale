using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.WebAPI.Models.Response
{
    public class ClaimHistoryResponse
    {
        public ClaimHeader Header { get; set; }

        public IEnumerable<ClaimDetail> History { get; set; }
    }
}
