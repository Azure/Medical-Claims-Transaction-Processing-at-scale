using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain
{
    public abstract class BaseEntity
    {
        [JsonProperty("id")]
        public abstract string Id { get; }

        [JsonProperty("createdBy")]
        public string CreatedBy { get; set; }

        [JsonProperty("createdOn")]
        public DateTime? CreatedOn { get; set; }

        [JsonProperty("modifiedBy")]
        public string ModifiedBy { get; set; }

        [JsonProperty("modifiedOn")]
        public DateTime? ModifiedOn { get; set; }
    }
}
