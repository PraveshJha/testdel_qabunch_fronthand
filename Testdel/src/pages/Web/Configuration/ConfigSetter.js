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
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Web/defaultconfiguration', await headers, await defaultConfigData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
                return false;
            }
        }

    }

    //**** Save environment and Url Details******************************//

    async saveURLDetails() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Web/envlist', await headers, await ConfigData.EnvUrlList);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
                return false;
            }

        }

    }

    // Save Default screen 

    async saveDefaultScreen() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            var defaultConfigData = {};
            defaultConfigData["DefaultExecutionPlatform"] = ConfigData.DefaultExecutionPlatform;
            defaultConfigData["DefaultBrowser"] = ConfigData.DefaultBrowser;
            defaultConfigData["DefaultMobileEmulator"] = ConfigData.DefaultMobileEmulator;
            defaultConfigData["DefaultTabletEmulator"] = ConfigData.DefaultTabletEmulator;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Web/defaultscreen', await headers, await defaultConfigData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
                return false;
            }
        }

    }

    //**** Emulator Data******************************//

    async saveEmulatorData() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Web/emulator', await headers, await ConfigData.AllEmulatorTableData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
                return false;
            }
        }

    }

    //**** Emulator Data******************************//

    async saveToolsData() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Web/testingtools', await headers, await ConfigData.AllTestManagementToolData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
                return false;
            }
        }

    }

    async saveCapabilityDataOnServer() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {
            var capData = {};
            capData["HubUrl"] = ConfigData.ServerUrl;
            capData["Capabilities"] = ConfigData.AllCapabilities;
            var capFor = ConfigData.ExecutionServer;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'configuration/project/' + selectedProject + '/testingtype/Web/capability/' + capFor, await headers, await await capData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
                return false;
            }
        }

    }

    async deleteReportData(envName, daysToDelete) {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 3000));
            return true;
        }
        else {

            var reportData = {};
            reportData["envName"] = await envName;
            reportData["days"] = await daysToDelete;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'cleanup/project/' + selectedProject + '/testingtype/Web', await headers, await reportData);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isSuccess'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
                return false;
            }
        }

    }
}
export default new ConfigSetter();

