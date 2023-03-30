using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class LineItem
    {
        [JsonProperty("lineItemNo")]
        public int LineItemNo { get; set; }

        [JsonProperty("procedureCode")]
        public string ProcedureCode { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("amount")]
        public decimal Amount { get; set; }

        [JsonProperty("discount")]
        public decimal Discount { get; set; }

        [JsonProperty("serviceDate")]
        public DateTime ServiceDate { get; set; }
    }
}
