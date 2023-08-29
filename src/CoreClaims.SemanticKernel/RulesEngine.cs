using CoreClaims.Infrastructure.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;
using System.Text.Json;
using System.Transactions;

namespace CoreClaims.SemanticKernel
{
    public class RulesEngine : IRulesEngine
    {
        readonly RulesEngineSettings _settings;

        public RulesEngine(
            IOptions<RulesEngineSettings> settings )
        {
            _settings = settings.Value;
        }

        public async Task<string> ReviewClaim(ClaimDetail claim)
        {
            await Task.CompletedTask;

            var builder = new KernelBuilder();

            builder.WithAzureChatCompletionService(
                     _settings.OpenAICompletionsDeployment,
                     _settings.OpenAIEndpoint,
                     _settings.OpenAIKey);

            var kernel = builder.Build();

            string skPrompt = @"
            You are an insurance claim review agent. You are provided data about a claim in JSON format and rules to evaluate the claim and classify it with a review result. 
            For a given claim you must specify one of the following results:
            - [No Action]
            - [Approve]
            - [Deny]
            - [Send to supervisor]

            First summarize the claim by providing the ""TotalAmount"" and the sum of ""Amount"" values.
            Then evaluate the claim according to the review rules and your summary. You must base your review result only on the rules provided and not use any other source for your decision. 
            You must also explain your reasoning for the review result you provide.

            Evaluate the following rules in order such that all Deny rules are evaluated before Approve rules.

            Review Rules
            - [No Action]: if the value of ""ClaimStatus"" is either 3, 4, 5, or 6 the claim has already been processed so the result is No Action.  
            - [Deny]: Let X = the ""TotalAmount"" value. Let Y = the sum of ""Amount"" values. If X is not equal to Y then the result is Deny.
            - [Approve]: if none of the Deny rules match, approve the claim.
            - [Send to supervisor]: send the claim to the supervisor if you don't know what to do, the applicable rules are contradictory or the rules do not explain what to do in this case.

            For example:

            +++

            [INPUT]
            {
              ""TotalAmount"": 0.91,
              ""LineItems"": [
                {
                  ""LineItemNo"": 1,
                  ""ProcedureCode"": ""314076"",
                  ""Description"": ""lisinopril 10 MG Oral Tablet"",
                  ""Amount"": 0.91,
                  ""Discount"": 0,
                  ""ServiceDate"": ""2023-01-17T21:02:18Z""
                }
              ],
              ""Comment"": ""[Automatic] Approved: Less than threshold of 200"",
              ""PreviousAdjudicatorId"": null,
            }
            [END INPUT]

            Provide your response as completions to the following bullets:
            - Summary:
                 The ""TotalAmount"" is 0.91 and the sum of ""Amount"" values is 0.91.
            - Review Result: 
                No Action
            - Reasoning: 
                The value of ""ClaimStatus"" is 3 meaning the claim has already been processed so the result is No Action.


            +++

            [INPUT]
            {
              ""AdjustmentId"": 1,
              ""ClaimStatus"": 1,
              ""TotalAmount"": 231.91,
              ""LineItems"": [
                {
                  ""LineItemNo"": 1,
                  ""ProcedureCode"": ""314076"",
                  ""Description"": ""lisinopril 10 MG Oral Tablet"",
                  ""Amount"": 0.91,
                  ""Discount"": 0,
                  ""ServiceDate"": ""2023-01-17T21:02:18Z""
                }
              ],
              ""Comment"": """",
            }
            [END INPUT]

            Provide your response as completions to the following bullets:
            - Summary:
                 The ""TotalAmount"" is 231.91 and the sum of ""Amount"" values is 0.91.
            - Review Result: 
                Deny
            - Reasoning: 
                The ""TotalAmount"" (231.91) is greater than 200.00.

            +++

            [INPUT]
            {{$claim}}
            [END INPUT]

            Provide your response as completions to the following bullets replacing the values in square brackets:
            - Summary:
                [Your Summary of the claim]
            - Review Result:
                [Your Review Result]
            - Reasoning:
                [Your Review Result Reasoning]
            ";

            var reviewer = kernel.CreateSemanticFunction(skPrompt, "review", "ReviewSkill", description: "Review the claim and make approval or denial recommendation.", maxTokens: 2000, temperature: 0.0);

            JsonSerializerOptions ser_options = new()
            {
                WriteIndented = true,
                MaxDepth = 20,
                AllowTrailingCommas = true,
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip,
            };

            string claimData = JsonSerializer.Serialize(claim, ser_options);

            var context = kernel.CreateNewContext();
            context["claim"] = claimData;

            var response = await reviewer.InvokeAsync(context);

            string result;
            if (response.ErrorOccurred)
            {
                result = response.LastException.ToString();
            }
            else
            {
                result = response.Result;
            }

            return result;
        }
    }
}