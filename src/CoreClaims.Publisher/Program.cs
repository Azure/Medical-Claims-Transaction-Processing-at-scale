using Azure.Identity;
using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Repository;
using CoreClaims.Publisher.Helpers;
using CoreClaims.Publisher.Services;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Extensions.Configuration;
using CoreClaims.Publisher.Model;
using System.Diagnostics;

namespace CoreClaims.Publisher
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            MainAsync(args).Wait();
        }

        public static async Task MainAsync(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("settings.json", optional: true, reloadOnChange: true)
                .AddCommandLine(args, new Dictionary<string, string>
                {
                    {"-m", $"{nameof(GeneratorOptions)}:{nameof(GeneratorOptions.RunMode)}"},
                    {"-s", $"{nameof(GeneratorOptions)}:{nameof(GeneratorOptions.SleepTime)}"},
                    {"-c", $"{nameof(GeneratorOptions)}:{nameof(GeneratorOptions.BatchSize)}"},
                    {"-i", $"{nameof(GeneratorOptions)}:{nameof(GeneratorOptions.ClaimId)}"},
                    {"-v", $"{nameof(GeneratorOptions)}:{nameof(GeneratorOptions.Verbose)}"}
                })
                .AddEnvironmentVariables()
                .Build();

            GeneratorOptions options = new();
            config.GetSection(nameof(GeneratorOptions))
                .Bind(options);

            if (string.IsNullOrEmpty(config[Constants.Connections.EventHubNamespace]))
            {
                Console.Error.WriteLine($"Missing config value: {Constants.Connections.EventHubNamespace}");
                return;
            }

            if (string.IsNullOrEmpty(config[Constants.Connections.CosmosDbEndpoint]))
            {
                Console.Error.WriteLine($"Missing config value: {Constants.Connections.CosmosDbEndpoint}");
                return;
            }
            
            var client = new CosmosClientBuilder(config[Constants.Connections.CosmosDbEndpoint], new DefaultAzureCredential())
                .Build();

            // Create repositories (used by both SeedData and normal modes)
            var adjudicatorRepository = new AdjudicatorRepository(client);
            var payerRepository = new PayerRepository(client);
            var memberRepository = new MemberRepository(client);
            var providerRepository = new ProviderRepository(client);
            var claimProcedureRepository = new ClaimProcedureRepository(client);
            var claimRepository = new ClaimRepository(client);

            // If SeedData mode, run seed and exit
            if (options.RunMode == GeneratorOptions.RunModeOption.SeedData)
            {
                Console.WriteLine("Starting initial data seed...");
                var stopwatch = Stopwatch.StartNew();
                var seedService = new DataSeedService(
                    adjudicatorRepository,
                    payerRepository,
                    memberRepository,
                    providerRepository,
                    claimProcedureRepository,
                    claimRepository,
                    options.DataPath);
                await seedService.SeedAllDataAsync();
                stopwatch.Stop();
                Console.WriteLine($"Data seed completed successfully in {stopwatch.Elapsed:hh\\:mm\\:ss\\.fff}");
                return;
            }

            Console.WriteLine("Loading Members...");
            var members = await memberRepository.ListMembers(0, 10000);
            var memberIds = members.Items.Select(m => m.MemberId).ToList();

            Console.WriteLine("Loading Payers...");
            var payers = await payerRepository.ListPayers();
            var payerIds = payers.Items.Select(p => p.PayerId).ToList();
            
            Console.WriteLine("Loading Providers...");
            var providers = await providerRepository.ListProviders();
            var providerIds = providers.Items.Select(p => p.ProviderId).ToList();

            Console.WriteLine("Loading Procedures...");
            var claimProcedures = await claimProcedureRepository.ListClaimProcedures();

            var eventHub = new EventHubService(config[Constants.Connections.EventHubNamespace]);
            var generator = new DataGenerator(memberIds, payerIds, providerIds, claimProcedures.Items.ToList());

            if (options.RunMode == GeneratorOptions.RunModeOption.Continuous)
            {
                Console.WriteLine($"Attempting to Create {options.BatchSize} claims every {options.SleepTime / 1000.0} seconds");
                await RunContinuous(eventHub, generator, options);
            }
            else
            {
                Console.WriteLine($"Creating {options.BatchSize} claims");
                await RunBatch(eventHub, generator, options);
            }
        }


        private static async Task RunContinuous(EventHubService eventHub, DataGenerator generator, GeneratorOptions options)
        {
            while(true)
            {
                await Task.WhenAll(
                    RunBatch(eventHub, generator, options),
                    Task.Delay(Math.Max(1, options.SleepTime))
                );
            } 
        }

        private static async Task RunBatch(EventHubService eventHub, DataGenerator generator, GeneratorOptions options)
        {
            var claims = generator.GenerateClaims(options);
            await eventHub.SendDataAsync(Constants.EventHubTopics.Incoming, claims);
            if (options.Verbose)
            {
                WriteClaims(claims);
            }
        }

        private static void WriteClaims(IEnumerable<CreateClaim> claims)
        {
            Console.WriteLine("Claims Batch Created:");
            foreach (var claim in claims)
            {
                Console.WriteLine($" - {claim.ClaimId} (Total: {claim.LineItems.Sum(i => i.Amount)})");
            }
        }
    }
}