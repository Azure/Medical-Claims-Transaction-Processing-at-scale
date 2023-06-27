
SUBSCRIPTION_ID=$1
SUFFIX=$2

WORKSPACE=synapse-coreclaims-$SUFFIX

echo 'Subscription Id     :' $SUBSCRIPTION_ID
echo 'Deployment Suffix   :' $SUFFIX
echo 'Synapse Workspace   :' $WORKSPACE

echo 'Validate variables above and press any key to continue setup...'
read -n 1

#Start infrastructure deployment
cd ../synapse
echo "Directory changed: '$(pwd)'"

az account set --subscription $SUBSCRIPTION_ID
az account show

echo 'Validate current subscription and press any key to continue setup...'
read -n 1

echo 'Creating linked services...'

DATA_LAKE_JSON=$(jq '.properties.typeProperties.url="https://adlcoreclaims'${SUFFIX}'.dfs.core.windows.net"' ./linkedService/CoreClaimsDataLake.json)
COSMOS_JSON=$(jq '.properties.typeProperties.accountEndpoint="https://db-coreclaims-'${SUFFIX}'.documents.azure.com:443/"' ./linkedService/CoreClaimsCosmosDb.json)

az synapse linked-service create --workspace-name $WORKSPACE --name CoreClaimsDataLake --file "$DATA_LAKE_JSON"
az synapse linked-service create --workspace-name $WORKSPACE --name CoreClaimsCosmosDb --file "$COSMOS_JSON"

echo 'Creating datasets...'

for file in $(ls ./dataset)
do
  az synapse dataset create \
        --workspace-name $WORKSPACE \
        --name "${file%%.*}" \
        --file @"./dataset/$file"
done

echo 'Creating pipeline...'
az synapse pipeline create \
    --workspace-name $WORKSPACE \
    --file @"./pipeline/Initial-Ingestion.json" \
    --name Initial-Ingestion
