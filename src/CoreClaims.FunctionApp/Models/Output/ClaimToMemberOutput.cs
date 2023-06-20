using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreClaims.FunctionApp.Models.Output
{
    public class ClaimToMemberOutput : OutputBase
    {
        [CosmosDBOutput(databaseName: Constants.Connections.CosmosDbName,
                containerName: "Member",
                Connection = Constants.Connections.CosmosDb)]
        public ClaimHeader Claim { get; set; }
    }
}
