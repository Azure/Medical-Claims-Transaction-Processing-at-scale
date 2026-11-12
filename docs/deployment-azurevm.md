# Deployment - Azure VM

## Prerequisites

- Azure subscription
- Subscription access to Azure OpenAI service. Start here to [Request Access to Azure OpenAI Service](https://aka.ms/oaiapply)

## Deployment steps

Follow the steps below to deploy the solution to your Azure subscription.

1. Run the following script to provision a development VM with Visual Studio 2026 Community and required dependencies preinstalled.

    ```pwsh
    .\deploy\powershell\Deploy-Vm.ps1 -resourceGroup <rg_name> -location <location> -password <password>
    ```

    `<password>` is the password for the `BYDtoChatGPTUser` account that will be created on the VM. It must be at least 12 characters long and meet the complexity requirements of Azure VMs.

    When the script completes, the console output should display the name of the provisioned VM similar to the following:

    ```txt
    The resource prefix used in deployment is libxarwttxjde
    The deployed VM name used in deployment is libxarwttxjdevm
    ```

1. Use RDP to remote into the freshly provisioned VM with the username `BYDtoChatGPTUser` and the password you provided earlier on.  

1. Log back in with the `BYDtoChatGPTUser` account and the password you provided earlier on.

1. Clone the repository:

    ```cmd
    git clone --recurse-submodules https://github.com/Azure/Medical-Claims-Transaction-Processing-at-scale.git
    ```

1. Open PowerShell, navigate to the `Medical-Claims-Transaction-Processing-at-scale` folder, and run the following script to provision the infrastructure and deploy the API and frontend. This will provision all of the required infrastructure and deploy the API and web app services into AKS.

    ```pwsh
    cd .\Medical-Claims-Transaction-Processing-at-scale
    ./deploy/powershell/Unified-Deploy.ps1 -resourceGroup <rg_name> -location <location> -subscription <target_subscription_id>
    ```

>**NOTE**: Make sure to set the `<location>` value to a region that supports Azure OpenAI services.  See [Azure OpenAI service regions](https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/?products=cognitive-services&regions=all) for more information.

### Deployment samples

1. Default deployment using Azure Container Apps. 
    ```pwsh
    cd .\Medical-Claims-Transaction-Processing-at-scale
    ./deploy/powershell/Unified-Deploy.ps1 -resourceGroup <rg_name> -location <location> -subscription <target_subscription_id>
    ```
1. Deployment using Azure Kubernetes Service. 
    ```pwsh
    cd .\Medical-Claims-Transaction-Processing-at-scale
    ./deploy/powershell/Unified-Deploy.ps1 -resourceGroup <rg_name> -location <location> -subscription <target_subscription_id> -deployAks $true
    ```
1. Deployment using an existing Azure Open AI Service. 
    ```pwsh
    cd .\Medical-Claims-Transaction-Processing-at-scale
    ./deploy/powershell/Unified-Deploy.ps1 -resourceGroup <rg_name> -location <location> -subscription <target_subscription_id> -openAiRg <openai_rg_name> -openAiName <openai_service_name> -openAiCompletionsDeployment <openai_deployment>
    ```

### Enabling/Disabling Deployment Steps

The following flags can be used to enable/disable specific deployment steps in the `Unified-Deploy.ps1` script.

| Parameter Name | Description |
|----------------|-------------|
| stepDeployBicep | Enables or disables the provisioning of resources in Azure via Bicep templates (located in `./infrastructure`). Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/powershell/Deploy-Bicep.ps1` script.
| stepBuildPush | Enables or disables the build and push of container images using ACR Tasks (no local Docker required). Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/powershell/BuildPush.ps1` script.
| stepDeployCertManager | Enables or disables adding the official cert-manager repository to your local and updates the repo cache. Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/powershell/DeployCertManager.ps1` script.
| stepDeployTls | Enables or disables SSL/TLS support on the AKS cluster in the resource group. Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/powershell/DeployTlsSupport.ps1` script.
| stepDeployImages | Enables or disables deploying container images from the `CoreClaims.WebAPI` and `CoreClaims.WorkerService` projects. Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/powershell/Deploy-Images-Aks.ps1` or `deploy/powershell/Deploy-Images-Aca.ps1` script.
| stepPublishSite | Enables or disables the build and deployment of the static HTML site to the hosting storage account in the target resource group. Valid values are 0 (Disabled) and 1 (Enabled). See the `deploy/powershell/Publish-Site.ps1` script.
| stepLoginAzure | Enables or disables interactive Azure login. If disabled, the deployment assumes that the current Azure CLI session is valid. Valid values are 0 (Disabled).

Example command:

```pwsh
cd deploy/powershell
./Unified-Deploy.ps1 -resourceGroup myRg `
                     -subscription 0000... `
                     -stepLoginAzure 0 `
                     -stepDeployBicep 0 `
                     -stepDeployCertManager 0 `
                     -stepDeployTls 0 `
                     -stepBuildPush 1 `
                     -stepDeployImages 1 `
                     -stepPublishSite 1
```
