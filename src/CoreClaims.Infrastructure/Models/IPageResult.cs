namespace CoreClaims.Infrastructure.Models;

public interface IPageResult<T>
{
    int? TotalPages { get; }
    int? PageNumber { get; }
    bool HasPreviousPage { get; }
    bool? HasNextPage { get; }
    int? PreviousPageNumber { get; }
    int? NextPageNumber { get; }
    int? Total { get; }
    int Size { get; }
    IEnumerable<T> Items { get; }
}