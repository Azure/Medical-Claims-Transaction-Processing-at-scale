using CoreClaims.Infrastructure.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CoreClaims.SemanticKernel
{
    public interface IRulesEngine
    {
        Task<string> ReviewClaim(ClaimDetail claim);
    }
}
