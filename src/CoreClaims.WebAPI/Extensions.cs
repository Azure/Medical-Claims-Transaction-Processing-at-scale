using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Helpers;

namespace CoreClaims.WebAPI
{
    internal static class Extensions
    {
        public static (int, int) GetPagingQuery(this HttpRequest req)
        {
            int offset = int.TryParse(req.Query["offset"], out offset) ? offset : 0;
            int limit = int.TryParse(req.Query["limit"], out limit) ? limit : Constants.DefaultPageSize;

            return (offset, limit);
        }

        public static (DateTime?, DateTime?) GetDateRangeQuery(this HttpRequest req)
        {
            DateTime? startDate = DateTime.TryParse(req.Query["startDate"], out DateTime start) ? start : null;
            DateTime? endDate = DateTime.TryParse(req.Query["endDate"], out DateTime end) ? end : null;

            return (startDate, endDate);
        }

        public static (string?, string?) GetSortQuery(this HttpRequest req)
        {
            var sortColumn = req.Query.ContainsKey("sortColumn") ? req.Query["sortColumn"].ToString() : null;
            var sortDirection = req.Query.ContainsKey("sortDirection") ? req.Query["sortDirection"].ToString() : null;

            // Valid values for sortDirection are "asc" and "desc"
            if (sortDirection != null && sortDirection != "asc" && sortDirection != "desc")
            {
                sortDirection = "asc";
            }

            return (sortColumn, sortDirection);
        }

        public static async Task<TRequest> GetRequest<TRequest>(this HttpRequest req) where TRequest : class
        {
            var body = await new StreamReader(req.Body).ReadToEndAsync();
            return JsonSerializationHelper.DeserializeItem<TRequest>(body);
        }
    }
}
