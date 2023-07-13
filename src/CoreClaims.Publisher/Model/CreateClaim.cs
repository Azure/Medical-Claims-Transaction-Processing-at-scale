using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreClaims.Publisher.Model
{
    public class CreateClaim
    {
        [JsonProperty("claimId")]
        public string ClaimId { get; set; }

        [JsonProperty("memberId")]
        public string MemberId { get; set; }

        [JsonProperty("adjustmentId")]
        public int AdjustmentId { get; internal set; }

        [JsonProperty("claimStatus")]
        [JsonConverter(typeof(StringEnumConverter))]
        public ClaimStatus ClaimStatus { get; set; }

        [JsonProperty("adjudicatorId")]
        public string AdjudicatorId { get; set; }

        [JsonProperty("payerId")]
        public string PayerId { get; set; }

        [JsonProperty("providerId")]
        public string ProviderId { get; set; }

        [JsonProperty("filingDate")]
        public DateTime FilingDate { get; set; }

        [JsonProperty("lineItems")]
        public IEnumerable<LineItem> LineItems { get; set; }
    }
}
