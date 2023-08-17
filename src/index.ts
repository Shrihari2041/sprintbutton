import { AzureDevOpsExtension, IExtensionContext } from '@microsoft/azure-devops-extension-sdk';

export class MyExtension extends AzureDevOpsExtension {
  onInit(context: IExtensionContext) {
    console.log('The extension has been initialized!');
  }
}