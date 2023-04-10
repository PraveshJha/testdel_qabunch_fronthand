import { ExecutionLabData } from './ExecutionLabData';
import DataGetter from '../../../pages/DataGetter';
import { Config, Users } from '../../../QAautoMATER/Config';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import ConfigGetter from '../Configuration/ConfigGetter';
import { ConfigData } from '../Configuration/ConfigData';
import GetData from '../../../QAautoMATER/funcLib/getData';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;


export class ExecutionLabDataGetter {

    async apiExecutionLabPageLoadData() {

        var allconfigData = null;
        if (!Config.isDemo) {
            allconfigData = await ConfigGetter.readConfigurationFile();
            ConfigData.AllConfigData = await allconfigData;
        }
        await this.renderEnvironment(await allconfigData);
        await this.renderAllComponent();
        await this.renderThreadCount();

    }

    async renderEnvironment(allconfigData) {
        await ConfigGetter.updateEnvironmentTableData(allconfigData);
        ExecutionLabData.EnvironmentList = ConfigData.EnvironmentList;
        ExecutionLabData.SelectedEnvironment = ConfigData.DefaultSelectedEnvironment;
    }

    async renderAllComponent() {
        if (Config.isDemo) {
            ExecutionLabData.ComponentList = ["All", "LandingPage", "SignIn", "ProductList", "ShoppingCart", "BookingSummary"];
            ExecutionLabData.SelectedComponent = "All";
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendAPI + 'components/project/' + selectedProject + '/testingtype/Api', await headers);
            var allComponent = await serverResponse['data'];
            if (allComponent.length > 0) {
                ExecutionLabData.ComponentList = ["All"].concat(allComponent);
                ExecutionLabData.SelectedComponent = "All";
            }
        }
    }

    async renderThreadCount() {
        if (ExecutionLabData.ThreadList.length > 0) {
            ExecutionLabData.ThreadCount = ExecutionLabData.ThreadList[0];
        }
    }


    async getAllTestScriptsfromComponent(componentName) {
        if (componentName === 'All') {
            ExecutionLabData.ListOfTestScripts = await this.createTestSuiteForAllComponent(ExecutionLabData.ComponentList);
        }
        else {
            ExecutionLabData.ListOfTestScripts = await this.createTestSuiteForSpecificComponent(componentName);
        }
    }

    async executeAPITestScripts(environment, threadCount, testingType, reportInDashBoard, selectedScripts) {
        var allTestScripts = ExecutionLabData.ListOfTestScripts;
        var totalPass = 0;
        var totalFail = 0;
        var doughnutData = [];
        var barChartDataForPass = {};
        var barChartDataForFail = {};
        var componentPassFailData = [];
        var executionReportData ={}
        var status = "Pass";
        if (Config.isDemo) {
            var mockResultsData = {};
            for (let i = 0; i < await selectedScripts.length; i++) {
                var executionStartDate = new Date();
                var selectedRowId = await selectedScripts[i];
                var randomNumber = await DataGeneratorUtility.getNumberFromRange(0, 1);
                status = "Pass";
                var AssertionData = [{ "id": 1, "expression": "ResponseCode", "function": "ShouldBe", "expected": 200, "actual": 200 }]
                mockResultsData['ResponseCode'] = 200;
                mockResultsData['ResponseHeader'] = { headkerKey: 'Hope you are enjoing QAautoMater' };
                mockResultsData['ResponseBody'] = { message: 'I m just hradcoded data , on real data you will get whatever you sent and whatever you get from the server' };
                if (randomNumber === 1) {
                    status = "Fail";
                    AssertionData = [{ "id": 1, "expression": "ResponseCode", "function": "ShouldBe", "expected": 201, "actual": 200 }]
                }
                allTestScripts[selectedRowId - 1]['status'] = status;
                ExecutionLabData.AssertionResultsForAllResults[selectedRowId] = await AssertionData;
                ExecutionLabData.ResponseDataForAllResults[selectedRowId] = await mockResultsData;
                var executionendDate = new Date();
                var executionTimeInseconds = (executionendDate.getTime() - executionStartDate.getTime()) / 1000;
                mockResultsData['Execution Time'] = await executionTimeInseconds + ' Seconds';
            }

        }
        else {
            var requestBody = {};
            requestBody['environment'] = await environment;
            requestBody['threadCount'] = await threadCount;
            requestBody['testingType'] = await testingType;
            requestBody['reportInDashBoard'] = await reportInDashBoard;
            var testScriptCollection =[];
            for (let i = 0; i < await selectedScripts.length; i++) 
            {
               var testDetails = await allTestScripts[Number(await selectedScripts[await i])-1];
               testScriptCollection.push(await testDetails);
            }
            requestBody['testscriptforExecution'] = await testScriptCollection;
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(backendAPI + 'apiexecutor/project/' + selectedProject, await headers, await requestBody);
             executionReportData = await serverResponse['data'];
            //update status
            for (let i = 0; i < await selectedScripts.length; i++) 
            {
               allTestScripts[Number(await selectedScripts[await i])-1]['status'] = await executionReportData['listOfTestScipts'][i]['status'];
               ExecutionLabData.AssertionResultsForAllResults[await selectedScripts[i]] = await executionReportData['testscriptAssertionData'][i+1];
               ExecutionLabData.ResponseDataForAllResults[await selectedScripts[i]] = await executionReportData['testscriptResponseData'][i+1];
            }

        }

        ///********* update Test Suite Result Data and Graph Data ***************************

        ExecutionLabData.ListOfTestScripts = allTestScripts;
        for (let i = 0; i < allTestScripts.length; i++) {
            var componentName = await allTestScripts[i]['component'];
             status = await allTestScripts[i]['status'];
            if (status === "Pass") {
                totalPass = totalPass + 1;
                if (barChartDataForPass[componentName] === undefined)
                    barChartDataForPass[componentName] = 1;
                else
                    barChartDataForPass[componentName] = barChartDataForPass[componentName] + 1;
            }
            else if (status === "Fail") {
                totalFail = totalFail + 1;
                if (barChartDataForFail[componentName] === undefined)
                    barChartDataForFail[componentName] = 1;
                else
                    barChartDataForFail[componentName] = barChartDataForFail[componentName] + 1;
            }
        }
        await new Promise(wait => setTimeout(wait, 2000));
        doughnutData.push(totalPass);
        doughnutData.push(totalFail);
        ExecutionLabData.TotalPassFailInLastXResults = doughnutData;
        componentPassFailData.push(barChartDataForPass);
        componentPassFailData.push(barChartDataForFail);
        ExecutionLabData.BarChartDataForComponent = componentPassFailData;

        ///********* update Execution time and Graph Data **********************************************

    //*** ExecutionTimeData****************************************************************
    var componentExecutionData = await executionReportData['executionTimeForComponent'];
    var componentPassDataxandyAxis = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await componentExecutionData);
    ExecutionLabData.ExecutionTimeGraphXaxis= await await componentPassDataxandyAxis['key'];
    var executiontimeYaxisData =[];
    executiontimeYaxisData.push(await componentPassDataxandyAxis['value']);
    ExecutionLabData.ExecutionTimeGraphYaxis = await executiontimeYaxisData;

    }

    async createTestSuiteForSpecificComponent(componentName, rowId = 1) {
        var allTestScripts = [];
        var rowData ={}
        if (Config.isDemo) {
            var randomRowCount = await DataGeneratorUtility.getNumberFromRange(10, 20);
            for (let i = 0; i < randomRowCount; i++) {
                rowData = { id: 0, component: await componentName, testid: 0, testname: '', status: '' }
                rowData.id = rowId;
                rowData.testid = "QA-" + await DataGeneratorUtility.getNumberFromRange(100, 500);
                rowData.testname = " This is test case No " + (i + 1);
                rowData.status = ''
                allTestScripts.push(rowData);
                rowId = rowId + 1;
            }
        }
        else {
            var allComponentTestDetails = await GetData.getListOfTestIdAndTestName(selectedProject, 'Api', componentName);
            for (let i = 0; i < allComponentTestDetails.length; i++) {
                rowData = { id: rowId, component: await componentName, testid: await allComponentTestDetails[i]['testid'], testname: await allComponentTestDetails[i]['testname'], status: '' }
                allTestScripts.push(rowData);
                rowId = rowId + 1;
            }
        }
        return allTestScripts;
    }

    async createTestSuiteForAllComponent(listOfComponent) {
        var allTestScripts = [];
        var rowId = 1;
        for (let i = 1; i < await listOfComponent.length; i++) {
            var componetTestDetails = await this.createTestSuiteForSpecificComponent(await listOfComponent[i], rowId);
            rowId = componetTestDetails.length + rowId;
            allTestScripts = allTestScripts.concat(componetTestDetails);
        }
        return allTestScripts;
    }

    async updateAssertionTable(responseData, assertionTable) {
        for (let i = 0; i < await assertionTable.length; i++) {
            var expression = await assertionTable[i]['expression'];
            var methodName = await assertionTable[i]['function'];
            var nameSpace = await GetData.createNameSpaceFromExpression(await expression);
            var actual = await GetData.getValueFromJsonUsingNameSpace(await responseData, nameSpace);
            if (actual === undefined) {
                actual = 'Key not found!'
            }
            if (methodName.toString().toLowerCase().includes('length')) {
                actual = await actual.length;
            }
            if (typeof (actual) === 'object') {
                assertionTable[i]['actual'] = await JSON.stringify(await actual);
            }
            else {
                assertionTable[i]['actual'] = await actual;
            }
            var expected = await assertionTable[i]['expected'];
            assertionTable[i]['expected'] = await DataGetter.getSessionVariableValue(await expected);
        }
        return assertionTable;
    }

    async updateAssertionTableForAllDataset(baseTable, newRowstoAdd) {
        var lastLength = await baseTable.length + 1;
        for (let i = 0; i < await newRowstoAdd.length; i++) {
            var oneByoneRow = { id: await lastLength, expression: await newRowstoAdd[i]['expression'], function: await newRowstoAdd[i]['function'], expected: await newRowstoAdd[i]['expected'], actual: await newRowstoAdd[i]['actual'] };
            baseTable.push(await oneByoneRow);
            lastLength = lastLength + 1;
        }
        return baseTable;
    }




}
export default new ExecutionLabDataGetter();

