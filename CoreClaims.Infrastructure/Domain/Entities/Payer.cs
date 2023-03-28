using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class Payer : BaseEntity
    {
        [JsonProperty("id")]
        public override string Id => PayerId;

        [JsonProperty("payerId")]
        public string PayerId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("phoneNumber")]
        public string PhoneNumber { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }
    }
}
