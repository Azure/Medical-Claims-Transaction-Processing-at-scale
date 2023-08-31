using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreClaims.Infrastructure.Models
{
    public class Page<T> : IPage<T>
    {
        internal Page(int? total, int size, IEnumerable<T> items)
        {
            Total = total;
            Size = size;
            Items = items;
        }
        
        public int? Total { get; }
        
        public int Size { get; }
        
        public IEnumerable<T> Items { get; }
    }
}
