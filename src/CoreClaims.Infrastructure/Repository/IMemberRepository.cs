﻿using CoreClaims.Infrastructure.Domain.Entities;

namespace CoreClaims.Infrastructure.Repository
{
    public interface IMemberRepository
    {
        Task<IEnumerable<ClaimHeader>> ListMemberClaims(string memberId, int offset, int limit, DateTime? startDate = null, DateTime? endDate = null, bool includeDenied = false);

        Task<IEnumerable<Coverage>> GetMemberCoverage(string memberId);

        Task<IEnumerable<Member>> ListMembers(int offset = 0, int limit = Constants.DefaultPageSize);

        Task<Member> IncrementMemberTotals(string memberId, int count, decimal amount);

        Task UpsertClaim(ClaimHeader claim);
    }
}
