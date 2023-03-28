using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class Coverage : BaseEntity
    {
        public const string EntityName = "Coverage";

        [JsonProperty("id")]
        public override string Id => $"coverage:{CoverageId}";

        [JsonProperty("type")]
        public string Type { get; set; } = EntityName;

        [JsonProperty("coverageId")]
        public string CoverageId { get; set; }

        [JsonProperty("memberId")]
        public string MemberId { get; set; }

        [JsonProperty("startDate")]
        public DateTime StartDate { get; set; }

        [JsonProperty("endDate")]
        public DateTime EndDate { get; set; }

        [JsonProperty("payerId")]
        public string PayerId { get; set; }
    }
}
