using CoreClaims.Infrastructure.Domain.Entities;
using System.Collections.Generic;

namespace CoreClaims.Publisher.Model
{
    public class ClaimGeneratorOptions
    {
        public IEnumerable<Member> Members { get; set; }

        public IEnumerable<Payer> Payers { get; set; }

        public IEnumerable<Provider> Providers { get; set; }

        public IEnumerable<LineItem> LineItems { get; set; }

        public int NumberOfClaims { get; set; }

        public bool HasMember { get; set; }

        public bool IsResubmitted { get; set; }

        public ClaimGeneratorOptions()
        {
            NumberOfClaims = 1;
            HasMember = true;
            IsResubmitted = false;
        }
    }
}
