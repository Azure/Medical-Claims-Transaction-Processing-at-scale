using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoreClaims.Infrastructure.Domain.Entities;
using Newtonsoft.Json;

namespace CoreClaims.Infrastructure.Domain.Enums
{
    public enum AdjudicatorRole
    {
        [JsonProperty("Adjudicator")]
        Adjudicator,

        [JsonProperty("Manager")]
        Manager
    }
}
