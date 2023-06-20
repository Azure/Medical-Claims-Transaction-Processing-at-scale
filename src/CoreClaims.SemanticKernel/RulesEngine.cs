using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.SemanticKernel
{
    public class RulesEngine : IRulesEngine
    {
        public async Task<string> ReviewClaim(ClaimDetail claim)
        {
            return "Approve";
        }
    }
}