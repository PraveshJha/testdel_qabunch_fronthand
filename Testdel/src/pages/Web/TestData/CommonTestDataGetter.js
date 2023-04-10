import { TestData } from './TestData';
import { Config, Users } from '../../../QAautoMATER/Config';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;

export class CommonTestDataGetter {

    async testDataPageLoad() {
        await this.readCommonTestData();
    }

    async saveCommonTestData() {
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
                var dataforSend = {};
                dataforSend['keyForAddandUpdate'] = await TestData.TestDataToAdd;
                dataforSend['keyForDelete'] = await TestData.DeletedKey;
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(backendApi + 'testdata/project/' + selectedProject + '/testingtype/Web', await headers, await dataforSend);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
             }
        }
    }

    async readCommonTestData() {
        if (Config.isDemo) {
            TestData.AllCommonTestData = [{ id: 1, key: 'searchItem', value: 'QAautoMATER' }];
        }
        else {
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendApi + 'testdata/project/' + selectedProject + '/testingtype/Web', await headers);
            var commonTesttestData = await serverResponse['data'];
            if (commonTesttestData === undefined) {
                TestData.AllCommonTestData = [];
            }
            else {
                var allData = [];
                var commonDataKeys = await Object.keys(await commonTesttestData);
                for (let i = 0; i < await commonDataKeys.length; i++) {
                    var keyName = await commonDataKeys[i];
                    var allDetails = { id: i + 1, key: await keyName, value: await commonTesttestData[await keyName] };
                    allData.push(await allDetails);
                }
                TestData.AllCommonTestData = await allData;
            }
        }
    }
}
export default new CommonTestDataGetter();

