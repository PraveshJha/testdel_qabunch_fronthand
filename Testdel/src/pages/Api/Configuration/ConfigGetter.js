import { ConfigData } from './ConfigData';
import { Config,Users } from '../../../QAautoMATER/Config';
import GetData from '../../../QAautoMATER/funcLib/getData';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import  FileLib  from '../../../QAautoMATER/funcLib/fileLib';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';

const selectedProject = Config.SelectedProject;

export class ConfigGetter {

    async apiConfigPageLoadData() {

        var allconfigData = null;
        if (!Config.isDemo) {
            allconfigData = await this.readConfigurationFile();
            ConfigData.AllConfigData = await allconfigData;
        }
        await this.updateEnvironmentTableData(await allconfigData);
        await this.updateDefaultConfigurationData(await allconfigData);
        await this.updateUrlTableData(await allconfigData, ConfigData.DefaultSelectedEnvironment);
        await this.updateHttpHeaderTableData(await allconfigData);
        await this.updateAutherizationTableData(await allconfigData);
    }
    /////****** Default Configuration Getter *******************************************************

    async updateDefaultConfigurationData(allconfigData) {
        if (Config.isDemo) {
            ConfigData.DefaultReportTrailCount = await DataGeneratorUtility.getNumberFromRange(40, 70);
            ConfigData.DefaultSaveDaysToReport = await DataGeneratorUtility.getNumberFromRange(20, 30);
            ConfigData.DefaultSaveDaysToDevelopment = await DataGeneratorUtility.getNumberFromRange(10, 30);
        }
        else {
            var dataChoice = await allconfigData['DefaultReportTrailCount'];
            if (dataChoice === undefined) {
                ConfigData.DefaultReportTrailCount = 0;
            }
            else {
                ConfigData.DefaultReportTrailCount = Number(await dataChoice);
            }
            dataChoice = await allconfigData['DefaultSaveDaysToReport'];
            if (dataChoice === undefined) {
                ConfigData.DefaultSaveDaysToReport = 0;
            }
            else {
                ConfigData.DefaultSaveDaysToReport = Number(await dataChoice);
            }
            dataChoice = await allconfigData['DefaultSaveDaysToDevelopment'];
            if (dataChoice === undefined) {
                ConfigData.DefaultSaveDaysToDevelopment = 0;
            }
            else {
                ConfigData.DefaultSaveDaysToDevelopment = Number(await dataChoice);
            }

        }
    }

    /////****** Configuration Getter ******************************************************************

    async updateEnvironmentTableData(allconfigData) {
        if (Config.isDemo) {
            ConfigData.EnvNameList = [{ id: 1, name: 'Qa' }, { id: 2, name: 'Dev' }, { id: 3, name: 'Stg' }]
            ConfigData.EnvironmentList = ["QA", "Dev", "Stg"];
            ConfigData.DefaultSelectedEnvironment = "Dev";
            ConfigData.EnvNameForUrl = "Dev";
        }
        else {
            ConfigData.EnvNameList = await allconfigData['Environment'];
            if (await allconfigData['DefaultSelectedEnvironment'] === undefined || await allconfigData['DefaultSelectedEnvironment'] === '') {
                if (ConfigData.EnvNameList.length > 0) {
                    ConfigData.DefaultSelectedEnvironment = ConfigData.EnvironmentList[0];
                    ConfigData.EnvNameForUrl = ConfigData.EnvironmentList[0];
                    ConfigData.CleanUpEnvironment = ConfigData.EnvironmentList[0];
                }
            }
            else {
                ConfigData.DefaultSelectedEnvironment = await allconfigData['DefaultSelectedEnvironment'];
                ConfigData.EnvNameForUrl = await allconfigData['DefaultSelectedEnvironment'];
                ConfigData.CleanUpEnvironment = await allconfigData['DefaultSelectedEnvironment'];
            }
            if (ConfigData.EnvNameList.length > 0) {
                ConfigData.EnvironmentList = await GetData.jsonArrayGetallKeyValue(ConfigData.EnvNameList, 'name');
            }
        }
    }

    /////****** Url Table Getter ******************************************************************

    async updateUrlTableData(allconfigData, environmentName) {
        if (Config.isDemo) {
            ConfigData.EnvUrlList = [{ "id": 1, "name": "baseUrl", "url": "https://fakerestapi.azurewebsites.net/api/v1/Activities" }]
        }
        else {
            var urlData = await allconfigData['Url'];
            if (urlData !== undefined) {
                var dataChoice = await environmentName;
                if (dataChoice !== undefined) {
                    var urlList = await urlData[dataChoice];
                    if (urlList !== undefined) {
                        ConfigData.EnvUrlList = await urlList;
                    }
                    else{
                        ConfigData.EnvUrlList = [];
                    }
                }
            }
            else{
                ConfigData.EnvUrlList = [];
            }
        }
    }

    /////****** Http header Table Getter ******************************************************************

    async updateHttpHeaderTableData(allconfigData) {
        if (Config.isDemo) {
            ConfigData.HttpHeaderData = [{ id: 1, key: 'Accept', value: 'application/json' }, { id: 2, key: 'Content-Type', value: 'application/json' }];
        }
        else {
            var dataChoice = await allconfigData['HttpHeader'];
            if (dataChoice !== undefined && await dataChoice.length > 0) {
                ConfigData.HttpHeaderData = await dataChoice;
            }
            else {
                ConfigData.HttpHeaderData = [];
            }
        }
    }

    /////****** Update Autherization Table Header ******************************************************************

    async updateAutherizationTableData(allconfigData) {
        if (Config.isDemo) {
            ConfigData.AutherizationTableData = [{ id: 1, key: 'baseApp', username: 'testUser', password: 'password' }];
        }
        else {
            var dataChoice = await allconfigData['Authorization'];
            if (dataChoice !== undefined) {
                ConfigData.AutherizationTableData = await dataChoice;
            }
            else {
                ConfigData.AutherizationTableData = [];
            }
        }
    }

    //**** Env Name List *********************************************************

    async updateRowIdAfterDelete(tableData, id) {
        tableData = await tableData.filter(m => m.id !== id);
        for (let i = 0; i < await tableData.length; i++) {
            tableData[i]['id'] = i + 1;;

        }
        return await tableData;
    }

    async readConfigurationFile(testingType='Api') {
        if (Config.fileSystemtechniques === 'local') {
            return await FileLib.readFile(selectedProject + '/'+testingType+'/Configuration.json');
        }
        else if (Config.fileSystemtechniques === 'api') {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            if(await Users.userToken ===null)
            {
                Users.userToken = await localStorage.getItem('Token');
            }
            if(await Users.userEmail ===null)
            {
                Users.userEmail = await localStorage.getItem('UserEmail');
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(await backendAPI + 'configuration/project/' + await selectedProject + '/testingtype/'+await testingType, await headers);
            return await serverResponse['data'];
        }
    }

}
export default new ConfigGetter();

