using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class ClaimProcedure : BaseEntity
    {
        [JsonProperty("id")]
        public override string Id => Code;

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }
    }
}
