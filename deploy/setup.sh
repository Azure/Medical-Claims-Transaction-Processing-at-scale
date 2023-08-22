
SUBSCRIPTION_ID=$1
RESOURCE_GROUP=$2
LOCATION=$3
SUFFIX=$4

echo 'Subscription Id     :' $SUBSCRIPTION_ID
echo 'Resource Group      :' $RESOURCE_GROUP
echo 'Location            :' $LOCATION
echo 'Deploy Suffix       :' $SUFFIX

echo 'Validate variables above and press any key to continue setup...'
read -n 1

#Start infrastructure deployment
cd ../infrastructure
echo "Directory changed: '$(pwd)'"

az account set --subscription $SUBSCRIPTION_ID
az account show

echo 'Validate current subscription and press any key to continue setup...'
read -n 1

RGCREATED=$(az group create \
                --name $RESOURCE_GROUP \
                --location $LOCATION \
                --query "properties.provisioningState" \
                -o tsv)

if [ "$RGCREATED" != "Succeeded" ] 
then
    echo 'Resource group creation failed! Exiting...'
    exit
fi

INFRADEPLOYED=$(az deployment group create \
                    --name CosmosDemoDeployment \
                    --resource-group $RESOURCE_GROUP \
                    --template-file ./main.bicep \
                    --parameters suffix=$SUFFIX \
                    --query "properties.provisioningState" \
                    -o tsv)

if [ "$INFRADEPLOYED" != "Succeeded" ] 
then
    echo 'Infrastructure deployment failed! Exiting...'
    exit
fi

echo 'Press any key to continue setup...'
read -n 1

cd ../src/
echo "Directory changed: '$(pwd)'"

cp ./CoreClaims.FunctionApp/local.settings{.template,}.json 
cp ./CoreClaims.Publisher/settings{.template,}.json 

COSMOSKEY=$(az cosmosdb keys list -g $RESOURCE_GROUP --name dbcoreclaims$SUFFIX --type keys --query primaryMasterKey -o tsv)
EVENTHUBKEY=$(az eventhubs namespace authorization-rule keys list -g $RESOURCE_GROUP --namespace-name ehcoreclaims$SUFFIX --name RootManageSharedAccessKey --query primaryKey -o tsv)

# File to modify
FILES_TO_REPLACE="CoreClaims.Publisher/settings.json CoreClaims.FunctionApp/local.settings.json"

for file in $FILES_TO_REPLACE
do
  # Pattern for your tokens -- e.g. ${token}
  TOKEN_PATTERN='(?<=\$\{)\w+(?=\})'

  # Find all tokens to replace
  TOKENS=$(grep -oP ${TOKEN_PATTERN} ${file} | sort -u)

  # Loop over tokens and use sed to replace
  for token in $TOKENS
  do
    echo "Replacing \${${token}} with ${!token}"
    sed -i "s|\${${token}}|${!token}|" ${file}
  done
done

cd ./CoreClaims.FunctionApp
echo "Directory changed: '$(pwd)'"

func azure functionapp publish "fa-coreclaims-$SUFFIX" --csharp

echo ""
echo "***************************************************"
echo "*************  Deploy completed!  *****************"
echo "Next steps:"
echo "1. Deploy Synapse workspace"
echo "2. Run Synthea to generate sample data"
echo "3. Run Synapse ingestion job to prepopulate data"
echo "4. Run Publisher to generate claims"
echo "5. Call APIs"
echo "***************************************************"