﻿using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;

namespace CoreClaims.WebAPI.Models
{
    public class UpdateClaimModel
    {
        public ClaimStatus ClaimStatus { get; set; }

        public IList<LineItem> LineItems { get; set; }

        public string Comment { get; set; }
    }
}
