﻿using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.Infrastructure.BusinessRules
{
    public interface ICoreBusinessRule
    {
        Task<ClaimDetail> AssignClaim(ClaimDetail claim);

        Task<(ClaimDetail, bool)> AdjudicateClaim(ClaimDetail claim);
    }
}
