# Deployment

## Deployment choices

The following table summarizes the deployment choices available for the solution:

 Deployment type | Description | When to use
--- | --- | ---
[Standard](./deployment-standard.md) | Use your local development environment or Azure Cloud Shell to deploy the solution to your Azure subscription. | **Recommended approach.** Works in local environments and Azure Cloud Shell. Supports both Azure Container Apps (ACA) and Azure Kubernetes Service (AKS).
[Azure VM](./deployment-azurevm.md) | Use an Azure VM to deploy the solution to your Azure subscription. | Best suited for situations where you need the flexibility of a full development environment (e.g. to customize the solution) but you don't have a local development environment available.

Select the links in the table above to learn more about each deployment choice.

>**NOTE**:
>The Azure VM deployment type requires additional setup steps. If you are involved in managing the infrastructure that enables Azure VM deployments for your team, see [Prepare Azure VM Setup](./deployment-azurevm-setup.md) for more information.
