namespace CoreClaims.Infrastructure.BusinessRules
{
    public class BusinessRulesConfig
    {
        public decimal AutoApproveThreshold { get; set; } = 200;

        public decimal RequireManagerApproval { get; set; } = 500;
    }
}
