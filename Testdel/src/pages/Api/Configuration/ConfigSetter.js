import { Config, Users } from '../../../QAautoMATER/Config';
import { ConfigData } from './ConfigData';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;

export class ConfigSetter {

    //**** Save Default Configuration******************************//

    async saveDefaultConfiguration() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            try {
                var defaultConfigData = {};
                defaultConfigData["DefaultSelectedEnvironment"] = ConfigData.DefaultSelectedEnvironment;
                defaultConfigData["DefaultReportTrailCount"] = ConfigData.DefaultReportTrailCount;
                defaultConfigData["DefaultSaveDaysToReport"] = ConfigData.DefaultSaveDaysToReport;
                defaultConfigData["DefaultSaveDaysToDevelopment"] = ConfigData.DefaultSaveDaysToDevelopment;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Api/defaultconfiguration', await headers, await defaultConfigData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
            }
        }

    }

    //**** Save Environment Details******************************//

    async saveEnvironmentDetails() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            try {
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Api/envlist', await headers, await ConfigData.EnvNameList);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
            }
        }

    }

    //**** Save URL Details******************************//

    async saveURLDetails() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            try {
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Api/env/' + ConfigData.EnvNameForUrl + '/envurl', await headers, await ConfigData.EnvUrlList);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
            }
        }

    }

    //**** Save HttpHeader Details******************************//

    async saveHttpHeaderDetails() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            try {
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Api/httpheader', await headers, await ConfigData.HttpHeaderData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
            }
        }

    }

    //**** Save Authorization Details******************************//

    async saveAuthorizationDetails() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            try {
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Api/auth', await headers, await ConfigData.AutherizationTableData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
            }
        }

    }

    async deleteReportData(envName, daysToDelete) {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            try {
                var reportData = {};
                reportData["envName"] = await envName;
                reportData["days"] = await daysToDelete;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'cleanup/project/' + selectedProject + '/testingtype/Api', await headers, await reportData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isSuccess'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
            }
        }

    }
}
export default new ConfigSetter();

