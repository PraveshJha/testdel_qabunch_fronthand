import { TestScriptData } from './TestScriptData';
import { Config, Users } from '../../../QAautoMATER/Config';
import DataGetter from '../../../pages/DataGetter';
import GetData from '../../../QAautoMATER/funcLib/getData';
import DynamicDataGetter from '../../../QAautoMATER/dynamicData/DynamicData';
import SetData from '../../../QAautoMATER/funcLib/setData';
import ConfigGetter from '../Configuration/ConfigGetter';
import { ConfigData } from '../Configuration/ConfigData';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import ExecutionLabDataGetter from '../ExecutionLab/ExecutionLabDataGetter';
import { SessionVariable } from '../../SessionVariable';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;

export class TestScriptGetter {

    async apiTestScriptPageLoadData() {
        var allconfigData = null;
        if (!Config.isDemo) {
            allconfigData = await ConfigGetter.readConfigurationFile();
            ConfigData.AllConfigData = await allconfigData;
        }
        await this.renderComponent();
        await this.renderEnvironment(allconfigData);
        await this.renderAutherization(allconfigData);
        await ConfigGetter.updateHttpHeaderTableData(allconfigData);
        TestScriptData.AllHttpHeaderData = ConfigData.HttpHeaderData

    }

    async renderComponent() {
        if (Config.isDemo) {
            TestScriptData.AllComponentList = ["LandingPage", "SignIn", "ProductList", "ShoppingCart", "BookingSummary"];
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendAPI + 'components/project/' + selectedProject + '/testingtype/Api', await headers);
            TestScriptData.AllComponentList = await serverResponse['data'];
        }
        if (TestScriptData.AllComponentList.length > 0) {
            var dependentComponentList = [];
            for (let i = 0; i < TestScriptData.AllComponentList.length; i++) {
                var itemList = { label: TestScriptData.AllComponentList[i], value: TestScriptData.AllComponentList[i] };
                dependentComponentList.push(itemList);
            }
            TestScriptData.DependendtComponentList = dependentComponentList;
        }
    }

    async getTestScriptListFromComponent(componentName) {
        TestScriptData.AllTestId = await DataGetter.getTestScriptIDfromallComponent(componentName);
    }

    async getAllAPITestAttribute() {
        await DataGetter.getAllApiTestScriptAttribute();
    }

    async renderEnvironment(allconfigData) {
        await ConfigGetter.updateEnvironmentTableData(allconfigData);
        TestScriptData.AllEnvironmentList = ConfigData.EnvironmentList;
        if (TestScriptData.AllEnvironmentList.length > 0) {
            if (Config.isDemo) {
                TestScriptData.SelectedEnvironmentName = ConfigData.DefaultSelectedEnvironment;
                TestScriptData.AllComponentUrlLIst = await DataGeneratorUtility.getStringArray(3);
                TestScriptData.SelectedComponentUrl = TestScriptData.AllComponentUrlLIst[0];
                TestScriptData.ApiUrl = "https://fakerestapi.azurewebsites.net/api/v1/Activities"
            }
            else {
                TestScriptData.SelectedEnvironmentName = ConfigData.DefaultSelectedEnvironment;
                var ListofURl = await allconfigData['Url'][TestScriptData.SelectedEnvironmentName];
                if (ListofURl !== undefined && ListofURl.length > 0) {
                    TestScriptData.AllComponentUrlLIst = await GetData.jsonArrayGetallKeyValue(ListofURl, 'name');
                    if (TestScriptData.AllComponentUrlLIst.length > 0) {
                        TestScriptData.SelectedComponentUrl = TestScriptData.AllComponentUrlLIst[0];
                        TestScriptData.ApiUrl = await ListofURl[0]['url'];
                    }

                }
            }
        }

    }

    async selectEnvironment(envName) {
        var allURlList = await DataGetter.getListOfUrlFromEnvronment(await envName);
        var allComponentUrlKey = await GetData.jsonArrayGetallKeyValue(allURlList, 'name');
        TestScriptData.AllComponentUrlLIst = allComponentUrlKey;
        TestScriptData.SelectedComponentUrl = TestScriptData.AllComponentUrlLIst[0];
        TestScriptData.ApiUrl = allURlList[0]['url'];
    }

    async setApiUrlAfterSelectingComponent(envName, componentName) {
        var allURlList = await DataGetter.getListOfUrlFromEnvronment(await envName);
        var matchingIndex = await GetData.getIndexForMatchingKeyValueinJsonArray(await allURlList, 'name', await componentName);
        if (matchingIndex > -1) {
            TestScriptData.ApiUrl = allURlList[matchingIndex]['url'];
        }
    }

    async renderAutherization(allconfigData) {
        if (Config.isDemo) {
            TestScriptData.AllAutherizationList = await DataGeneratorUtility.getStringArray(3);
        }
        else {
            var allAuthDetails = await allconfigData['Authorization'];
            if (await allAuthDetails !== undefined && await allAuthDetails.length > 0) {
                TestScriptData.AllAutherizationList = await GetData.jsonArrayGetallKeyValue(allAuthDetails, 'key');
            }
        }
    }

    async getApiRequestAndResponseData(componentName, testId) {
        var output = await DataGetter.getRequestAndResponseFromApi(await componentName, await testId);
        TestScriptData.ApiResponseData = output['ApiResponseData'];
        TestScriptData.ApiVariableData = output['ApiVariableData'];
    }

    async callRestApiMethod(apiUrl, relativeUrl, testid, requestHeaderList, methodName, requestPayLoad, dependentApi, assertionData, requestVariable) {
        var requestHeader ={}
        try {
            var allVariableDataToShow = [];
            if (await relativeUrl.toString().trim() !== '') {
                apiUrl = await apiUrl + await relativeUrl;
            }
            if (await testid.toString().trim() === '') {
                testid = "Debug-TestId"
            }
            requestHeader = await GetData.jsonObjectGetallKeyPairvalue(await requestHeaderList, 'key', 'value');
            requestHeader = await DataGetter.convertRandomDataandSessionVariable(await requestHeader, await testid);
            var totalIteration = 1;
            if (await methodName === "Post" || await methodName === "Put" || await methodName === "Patch") {
                if (!Config.isDemo) {
                    totalIteration = await Object.keys(await requestPayLoad).length;
                }
            }
            var allDataSetResults = {};
            var assertionResultsForAllDataSet = [];
            var ListofURl = await DataGetter.getListOfUrlFromEnvronment(TestScriptData.SelectedEnvironmentName);
            for (let dataCounter = 1; dataCounter <= await totalIteration; dataCounter++) {  
                var dependendentResponse = await DataGetter.callDependentApiandSaveInSessionVariable(TestScriptData.TestingType, await testid, await dependentApi, await ListofURl);
                var requestBody = await requestPayLoad[dataCounter.toString()];
                requestBody = await DataGetter.convertRandomDataandSessionVariable(await requestBody, await testid,await SessionVariable);
                var requestedUrl = await DataGetter.convertRandomDataandSessionVariable(await apiUrl, await testid,await SessionVariable);
                requestHeader = await GetData.jsonObjectGetallKeyPairvalue(await requestHeaderList, 'key', 'value');
                requestHeader = await DataGetter.convertRandomDataandSessionVariable(await requestHeader, await testid, await SessionVariable);
                await DataGetter.saveRequestVariableKeyInSessionVariable(await testid, await requestVariable, await requestHeader, await requestBody);
                var ResponseData = await DataGetter.callRestApi(await requestedUrl, await methodName, await requestHeader, await requestBody);
                var totalDepApi = await Object.keys(await dependendentResponse).length;
                allDataSetResults["Test Results for Dataset " + dataCounter] = await ResponseData;
                if (await totalDepApi > 0) {
                    allDataSetResults["Dependendt Api Response Result"] = await dependendentResponse;
                }
                assertionData = await DataGetter.convertRandomDataandSessionVariable(await assertionData, await testid, await SessionVariable);
                assertionData = await SetData.addNewKeyInExistingJsonArray(await assertionData, 'actual');
                assertionData = await ExecutionLabDataGetter.updateAssertionTable(ResponseData, assertionData);
                assertionResultsForAllDataSet = await ExecutionLabDataGetter.updateAssertionTableForAllDataset(await assertionResultsForAllDataSet, await assertionData);
            }
            if (totalIteration === 1 && totalDepApi === 0) {
                TestScriptData.ApiResponseData = await ResponseData;
            }
            else if (totalIteration === 1 && totalDepApi > 0) {
                ResponseData['Dependendt Api Response Result'] = await dependendentResponse;
                TestScriptData.ApiResponseData = await ResponseData;
            }
            else {
                TestScriptData.ApiResponseData = await allDataSetResults;
            }
            TestScriptData.ResponseAssertionData = await assertionResultsForAllDataSet;
            if (await SessionVariable[await testid] !== undefined) {
                var allVarDataVaue = await Object.keys(await SessionVariable[await testid]);
                for (let varCounter = 0; varCounter < await allVarDataVaue.length; varCounter++) {
                    var keyName = await allVarDataVaue[varCounter];
                    var keyValue = await SessionVariable[await testid][keyName];
                    var dataType = typeof (await keyValue);
                    var rowDetails = {}
                    if (await dataType === 'object') {
                        rowDetails = { id: varCounter + 1, key: await keyName, value: await JSON.stringify(await keyValue) };
                    }
                    else {
                        rowDetails = { id: varCounter + 1, key: await keyName, value: await keyValue };
                    }
                    allVariableDataToShow.push(await rowDetails);
                }
            }

            TestScriptData.ApiVariableData = await allVariableDataToShow;
        }
        catch (error) {
            var errortoShow = error.toString();
            assertionData = await SetData.addNewKeyInExistingJsonArray(assertionData, 'actual', 'Not Evaluated');
            TestScriptData.ResponseAssertionData = await assertionData;
            TestScriptData.ApiResponseData = { errorMessage: errortoShow };
            TestScriptData.ApiVariableData = await allVariableDataToShow;
        }
    }

    async addDependentApiTableHeader() {
        var dependentRow = { id: 1, component: '', testid: '', variable: 'myKey', key: 'ResponseBody[keyName]', seq: 1 };
        if (TestScriptData.DependentApiDataTable.length === 0) {
            TestScriptData.DependentApiDataTable.push(dependentRow)
        }
    }

    async getDependentTestIdList(componentName) {
        var allTestIdwithName = [];
        var testId =''
        var testDetails =''
        var testIdwithName =''
        if (Config.isDemo) {
             testId = await DataGeneratorUtility.getNumberArray(5);
            for (let i = 0; i < await testId.length; i++) {
                testDetails = await testId[i] + '@ this my test case ' + (i + 1);
                testIdwithName = { label: testDetails, value: testDetails }
                allTestIdwithName.push(testIdwithName);
            }
            TestScriptData.DependentTestIdList = await allTestIdwithName;
        }
        else {
            var allTestIdDetailsForComponent = await GetData.getListOfTestIdAndTestName(selectedProject, 'Api', componentName);
            for (let i = 0; i < await allTestIdDetailsForComponent.length; i++) {
                testId = await allTestIdDetailsForComponent[i]['testid'];
                var testName = await allTestIdDetailsForComponent[i]['testname'];
                testDetails = testId + '@' + testName;
                testIdwithName = { label: testDetails, value: testDetails }
                allTestIdwithName.push(testIdwithName);
            }
            TestScriptData.DependentTestIdList = await allTestIdwithName;
        }
    }

    async isDataFilledforDependendentAPITable() {
        var allData = TestScriptData.DependentApiDataTable;
        for (let i = 0; i < allData.length; i++) {
            var component = await allData[i]['component'].toString().trim();
            var testid = await allData[i]['testid'].toString().trim();
            var variable = await allData[i]['variable'].toString().trim();
            var key = await allData[i]['key'].toString().trim();
            var seq = await allData[i]['seq'].toString().trim();
            if (component === '' || testid === '' || variable === '' || key === '' || seq === '') {
                return false;
            }
            if (await testid.includes(await TestScriptData.TestId + '@')) {
                return false;
            }
        }
        return true;
    }

    async deleteApiTestScript(componentName, testId) {
        if (!TestScriptData.AllComponentList.includes(await componentName)) {
            return false;
        }
        else if (!TestScriptData.AllTestId.includes(await testId)) {
            return false;
        }
        else {
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
                var serverResponse = await restAPI.delete(backendAPI + 'testscripts/component/' + componentName + '/testId/' + testId + '@' + TestScriptData.TestName + '/project/' + selectedProject + '/testingtype/Api', await headers);
                var deleteFile = await serverResponse['data'];
                Config.ErrorMessage = await deleteFile['errorMessage'];
                return await deleteFile['isFileDeleted'];
                // var filePath = apiComponentPath + componentName + '/' + testId + '@' + TestScriptData.TestName + '.json';
                // return await FileLib.deleteFile(filePath);
            }

        }
    }

    async isAllDetailsValidInBasicDetailSection() {
        if (TestScriptData.IsValidComponentName && TestScriptData.IsValidTestId && TestScriptData.IsValidTestName && TestScriptData.IsValidHttpMethod) {
            return true;
        }
        else {
            return false;
        }
    }

    async isAllDetailsValidInUrlDetailSection() {
        if (TestScriptData.IsValidEnvironment && TestScriptData.IsValidComponentUrl) {
            return true;
        }
        else {
            return false;
        }
    }

    async isAllDetailsValidInDependendtApiTable() {
        if (!await this.isDataFilledforDependendentAPITable()) {
            return false;
        }
        return true;
    }

    async isAllDetailsValidForRequestHeaderTable() {
        var tableData = TestScriptData.AllHttpHeaderData;
        var tableLength = tableData.length;
        if (tableLength > 0) {
            if (await tableData[tableLength - 1]['key'].toString().trim() === '' || await tableData[tableLength - 1]['value'].toString().trim() === '') {
                return false;
            }
            else { return true; }
        }
        else {
            return true;
        }

    }

    async isAllDetailsValidForRequestVariableTable() {
        var tableData = TestScriptData.AllRequestVariables;
        var tableLength = tableData.length;
        if (tableLength > 0) {
            if (await tableData[tableLength - 1]['variable'].toString().trim() === '' || await tableData[tableLength - 1]['key'].toString().trim() === '') {
                return false;
            }
            else { return true; }
        }
        else {
            return true;
        }

    }

    async isAllDetailsValidForRequestAssertionTable() {
        var tableData = TestScriptData.AllAssertionData;
        var tableLength = tableData.length;
        if (tableLength > 0) {
            if (await tableData[tableLength - 1]['expression'].toString().trim() === '' || await tableData[tableLength - 1]['function'].toString().trim() === '') {
                return false;
            }
            else { return true; }
        }
        else {
            return true;
        }

    }

    async getMaxSequence() {
        var dataTable = TestScriptData.DependentApiDataTable;
        var AllTestIDList = [];
        for (let i = 0; i < await dataTable.length; i++) {
            var testId = await dataTable[i]['testid'];
            if (!AllTestIDList.includes(testId)) {
                AllTestIDList.push(await testId);
            }
        }
        return AllTestIDList.length;
    }

    async saveTestScript() {

        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {
            var testDetails = {};
            testDetails['ComponentUrl'] = TestScriptData.SelectedComponentUrl;
            testDetails['RelativeUrl'] = TestScriptData.RelativeUrl;
            testDetails['HttpMethod'] = TestScriptData.HttpMethod;
            testDetails['AutherizationCredentialsKey'] = TestScriptData.SelectedAutherization;
            testDetails['RequestHeader'] = TestScriptData.AllHttpHeaderData;
            testDetails['RequestBody'] = TestScriptData.AllRequestBody;
            testDetails['RequestVariable'] = TestScriptData.AllRequestVariables;
            testDetails['Assertion'] = TestScriptData.AllAssertionData;
            testDetails['DependendtApiScripts'] = TestScriptData.DependentApiDataTable;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(backendApi + 'testscripts/component/' + TestScriptData.ComponentName + '/testId/' + TestScriptData.TestId + '@' + TestScriptData.TestName + '/project/' + selectedProject + '/testingtype/Api', await headers,await testDetails);
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            return await saveFile['isFileSaved'];
        }

    }

    async getDynamicDataValue(dataKey, param) {
        return await DynamicDataGetter.getValueFromDynamicData(dataKey, param);
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

    async getDependentApiScriptAttribute(selectedDependentApi) {
        var outPut = {}
        var variableData = [];
        var testIdWithName = await selectedDependentApi['testid'];
        var component = await selectedDependentApi['component'];
        var varName = await selectedDependentApi['variable'];
        var keytoGet = await selectedDependentApi['key'];
        var testId = await testIdWithName.split('@')[0];
        var depTestName = await testIdWithName.split('@')[1];
        outPut['testid'] = await testId;
        outPut['testname'] = await depTestName;
        outPut['component'] = await component;
        variableData.push({ id: 1, variable: await varName, key: await keytoGet });
        outPut['variabledata'] = await variableData;
        outPut['assertion'] = [];
        if (Config.isDemo) {
            outPut['relativeurl'] = '';
            outPut['httpmethod'] = 'Get';
            outPut['requestheader'] = await ConfigData.HttpHeaderData;
            outPut['requestbody'] = {};
            outPut['childapi'] = [];
        }
        else {
            var testScriptData = {}
            testScriptData = await DataGetter.getTestDetailsInJson(await component, await testId, await depTestName, 'Api');
            //var testScriptData = await require('../../../QAautoMATER/dataHub/' + selectedProject + '/Api/TestScripts/' + component + '/' + testIdWithName + '.json');
            outPut['relativeurl'] = await testScriptData['RelativeUrl'];
            outPut['httpmethod'] = await testScriptData['HttpMethod'];
            outPut['requestheader'] = await testScriptData['RequestHeader'];
            outPut['requestbody'] = await testScriptData['RequestBody'];
            outPut['childapi'] = await testScriptData['DependendtApiScripts'];
        }
        return await outPut;
    }

    async callDependendtApiMethod(testingType, apiUrl, relativeUrl, testid, requestHeaderList, methodName, requestPayLoad, dependentApi, responseVariable, component, testName) {
        var requestHeader ={}
        var ResponseData ={}
        var totalDepApi = 0;
        try {
            SessionVariable[await testid] = {};
            var allVariableDataToShow = [];
            if (await relativeUrl.toString().trim() !== '') {
                apiUrl = await apiUrl + await relativeUrl;
            }
            var requestedUrl = await apiUrl;
            requestHeader = await GetData.jsonObjectGetallKeyPairvalue(await requestHeaderList, 'key', 'value');
            requestHeader = await DataGetter.convertRandomDataandSessionVariable(await requestHeader, await testid);
            var totalIteration = 1;
            if (testingType === 'Unit Testing') {
                totalDepApi = 0;
                ResponseData = await DataGetter.getMockedResponse(await apiUrl, await methodName, await requestHeaderList, await requestPayLoad, await component, await testid, await testName, 'Api');
                await DataGetter.saveResponseVariableKeyInSessionVariable(await testid, await responseVariable, await ResponseData);
            }
            else {
                if (methodName === "Post" || methodName === "Put" || methodName === "Patch") {
                    try {
                        totalIteration = await Object.keys(await requestPayLoad).length;
                    }
                    catch (error) { }
                }
                var allDataSetResults = {};
                var ListofURl = await DataGetter.getListOfUrlFromEnvronment(await TestScriptData.SelectedEnvironmentName);
                for (let dataCounter = 1; dataCounter <= totalIteration; dataCounter++) {
                    var dependendentResponse = await DataGetter.callDependentApiandSaveInSessionVariable(await testingType, await testid, await dependentApi, await ListofURl);
                    var requestBody = await requestPayLoad[dataCounter.toString()];
                    requestBody = await DataGetter.convertRandomDataandSessionVariable(await requestBody, await testid,await SessionVariable);
                    requestedUrl = await DataGetter.convertRandomDataandSessionVariable(await requestedUrl, await testid,await SessionVariable);
                    requestHeader = await GetData.jsonObjectGetallKeyPairvalue(await requestHeaderList, 'key', 'value');
                    requestHeader = await DataGetter.convertRandomDataandSessionVariable(await requestHeader, await testid, await SessionVariable);
                    ResponseData = await DataGetter.callRestApi(await requestedUrl, await methodName, await requestHeader, await requestBody);
                    await DataGetter.saveResponseVariableKeyInSessionVariable(await testid, await responseVariable, await ResponseData);
                    totalDepApi = await Object.keys(await dependendentResponse).length;
                    allDataSetResults["Test Results for Dataset " + dataCounter] = await ResponseData;
                    if (await totalDepApi > 0) {
                        allDataSetResults["Dependendt Api Response Result"] = await dependendentResponse;
                    }
                }
            }
            if (totalIteration === 1 && totalDepApi === 0) {
                TestScriptData.ApiResponseData = await ResponseData;
            }
            else if (totalIteration === 1 && totalDepApi > 0) {
                ResponseData['Dependendt Api Response Result'] = await dependendentResponse;
                TestScriptData.ApiResponseData = await ResponseData;
            }
            else {
                TestScriptData.ApiResponseData = await allDataSetResults;
            }
            if (SessionVariable[await testid] !== undefined) {
                var allVarDataVaue = Object.keys(SessionVariable[await testid]);
                for (let varCounter = 0; varCounter < allVarDataVaue.length; varCounter++) {
                    var keyName = await allVarDataVaue[varCounter];
                    var keyValue = await SessionVariable[await testid][keyName];
                    var dataType = typeof (keyValue);
                    var rowDetails ={}
                    if (dataType === 'object') {
                         rowDetails = { id: varCounter + 1, key: keyName, value: await JSON.stringify(keyValue) };
                    }
                    else {
                         rowDetails = { id: varCounter + 1, key: keyName, value: keyValue };
                    }
                    allVariableDataToShow.push(rowDetails);
                }
            }

            TestScriptData.ApiVariableData = await allVariableDataToShow;
        }
        catch (error) {
            var errortoShow = error.toString();
            TestScriptData.ApiResponseData = { errorMessage: errortoShow };
            TestScriptData.ApiVariableData = await allVariableDataToShow;
        }
    }

    async renameTestId() {
        if (Config.isDemo) {
            return true;
        }
        else {
            var componentName = TestScriptData.ComponentName.trim();
            var existingTestId = TestScriptData.TestId.trim();
            var newTestId = TestScriptData.NewTestId.trim();
            var testName = TestScriptData.TestName.trim();
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(backendApi + 'testscripts/component/' + componentName + '/testId/' + existingTestId + '@' + testName + '/project/' + selectedProject + '/testingtype/Api/updateid', await headers,{ newId: newTestId });
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            return await saveFile['isFileSaved'];
        }

    }


}
export default new TestScriptGetter();

