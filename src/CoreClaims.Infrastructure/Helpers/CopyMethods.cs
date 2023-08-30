using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CoreClaims.Infrastructure.Helpers
{
    public static class CopyMethods
    {
        public static T DeepCopyJson<T>(T input)
        {
            var jsonString = JsonSerializer.Serialize(input);
            return JsonSerializer.Deserialize<T>(jsonString);
        }
    }
}
