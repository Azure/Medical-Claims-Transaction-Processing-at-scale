using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreClaims.Infrastructure.Models
{
    /// <summary>
    /// Returns useful values for paging.
    /// Uses the same properties as <see cref="Page{T}"/> but adds additional properties for paging.
    /// Drew inspiration from the PagedQueryResult class in the Azure Cosmos DB Repository .NET SDK (https://github.com/IEvangelist/azure-cosmos-dotnet-repository)
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class PageResult<T> : Page<T>, IPageResult<T>
    {
        internal PageResult(
            int? total,
            int size,
            IEnumerable<T> items)
            : this(total, null, size, items)
        { }

        internal PageResult(
            int? total,
            int? offset,
            int size,
            IEnumerable<T> items)
            : base(total, size, items)
        {
            Offset = offset;
            PageNumber = (int)Math.Ceiling((double)(offset ?? 0) / size) + 1;
        }

        public int? TotalPages => GetTotalPages();

        public int? PageNumber { get; }

        public int? Offset { get; }

        public bool HasPreviousPage => PageNumber > 1;

        public bool? HasNextPage => TotalPages is not null ? PageNumber < TotalPages : null;

        public int? PreviousPageNumber => GetPreviousPageNumber();

        public int? PreviousOffset => GetPreviousOffset();

        public int? NextPageNumber => GetNextPageNumber();

        public int? NextOffset => GetNextOffset();

        private int? GetNextPageNumber()
        {
            if (HasNextPage is not null)
            {
                return HasNextPage.HasValue && PageNumber.HasValue ? PageNumber.Value + 1 : null;
            }

            return null;
        }

        private int? GetNextOffset()
        {
            if (HasNextPage is not null)
            {
                return HasNextPage.HasValue && Offset.HasValue ? Offset.Value + Size : null;
            }

            return null;
        }

        private int? GetTotalPages()
        {
            if (Total is not null)
            {
                return (int)Math.Abs(Math.Ceiling(Total.Value / (double)Size));
            }

            return null;
        }

        private int? GetPreviousPageNumber() => HasPreviousPage && PageNumber.HasValue ? PageNumber.Value - 1 : null;

        private int? GetPreviousOffset()
        {
            return HasPreviousPage && Offset.HasValue ? Offset.Value - Size : null;
        }
    }
}
