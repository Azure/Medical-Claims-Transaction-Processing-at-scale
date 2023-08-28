namespace CoreClaims.Infrastructure.Models;

public interface IPage<T>
{
    public int? Total { get; }
    public int Size { get; }
    public IEnumerable<T> Items { get; }
}