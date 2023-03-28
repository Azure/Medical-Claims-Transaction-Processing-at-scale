using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class Adjudicator : BaseEntity
    {
        public const string EntityName = "Adjudicator";

        [JsonProperty("id")]
        public override string Id => AdjudicatorId;

        [JsonProperty("type")]
        public string Type { get; set; } = EntityName;

        [JsonProperty("adjudicatorId")]
        public string AdjudicatorId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("role")]
        public string Role { get; set; }
    }
}
