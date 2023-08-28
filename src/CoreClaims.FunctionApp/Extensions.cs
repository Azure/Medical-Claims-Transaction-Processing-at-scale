using System;
using System.IO;
using System.Threading.Tasks;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker.Http;

namespace CoreClaims.FunctionApp
{
    internal static class Extensions
    {
        public static (int, int) GetPagingQuery(this HttpRequestData req)
        {
            int offset = int.TryParse(req.Query["offset"], out offset) ? offset : 0;
            int limit = int.TryParse(req.Query["limit"], out limit) ? limit : Constants.DefaultPageSize;

            return (offset, limit);
        }

        public static (DateTime?, DateTime?) GetDateRangeQuery(this HttpRequestData req)
        {
            DateTime? startDate = DateTime.TryParse(req.Query["startDate"], out DateTime start) ? start : null;
            DateTime? endDate = DateTime.TryParse(req.Query["endDate"], out DateTime end) ? end : null;

            return (startDate, endDate);
        }

        public static (string?, string?) GetSortQuery(this HttpRequestData req)
        {
            var sortColumn = req.Query["sortColumn"];
            var sortDirection = req.Query["sortDirection"];

            // Valid values for sortDirection are "asc" and "desc"
            if (sortDirection != null && sortDirection != "asc" && sortDirection != "desc")
            {
                sortDirection = "asc";
            }

            return (sortColumn, sortDirection);
        }

        public static async Task<TRequest> GetRequest<TRequest>(this HttpRequestData req) where TRequest : class
        {
            var body = await new StreamReader(req.Body).ReadToEndAsync();
            return JsonSerializationHelper.DeserializeItem<TRequest>(body);
        }
    }
}
