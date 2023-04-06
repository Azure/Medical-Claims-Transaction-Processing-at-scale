using CoreClaims.Infrastructure.Domain.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class ClaimDetail : BaseEntity
    {
        public const string EntityName = nameof(ClaimDetail);

        public ClaimDetail()
        {
            Type = EntityName;
        }

        [JsonProperty("id")]
        public override string Id => $"claim:{ClaimId}:{AdjustmentId}";

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

        [JsonProperty("totalAmount")]
        public decimal TotalAmount { get; set; }

        [JsonProperty("payerId")]
        public string PayerId { get; set; }

        [JsonProperty("payerName")]
        public string PayerName { get; set; }

        [JsonProperty("providerId")]
        public string ProviderId { get; set; }

        [JsonProperty("providerName")]
        public string ProviderName { get; set; }

        [JsonProperty("filingDate")]
        public DateTime FilingDate { get; set; }

        [JsonProperty("lineItems")]
        public IEnumerable<LineItem> LineItems { get; set; }

        [JsonProperty("lastAdjudicatedDate")]
        public DateTime? LastAdjudicatedDate { get; set; }

        [JsonProperty("lastAmount")]
        public decimal? LastAmount { get; set; }

        [JsonProperty("comment")]
        public string Comment { get; set; }

        [JsonProperty("previousAdjudicatorId")]
        public string PreviousAdjudicatorId { get; set; }
    }
}
