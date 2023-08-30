---
title: Requirements
status: Draft
created: 2023-03-08T10:27:24-08:00
updated: 2023-03-20T14:45:47-07:00
---

# Core Claims Requirements

## Data Model

CosmosDB with Multiple Containers for logically separate data

### Mutable Entity Fields

Mutable entities will contain a set of audit trail fields. These should automatically be set whenever a value is created/modified

| Field      | Type     | Notes                                   |
| ---------- | -------- | --------------------------------------- |
| createdOn  | DateTime |                                         |
| createdBy  | string   | Set once on create                      |
| modifiedOn | DateTime |                                         |
| modifiedBy | string   | Set whenever changed (including create) |

### Container: Member
**Entities**: Member, Coverage, ClaimHeader  
**Partition Key**: `memberId`  

#### Entity: Member
**Extends**: MutableEntity  

| Field          | Type           | Notes                                             |
| -------------- | -------------- | ------------------------------------------------- |
| id             | string         | row key (`{memberId}`?)                           |
| type           | string         | `MemberDetail`, entity discriminator              |
| memberId       | string         | uniqueId of member                                |
| memberType     | enum           | `self`, `spouse`, `dependent`                     |
| title          | string         |                                                   |
| firstName      | string         |                                                   |
| lastName       | string         |                                                   |
| email          | string (email) |                                                   |
| address        | string         | 123 Main Street                                   |
| city           | string         | Redmond                                           |
| state          | string         | Washington                                        |
| country        | string         | United States                                     |
| phoneNumber    | string         |                                                   |
| approved.count | number         | 0, increment every time a claim is approved       |
| approved.total | decimal        | 0, increment by claimTotal when claim is approved |

#### Entity: Coverage
**Extends**: MutableEntity  

| Field     | Type     | Notes                                                  |
| --------- | -------- | ------------------------------------------------------ |
| id        | string   | row key (new `coverage:{guid}`?), essentially policyId |
| memberId  | string   | foreign key, Member this claim belongs to              |
| type      | string   | `Coverage`, entity discriminator                       |
| startDate | DateTime |                                                        |
| endDate   | DateTime |                                                        |
| payerId   | string   | foreign key of payer (ie: Insurer)                     | 

### Container: Claim
**Entities**: ClaimHeader, ClaimDetail  
**Partition Key**: `claimId`  

A single `ClaimHeader` will exist per claim, `ClaimDetail`s will be replaced, rather than updated, creating an audit trail.

#### Entity: Claim Header
**Extends**: MutableEntity

| Field               | Type     | Notes                                                                                                  |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| id                  | string   | row key (`claim:{claimId}`?)                                                                           |
| type                | string   | `ClaimHeader`, type discriminator                                                                      |
| claimId             | string   | unique key for this claim                                                                              |
| memberId            | string   | foreign key, Member this claim belongs to                                                              |
| payerId             | string   | foreign key, Payer this claim will be paid by                                                          |
| payerName           | string   | redundant from Payer to improve querying                                                               |
| adjudicatorId       | string   | foreign key, Adjudicator                                                                               |
| providerId          | string   | foreign key, Provider                                                                                  |
| providerName        | string   | redundant from Provider to improve querying                                                            |
| claimStatus         | enum     | `Initial`, `Assigned`, `Acknowledged`, `Proposed`, `Denied`, `ApprovalRequired`, `Complete`, `Pending` | 
| amount              | decimal  | Aggregate of lineItems `lineItems.sum(i => i.amount - i.discount)`                                     |
| filingDate          | DateTime | set on create                                                                                          |
| lastAdjudicatedDate | DateTime | set when adjudicator API called                                                                        |
| lastAmount          | decimal  | Set when adjudicator API called                                                                        |
| adjustmentId        | number   | id of the latest adjustment                                                                            |


#### Entity: Claim Detail
**Extends**: MutableEntity  

| Field         | Type       | Notes                                                                                    |
| ------------- | ---------- | ---------------------------------------------------------------------------------------- |
| id            | string     | row key (`{adjustmentId}`?)                                                              |
| type          | string     | `ClaimDetail`, type discriminator                                                        |
| memberId      | string     | member this claim belongs to                                                             |
| adjustmentId  | number     | incrementing version number of this adjustment (0 on create, +1 each time it's updated?) |
| claimId       | string     | id of the ClaimHeader                                                                    |
| claimStatus   | enum       | `Initial`, `Assigned`, `Acknowledged`, `Proposed`, `Rejected`, `Complete`, `Resubmitted` | 
| adjudicatorId | string     | Assigned Adjudicator                                                                     |
| totalAmount   | decimal    | Aggregate of lineItems `lineItems.sum(i => i.amount - i.discount)`                       |
| lineItems     | LineItem[] | Array of line claim line items                                                           |
 
| LineItem: Field | Type     | Notes                          |
| --------------- | -------- | ------------------------------ |
| lineItem        | number   | index of line item             |
| procedureCode   | string   | foreign key for ClaimProcedure |
| description     | string   |                                |
| amount          | decimal  |                                |
| discount        | decimal  |                                |
| serviceDate     | DateTime |                                |

### Container: ClaimProcedure

**Entities**: ClaimProcedure  
**Partition Key**: `code`  

| Field       | Type   | Notes                    |
| ----------- | ------ | ------------------------ |
| id          | string | row key (`{code}`?)      |
| code        | string |                          |
| category    | string |                          | 
| description | string | display name/description |

### Container: Payer
**Entities**: Payer  
**Partition Key**: `payerId`  
**Extends**: MutableEntity  

| Field       | Type           | Notes                 |
| ----------- | -------------- | --------------------- |
| id          | string         | row key (`{payerId}`) |
| payerId     | string         | unique id             |
| name        | string         |                       |
| email       | string (email) |                       |
| address     | string         | 123 Main Street       |
| city        | string         | Redmond               | 
| state       | string         | Washington            |
| country     | string         | United States         |
| phoneNumber | string         |                       |

### Container: Adjudicator
**Entities**: Adjudicator, ClaimHeader  
**Partition Key**: `adjudicatorId`   
**Extends**: MutableEntity  

| Field         | Type           | Notes                             |
| ------------- | -------------- | --------------------------------- |
| id            | string         | row key (`{adjudicatorId}`)       |
| adjudicatorId | string         | unique id                         |
| type          | string         | `Adjudicator`, type discriminator |
| name          | string         |                                   |
| email         | string (email) |                                   |
| role          | string         | `Manager` or `Adjudicator`        | 

### Container: Provider
**Entities**: Provider   
**Partition Key**: `providerId`   
**Extends**: MutableEntity  

| Field       | Type           | Notes                     |
| ----------- | -------------- | ------------------------- |
| id          | string         | row key (`{providerId}`?) |
| providerId  | string         | uniqueId                  |
| name        | string         |                           |
| email       | string (email) |                           |
| address     | string         | 123 Main Street           |
| city        | string         | Redmond                   |
| state       | string         | Washington                |
| country     | string         | United States             | 
| phoneNumber | string         |                           |

## Data Ingestion

### Seeding

In order to demonstrate CosmosDB's ability to handle extremely large data-sets we'll be pre-loading the system with a large volume of records.

A Synapse script will be used to bulk insert the initial seed data into the CosmosDB containers. The source of this initial data will vary based on the entity type

| Container      | Approximate Entity Count | Source                                                                            |
| -------------- | ------------------------ | --------------------------------------------------------------------------------- |
| Claims         | 1000000+ tbc             | Synthia/Faker generated, Approximately 1% will be flagged for manual adjudication |
| Member         | 100000+ tbc              | Faker generated, Member + Coverage                                                |
| Adjudicator    | 10+                      | Manually created                                                                  |
| Payer          | 10+                      | Manually created                                                                  |
| Provider       | 100+                     | Manually created                                                                  |
| ClaimProcedure | 100+                     | Manually created                                                                  |

#### Generating data

- 1% of Members should have ~1000 claims
- 0.01% of members should have ~10000 claims
- Need a way to artificially inflate document size
  - proposed extra nested json object with [1-100] random properties that contain random strings ~10k characters long
- Line items should generally [8-10000], average ~184 line items
  - About 99.9% should have 8-100 line items, some will have **many** more, up to ~10000
- Filing Date should be evenly spread between Today and 90 Days ago

Synthia/Faker will be used to generate thousands of rows of Member and Claim data, and exported into multiple CSV files. These CSV files will be placed in an Azure Data Lake, and Synapse will be used to transform, and insert this sample data into CosmosDB directly. 

### Streaming data

In order to simulate continuous claims being filed, a Publisher app will be created. This will be a simple Console/Function app that will be responsible for using Faker to  generate new claims, and push them to the `IncomingClaim` EventHub topic.

## Web API

The Web API application will be main entry point for users, exposing a number of endpoints for use in testing, and a hypothetical future UI.

### Application Flow

For the purposes of this demo we're going to limit the scope of the process to highlight a few specific details. We'll be tracking the state of a claim through its life-cycle, from creation, through to completion.

#### 1. Creation

> [!trigger] Endpoint: CreateClaim  
> **Trigger**: EventHub Topic: `IncomingClaim`  
> **Request**: ClaimDetail  
> 
> Event hub trigger that will take details of the claim including
> - claimId from upstream **(required)**
> - Member claim belongs to (Optional)
> - Provider (ie: Medical Provider)
> - Payer (ie: Insurance Provider)
> - Line Items for the claim (1+ rows with cost/details)
> - if `claimStatus` == `Resubmitted` treat it as an update rather than rejecting as a duplicate
> 
> Some simple validation should be done to ensure the claim is not a duplicate of an existing claim. Validation is checking for existing claim with claimId (when eventType is create), duplicate should return an Error, and publish an Event to `RejectedClaims` topic in EventHub.

A claim is first created via the `CreateClaim` endpoint. This could be via an event from the EventHub, or via an HTTP Post action. This should create a Claim. A Claim consists of 2 documents in a container.

- ClaimHeader
- ClaimDetail

The Claim Detail contains the bulk of the information about the claim, including Member and Payer, as well as the line items on the claim. The ClaimDetail should almost never be updated, instead it will be replaced with newer version. The ClaimHeader is a simplified view of the claim, containing:

- a reference to the latest version of the ClaimDetail
- a subset of the properties on the detail
- an aggregate of the total line items
- the status of the *current* ClaimDetail
- Optional flag "resubmitted" to indicate it's an update

Creating a claim will create both of these documents, and set their state to `Initial`

#### 2. Auto-Adjudication/Assignment

> [!trigger] Endpoint: AssignClaimAdjudicator  
> **Trigger**: Change Feed/ClaimUpdated, LeasePrefix: `ReviewClaim`
> 
> Will be triggered when a claim is created in the `Initial` state **OR** claim is `Resubmitted`, if the business logic decides it needs manual adjudication, it will have an adjudicator assigned, and it's status will be set to `Assigned`.
> If the logic decides it can be auto-processed, it will be processed according to some simple business logic that we will define. Automatically approved/declined Claims will be updated to either `Complete` or `Declined` based on these rules.

When a claim enters the system, some rules will be reviewed to decide if the system can automatically adjudicate the Claim, or if it must be manually reviewed. If the claim can be automatically adjudicated this step will apply any appropriate actions to the Claim, approving or declining it. If it doesn't meet the criteria for automatic adjudication it will be assigned to an adjudicator and flagged for manual review.

Rules for Auto-adjudication
- If the Claim has no Member assigned: Set status to `Pending`, do nothing else, expect this will be Resubmitted with 
- If the Member the does not have active coverage for the date of the claim: Set to `Denied`
- Calculate total $ of claim, if < $200 set `Approved`, otherwise `Assigned` and assign adjudicator to the Claim
  - threshold should be configurable, set initial value based on producers example claims, targeting ~0.001% or less to be flagged manual
- *More to come* 

Rules when `Resubmitted`:
- This should esentially restart the workflow **regardless of where it currently is**
- We can leave it assigned to the existing Adjudicator if one has already been assigned

#### 3. Acknowledgement
Once a claim has been assigned for **manual** adjudication, the adjudicator must acknowledge the claim. To support this, two endpoints will be build

> [!api] Endpoint: GetAssignedClaims  
> **GET** /adjudicator/{adjudicator}/claims  
> **Response**: 200 (OK), `PagedResult<ClaimHeader>`  
> 
> API that will list all claims assigned to the current adjudicator.
>
> Store redundant ClaimHeader data with Adjudicator as Partition Key to allow for improved query, maintained by change feed  

> [!api] Endpoint: AcknowledgeClaim  
> **POST** /claims/{claimId}/acknowledge  
> **Request**: tbc, maybe just empty post?  
> **Response**: 200 (OK) with `ClaimHeader`, or 204 (NoContent) or 4XX  
>  
>  API that will take a claimId and update the status of the claim to `Acknowledged`

#### 4. Review

> [!api] Endpoint: UpdateAdjudication  
> **POST** /claims/{claimId}  
> **Request**: Partial ClaimDetail model (including line-items)  
> **Response**: 200 (OK) with `ClaimHeader`, or 204 (NoContent) or 4XX  
>
> Adjudicator can include status in this request
> - **Denied**: Close claim as Denied
> - **Proposed**: Can be auto approved based on rules below
>  
> Small change: (+/- $500 difference between initial claim and proposed change), set status to Complete  
> Large Change: Manual Approve, claim will be reassigned to a manager with "ApprovalRequired" status

An adjudicator will then review the claim, potentially updating some of the details, and deciding weather to accept or reject the claim.

Some modifications will require adjudicators with specific permissions to approve. For the purposes of this demo application we will be implementing two roles, `Manager` and `Adjudicator`. Adjudicators will be able to approve claims if their modifications are less than $200, if their modifications are more than this number the Claim will be reassigned to an adjudicator with the `Manager` role. Adjudicator assignments will be random, but should be built in a way that this logic can easily be customized for use in a real world scenario.

#### 5. Post-Review
Once a ClaimHeader gets the `Complete` or `Denied` status assigned, an event will be published to a topic in the EventHub. While nothing will be listening for the event in this implementation, it's expected that an external payment system could listen for this event and handle payment processing in a real world scenario.

> [!trigger] Endpoint: ClaimComplete  
> **Trigger**: Change Feed/ClaimUpdated, LeasePrefix: `ClaimComplete`
> 
> When a claim is updated in the Claims container, and it's Status is set to `Complete` or `Denied` publish a message to the appropriate EventHub topic (`ClaimApproved`, `ClaimDenied`). Message should include the whole of the latest ClaimDetail entity (including the line items).
> 
> In order to demonstrate the change-feed's usefulness in keeping running counts, in additional to publishing messages to EventHub, for **approved** claims, we will update the associated Member record, incrementing the `approved.count` number by 1, and `approved.total` by the total of the approved claim. 

### Supporting Endpoints
> [!api] Endpoint: GetClaim  
> **GET** /claim/{claimId}  
> **Response**: 200 (OK) with `ClaimDetail`, or 4XX
> 
> Return a claim based on it's claimId from Cosmos

> [!api] Endpoint: GetClaimHistory  
> **GET** /claim/{claimId}/history  
> **Response**: 200 (OK), or 4XX
> 
> Return a claim and All Historic ClaimDetail based on it's claimId from Cosmos
> Suggested response
> ```json
> {
>   header: { /* ClaimHeader record */ },
>   history: [
>      /* All ClaimDetail records sorted by timestamp */ 
>   ]
> }
> ```


> [!api] Endpoint: ListProviders  
> **GET** /providers  
> **Response**: 200 (OK) with `PagedResult<Provider>`, or 4XX  
> 
> Return a list of Providers from Cosmos

> [!api] Endpoint: ListPayers  
> **GET** /payers  
> **Response**: 200 (OK) with `PagedResult<Payer>`, or 4XX  
> 
> Return a list of Payers from Cosmos

> [!api] Endpoint: ListMemberClaims  
> **GET** /member/{memberId}/claims  
> **Response**: 200 (OK) with `PagedResult<ClaimHeader>`  
> **Optional Parameters**: `startDate`, `endDate`: should filter query for claims filed between these dates
> 
> Return a list claims for a specific member, and their status.
> Writing a claim will trigger a change feed that will write a redundant version of the ClaimHeader with memberId as the partition key
> 
> **Future State**: Prefer Continuation Tokens for paging for best performance  
> **Future State**: Additional filters (ie: Total)

> [!view] View: Aggregate Status Counts  
> In order to provide more complex query functionality in a performant manor, the Claims container will need to be exposed as a Synapse view. The container will need to be created with this in mind to ensure compatibility with Synapse.
>  
> **Stretch Goal:** For the scope of this release we will deprioritize the Synapse integration. If time allows we should aim to expose this, and provide a few example queries. But prioritizing the other functionality is first priority.

### Change feed Endpoints

> [!trigger] Endpoint: ClaimUpdated  
> **Trigger**: Change Feed/ClaimUpdated, LeasePrefix: `PropigateClaimHeader`  
> 
> When a claim is updated in the Claims container, the following should happen:
> - If the claim has a member: A redundant copy of the claim header should be stored in the member container allowing for efficient query of "Claims by MemberId"
> - If the claim has an adjudicator assigned: A redundant copy of the claim header should be stored in the adjudicator container allowing for efficient query of "Claims by Adjudicator"

### Infrastructure

A bicep definition of the required infrastructure will be created containing the following resources

| Type               | Name                      | Purpose                                                                                                 |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| Resource Group     | `rg-coreclaims-demo`      |                                                                                                         |
| Managed Identity   | `id-coreclaims-demo`      | Auth/Auth between azure services                                                                        |
| CosmosDB           | `db-coreclaims-demo`      |                                                                                                         |
| CosmosDB/Container | `Claim`                   | Claim Container, PK: `claimId`                                                                          |
| CosmosDB/Container | `Member`                  | Member Container, PK: `memberId`                                                                        |
| CosmosDB/Container | `Adjudicator`             | Adjudicator Container, PK: `adjudicatorId`                                                              |
| CosmosDB/Container | `ClaimProcedure`          | Claim Procedure container, PK: `code`                                                                   |
| CosmosDB/Container | `Provider`                | Provider container, PK: `providerId`                                                                    |
| CosmosDB/Container | `Payer`                   | Payer container, PK: `payerId`                                                                                                        |
| App Service Plan   | `asp-coreclaims-demo`     | App Service Plan for hosting the function app                                                           |
| Function App       | `fa-coreclaims-demo`      |                                                                                                         |
| EventHub           | `eh-coreclaims-demo`      |                                                                                                         |
| EventHub/Topic     | `IncomingClaim`           | Streaming input of claims, provided by Publisher app                                                    |
| EventHub/Topic     | `RejectedClaim`           | Topic where duplicate claims, or invalid claims get published after failing validation on CreateClaim   |
| EventHub/Topic     | `ClaimApproved`           | Topic where claims that have been approved are published for hypothetical downstream systems to process |
| EventHub/Topic     | `ClaimDenied`             | Topic where claims that have been denied are published for hypothetical downstream systems to process   |
| EventHub/Topic     | `AdjudicatorChanged`            | Topic where the adjudicator for a claim was changed, such as when a manager is assigned because they need to approve a proposal. Downstream, the EventHub processor uses the claim header data to delete the previous adjudicator's claim header record. This way, there are no duplicated records between two adjudicators.  |
| Storage Account    | `adl-coreclaims-demo`     | Storage account for Azure Data Lake storage of initial seed data for synapse processing                 |
| Synapse workspace  | `synapse-coreclaims-demo` | Synapse notebook for running initial seed scripts                                                       |
| Apache Spark Pool  | `SeedData`                | Spark pool used by synapse                                                                              |

