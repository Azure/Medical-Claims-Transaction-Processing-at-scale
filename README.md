# Azure Cosmos DB & Azure OpenAI Service - Medical Claims Handling

## Introduction

This repository provides a code sample in .NET on how you might use a combination of Azure Functions, Azure Cosmos DB, Azure OpenAI Service and Azure Event Hubs to implement an event-driven medical insurance claims process. With minimal changes this could be modified to work for other insurance processes.

## Scenario

The scenario centers around a medical claims management solution. Members having coverage and making claims, providers who deliver services to the member and payers who provide the insurance coverage that pays providers for services to the members.

Claims submitted are submitted in a stream and loaded into the backing database for review and approval.

Business rules govern the automated or human approval of claims.

An AI powered co-pilot empowers agents with recommendations on how to process the claim.

## Solution Architecture

The solution architecture is represented by this diagram:

<p align="center">
    <img src="img/architecture.png" width="100%">
</p>

## Technical Details

Read the [Technical Details](./docs/technical-details.md) page for more information on the data models, application flow, deployed components, and other technical details of the solution.

## Deployment

Check the [Deployment](./docs/deployment.md) page for instructions on how to deploy the solution to your Azure subscription.

Once your deployment is complete, you can proceed to the [Quickstart](#quickstart) section.

### Publish the React web app after making changes

If you make changes to the React web app and want to redeploy it, run the following:

```pwsh
.\deploy\powershell\Publish-Site.ps1 -resourceGroup <resource-group-name> `
                     -storageAccount <storage-account-name (webcoreclaimsxxxx)>
```

### Setting RBAC permissions when running locally

When you run the solution locally, you will need to set role-based access control (RBAC) permissions on the Azure Cosmos DB account as well as the Azure Event Hubs namespace. You can do this by running the following commands in the Azure Cloud Shell or Azure CLI:

Assign yourself to the "Cosmos DB Built-in Data Contributor" role:

```bash
az cosmosdb sql role assignment create --account-name YOUR_COSMOS_DB_ACCOUNT_NAME --resource-group YOUR_RESOURCE_GROUP_NAME --scope "/" --principal-id YOUR_AZURE_AD_PRINCIPAL_ID --role-definition-id 00000000-0000-0000-0000-000000000002
```

The Web API triggers Event Hubs events, and the Worker Service consumes them. You will need to assign yourself to the "Azure Event Hubs Data Owner" role:

```bash
az role assignment create --assignee "YOUR_EMAIL_ADDRESS" --role "Azure Event Hubs Data Owner" --scope "/subscriptions/YOUR_AZURE_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP_NAME/providers/Microsoft.EventHub/namespaces/YOUR_EVENT_HUBS_NAMESPACE"
```

> Make sure you're signed in to Azure from Visual Studio before running the backend applications locally.

## Quickstart

1. After deployment is complete, go to the resource group for your deployment and open the Azure Storage Account prefixed with `web`.  This is the storage account hosting the static web app.
1. Select the `Static website` blade in the left-hand navigation pane and copy the site URL from the `Primary endpoint` field in the detail view.

    <p align="center">
        <img src="img/website-url.png" width="100%">
    </p>

1. Browse to the URL copied in the previous step to access the web app.
 
> 
> Resources created:
> - Resource Group
> - Azure Blob Storage (ADLS Gen2)
> - Azure Cosmos DB account (1 database with 1000 RUs autoscale shared with 4 collections, and 3 containers with dedicated RUs) with Analytical Store enabled
> - Azure Event Hubs standard
> - Azure Kubernetes Service (AKS)
> - Azure Application Insights
> - Azure OpenAI Service
> - Azure Synapse Workspace (public access enabled)
>
> This setup will provision the Ingestion pipeline and supporting components in the Azure Synapse workspace created in the previous step.
>
> Resources Created:
> - Linked Services for:
>   - Azure Blob Storage
>   - Azure Cosmos DB
> - Source/Sink datasets for the ingestion process
> - Pipeline for ingesting sample data into Azure Cosmos DB Containers

## Ingest Sample Data

This will require logging into the Azure portal and accessing the Azure Synapse workspace.

1. Log into the Azure Synapse workspace in Synapse Studio.
2. Locate the **Initial-Ingestion** pipeline in the **Integrate** section in the side menu.
3. Select **Add trigger -> Trigger now** to run the pipeline.

> The pipeline execution should take about 5 minutes to complete. You can monitor the progress of the pipeline by selecting the **Monitor** section in the side menu and selecting the **Pipeline runs** tab.

## Running the sample

You can run the sample application through the static website that was deployed as part of the setup process.

You can also work directly with the REST API by calling the Azure Function App APIs from Azure Portal or your favorite tool.
> Postman Exports are included in the `/postman` folder

### Run the Claim Publisher

**This step is optional** since you ingest sample data from the Azure Synapse workspace pipeline.

> This console app will generate random claims and publish them to the Azure Event Hubs topic the Worker Service subscribes to which then will be injested into Azure Cosmos DB `Claim` container where we will store all Claim and Claim line item events data. **Take note of one of the ClaimId uuids output from this tool which has value over $500**.
>
> Console app has 2 **"RunMode"** options configurable in *settings.json* under `./src/CoreClaims.Publisher` : "OneTime" (default) and "Continous" 
> as well as **"BatchSize"** (default - 10), **"Verbose"** (default - True) and **"SleepTime"** (default - 1000 ms).
>
>  *settings.json* example:
```
{
  "GeneratorOptions": {
    "RunMode": "OneTime",
    "BatchSize": 10,
    "Verbose": true,
    "SleepTime": 1000
  },
  "CoreClaimsCosmosDB": {
    "accountEndpoint": "AccountEndpoint=https://*COSMOS_ACC_NAME*.documents.azure.com:443/;AccountKey=*COSMOS_ACC_KEY*;"
  },
  "CoreClaimsEventHub": {
    "fullyQualifiedNamespace": "Endpoint=sb://*YOUR_EH_NAME*.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=*EH_KEY*"
  }
}
```

```bash
cd ../src/CoreClaims.Publisher
dotnet run
```

## Interact with the React web app

Browse to the URL copied in the previous step to access the web app.

### Managing the claims flow

- When a new claim is added:
  - If the member this claim belongs to doesn't have a Coverage record that is active for the `filingDate`, the claim should be `Rejected`
  - If the `totalAmount` value is less than 200.00 (configurable) it should be `Approved`
  - If the `totalAmount` value is greater than 200.00, it should be `Assigned`
  - Finally, if your initial ingestion run has a large volume of claims, it's possible the ChangeFeed triggers are still catching up, and the status may be `Initial`
- When the claim is assigned to an adjudicator:
  - Go to the Adjudicator page and select **Acknowledge Claim Assignment** and observe the flow of the claim through the system (change feed triggers, etc.). There should be claims assigned to both the Non-Manager and the Manager Adjudicators.
- When the claim is acknowledged:
  - The claim should be `Assigned` to the Adjudicator
  - Selecting **Deny Claim** will finalize the claim as `Denied` and publish the final status of the claim to a `ClaimDenied` topic on the event hub
  - Selecting **Propose Claim** without applying discounts on the Line Items, or changing them such that the difference between the total before and after is less than $500.00 (configurable) will trigger an automatic approval
  - Selecting **Propose Claim** while applying discounts on the Line Items so the total before and after differs by more than $500.00 will trigger manager approval, updating the status to `ApprovalRequired` and assigning a new adjudicator manager to the claim. Since we are hard-coding the Non-Manager and Manager Adjudicators, you should be able to select the Manager tab and see the claim assigned to the Manager Adjudicator.
    - A change from the original adjudicator to the adjudicator manager will publish the claim header to an `AdjudicatorChanged` event to the event hub.
    - The `CoreClaims.WorkerService` will pick up the `AdjudicatorChanged` event and delete the claim header record from the Non-Manager Adjudicator's queue. This way, we do not have to worry about the Non-Manager Adjudicator processing the claim after it has been assigned to the Manager Adjudicator. We also avoid the claim showing up in the Non-Manager Adjudicator's queue.
  
  <details>
      <summary>Technical Details</summary>
      Some technical background on this process: When adding new claims, they are currently assigned to an Adjudicator. When this happens, a `ClaimHeader` document is stored in the `Adjudicator` container. That container has the `adjudicatorId` as its partition key. As we know, it is not possible to change the partition key value of a document once it's been saved to the container. Because of this, if the claim gets reassigned to a manager, according to the core business rules, the claim details record is updated, triggering a downstream update of the `ClaimHeader` document stored in the `Adjudicator` container, this time **with a new `adjudicatorId`** value (the value of the assigned manager). In some cases, this value might not change, like if the claim was originally assigned to a manager. But in most cases, it does. When the adjudicator is reassigned, we get a **new** `ClaimHeader` record stored in the `Adjudicator` container from the `AdjudicatorRepository.UpsertClaim` method that gets called by the `ClaimUpdated` Change Feed trigger. Ideally, we would create a new batch transaction to delete the previous adjudicator's document and upsert the new adjudicator's document. This cannot be done since they live in different logical partitions. To get around this, we implement a Transactional Outbox pattern. This is why we publish the previous adjudicator's `ClaimHeader` document to the `AdjudicatorChanged` event topic before upserting the new adjudicator's `ClaimHeader` document. The downstream EventHub processor executes an idempotent method to delete the previous adjudicator's `ClaimHeader` document from the `Adjudicator` container if it exists.
  </details>

  > **Note**: If you propose a claim as an adjudicator manager, the claim will always be approved, regardless of the total discount amount.

- Reviewing the claim history:
  - Select **View History** on a claim row to see the history of the claim
  - All claims start in the `Initial` state, from here they can transition to
    - `Denied` if the member is uninsured
    - `Approved` if the total is less than 200
    - `Assigned` if the total is more than 200
  - From `Assigned` it transitions to `Acknowledged` when the adjudicator acknowledges the claim
  - From `Acknowledge` to
    - `Denied` if the adjudicator declines the claim
    - `Proposed` if the adjudicator proposes some updates
  - From `Proposed`
    - `Approved` if the changes are under a configured threshold
    - `ApprovalRequired` if the changes are over a threshold
  - From `ApprovalRequired` to
    - `Denied` or `Proposed`
- Final claim state:
  - Once a Claim reaches the `Denied` or `Approved` state, it will get published to another pair of EventHub topics for hypothetical downstream processing
  - Note that when a Claim gets to a final `Approved` state, the associated Member document within the `Member` container will get updated with increments of the following two attributes:
    - `approvedCount` - the number of claims that have been approved for this member
    - `approvedTotal` - the total amount of all claims that have been approved for this member

## Clean Up

1. `CTRL + C` to stop Publisher app (if running in Continuous mode)
2. Delete the Resource Group to destroy all resources

## How to Contribute

If you find any errors or have suggestions for changes, please be part of this project!

1. Create your branch: `git checkout -b my-new-feature`
2. Add your changes: `git add .`
3. Commit your changes: `git commit -m '<message>'`
4. Push your branch to Github: `git push origin my-new-feature`
5. Create a new Pull Request 😄
