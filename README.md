# Cosmos DB NoSQL API - Medical Claims Handling

## Introduction

This repository provides a code sample in .NET on how you might use a combination of Azure Functions, Cosmos DB, and EventHub to implement an event-driven medical insurance claims process. With minimal changes this could be modified to work for other insurance processes.

## Requirements to deploy
> Setup shell was tested on WSL2 (Ubuntu 22.04.5 LTS)

* <a href="https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=apt#option-1-install-with-one-command" target="_blank">Install Azure CLI</a>

* <a href="https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools" target="_blank">Install Azure Functions Core Tools</a>

* <a href="https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu#install-the-sdk" target="_blank">Install .NET SDK 6.0</a>

* <a href="https://git-scm.com/download/linux" target="_blank">Install Git</a>

* Install `jq` JSON Processor command line tool
```bash
sudo apt install jq
```

## Setup environment

> The setup will provision and configure all the resources required.

* Sign in with Azure CLI

```bash
az login
```

* Clone the repo
```bash
git clone https://github.com/AzureCosmosDB/medical-claims
cd medical-claims/deploy/
```

* Run setup.sh with the appropriate parameters. Take note of the API's URIs for use when completed.
> Provide a non-existent resource group name. Setup will provision.

```bash
#SAMPLE
#./setup.sh 00000000-0000-0000-0000-000000000000 rg-coreclaims-demo WestUS3 myrandomsuffix

./setup.sh <subscription id> <resource group> <location> <resources suffix>
```

> Setup has some pause stages. Hit enter to continue when prompted. 
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
> - Synapse Workspace
> - Apache Spark Pool

* Run setup-synapse.sh with the appropriate parameters.

```bash
#SAMPLE
#./setup.sh 00000000-0000-0000-0000-000000000000 myrandomsuffix

./setup.sh <subscription id> <resources suffix>
```

> This setup will provision the Ingestion pipeline and supporting components in the Synapse workspace created in the previous step.
>
> Resources Created:
> - Linked Services for:
>   - Azure Blob Storage
>   - Azure Cosmos DB
> - Source/Sink datasets for the ingestion process
> - Notebook for transforming Synthea output
> - Pipeline for ingesting Synthea output into Cosmos Db Containers

## Generate Sample Data
> Requirements: Java 11 or new
```bash
sudo apt install openjdk-11-jre-headless
```

1. Clone and build Synthea
```bash
git clone https://github.com/synthetichealth/synthea
cd synthea
./gradlew build check test
```

2. Run Synthea to generate patient information
```bash
./run_synthea -c <medical-claims-path>/deploy/synthea-settings.properties
```
This config file will generate 10000 patients, each with a random number of claims. These files will be output to the `./output/csv` directory. Creating 10000 records took me around 15 minutes.

3. Upload these files to blob storage
The `setup.sh` script created a Blob Storage account with a container called `claimsfs`, create a folder in this account called `SyntheaInput` and upload all of these csv files to this folder.

> For more information customizing this generated patient data see: https://github.com/synthetichealth/synthea

## Ingest Sample Data

This will require logging into the azure portal, and accessing the Synapse workspace.

1. Log into the Synapse workspace in Synapse Studio
2. Locate the **Initial-Ingestion** pipeline in the **Integrate** section in the side menu
3. Click the **Debug** button to run the pipeline

> The time this pipeline takes to run will heavily depend on the volume of data generated from Synthea. In addition, the Spark pool will often take 2-3 minutes to start up the first time it's used.


## Running the sample

You can call Function APIs from Azure Portal or your favorite tool.
> Postman Exports are included in the `/docs` folder

### 1. Run the Claim Publisher

> This console app will generate random claims and publish them to the EventHub topic the FunctionApp subscribes to. Take note of one of the ClaimId uuids output from this tool.


```bash
cd ../src/CoreClaims.Publisher
dotnet run
```

### 2. Call GetClaimHistory function

```bash
#Setting variables
SUFFIX=<your suffix>
CLAIM_ID=<Claim UUID from Publisher>
FUNCTION_KEY=<FunctionApp Authorization Key from Portal>

curl "https://fa-coreclaims-$SUFFIX.azurewebsites/api/claim/$CLAIM_ID" \
    --request GET \
    --header "x-functions-key: $FUNCTION_KEY"
```

Check the status of the claim response. At this point it should be one of a few values

- If the member this claim belongs to doesn't have a Coverage record that is active for the `filingDate`, the claim should be `Rejected`
- If the `totalAmount` value is less than 200.00 (configurable) it should be `Approved`
- If the `totalAmount` value is greater than 200.00, it should be `Assigned`
- Finally, if your initial ingestion run has a large volume of claims, it's possible the ChangeFeed triggers are still catching up, and the status may be `Initial`

*Repeat these steps till you find a claim that has the status `Assigned`*

### 3. Call AcknowledgeClaim function

This is simulating an Adjudicator acknowledging the claim has been assigned to them in preparation for adjudication.

```bash
curl "https://fa-coreclaims-$SUFFIX.azurewebsites/api/claim/$CLAIM_ID" \
    --request POST \
    --header "x-functions-key: $FUNCTION_KEY" \
    --header "Content-Type: application/json" \
    --data-raw '{}'
```

### 3. Call AdjudicateClaim function

This is simulating an Adjudicator making any adjustments to a claim (applying discounts), and proposing an update, or denying a claim

```bash
curl "https://fa-coreclaims-$SUFFIX.azurewebsites/api/claim/$CLAIM_ID" \
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

Here you have some choices
- Setting `claimStatus` to `Denied` will finalize the claim as `Denied` and publish the final status of the claim to a `ClaimDenied` topic on the event hub
- Setting `claimStatus` to `Proposed` without changing the `lineItems`, or changing them such that the difference between the total before and after is less than 500.00 (configurable) will trigger automatic approval
- Setting `claimStatus` to `Proposed` while changing the `lineItems` so the total before and after differs by more than 500.00 will trigger manager approval, updating the status to `ApprovalRequired` and assigning a new adjudicator to the claim. At which point you can call the endpoint again, acting as the manager approver.

### 4. Reviewing the Claim history

```bash
curl "https://fa-coreclaims-$SUFFIX.azurewebsites/api/claim/$CLAIM_ID" \
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