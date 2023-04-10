import { MockData } from './MockData';
import { Config,Users } from '../../../QAautoMATER/Config';
import DataGetter from '../../DataGetter';
import GetData from '../../../QAautoMATER/funcLib/getData';
import SetData from '../../../QAautoMATER/funcLib/setData';
import ConfigGetter from '../Configuration/ConfigGetter';
import { ConfigData } from '../Configuration/ConfigData';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import Matcher from '../../../QAautoMATER/funcLib/matcher';
import DynamicDataGetter from '../../../QAautoMATER/dynamicData/DynamicData';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;

export class MockRepoGetter {

    async apiMockRepoPageLoadData() {
        var allconfigData = null;
        if (!Config.isDemo) {
            allconfigData = await ConfigGetter.readConfigurationFile();
            ConfigData.AllConfigData = await allconfigData;
        }
        await this.renderComponent();
    }

    async renderComponent() {
        if (Config.isDemo) {
            MockData.AllComponentList = ["LandingPage", "SignIn", "ProductList", "ShoppingCart", "BookingSummary"];
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendAPI + 'components/project/' + selectedProject + '/testingtype/Api', await headers);
            MockData.AllComponentList = await serverResponse['data'];
        }
    }

    async getTestScriptListFromComponent(componentName) {
        MockData.AllTestId = await DataGetter.getTestScriptIDfromallComponent(componentName);
    }

    async isAllDetailsValidForResponseHeaderTable() {
        var tableData = MockData.ResponseHeaderData;
        var tableLength = await tableData.length;
        if (tableLength > 0) {
            var allKeysName = [];
            for (let rowCounter = 0; rowCounter < await tableLength; rowCounter++) {
                var rowCellKey = await tableData[rowCounter]['key'].toString().trim();
                var rowCellValue = await tableData[rowCounter]['value'].toString().trim();
                var isKeyFound = await Matcher.isValuePresentInArray(await allKeysName, await rowCellKey);
                if (await isKeyFound) {
                    return false;
                }
                if (await rowCellKey === '' || rowCellValue === '') {
                    return false;
                }
            }
            return true;
        }
        else {
            return true;
        }

    }

    async saveMockData() {

        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var componentName = await MockData.SelectedComponent;
            var testId = await MockData.SelectedTestId;
            var testName = await MockData.TestName;
            var mockDataDetails = {}
            mockDataDetails['ResponseHeader'] = MockData.ResponseHeaderData;
            mockDataDetails['ResponseBody'] = MockData.ResponseBody;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(backendApi + 'mockrepo/component/' + componentName + '/testId/' + testId + '@' + testName + '/project/' + selectedProject + '/testingtype/Api', await headers,await mockDataDetails);
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            return await saveFile['isFileSaved'];
        }

    }

    async updateRequestBody(requestBody, namespace, valueToUpdate) {
        return await SetData.setJsonKeyValue(requestBody, namespace, valueToUpdate);
    }

    async setRequestBodyData(requestBodyData) {
        var actualData = requestBodyData;
        var keyList = await GetData.getAllDynamicDataKeyList(requestBodyData, "{{RandomData.");
        if (keyList.length > 0) {
            var actualDataInString = await JSON.stringify(actualData);
            for (let i = 0; i < await keyList.length; i++) {
                var methodName = '';
                var param = ''
                var methodNamewithParam = await keyList[i];
                if (methodNamewithParam.includes('||')) {
                    methodName = await methodName.split('||')[1];
                    param = methodName.split('||')[1];
                }
                else {
                    methodName = await methodNamewithParam;
                }
                var dataToReplace = await this.getDynamicDataValue(methodName, param);
                actualDataInString = actualDataInString.replaceAll('{{RandomData.' + methodNamewithParam + '}}', dataToReplace);
                return await JSON.parse(actualDataInString);
            }
        }
        else {
            return actualData;
        }
    }

    async getTestIdAndTestName(componentName) {
        var allTestId = [];
        if (Config.isDemo) {
            var all
            allTestId = await DataGeneratorUtility.getNumberArray(5);
            MockData.AllTestId = allTestId;
            var TestDetails = [];
            for (let i = 0; i < await allTestId.length; i++) {
                var onebyOne = { testid: await allTestId[i], testname: 'This is my test case ' + (i + 1) }
                TestDetails.push(onebyOne);
            }
            MockData.AllTestIdWithName = TestDetails;
        }
        else {
            var allTestIdDetailsForComponent = await GetData.getListOfTestIdAndTestName(selectedProject, 'Api', componentName);
            if (await allTestIdDetailsForComponent.length > 0) {
                MockData.AllTestIdWithName = await allTestIdDetailsForComponent;
                MockData.AllTestId = await GetData.jsonArrayGetallKeyValue(await allTestIdDetailsForComponent, 'testid');
            }
            else {
                MockData.AllTestIdWithName = [];
                MockData.AllTestId = [];
            }
        }
    }

    async getTestName(selectedComponent) {
        if (await selectedComponent.trim() === '') {
            MockData.TestName = ''
        }
        var matchingIndex = await GetData.getIndexForMatchingKeyValueinJsonArray(MockData.AllTestIdWithName, 'testid', await selectedComponent);
        if (matchingIndex >= 0) {
            MockData.TestName = MockData.AllTestIdWithName[matchingIndex]['testname'];
        }
    }

    async isResponseBodyValid() {
        var mockedData = MockData.ResponseBody['MockedResponseBody'];
        var dataTypeOfmockedData = typeof (await mockedData);
        if (dataTypeOfmockedData === 'object') {
            return true;
        }
        else {
            return false;
        }
    }

    async getDynamicDataValue(dataKey, param) {
        return await DynamicDataGetter.getValueFromDynamicData(dataKey, param);
    }

    async getMockDataForExistingTestId(selectedComponent, testId, testName, testingType) {
        if (Config.isDemo) {
            return {}
        }
        else {
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendApi + 'mockrepo/component/' + selectedComponent + '/testId/' + testId + '@' + testName + '/project/' + selectedProject + '/testingtype/' + testingType, await headers);
            return await serverResponse['data'];
        }

    }

    async deleteMockedDataForTestId() {

        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.delete(backendAPI + 'mockrepo/component/' + MockData.SelectedComponent + '/testId/' + MockData.SelectedTestId + '@' + MockData.TestName + '/project/' + selectedProject + '/testingtype/Api', await headers);
            var deleteFile= await serverResponse['data'];
            Config.ErrorMessage = await deleteFile['errorMessage'];
            return await deleteFile['isFileDeleted'];
        }

    }

}
export default new MockRepoGetter;

