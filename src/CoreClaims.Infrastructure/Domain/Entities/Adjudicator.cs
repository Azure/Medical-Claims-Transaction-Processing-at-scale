using CoreClaims.Infrastructure.Domain.Enums;
using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class Adjudicator : BaseEntity
    {
        public const string EntityName = nameof(Adjudicator);

        public Adjudicator()
        {
            Type = EntityName;
        }

        [JsonProperty("id")]
        public override string Id => AdjudicatorId;

        [JsonProperty("adjudicatorId")]
        public string AdjudicatorId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("role")]
        public AdjudicatorRole Role { get; set; }
    }
}
