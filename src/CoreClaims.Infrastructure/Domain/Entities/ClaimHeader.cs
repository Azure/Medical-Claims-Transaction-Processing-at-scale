using CoreClaims.Infrastructure.Domain.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class ClaimHeader : BaseEntity
    {
        public const string EntityName = nameof(ClaimHeader);

        public ClaimHeader()
        {
            Type = EntityName;
        }

        public ClaimHeader(ClaimDetail detail) : this()
        {
            ClaimId = detail.ClaimId;
            MemberId = detail.MemberId;
            PayerId = detail.PayerId;
            PayerName = detail.PayerName;
            ProviderId = detail.ProviderId;
            ProviderName = detail.ProviderName;
            AdjudicatorId = detail.AdjudicatorId;
            ClaimStatus = detail.ClaimStatus;
            TotalAmount = detail.LineItems.Sum(v => v.Amount - v.Discount);
            FilingDate = detail.FilingDate;
            AdjustmentId = detail.AdjustmentId;
            CreatedOn = detail.CreatedOn;
            CreatedBy = detail.CreatedBy;
            ModifiedOn = detail.ModifiedOn;
            ModifiedBy = detail.ModifiedBy;
            LastAdjudicatedDate = detail.LastAdjudicatedDate;
            LastAmount = detail.LastAmount;
        }

        [JsonProperty("id")]
        public override string Id => $"claim:{ClaimId}";

        [JsonProperty("claimId")]
        public string ClaimId { get; set; }

        [JsonProperty("memberId")]
        public string MemberId { get; set; }

        [JsonProperty("payerId")]
        public string PayerId { get; set; }

        [JsonProperty("payerName")]
        public string PayerName { get; set; }

        [JsonProperty("providerId")]
        public string ProviderId { get; set; }

        [JsonProperty("providerName")]
        public string ProviderName { get; set; }

        [JsonProperty("adjudicatorId")]
        public string AdjudicatorId { get; set; }

        [JsonProperty("claimStatus")]
        [JsonConverter(typeof(StringEnumConverter))]
        public ClaimStatus ClaimStatus { get; set; }

        [JsonProperty("adjustmentId")]
        public int AdjustmentId { get; set; }

        [JsonProperty("totalAmount")]
        public decimal TotalAmount { get; set; }

        [JsonProperty("filingDate")]
        public DateTime FilingDate { get; set; }

        [JsonProperty("lastAdjudicatedDate")]
        public DateTime? LastAdjudicatedDate { get; set; }

        [JsonProperty("lastAmount")]
        public decimal? LastAmount { get; set; }
    }
}
