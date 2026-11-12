using CoreClaims.Infrastructure;
using CoreClaims.Infrastructure.Domain.Entities;
using CoreClaims.Infrastructure.Domain.Enums;
using CoreClaims.Infrastructure.Repository;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace CoreClaims.Publisher.Services
{
    public class DataSeedService
    {
        private readonly string _dataPath;
        private readonly AdjudicatorRepository _adjudicatorRepository;
        private readonly PayerRepository _payerRepository;
        private readonly MemberRepository _memberRepository;
        private readonly ProviderRepository _providerRepository;
        private readonly ClaimProcedureRepository _claimProcedureRepository;
        private readonly ClaimRepository _claimRepository;
        
        // Throttle settings to avoid overwhelming Cosmos DB
        private const int BatchSize = 100;
        private const int DelayBetweenBatchesMs = 1;

        public DataSeedService(
            AdjudicatorRepository adjudicatorRepository,
            PayerRepository payerRepository,
            MemberRepository memberRepository,
            ProviderRepository providerRepository,
            ClaimProcedureRepository claimProcedureRepository,
            ClaimRepository claimRepository,
            string dataPath = "data")
        {
            _adjudicatorRepository = adjudicatorRepository;
            _payerRepository = payerRepository;
            _memberRepository = memberRepository;
            _providerRepository = providerRepository;
            _claimProcedureRepository = claimProcedureRepository;
            _claimRepository = claimRepository;
            
            // If path is relative, resolve from current directory; otherwise use as-is
            _dataPath = Path.IsPathRooted(dataPath) 
                ? dataPath 
                : Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), dataPath));
        }

        /// <summary>
        /// Reads a JSONL file from the data root directory and deserializes it
        /// </summary>
        private async Task<List<T>> ReadJsonlFile<T>(string fileName)
        {
            var filePath = Path.Combine(_dataPath, fileName);
            var items = new List<T>();

            if (!File.Exists(filePath))
            {
                Console.WriteLine($"⚠️  File {filePath} not found, skipping...");
                return items;
            }

            var lines = await File.ReadAllLinesAsync(filePath);
            foreach (var line in lines)
            {
                if (!string.IsNullOrWhiteSpace(line))
                {
                    var item = JsonConvert.DeserializeObject<T>(line);
                    if (item != null)
                    {
                        items.Add(item);
                    }
                }
            }

            return items;
        }

        public async Task SeedAllDataAsync()
        {
            Console.WriteLine("=================================================");
            Console.WriteLine("Starting Data Seed Process");
            Console.WriteLine("=================================================\n");

            // Seed in order respecting dependencies
            await SeedAdjudicatorsAsync();
            await SeedPayersAsync();
            await SeedMembersAsync();
            await SeedProvidersAsync();
            await SeedClaimProceduresAsync();
            await SeedCoverageAsync();
            await SeedClaimsAsync();

            Console.WriteLine("\n=================================================");
            Console.WriteLine("Data Seed Process Completed Successfully!");
            Console.WriteLine("=================================================");
        }

        private async Task SeedAdjudicatorsAsync()
        {
            Console.WriteLine("📋 Seeding Adjudicators...");
            var adjudicators = await ReadJsonlFile<Adjudicator>("adjudicator.json");

            if (!adjudicators.Any())
            {
                Console.WriteLine("⚠️  No adjudicator data found, skipping...");
                return;
            }

            int count = 0;
            var tasks = new List<Task>();
            
            foreach (var adjudicator in adjudicators)
            {
                // Add metadata fields as per Synapse transformation
                adjudicator.CreatedOn = DateTime.UtcNow;
                adjudicator.ModifiedOn = DateTime.UtcNow;
                adjudicator.CreatedBy = "DataSeed";
                adjudicator.ModifiedBy = "DataSeed";
                adjudicator.Type = Adjudicator.EntityName;

                tasks.Add(_adjudicatorRepository.UpsertAdjudicator(adjudicator));
                count++;
                
                // Process batch when size is reached
                if (count % BatchSize == 0)
                {
                    await Task.WhenAll(tasks);
                    Console.WriteLine($"   Progress: {count} adjudicators loaded");
                    tasks.Clear();
                    if (DelayBetweenBatchesMs > 0)
                        await Task.Delay(DelayBetweenBatchesMs);
                }
            }
            
            // Process remaining items
            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
                Console.WriteLine($"   Progress: {count} adjudicators loaded");
            }

            Console.WriteLine($"✅ Loaded {count} adjudicators\n");
        }

        private async Task SeedPayersAsync()
        {
            Console.WriteLine("📋 Seeding Payers...");
            var payers = await ReadJsonlFile<Payer>("payers.json");

            if (!payers.Any())
            {
                Console.WriteLine("⚠️  No payer data found, skipping...");
                return;
            }

            int count = 0;
            var tasks = new List<Task>();
            
            foreach (var payer in payers)
            {
                // Add metadata fields as per Synapse transformation
                payer.CreatedOn = DateTime.UtcNow;
                payer.ModifiedOn = DateTime.UtcNow;
                payer.CreatedBy = "DataSeed";
                payer.ModifiedBy = "DataSeed";
                payer.Type = Payer.EntityName;

                tasks.Add(_payerRepository.UpsertPayer(payer));
                count++;
                
                // Process batch when size is reached
                if (count % BatchSize == 0)
                {
                    await Task.WhenAll(tasks);
                    Console.WriteLine($"   Progress: {count} payers loaded");
                    tasks.Clear();
                    if (DelayBetweenBatchesMs > 0)
                        await Task.Delay(DelayBetweenBatchesMs);
                }
            }
            
            // Process remaining items
            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
                Console.WriteLine($"   Progress: {count} payers loaded");
            }

            Console.WriteLine($"✅ Loaded {count} payers\n");
        }

        private async Task SeedMembersAsync()
        {
            Console.WriteLine("📋 Seeding Members...");
            var members = await ReadJsonlFile<Member>("patients.json");

            if (!members.Any())
            {
                Console.WriteLine("⚠️  No member data found, skipping...");
                return;
            }

            int count = 0;
            var tasks = new List<Task>();
            
            foreach (var member in members)
            {
                // Add metadata fields as per Synapse transformation
                member.CreatedOn = DateTime.UtcNow;
                member.ModifiedOn = DateTime.UtcNow;
                member.CreatedBy = "DataSeed";
                member.ModifiedBy = "DataSeed";
                member.Type = Member.EntityName;

                tasks.Add(_memberRepository.UpsertMember(member));
                count++;
                
                // Process batch when size is reached
                if (count % BatchSize == 0)
                {
                    await Task.WhenAll(tasks);
                    Console.WriteLine($"   Progress: {count} members loaded");
                    tasks.Clear();
                    if (DelayBetweenBatchesMs > 0)
                        await Task.Delay(DelayBetweenBatchesMs);
                }
            }
            
            // Process remaining items
            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
                Console.WriteLine($"   Progress: {count} members loaded");
            }

            Console.WriteLine($"✅ Loaded {count} members\n");
        }

        private async Task SeedProvidersAsync()
        {
            Console.WriteLine("📋 Seeding Providers...");
            var providers = await ReadJsonlFile<Provider>("providers.json");

            if (!providers.Any())
            {
                Console.WriteLine("⚠️  No provider data found, skipping...");
                return;
            }

            int count = 0;
            var tasks = new List<Task>();
            
            foreach (var provider in providers)
            {
                // Add metadata fields as per Synapse transformation
                provider.CreatedOn = DateTime.UtcNow;
                provider.ModifiedOn = DateTime.UtcNow;
                provider.CreatedBy = "DataSeed";
                provider.ModifiedBy = "DataSeed";
                provider.Type = Provider.EntityName;

                tasks.Add(_providerRepository.UpsertProvider(provider));
                count++;
                
                // Process batch when size is reached
                if (count % BatchSize == 0)
                {
                    await Task.WhenAll(tasks);
                    Console.WriteLine($"   Progress: {count} providers loaded");
                    tasks.Clear();
                    if (DelayBetweenBatchesMs > 0)
                        await Task.Delay(DelayBetweenBatchesMs);
                }
            }
            
            // Process remaining items
            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
                Console.WriteLine($"   Progress: {count} providers loaded");
            }

            Console.WriteLine($"✅ Loaded {count} providers\n");
        }

        private async Task SeedClaimProceduresAsync()
        {
            Console.WriteLine("📋 Seeding Claim Procedures...");
            var procedures = await ReadJsonlFile<ClaimProcedure>("claimprocedure.json");

            if (!procedures.Any())
            {
                Console.WriteLine("⚠️  No claim procedure data found, skipping...");
                return;
            }

            int count = 0;
            var tasks = new List<Task>();
            
            foreach (var procedure in procedures)
            {
                // Add metadata fields as per Synapse transformation
                procedure.CreatedOn = DateTime.UtcNow;
                procedure.ModifiedOn = DateTime.UtcNow;
                procedure.CreatedBy = "DataSeed";
                procedure.ModifiedBy = "DataSeed";
                procedure.Type = ClaimProcedure.EntityName;

                tasks.Add(_claimProcedureRepository.UpsertClaimProcedure(procedure));
                count++;
                
                // Process batch when size is reached
                if (count % BatchSize == 0)
                {
                    await Task.WhenAll(tasks);
                    Console.WriteLine($"   Progress: {count} claim procedures loaded");
                    tasks.Clear();
                    if (DelayBetweenBatchesMs > 0)
                        await Task.Delay(DelayBetweenBatchesMs);
                }
            }
            
            // Process remaining items
            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
                Console.WriteLine($"   Progress: {count} claim procedures loaded");
            }

            Console.WriteLine($"✅ Loaded {count} claim procedures\n");
        }

        private async Task SeedCoverageAsync()
        {
            Console.WriteLine("📋 Seeding Coverage...");
            var coverageList = await ReadJsonlFile<Coverage>("coverage.json");

            if (!coverageList.Any())
            {
                Console.WriteLine("⚠️  No coverage data found, skipping...");
                return;
            }

            int count = 0;
            var tasks = new List<Task>();
            
            foreach (var coverage in coverageList)
            {
                // Add metadata fields as per Synapse transformation
                coverage.CreatedOn = DateTime.UtcNow;
                coverage.ModifiedOn = DateTime.UtcNow;
                coverage.CreatedBy = "DataSeed";
                coverage.ModifiedBy = "DataSeed";
                coverage.Type = Coverage.EntityName;

                tasks.Add(_memberRepository.UpsertCoverage(coverage));
                count++;
                
                // Process batch when size is reached
                if (count % BatchSize == 0)
                {
                    await Task.WhenAll(tasks);
                    Console.WriteLine($"   Progress: {count} coverage records loaded");
                    tasks.Clear();
                    if (DelayBetweenBatchesMs > 0)
                        await Task.Delay(DelayBetweenBatchesMs);
                }
            }
            
            // Process remaining items
            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
                Console.WriteLine($"   Progress: {count} coverage records loaded");
            }

            Console.WriteLine($"✅ Loaded {count} coverage records\n");
        }

        private async Task SeedClaimsAsync()
        {
            Console.WriteLine("📋 Seeding Claims (Detail and Header)...");
            
            // Read ClaimDetail records from consolidated claims file
            var claimDetails = await ReadJsonlFile<ClaimDetail>("claims.json");

            if (!claimDetails.Any())
            {
                Console.WriteLine("⚠️  No claim data found, skipping...");
                return;
            }

            int count = 0;
            var tasks = new List<Task>();

            foreach (var claimDetail in claimDetails)
            {
                // Add metadata fields to ClaimDetail
                claimDetail.CreatedBy = "DataSeed";
                claimDetail.ModifiedBy = "DataSeed";

                // Use repository's CreateClaim which handles both detail and header transactionally
                tasks.Add(_claimRepository.CreateClaim(claimDetail));
                count++;
                
                // Process batch when size is reached
                if (count % BatchSize == 0)
                {
                    await Task.WhenAll(tasks);
                    Console.WriteLine($"   Progress: {count} claims loaded");
                    tasks.Clear();
                    if (DelayBetweenBatchesMs > 0)
                        await Task.Delay(DelayBetweenBatchesMs);
                }
            }
            
            // Process remaining items
            if (tasks.Any())
            {
                await Task.WhenAll(tasks);
                Console.WriteLine($"   Progress: {count} claims loaded");
            }

            Console.WriteLine($"✅ Loaded {count} claims (details and headers)\n");
        }
    }
}
