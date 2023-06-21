using System.ComponentModel.DataAnnotations;

namespace CoreClaims.Infrastructure.BusinessRules
{
    public sealed class BusinessRuleOptions
    {
        [Range(0.0, 20000.0)]
        public decimal AutoApproveThreshold { get; set; } = 200;

        [Range(0.0, 20000.0)]
        public decimal RequireManagerApproval { get; set; } = 500;

        /// <summary>
        /// If true, use the DemoAdjudicatorId and DemoManagerAdjudicatorId values
        /// to override automatic assignments.
        /// </summary>
        public bool DemoMode { get; set; } = true;
        public string DemoAdjudicatorId { get; set; }
        public string DemoManagerAdjudicatorId { get; set; }
    }
}
