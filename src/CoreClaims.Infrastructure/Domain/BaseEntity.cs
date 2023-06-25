using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain
{
    public abstract class BaseEntity
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("id")]
        public abstract string Id { get; }

        [JsonProperty("createdBy")]
        public string CreatedBy { get; set; }

        [JsonProperty("createdOn")]
        public string CreatedOn { get; set; }
        //public DateTime? CreatedOn { get; set; }

        [JsonProperty("modifiedBy")]
        public string ModifiedBy { get; set; }

        [JsonProperty("modifiedOn")]
        public string ModifiedOn { get; set; }
        //public DateTime? ModifiedOn { get; set; }
    }
}
