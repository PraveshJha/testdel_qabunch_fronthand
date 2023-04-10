import DataGeneratorUtility from '../QAautoMATER/funcLib/DataGeneratorUtility';
import { Config, Users } from '../QAautoMATER/Config';
import RestApi from '../QAautoMATER/funcLib/restAPI';
import DynamicDataGetter from '../QAautoMATER/dynamicData/DynamicData';
import GetData from '../QAautoMATER/funcLib/getData';
import { SessionVariable } from './SessionVariable'
import Matcher from '../QAautoMATER/funcLib/matcher';
import { TestScriptData } from './Api/TestScript/TestScriptData';
import { ConfigData } from './Api/Configuration/ConfigData';
import MockRepoGetter from './Api/MockRepo/MockRepoGetter';
import { CustomFunctionData } from './Web/CustomFunction/CustomFunctionData';
const selectedProject = Config.SelectedProject;
export class DataGetter {

    async getPastDateList(historyCounter) {
        var output = {}
        output['pastdatelist'] = await DataGeneratorUtility.getPastDateListFromCurrentDate(historyCounter);
        output['selectedexecutiondate'] = output['pastdatelist'][0];
        return output;
    }



    async getTestScriptIDfromallComponent(componentName, projectType = 'Api') {
        var allTestId = [];
        if (Config.isDemo) {
            allTestId = await DataGeneratorUtility.getNumberArray(5);
            return allTestId;
        }
        else {
            var allTestIdDetailsForComponent = await GetData.getListOfTestIdAndTestName(selectedProject, projectType, componentName);
            if (await allTestIdDetailsForComponent.length > 0) {
                TestScriptData.AllTestIdWithName = await allTestIdDetailsForComponent;
                allTestId = await GetData.jsonArrayGetallKeyValue(await allTestIdDetailsForComponent, 'testid');
            }
            else {
                TestScriptData.AllTestIdWithName = [];
            }
        }
        return allTestId;
    }

    async getAllApiTestScriptAttribute() {
        if (Config.isDemo) {
            TestScriptData.TestName = "My Test case Name is " + await DataGeneratorUtility.getFirstName();
            var randomNumber = await DataGeneratorUtility.getNumberFromRange(0, 3);
            var httpMethodName = "";
            switch (await Number(await randomNumber)) {
                case 0:
                    httpMethodName = "Get";
                    break;
                case 1:
                    httpMethodName = "Post";
                    break;
                case 2:
                    httpMethodName = "Put";
                    break;
                case 3:
                    httpMethodName = "Delete";
                    break;
                default:
                    httpMethodName = "Patch";
                    break;
            }
            TestScriptData.HttpMethod = await httpMethodName;
            TestScriptData.RelativeUrl = '/'
        }
        else {
            var testID = TestScriptData.TestId;
            var testIdIndex = await GetData.getIndexForMatchingKeyValueinJsonArray(TestScriptData.AllTestIdWithName, 'testid', testID);
            TestScriptData.TestName = TestScriptData.AllTestIdWithName[testIdIndex]['testname'];
            var existingTestDetails = await this.getTestDetailsInJson(TestScriptData.ComponentName, testID, TestScriptData.TestName, 'Api');
            //var existingTestDetails = await (await axios.get(await Config.backendAPI + 'project/' + selectedProject + '/testingtype/Api/components/' + TestScriptData.ComponentName + '/testscript/' + testID + '@' + TestScriptData.TestName)).data;
            //var existingTestDetails = await require('../QAautoMATER/dataHub/' + selectedProject + '/Api/TestScripts/' + TestScriptData.ComponentName + '/' + testID + '@' + TestScriptData.TestName + '.json');
            TestScriptData.HttpMethod = await existingTestDetails['HttpMethod'];
            TestScriptData.SelectedComponentUrl = await existingTestDetails['ComponentUrl'];
            TestScriptData.RelativeUrl = await existingTestDetails['RelativeUrl'];
            TestScriptData.SelectedAutherization = await existingTestDetails['AutherizationCredentialsKey'];
            TestScriptData.AllHttpHeaderData = await existingTestDetails['RequestHeader'];
            TestScriptData.AllRequestBody = await existingTestDetails['RequestBody'];
            TestScriptData.AllRequestVariables = await existingTestDetails['RequestVariable'];
            TestScriptData.AllAssertionData = await existingTestDetails['Assertion'];
            TestScriptData.DependentApiDataTable = await existingTestDetails['DependendtApiScripts'];
            var ListofURl = await ConfigData.AllConfigData['Url'][TestScriptData.SelectedEnvironmentName];
            if (ListofURl !== undefined && ListofURl.length > 0) {
                var urlIndex = await GetData.getIndexForKeySpecificValueInJArray(ListofURl, 'name', TestScriptData.SelectedComponentUrl);
                TestScriptData.ApiUrl = await ListofURl[urlIndex]['url'];
            }
        }
    }

    async getRequestAndResponseFromApi(componentName, testId) {
        var output = {}
        var reqResponseData = {};
        if (Config.isDemo) {
            reqResponseData["Url"] = "https://qaautomater.vercel.app/";
            reqResponseData["Method"] = "Post";
            reqResponseData["ResponseCode"] = 200;
            var resbody = [];
            for (let i = 0; i < 5; i++) {
                var keyPair = { name: '', value: [] }
                keyPair.name = await DataGeneratorUtility.getFirstName();
                keyPair.value = await DataGeneratorUtility.getStringArray(5);
                resbody.push(keyPair);
            }
            reqResponseData["ResponseBody"] = resbody;
            reqResponseData["ResponseHeader"] = { orderId: 'Welcome to QAautoMATER' };
            reqResponseData["RequestHeader"] = await this.getBasicHttpHeader();
            output["ApiResponseData"] = reqResponseData;
            output["ApiVariableData"] = [{ id: 1, key: 'Id', value: 100 }]
            return output;
        }

    }


    async updateTableAfterDeleteRowId(tableData, id) {
        tableData = await tableData.filter(m => m.id !== id);
        for (let i = 0; i < await tableData.length; i++) {
            tableData[i]['id'] = i + 1;;

        }
        return await tableData;
    }
    async updateTableAfterDeletecolumndataField(tableData, matchingIndex) {
        var newTableData = [];
        for (let i = 0; i < await tableData.length; i++) {
            if (await tableData[i]['dataField'] !== matchingIndex) {
                newTableData.push(await tableData[i]);
            }
        }

        return await newTableData;
    }

    async callRestApi(apiUrl, methodName, requestHeader, requestBody) {
        var responsData = {}
        var isRequestBodySent = false;
        var response;
        switch (methodName.trim().toLocaleLowerCase()) {
            case "get":
                response = await RestApi.get(apiUrl, await requestHeader);
                break;
            case "post":
                response = await RestApi.post(apiUrl, requestHeader, await requestBody);
                isRequestBodySent = true;
                break;
            case "put":
                response = await RestApi.put(apiUrl, requestHeader, await requestBody);
                isRequestBodySent = true;
                break;
            case "patch":
                response = await RestApi.patch(apiUrl, requestHeader, await requestBody);
                isRequestBodySent = true;
                break;
            case "delete":
                response = await RestApi.delete(apiUrl, requestHeader, await requestBody);
                break;
            case "head":
                response = await RestApi.head(apiUrl, requestHeader, await requestBody);
                break;
            case "options":
                response = await RestApi.options(apiUrl, requestHeader, await requestBody);
                break;
            default:
                break;
        }
        responsData["Url"] = apiUrl;
        responsData["Method"] = methodName;
        responsData["ResponseCode"] = await response.status;
        responsData["ResponseBody"] = await response.data;
        responsData["ResponseHeader"] = await response.headers;
        if (isRequestBodySent) {
            responsData["RequestBody"] = await requestBody;
        }
        if (await Object.keys(await requestHeader).length > 0) {
            responsData["RequestHeader"] = await requestHeader;
        }
        return responsData;
    }

    async getRandomDataValue(requestBodyData) {
        try {
            var actualData = requestBodyData;
            var keyList = await GetData.getAllDynamicDataKeyList(await requestBodyData, "{{RandomData.");
            if (await keyList.length > 0) {
                var actualDataInString = await JSON.stringify(await actualData);
                for (let i = 0; i < await keyList.length; i++) {
                    var methodName = '';
                    var param = ''
                    var methodNamewithParam = await keyList[i];
                    if (await methodNamewithParam.includes('||')) {
                        methodName = methodNamewithParam.split('||')[0];
                        param = methodNamewithParam.split('||')[1];
                    }
                    else {
                        methodName = await methodNamewithParam;
                    }
                    var dataToReplace = await DynamicDataGetter.getValueFromDynamicData(await methodName, await param);
                    actualDataInString = actualDataInString.replaceAll('{{RandomData.' + methodNamewithParam + '}}', dataToReplace);
                }
                return await JSON.parse(actualDataInString);
            }
            else {
                return requestBodyData;
            }
        }
        catch (error) {

        }
        return await requestBodyData
    }

    async getSessionVariableValue(requestBodyData, testId, SessionVariable) {
        try {
            var actualData = requestBodyData;
            var keyList = await GetData.getAllDynamicDataKeyList(requestBodyData, "{{");
            if (keyList.length > 0) {
                var actualDataInString = await JSON.stringify(await actualData);
                for (let i = 0; i < await keyList.length; i++) {
                    var variableName = await keyList[i];
                    var dataToReplace = await SessionVariable[testId][variableName];
                    if (await dataToReplace === undefined) {
                        var allsessionVarKeys = await Object.keys(await SessionVariable);
                        for (let j = 0; j < await allsessionVarKeys.length; j++) {
                            var keyName = await allsessionVarKeys[j];
                            if (await testId !== keyName) {
                                dataToReplace = await SessionVariable[await keyName][await variableName];
                                if (await dataToReplace !== undefined) {
                                    break;
                                }
                            }
                        }
                    }
                    actualDataInString = await actualDataInString.replaceAll('{{' + variableName + '}}', dataToReplace);
                }
                return await JSON.parse(await actualDataInString);
            }
            else {
                return requestBodyData;
            }
        }
        catch (error) { }
        return await requestBodyData;

    }

    async convertRandomDataandSessionVariable(requestBodyData, testid, sessionVariable) {
        requestBodyData = await this.getRandomDataValue(await requestBodyData);
        requestBodyData = await this.getSessionVariableValue(await requestBodyData, await testid, await sessionVariable);
        return requestBodyData;
    }

    async verifyAllassertion(assertionData) {
        var status = "Pass";
        for (let i = 0; i < await assertionData.length; i++) {
            var actual = await assertionData[i]['actual'];
            var expected = await assertionData[i]['expected'];
            var methodName = await assertionData[i]['function'];
            var isMatch = await Matcher.matchExpectedvsActual(await methodName, await expected, await actual);
            if (!await isMatch) {
                return "Fail";
            }
        }
        return status;
    }

    async saveRequestVariableKeyInSessionVariable(testId, requestVariableData, httpHeaderData, requestBodyData) {
        var keyValue;
        for (let i = 0; i < await requestVariableData.length; i++) {
            var variable = await requestVariableData[i]['variable'];
            var expression = await requestVariableData[i]['key'];
            var namespace = await GetData.createNameSpaceFromExpression(await expression);
            namespace.shift()
            if (expression.toLocaleLowerCase().includes('requestbody')) {
                keyValue = await GetData.getValueFromJsonUsingNameSpace(await requestBodyData, await namespace)
            }
            if (expression.toLocaleLowerCase().includes('requestheader')) {
                keyValue = await GetData.getValueFromJsonUsingNameSpace(await httpHeaderData, await namespace);
            }
            if (SessionVariable[testId] === undefined) {
                SessionVariable[testId] = {};
            }
            SessionVariable[testId][variable] = ''
            if (await keyValue === undefined) {
                SessionVariable[testId][variable] = 'Key not found';
            }
            else {
                SessionVariable[testId][variable] = await keyValue;
            }
        }

    }

    async callDependentApiandSaveInSessionVariable(testingType, parenttestId, dependendentAPIScripts, ListofURl) {
        var depResultData = {};
        var allApiList = await this.getallParentChild(await parenttestId, await dependendentAPIScripts);
        var totalDepAPI = await allApiList.length;
        for (let i = 0; i < await totalDepAPI; i++) {
            var onebyOneApi = await allApiList[totalDepAPI - (i + 1)];
            var parentTestIdtoSave = Object.keys(await onebyOneApi)[0];
            var allChildItems = await onebyOneApi[await parentTestIdtoSave];
            if (await allChildItems.length > 0) {
                for (let j = 0; j < await allChildItems.length; j++) {
                    var allSequnce = await GetData.getIndexForKeySpecificValueInJArray(await allChildItems, 'seq', (j + 1).toString());
                    if (allSequnce.length > 0) {
                        var component = await allChildItems[allSequnce[0]]['component'];
                        var testIdwithName = await allChildItems[allSequnce[0]]['testid'];
                        var testid = await testIdwithName.split('@')[0];
                        var depTestName = await testIdwithName.split('@')[1];
                        var testScriptData = {}
                        testScriptData = await this.getTestDetailsInJson(component, testid, depTestName, 'Api');
                        var componentUrlKey = await testScriptData['ComponentUrl'];
                        var matchingDataIndex = await GetData.getIndexForMatchingKeyValueinJsonArray(await ListofURl, 'name', await componentUrlKey);
                        var requestedUrl = await ListofURl[matchingDataIndex]['url'];
                        var relativeUrl = await testScriptData['RelativeUrl'];
                        requestedUrl = requestedUrl + relativeUrl;
                        var requestHeaderList = await testScriptData['RequestHeader'];
                        var methodName = await testScriptData['HttpMethod'];
                        var requestHeader = await GetData.jsonObjectGetallKeyPairvalue(requestHeaderList, 'key', 'value');
                        requestHeader = await this.convertRandomDataandSessionVariable(await requestHeader, await testid, await SessionVariable);
                        var requestBody = await testScriptData['RequestBody']["1"];
                        requestBody = await this.convertRandomDataandSessionVariable(await requestBody, await testid, await SessionVariable);
                        requestedUrl = await this.convertRandomDataandSessionVariable(await requestedUrl, await testid, await SessionVariable);
                        var ResponseData = {}
                        if (await testingType === 'Unit Testing') {
                            ResponseData = await this.getMockedResponse(await requestedUrl, await methodName, await requestHeader, await requestBody, await component, await testid, await depTestName, 'Api');
                        }
                        else {
                            ResponseData = await this.callRestApi(await requestedUrl, await methodName, await requestHeader, await requestBody);
                        }

                        for (let varCounter = 0; varCounter < allSequnce.length; varCounter++) {
                            var varName = await allChildItems[allSequnce[varCounter]]['variable'];
                            var varValue = await allChildItems[allSequnce[varCounter]]['key'];
                            var namespace = await GetData.createNameSpaceFromExpression(await varValue);
                            var valueToSave = await GetData.getValueFromJsonUsingNameSpace(await ResponseData, await namespace);
                            if (SessionVariable[parentTestIdtoSave] === undefined) {
                                SessionVariable[parentTestIdtoSave] = {};
                            }
                            SessionVariable[parentTestIdtoSave][varName] = ''
                            SessionVariable[parentTestIdtoSave][varName] = await valueToSave;
                        }
                        depResultData[await testIdwithName] = await ResponseData;
                    }
                }
            }

        }
        return await depResultData;
    }

    async getAllDependendentApiScriptsInSequence(dependendentAPIScripts) {
        var allApiList = {};
        for (let i = 0; i < await dependendentAPIScripts.length; i++) {
            allApiList[(i + 1).toString()] = await this.getDependentApiTillLast(await dependendentAPIScripts);
        }
        return allApiList;
    }

    async getDependentApiTillLast(dependendentAPIScripts) {
        var allApiList = [];
        while (dependendentAPIScripts.length !== 0) {
            for (let allCounter = 0; allCounter < await dependendentAPIScripts.length; allCounter++) {
                var allSequnce = await GetData.getIndexForKeySpecificValueInJArray(await dependendentAPIScripts, 'seq', (allCounter + 1).toString());
                if (allSequnce.length > 0) {
                    for (let i = 0; i < allSequnce.length; i++) {
                        var component = await dependendentAPIScripts[allSequnce[i]]['component'];
                        var testIdwithName = await dependendentAPIScripts[allSequnce[i]]['testid'];
                        var testid = await testIdwithName.split('@')[0];
                        var varData = [];
                        var allTestDetails = { component: component, testid: await testid, testidwithname: testIdwithName, variable: [] }
                        var testScriptData = {}
                        //var testScriptData = await require('../QAautoMATER/dataHub/' + selectedProject + '/Api/TestScripts/' + component + '/' + testIdwithName + '.json');
                        for (let varCounter = 0; varCounter < allSequnce.length; varCounter++) {
                            var varName = await dependendentAPIScripts[allSequnce[varCounter]]['variable'];
                            var varValue = await dependendentAPIScripts[allSequnce[varCounter]]['key'];
                            var variable = { key: varName, value: varValue };
                            varData.push(variable);
                        }
                        allTestDetails.variable = varData;
                        allApiList.push(allTestDetails);
                    }

                }
            }
            dependendentAPIScripts = await testScriptData['DependendtApiScripts'];
        }
        return allApiList;
    }

    async getallParentChild(parentTestId, depApiDetails) {
        var allapiDetails = [];
        var allChildDetails = [];
        try {
            while (await allChildDetails.length !== 0 || await depApiDetails.length !== 0) {
                var allParentChildDetails = {};
                allParentChildDetails[await parentTestId] = await depApiDetails;
                allapiDetails.push(await allParentChildDetails);
                for (let i = 0; i < await depApiDetails.length; i++) {
                    allChildDetails.push(await depApiDetails[i]);
                }
                var testIdwithName = await allChildDetails[0]['testid'];
                parentTestId = await testIdwithName.split('@')[0];
                var testDetails = {};
                //var testDetails = await require('../QAautoMATER/dataHub/' + selectedProject + '/Api/TestScripts/' + component + '/' + testIdwithName + '.json');
                depApiDetails = await testDetails['DependendtApiScripts'];
                allChildDetails.splice(0, 1);
            }
        }
        catch (error) { }
        return allapiDetails;
    }

    async getListOfUrlFromEnvronment(environmentName) {
        if (Config.isDemo) {
            var outPut = [];
            var allComponentUrlTable = TestScriptData.AllComponentUrlLIst;
            for (let i = 0; i < await allComponentUrlTable.length; i++) {
                outPut.push(allComponentUrlTable);
            }
            return outPut;
        }
        else {
            return await ConfigData.AllConfigData['Url'][await environmentName];
        }
    }

    async saveResponseVariableKeyInSessionVariable(testId, responseVariableData, responseData) {
        var keyValue;
        for (let i = 0; i < await responseVariableData.length; i++) {
            var variable = await responseVariableData[i]['variable'];
            var expression = await responseVariableData[i]['key'];
            var namespace = await GetData.createNameSpaceFromExpression(await expression);
            namespace.shift()
            if (expression.toLocaleLowerCase().includes('responsebody')) {
                keyValue = await GetData.getValueFromJsonUsingNameSpace(await responseData['ResponseBody'], await namespace);
            }
            if (expression.toLocaleLowerCase().includes('responseheader')) {
                keyValue = await GetData.getValueFromJsonUsingNameSpace(await responseData['ResponseHeader'], await namespace);
            }
            if (SessionVariable[testId] === undefined) {
                SessionVariable[testId] = {};
            }
            SessionVariable[testId][variable] = ''
            if (keyValue === undefined) {
                SessionVariable[testId][variable] = 'Key not found'
            }
            else {
                SessionVariable[testId][variable] = await keyValue;
            }

        }
    }

    async getTestDetailsInJson(component, testId, testName, testingtype) {
        var backendAPI = await Config.backendAPI;
        if (Config.backendServiceAt === 'remote') {
            backendAPI = await Config.remoteBackendAPI;
        }
        try {
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await RestApi.get(backendAPI + 'testscripts/component/' + component + '/testId/' + testId + '@' + testName + '/project/' + selectedProject + '/testingtype/' + testingtype, await headers);
            return serverResponse['data']
        }
        catch (error) {
            Config.ErrorMessage = await error.message;
        }
    }

    async getMockedResponse(apiUrl, methodName, requestHeader, requestBody, componentName, testId, testName, testingType) {
        var responsData = {}
        var isRequestBodySent = false;
        var response = {};
        switch (methodName.trim().toLocaleLowerCase()) {
            case "post":
            case "put":
            case "patch":
                isRequestBodySent = true;
                break;
            default:
                break;
        }
        try {
            response = await MockRepoGetter.getMockDataForExistingTestId(await componentName, await testId, await testName, await testingType);
            var rawreqBody = await response['ResponseBody']['MockedResponseBody'];
            rawreqBody = await this.convertRandomDataandSessionVariable(await rawreqBody, await testId);
            var rawresHeader = await response['ResponseHeader'];
            rawresHeader = await GetData.jsonObjectGetallKeyPairvalue(await rawresHeader, 'key', 'value');
            rawresHeader = await this.convertRandomDataandSessionVariable(await rawresHeader, await testId);
            responsData["Url"] = apiUrl;
            responsData["Method"] = methodName;
            responsData["ResponseCode"] = 200;
            responsData["ResponseBody"] = await rawreqBody;
            responsData["ResponseHeader"] = await rawresHeader;
            if (isRequestBodySent) {
                responsData["RequestBody"] = await requestBody;
            }
            if (Object.keys(await requestHeader).length > 0) {
                responsData["RequestHeader"] = await requestHeader;
            }
        }
        catch (error) {
            responsData['error'] = 'Mock Response data is not found on server, please add the mock response in Mock Repo';
        }
        return responsData;
    }

    async getUITestScriptIDfromallComponent(componentName, projectType) {
        var output = {};
        var allTestId = [];
        if (await Config.isDemo) {
            allTestId = await DataGeneratorUtility.getNumberArray(5);
            output['allTestId'] = await allTestId;
        }
        else {
            var allTestIdDetailsForComponent = await GetData.getListOfTestIdAndTestName(selectedProject, await projectType, await componentName);
            if (await allTestIdDetailsForComponent.length > 0) {
                var testIdWithName = await allTestIdDetailsForComponent;
                allTestId = await GetData.jsonArrayGetallKeyValue(await allTestIdDetailsForComponent, 'testid');
                output['allTestId'] = await allTestId;
                output['testIdWithName'] = await testIdWithName;
            }
            else {
                output['testIdWithName'] = []
            }
        }
        return output;
    }

    async GetAllActions() {
        if (await Config.isDemo) {
            CustomFunctionData.AllSeleniumMethod = [{ label: 'LaunchApplication', value: 'LaunchApplication' }, { label: 'Click', value: 'Click' }, { label: 'Type', value: 'Type' }]
        }
        else {
            try {
                var backendApi = await Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await RestApi.get(backendApi + 'seleniummethod/project/' + selectedProject, await headers);
                var allSeleniumMethod = await serverResponse['data'];
                var allOptionsList = [];
                for (let i = 0; i < await allSeleniumMethod.length; i++) {
                    var methodList = { label: await allSeleniumMethod[i], value: await allSeleniumMethod[i] };
                    allOptionsList.push(await methodList);
                }
                CustomFunctionData.AllSeleniumMethod = await allOptionsList;
                return await allOptionsList;
            }
            catch (error) {
                Config.ErrorMessage = await error.message;
            }
        }
    }

    async getArgumentListFromParameter(parameter) {
        var allOutPut = [];
        var keywordToFind = ''
        if (await parameter.includes('+ARGS.')) {
            keywordToFind = '+ARGS.'
        }
        else if (await parameter.includes('ARGS.')) {
            keywordToFind = 'ARGS.'
        }
        else {
            return await allOutPut;
        }
        if (await parameter.includes(await keywordToFind)) {
            for (let i = 0; i < 10; i++) {
                try {
                    var argsName = await parameter.split(await keywordToFind)[1].trim();
                    if(await argsName.includes('+'))
                    {
                        argsName = await argsName.split('+')[0].trim();
                        var replaceKeyWord = await keywordToFind + await argsName+'+';
                    }
                    else if(await argsName.includes(','))
                    {
                        argsName = await argsName.split(',')[0].trim();
                        var replaceKeyWord = await keywordToFind + await argsName;
                    }
                    else{
                        var replaceKeyWord = await keywordToFind + await argsName;
                    }
                    var argsToSave = 'ARGS.' + await argsName;
                    if (!await allOutPut.includes(await argsToSave)) {
                        allOutPut.push(await argsToSave);
                    }
                    parameter = await parameter.replace(await replaceKeyWord, "");
                }
                catch (error) { }
            }
        }
        return await allOutPut;
    }

    async ConvertArgsKeyintoUpperCase(parameter) {
        return await parameter;
    }

}
export default new DataGetter();

