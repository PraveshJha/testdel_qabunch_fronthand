import { Config, Users } from '../../../QAautoMATER/Config';
import ConfigGetter from '../Configuration/ConfigGetter';
import { ConfigData } from '../Configuration/ConfigData';
import { AutoScriptData } from './AutoScriptData';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import GetData from '../../../QAautoMATER/funcLib/getData';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;

export class AutoScriptGetter {

    async apiAutoScriptPageLoad() {
        var allconfigData = null;
        if (!Config.isDemo) {
            allconfigData = await ConfigGetter.readConfigurationFile();
            ConfigData.AllConfigData = await allconfigData;
        }
        await this.renderEnvironmentandComponent(await allconfigData);
    }

    async renderEnvironmentandComponent(allconfigData) {
        await ConfigGetter.updateEnvironmentTableData(await allconfigData);
        AutoScriptData.AllEnvironmentList = ConfigData.EnvironmentList;
        if (await AutoScriptData.AllEnvironmentList.length > 0) {
            if (Config.isDemo) {
                AutoScriptData.SelectedEnvironmentName = await ConfigData.DefaultSelectedEnvironment;
                AutoScriptData.AllComponentUrlLIst = await DataGeneratorUtility.getStringArray(3);
                AutoScriptData.SelectedComponentUrl = await AutoScriptData.AllComponentUrlLIst[0];
            }
            else {
                AutoScriptData.SelectedEnvironmentName = ConfigData.DefaultSelectedEnvironment;
                var ListofURl = await allconfigData['Url'][AutoScriptData.SelectedEnvironmentName];
                if (await ListofURl !== undefined && await ListofURl.length > 0) {
                    AutoScriptData.AllComponentUrlLIst = await GetData.jsonArrayGetallKeyValue(ListofURl, 'name');
                    if (AutoScriptData.AllComponentUrlLIst.length > 0) {
                        AutoScriptData.SelectedComponentUrl = await AutoScriptData.AllComponentUrlLIst[0];
                    }

                }
            }
        }

    }

    async updateEnvironment(envName) {
        var ListofURl = await ConfigData.AllConfigData['Url'][await envName];
        if (await ListofURl !== undefined && await ListofURl.length > 0) {
            AutoScriptData.AllComponentUrlLIst = await GetData.jsonArrayGetallKeyValue(ListofURl, 'name');
            if (AutoScriptData.AllComponentUrlLIst.length > 0) {
                AutoScriptData.SelectedComponentUrl = await AutoScriptData.AllComponentUrlLIst[0];
            }

        }
        else {
            AutoScriptData.AllComponentUrlLIst = [];
            AutoScriptData.SelectedComponentUrl = ''
        }
    }

    async createNewTestScript() {
        var completedScripts ={}
        var percentage =0;
        if (await Config.isDemo) {

            AutoScriptData.TotalController = await DataGeneratorUtility.getNumberFromRange(5, 9);
            AutoScriptData.TotalEndPoint = await DataGeneratorUtility.getNumberFromRange(10, 20);
            AutoScriptData.ExistingEndPoint = await DataGeneratorUtility.getNumberFromRange(1, 3);
            AutoScriptData.NewApiScripts = await DataGeneratorUtility.getNumberFromRange(190, 200);
            completedScripts = await DataGeneratorUtility.getNumberFromRange(180, 189);
            percentage = await parseFloat(await Number (await Number(completedScripts)/await await Number(AutoScriptData.NewApiScripts ))*100).toFixed(0)
            AutoScriptData.TotalCompeletedTestScript = await percentage
            return true;
        }
        else {
            var componentUrl = AutoScriptData.SelectedComponentUrl;
            var url = await AutoScriptData.Url;
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var requestBody = {};
            requestBody['url'] = await url;
            requestBody['componentKey'] = await componentUrl;
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(backendAPI + 'swagger/project/' + selectedProject, await headers, await requestBody);
            serverResponse = await serverResponse['data'];
            Config.ErrorMessage = await serverResponse['errorMessage'];
            AutoScriptData.TotalController = await serverResponse['totalController'];
            AutoScriptData.TotalEndPoint =  await serverResponse['totalEndPoint'];
            AutoScriptData.ExistingEndPoint = await serverResponse['existingEndPoint'];
            AutoScriptData.NewApiScripts = await serverResponse['totalScriptCreated'];
            completedScripts = await serverResponse['scriptCountInCompleteStatus'];
            percentage = await parseFloat(await Number (await Number(completedScripts)/await await Number(AutoScriptData.NewApiScripts ))*100).toFixed(0)
            AutoScriptData.TotalCompeletedTestScript = await percentage
            return serverResponse['isSuccess'];
        }

    }
}
export default new AutoScriptGetter();

