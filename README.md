# Cosmos DB NoSQL API - Medical Claims Handling

## Introduction

This repository provides a code sample in .NET on how you might use a combination of Azure Functions, Cosmos DB, and EventHub to implement an event-driven medical insurance claims process. With minimal changes this could be modified to work for other insurance processes.

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

## Deployment

### Standard Deployments

From the `deploy/powershell` folder, run the following command. This should provision all of the necessary infrastructure, deploy builds to the function apps, deploy the frontend, and deploy necessary artifacts to the Synapse workspace.

```pwsh
.\Unified-Deploy.ps1 -resourceGroup <resource-group-name> `
                     -subscription <subscription-id>
```

### Deployments using an existing OpenAI service

For deployments that need to use an existing OpenAI service, run the following from the `deploy/powershell`.  This will provision all of the necessary infrastruction except the Azure OpenAI service and will deploy the function apps, the frontend, and Synapse artifacts.

```pwsh
.\Unified-Deploy.ps1 -resourceGroup <resource-group-name> `
                     -subscription <subscription-id> `
                     -openAiName <openAi-service-name> `
                     -openAiRg <openAi-resource-group-name> `
                     -openAiDeployment <openAi-completions-deployment-name>
```

### Enabling/Disabling Deployment Steps

The following flags can be used to enable/disable specific deployment steps in the `Unified-Deploy.ps1` script.

| Parameter Name | Description |
|----------------|-------------|
| stepDeployBicep | Enables or disables the provisioning of resources in Azure via Bicep templates (located in `./infrastructure`). Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/powershell/Deploy-Bicep.ps1` script.
| stepPublishFunctionApp | Enables or disables the publish and zip deployment of the `CorePayments.FunctionApp` project to the regional function apps present in the target resource group. Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/infrastructure/Publish-FunctionApp.ps1` script.
| stepDeployOpenAi | Enables or disables the provisioning of (or detection of an existing) Azure OpenAI service. If an explicit OpenAi resource group is not defined in the `openAiRg` parameter, the target resource group defaults to that passed in the `resourceGroup` parameter. Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/infrastructure/Deploy-OpenAi.ps1` script.
| stepPublishSite | Enables or disables the build and deployment of the static HTML site to the hosting storage account in the target resource group. Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/infrastructure/Publish-Site.ps1` script.
| stepSetupSynapse | Enables or disables the deployment of a Synapse artifacts to the target synapse workspace. Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/infrastructure/Setup-Synapse.ps1` script.
| stepLoginAzure | Enables or disables interactive Azure login. If disabled, the deployment assumes that the current Azure CLI session is valid. Valid values are 0 (Disabled). 

Example command:
```pwsh
cd deploy/powershell
./Unified-Deploy.ps1 -resourceGroup myRg `
                     -subscription 0000... `
                     -openAiName myOpenAi `
                     -openAiRg myOpenAiRg `
                     -openAiDeployment completions `
                     -stepLoginAzure 0 `
                     -stepDeployBicep 0 `
                     -stepPublishFunctionApp 1 `
                     -stepPublishSite 1
```

### Quickstart

1. After deployment is complete, go to the resource group for your deployment and open the Azure Storage Account prefixed with `web`.  This is the storage account hosting the static web app.
1. Select the `Static website` blade in the left-hand navigation pane and copy the site URL from the `Primary endpoint` field in the detail view.

    <p align="center">
        <img src="img/website-url.png" width="100%">
    </p>

1. Browse to the URL copied in the previous step to access the web app.
 
> 
> It takes around 3min to provision and configure resoures.
>
> Resources created:
> - Resource group
> - Azure Blob Storage (ADLS Gen2)
> - Azure Cosmos DB account (1 database with 1000 RUs autoscale shared with 4 collections, and 3 containers with dedicated RUs) with Analytical Store enabled
> - Azure Event Hub standard
> - Azure Functions Consumption Plan
> - Azure Application Insights
> - Azure OpenAI
> - Synapse Workspace (public access enabled)
>
> This setup will provision the Ingestion pipeline and supporting components in the Synapse workspace created in the previous step.
>
> Resources Created:
> - Linked Services for:
>   - Azure Blob Storage
>   - Azure Cosmos DB
> - Source/Sink datasets for the ingestion process
> - Pipeline for ingesting Synthea output into Cosmos Db Containers

## Generate Sample Data (Optional)
> Requirements: Java 11 or newer.
> 
> This step is **optional** if you want to create and load large historical dataset based on Synthea data generator.
>
> The repo has pre-generated small dataset files ready to use under `/deploy/csv` (this sample data has around 100 patients).
> If you want to continue with this step - note that building and generating sample data may take more than 15 minutes to complete.
```bash
sudo apt install openjdk-11-jdk
```

1. Clone and build Synthea
```bash
git clone https://github.com/synthetichealth/synthea
cd synthea
./gradlew build -x check
```

2. Run Synthea to generate patient information
```bash
./run_synthea -c <medical-claims-path>/deploy/synthea-settings.properties
```
This config file will generate 10000 patients, each with a random number of claims. These files will be output to the `./output/csv` directory. Creating 10000 records took me around 15 minutes.

> For more information customizing this generated patient data see: https://github.com/synthetichealth/synthea

## Ingest Sample Data

This will require logging into the azure portal, and accessing the Synapse workspace.

1. Create a folder `SyntheaInput` in blob storage container `claimsfs` created by `setup.sh` script and upload generated csv files 
    - Pre-generated data can be found in this repo under `/deploy/csv` (this sample data has around 100 patients)
    - If you generated your own using the above instructions these will be in `{clone-path}/synthea/output/csv` folder
1. Log into the Synapse workspace in Synapse Studio
2. Locate the **Initial-Ingestion** pipeline in the **Integrate** section in the side menu
3. Click the **Add trigger -> Trigger now** button to run the pipeline

> The time this pipeline takes to run will heavily depend on the volume of data generated from Synthea. In addition, the Spark pool will often take 2-3 minutes to start up the first time it's used.


## Running the sample

You can call Function APIs from Azure Portal or your favorite tool.
> Postman Exports are included in the `/postman` folder

### 1. Run the Claim Publisher

> This console app will generate random claims and publish them to the EventHub topic the FunctionApp subscribes to which then will be injested into Cosmos `Claim` container where we will store all Claim and Claim line item events data. **Take note of one of the ClaimId uuids output from this tool which has value over $500**.
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

### 2. Call GetSingleClaimById or GetClaimHistory functions to see Claim Status changes:

```bash
#Setting variables
SUFFIX=<your suffix>
CLAIM_ID=<Claim UUID from Publisher>
FUNCTION_KEY=<FunctionApp Authorization Key from Portal>

curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/claim/$CLAIM_ID" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```
> 
> then get history:
> 
```bash
#Setting variables
SUFFIX=<your suffix>
CLAIM_ID=<Claim UUID from Publisher>
FUNCTION_KEY=<FunctionApp Authorization Key from Portal>

curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/claim/$CLAIM_ID/history" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```

Check the status of the claim response. At this point it should be one of a few values

- If the member this claim belongs to doesn't have a Coverage record that is active for the `filingDate`, the claim should be `Rejected`
- If the `totalAmount` value is less than 200.00 (configurable) it should be `Approved`
- If the `totalAmount` value is greater than 200.00, it should be `Assigned`
- Finally, if your initial ingestion run has a large volume of claims, it's possible the ChangeFeed triggers are still catching up, and the status may be `Initial`

*Repeat these steps till you find a claim that has the status `Assigned` which will be assigned to random AdjudicatorId*

### 3. Call AcknowledgeClaim function

For simulation of manual claims Adjudication process we first need to call Claim Ackowledgement API to trigger downstream processing logic.
This is simulating an Adjudicator acknowledging the claim has been assigned to them in preparation for adjudication.

```bash
curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/claim/$CLAIM_ID/acknowledge" \
    --request POST \
    --header "x-functions-key: $FUNCTION_KEY" \
    --header "Content-Type: application/json" \
    --data-raw '{}'
```

### 3. Call AdjudicateClaim function
This is simulating an Adjudicator making any adjustments to a claim (applying discounts), and proposing an update, or denying a claim.

Once it is acknowledged in a previous step  - you can now execute this API to do a manual Adjudication based on following conditions for this API payload:

Here you have some choices
- Setting `claimStatus` to `Denied` will finalize the claim as `Denied` and publish the final status of the claim to a `ClaimDenied` topic on the event hub
- Setting `claimStatus` to `Proposed` without changing the `lineItems`, or changing them such that the difference between the total before and after is less than 500.00 (configurable) will trigger automatic approval 
- Setting `claimStatus` to `Proposed` while changing the `lineItems` so the total before and after differs by more than 500.00 will trigger manager approval, updating the status to `ApprovalRequired` and assigning a new adjudicator to the claim. At which point you can call the endpoint again, acting as the manager approver. To simulate this type of processing - copy `lineItems` array from GetClaimbyId output, paste/update in the payload for this API in addition to Status update with modified `discount` line item values total over $500.  

```bash
curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/claim/$CLAIM_ID" \
    --request PUT \
    --header "x-functions-key: $FUNCTION_KEY" \
    --header "Content-Type: application/json" \
    --data-raw '{
        "claimStatus": "Proposed",
        "comment": "<free text comment>",
        "lineItems": [
            ...
        ]
    }'
```



### 4. Reviewing the Claim history

```bash
curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/claim/$CLAIM_ID/history" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```

From the response you should be able to see the history of the various stages the claim has been too.
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

### 5. Post Run

Once a Claim reaches the `Denied` or `Approved` state, it will get published to another pair of EventHub topics for hypothetical downstream processing.

Note that when Claim get to final `Approved` state - member main document in `Member` container will get updated with increments of 2 additional attributes:
```
 "approvedCount": 6,
 "approvedTotal": 5851.93
```
which you can see by calling Read MemberId API ( see below reference APIs):

### 6. Additional Reference Read APIs

Functions support a set of additional Reference Read APIs:
1. GetMemberById

```bash
#Setting additional variables
MEMBER_ID=<Member UUID>

curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/member/$MEMBER_ID" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```



2. List Claims for MemberId

```bash
#Setting additional variables
MEMBER_ID=<Member UUID>

curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/member/$MEMBER_ID/claims?offset=0&limit=50" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```

3. List Claims for AdjudicatorId 

```bash
#Setting additional variables
ADJUDICATOR_ID=<Member UUID>

curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/adjudicator/$ADJUDICATOR_ID/claims?offset=0&limit=100" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```

5. List Providers

```bash

curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/providers?offset=0&limit=50" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```

4. List Payers
```bash

curl "https://fa-coreclaims-$SUFFIX.azurewebsites.net/api/payers?offset=0&limit=50" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```


# Clean Up

1. `CTRL + C` to stop Publisher app (if running in Continuous mode)
2. Delete the Resource Group to destroy all resources

# How to Contribute

If you find any errors or have suggestions for changes, please be part of this project!

1. Create your branch: `git checkout -b my-new-feature`
2. Add your changes: `git add .`
3. Commit your changes: `git commit -m '<message>'`
4. Push your branch to Github: `git push origin my-new-feature`
5. Create a new Pull Request 😄
