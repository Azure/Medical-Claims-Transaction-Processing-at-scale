using CoreClaims.Infrastructure.Domain.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class Member : BaseEntity
    {
        public const string EntityName = nameof(Member);

        public Member()
        {
            Type = EntityName;
        }

        [JsonProperty("id")]
        public override string Id => MemberId;

        [JsonProperty("memberId")]
        public string MemberId { get; set; }

        [JsonProperty("memberType")]
        [JsonConverter(typeof(StringEnumConverter))]
        public MemberTypeEnum MemberType { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

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

        [JsonProperty("approvedCount")]
        public int ApprovedCount { get; set; }

        [JsonProperty("approvedTotal")]
        public decimal ApprovedTotal { get; set; }
    }
}
