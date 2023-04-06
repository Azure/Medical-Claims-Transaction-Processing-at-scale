using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreClaims.Publisher
{

    public sealed class GeneratorOptions
    {
        public enum RunModeOption
        {
            OneTime,
            Continuous
        }

        public RunModeOption RunMode { get; set; } = RunModeOption.OneTime;

        public int BatchSize { get; set; } = 10;

        public string ClaimId { get; set; }

        public int SleepTime { get; set; } = 10000;

        public bool Verbose { get; set; } = true;
    }
}
