import { DashBoardData } from './DashboardData';
import DataGetter from '../DataGetter';
import DataGeneratorUtility from '../../QAautoMATER/funcLib/DataGeneratorUtility'
import { Config, Users } from '../../QAautoMATER/Config';
import { ConfigData } from '../Api/Configuration/ConfigData';
import ConfigGetter from '../Api/Configuration/ConfigGetter';
import GetData from '../../QAautoMATER/funcLib/getData';
import restAPI from '../../QAautoMATER/funcLib/restAPI';
const selectedProject = Users.userSelectedAccount;
export class DashBoardGetter {

    async dashboardPageLoadData(selectedTestingType, envChange = false) {
        var daysCounterForDevepeonet = 0;
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 1000));
        }
        var allconfigData = {};
        var dashBoardData = {}
        if (!Config.isDemo) {
            allconfigData = await ConfigGetter.readConfigurationFile(await DashBoardData.SelectedTab);
            ConfigData.AllConfigData = await allconfigData;
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            try {
                await new Promise(wait => setTimeout(wait, 1000));
                daysCounterForDevepeonet = await Number(await allconfigData['DefaultSaveDaysToDevelopment']);
            }
            catch (error) {
                daysCounterForDevepeonet = 0;
            }
            var reportTrailCount = 0;
            try {
                reportTrailCount = await Number(await allconfigData['DefaultReportTrailCount']);
            }
            catch (error) {
                reportTrailCount = 0;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendAPI + 'dashboard/project/' + selectedProject + '/testingtype/' + DashBoardData.SelectedTab + '/daysdevcounter/' + await daysCounterForDevepeonet, await headers);
            dashBoardData = await serverResponse['data'];
        }
        //******************* COUNTER and Environment Configuration *********************************************************
        if (!envChange) {
            DashBoardData.ReportHistoryCounter = await this.getReportHistoryCounter(await selectedProject, await selectedTestingType);
            DashBoardData.DefaultSaveDaysToReport = await this.getDefaultSaveDaysToReportCounter(await ConfigData.AllConfigData);
            DashBoardData.DefaultSaveDaysToDevelopment = await this.getDefaultSaveDaysToDevelopment(await ConfigData.AllConfigData);
            await this.renderEnvironment(ConfigData.AllConfigData);
        }

        //****************** All Account Attribute (Basic) **************************************************************************

        DashBoardData.TotalTestScripts = await this.getTotalScripts(await dashBoardData);
        DashBoardData.TotalComponents = await this.getTotalComponent(await dashBoardData);
        await this.getModuleWiseScripts(dashBoardData);
        await this.getTestDevelopmentCountDayWise(DashBoardData.DefaultSaveDaysToDevelopment, await dashBoardData);

        //****************** Report Data ********************************************************************************************
        await this.setGraphDatabasedOnReportTrail(await reportTrailCount);
        await this.getTestExecutionCountDayWise(DashBoardData.DefaultSaveDaysToDevelopment);
        DashBoardData.PastDateList = await DataGeneratorUtility.getPastDateListinDesendingOrder(DashBoardData.DefaultSaveDaysToReport);

    }

    async getDetailedReport(projectName, environment, executionDate, executionTime) {
        if (Config.isDemo) {
            var dataTableData = [];
            var totalModules = await DataGeneratorUtility.getStringArray(10);
            var totalPassCount = 0;
            var totalFailCount = 0;
            for (let i = 0; i < totalModules.length; i++) {
                var rowData = { id: 0, component: '', passCount: 0, failCount: 0, executionTime: '00:00:00' }
                rowData.id = i + 1;
                rowData.component = await totalModules[i];
                rowData.passCount = await DataGeneratorUtility.getNumberFromRange(1, 100);
                totalPassCount = totalPassCount + rowData.passCount;
                rowData.failCount = await DataGeneratorUtility.getNumberFromRange(1, 50);
                totalFailCount = totalFailCount + rowData.failCount;
                rowData.executionTime = "00:" + await DataGeneratorUtility.getNumberFromRange(10, 50) + ":00";
                dataTableData.push(rowData);
            }
            var lastData = { id: 'SUMMARY', component: totalModules.length, passCount: totalPassCount, failCount: totalFailCount, executionTime: '02:10:20' }
            dataTableData.push(lastData);
            DashBoardData.TableDataforDetailedReports = dataTableData;
        }
        else {

        }
    }
    async renderEnvironment(allconfigData) {
        if (Config.isDemo) {
            DashBoardData.EnvironmentList = ['Dev', 'QA', 'Prod'];
            DashBoardData.SelectedEnvironment = 'Dev';
        }
        else {
            try {
                var allenvList = await allconfigData['Environment'];
                DashBoardData.EnvironmentList = await GetData.jsonArrayGetallKeyValue(await allenvList, 'name');
            }
            catch (error) {
                DashBoardData.EnvironmentList = [];
            }
            var defaultEnv = await allconfigData['DefaultSelectedEnvironment'];
            if (defaultEnv === undefined || defaultEnv.toString().trim() === '') {
                try {
                    if (DashBoardData.EnvironmentList.length > 0) {
                        DashBoardData.SelectedEnvironment = await DashBoardData.EnvironmentList[0];
                    }
                }
                catch (error) { }
            }
            else {
                DashBoardData.SelectedEnvironment = await defaultEnv;
            }
        }

    }

    async getReportHistoryCounter() {
        if (Config.isDemo) {
            return await DataGeneratorUtility.getNumberFromRange(20, 50);
        }
        else {
            try {
                return ConfigData.AllConfigData['DefaultReportTrailCount'];
            }
            catch (error) { }
        }

    }

    async getDefaultSaveDaysToReportCounter(configData) {
        if (Config.isDemo) {
            return await DataGeneratorUtility.getNumberFromRange(20, 40);
        }
        else {
            try {
                return await configData['DefaultSaveDaysToReport'];
            }
            catch (error) { }
        }

    }

    async getDefaultSaveDaysToDevelopment(configData) {
        if (Config.isDemo) {
            return await DataGeneratorUtility.getNumberFromRange(20, 40);
        }
        else {
            try {
                return await configData['DefaultSaveDaysToDevelopment'];
            }
            catch (error) { }
        }
    }

    async getTotalScripts(dashboardData) {
        if (Config.isDemo) {
            return await DataGeneratorUtility.getNumberFromRange(200, 400);
        }
        else {
            try {
                return await dashboardData['TotalTestScripts'];
            }
            catch (error) { }
        }
    }

    async getTotalComponent(dashboardData) {
        if (Config.isDemo) {
            return await DataGeneratorUtility.getNumberFromRange(12, 20);
        }
        else {
            try {
                return await dashboardData['TotalComponents'];
            }
            catch (error) { }
        }
    }

    async getModuleWiseScripts(dashboardData) {
        var yaxisData = [];
        var dataValue = [];
        if (Config.isDemo) {
            DashBoardData.ModuleScriptCountXaxis = await DataGeneratorUtility.getStringArray(12);
            yaxisData = await DataGeneratorUtility.getNumberArray(12);
            dataValue = [];
            dataValue.push(yaxisData)
            DashBoardData.ModuleScriptCountYaxis = dataValue;
        }
        else {
            try {
                DashBoardData.ModuleScriptCountXaxis = await dashboardData['ModuleScriptCountXaxis']
                yaxisData = await dashboardData['ModuleScriptCountYaxis']
                dataValue = [];
                dataValue.push(yaxisData)
                DashBoardData.ModuleScriptCountYaxis = dataValue;
            }
            catch (error) { }

        }

    }

    async getTestDevelopmentCountDayWise(dayCounterForDevelopment, dashboardData) {
        var pastDate = [];
        var allPastDateItem = [];
        if (Config.isDemo) {
            var testScripts = [];
            testScripts.push(await DataGeneratorUtility.getNumberArray(dayCounterForDevelopment, 0, 20));
            DashBoardData.DayWiseTestScriptDevelopment = await testScripts;
            pastDate = await DataGetter.getPastDateList(Number(dayCounterForDevelopment));
            allPastDateItem = await pastDate['pastdatelist'];
            DashBoardData.ListOfPastDateforDaysToDevelopment = await allPastDateItem;
        }
        else {
            try {
                var testDevcountDayWise = await dashboardData['DayWiseTestScriptDevelopment'];
                pastDate = await DataGetter.getPastDateList(Number(dayCounterForDevelopment));
                allPastDateItem = await pastDate['pastdatelist'];
                DashBoardData.ListOfPastDateforDaysToDevelopment = await allPastDateItem;
                var dataValue = [];
                dataValue.push(testDevcountDayWise)
                DashBoardData.DayWiseTestScriptDevelopment = await dataValue;
            }
            catch (error) {
            }
        }
    }

    async getWebButtonColor() {
        if (DashBoardData.SelectedTab === 'Web') {
            return 'dark'
        }
        else {
            return 'white'
        }
    }

    async getApiButtonColor() {
        if (DashBoardData.SelectedTab === 'Api') {
            return 'dark'
        }
        else {
            return 'white'
        }
    }

    async SelectedExecutionDate() {
        if (Config.isDemo) {
            DashBoardData.ListOfExecutionTimeForaDay = ['10:00 AM', '06:00 PM']
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendAPI + 'dashboard/project/' + selectedProject + '/testingtype/' + DashBoardData.SelectedTab + '/env/' + DashBoardData.SelectedEnvironment + '/executiondate/' + DashBoardData.SelectedExecutionDate, await headers);
            DashBoardData.ListOfExecutionTimeForaDay = await serverResponse['data'];
        }
    }

    async getSelectedReportData() {
        var listOfPassFail = [];
        var executionTimeData = [];
        var componentPassFailData = [];
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            listOfPassFail = [];
            var passCount = await DataGeneratorUtility.getNumberFromRange(200, 223);
            listOfPassFail.push(passCount);
            var failCount = await DataGeneratorUtility.getNumberFromRange(1, 50);
            listOfPassFail.push(failCount);
            DashBoardData.SelectedReportTotalPassFailData = await listOfPassFail;
            var executionTimeLabel = []
            var xaxisData = await DataGeneratorUtility.getStringArray(12);
            executionTimeLabel.push(await xaxisData);
            DashBoardData.SelectedReportExecutionTimeGraphXaxis = await xaxisData;
            executionTimeData = []
            var yaxisData = await DataGeneratorUtility.getNumberArray(12);
            executionTimeData.push(await yaxisData);
            DashBoardData.SelectedReportExecutionTimeGraphYaxis = await executionTimeData;
            componentPassFailData = [];
            var passData = {}
            var failData = {}
            for (let i = 0; i < await xaxisData.length; i++) {
                passData[await [xaxisData[i]]] = await DataGeneratorUtility.getNumberFromRange(1, 10);
                failData[await [xaxisData[i]]] = await DataGeneratorUtility.getNumberFromRange(0, 9);
            }
            componentPassFailData.push(await passData);
            componentPassFailData.push(await failData);
            DashBoardData.SelectedReportComponentPassFailData = await componentPassFailData;
            var allTestScripts = [];
            var randomRowCount = await DataGeneratorUtility.getNumberFromRange(10, 20);
            for (let i = 0; i < randomRowCount; i++) {
                var rowData = { id: 0, component: await 'Spacecraft', testid: 0, testname: '', status: '' }
                rowData.id = i + 1;
                rowData.testid = "QA-" + await DataGeneratorUtility.getNumberFromRange(100, 500);
                rowData.testname = " This is test case No " + (i + 1);
                var randomNumber = await DataGeneratorUtility.getNumberFromRange(0, 1);
                if (randomNumber === 0) {
                    rowData.status = 'Pass'
                }
                else {
                    rowData.status = 'Fail'
                }
                allTestScripts.push(rowData);
            }
            DashBoardData.SelectedReportListOfTestScripts = await allTestScripts;
            for (let resultCounter = 0; resultCounter < await DashBoardData.SelectedReportListOfTestScripts.length; resultCounter++) {
                var executionStartDate = new Date();
                var mockResultsData = {};
                var AssertionData = [{ "id": 1, "expression": "ResponseCode", "function": "ShouldBe", "expected": 200, "actual": 200 }];
                if (await DashBoardData.SelectedReportListOfTestScripts[resultCounter]['status'] === 'Fail') {
                    AssertionData = [{ "id": 1, "expression": "ResponseCode", "function": "ShouldBe", "expected": 201, "actual": 200 }]
                }
                if (await DashBoardData.AssertionResultsForAllResults[resultCounter + 1] === undefined) {
                    DashBoardData.AssertionResultsForAllResults[resultCounter + 1] = [];
                }
                mockResultsData['ResponseCode'] = 200;
                mockResultsData['ResponseHeader'] = { headkerKey: 'Hope you are enjoing QAautoMater' };
                mockResultsData['ResponseBody'] = { message: 'I m just hradcoded data , on real data you will get whatever you sent and whatever you get from the server' };
                DashBoardData.AssertionResultsForAllResults[resultCounter + 1] = AssertionData;
                var executionendDate = new Date();
                var executionTimeInseconds = (executionendDate.getTime() - executionStartDate.getTime()) / 1000;
                mockResultsData['Execution Time'] = await executionTimeInseconds + ' Seconds';
                if (await DashBoardData.ResponseDataForAllResults[resultCounter + 1] === undefined) {
                    DashBoardData.ResponseDataForAllResults[resultCounter + 1] = {};
                }
                DashBoardData.ResponseDataForAllResults[resultCounter + 1] = await mockResultsData;
            }
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendAPI + 'dashboard/project/' + selectedProject + '/testingtype/' + DashBoardData.SelectedTab + '/env/' + DashBoardData.SelectedEnvironment + '/executiondate/' + DashBoardData.SelectedExecutionDate + '/executiontime/' + DashBoardData.SelectedExecutionTime, await headers);
            var executionData = await serverResponse['data'];
            if (Object.keys(executionData).length > 0) {
                //Total Pass Fail
                try {
                    var testingTechniques = await executionData['testingType'];
                    DashBoardData.TestingMethod = await testingTechniques;
                    listOfPassFail = [];
                    listOfPassFail.push(await executionData['totalPass']);
                    listOfPassFail.push(await executionData['totalFail']);
                    DashBoardData.SelectedReportTotalPassFailData = await listOfPassFail;
                    DashBoardData.SelectedReportListOfTestScripts = await executionData['listOfExecutedTestScripts'];
                    DashBoardData.AssertionResultsForAllResults = await executionData['assertionResultsForAllTestScripts'];
                    if (DashBoardData.SelectedTab === 'Api') {
                        DashBoardData.ResponseDataForAllResults = await executionData['testResultsDataForAllTestScripts'];
                    }
                    executionTimeData = await executionData['executionTimeData'];
                    var executionTimeDataxandyAxis = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await executionTimeData);
                    var yaxisDataForExecutionTime = [];
                    yaxisDataForExecutionTime.push(await executionTimeDataxandyAxis['value']);
                    DashBoardData.SelectedReportExecutionTimeGraphXaxis = await executionTimeDataxandyAxis['key'];
                    DashBoardData.SelectedReportExecutionTimeGraphYaxis = await yaxisDataForExecutionTime;
                    componentPassFailData = await executionData['componentPassFail'];
                    var allPassDataForComponent = [];
                    var componentPassDataxandyAxis = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await componentPassFailData[0]);
                    allPassDataForComponent.push(await componentPassDataxandyAxis['value'])
                    var componentFailDataxandyAxis = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await componentPassFailData[1]);
                    allPassDataForComponent.push(await componentFailDataxandyAxis['value']);
                    DashBoardData.SelectedReportComponentPassFailData = await allPassDataForComponent;
                    if (DashBoardData.SelectedTab === 'Web') {
                        DashBoardData.ExecutionTimeForUITestScripts = await executionData['executionTimeForTestScripts'];
                        DashBoardData.ExistingReportExecutionPlatform = await executionData['screen'];
                        DashBoardData.ExistingReportExecutionDevice = await executionData['devicebrowser'];
                    }
                    DashBoardData.ExistingReportTestExecutionTime = await executionData['totalExecutionTime'] + ' Seconds';
                    var triggerFrom = await executionData['triggerFrom'];
                    if (await triggerFrom === undefined) {
                        triggerFrom = 'QAautoMATER UI'
                    }
                    DashBoardData.ExistingReportExecutionStartFrom = await triggerFrom;
                }
                catch (error) { }
            }
        }
    }

    async setGraphDatabasedOnReportTrail(reportTrailCount = 10, executionCounter = 10) {
        var listOfPassFail = [];
        if (Config.isDemo) {
            reportTrailCount = 10;
            DashBoardData.TotalTestScriptsOnLastExecution = await DataGeneratorUtility.getNumberFromRange(150, 200);
            DashBoardData.PassPercentageInLastExecution = await DataGeneratorUtility.getNumberFromRange(50, 100);
            listOfPassFail = [];
            var passCount = await DataGeneratorUtility.getNumberFromRange(1000, 2000);
            listOfPassFail.push(passCount);
            var failCount = await DataGeneratorUtility.getNumberFromRange(100, 3000);
            listOfPassFail.push(failCount);
            DashBoardData.TotalPassFailInLastXResults = await listOfPassFail;
            DashBoardData.ExecutionXaxisInLastXResults = await DataGeneratorUtility.getListOfDateDate(reportTrailCount);
            var yaxisData = [];
            var passData = await DataGeneratorUtility.getNumberArray(reportTrailCount, 200, 500)
            yaxisData.push(passData);
            var failData = await DataGeneratorUtility.getNumberArray(reportTrailCount, 1, 50);
            yaxisData.push(failData);
            DashBoardData.ExecutionYaxisInLastXResults = yaxisData;
            DashBoardData.ExecutionTimeXaxisInLastXResults = await DataGeneratorUtility.getListOfDateDate(reportTrailCount);
            yaxisData = [];
            var randomNumber = await DataGeneratorUtility.getNumberArray(reportTrailCount, 10, 60);
            yaxisData.push(randomNumber)
            DashBoardData.ExecutionTimeYaxisInLastXResults = yaxisData;
            var failedData = [];
            randomNumber = await DataGeneratorUtility.getNumberArray(reportTrailCount, 0, 5);
            failedData.push(randomNumber);
            DashBoardData.FailedComponentInLastXResults = failedData;
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.get(backendAPI + 'dashboard/project/' + selectedProject + '/testingtype/' + DashBoardData.SelectedTab + '/env/' + await DashBoardData.SelectedEnvironment + '/reportcounter/' + await Number(reportTrailCount), await headers);
                var reportData = await serverResponse['data'];
                if (Object.keys(await reportData).length > 0) {
                    DashBoardData.TotalTestScriptsOnLastExecution = await reportData['lastResultTotalExecutedScript'];
                    DashBoardData.PassPercentageInLastExecution = await reportData['lastResultPassPercenatage'];
                    listOfPassFail = [];
                    listOfPassFail.push(await reportData['totalPassInXCounter']);
                    listOfPassFail.push(await reportData['totalFailInXCounter']);
                    DashBoardData.TotalPassFailInLastXResults = await listOfPassFail;
                    DashBoardData.ExecutionXaxisInLastXResults = await reportData['executionHistoryXaxis'];
                    DashBoardData.ExecutionYaxisInLastXResults = await reportData['executionHistoryPassFailData'];
                    DashBoardData.ExecutionTimeXaxisInLastXResults = await reportData['executionHistoryXaxis'];
                    DashBoardData.ExecutionTimeYaxisInLastXResults = await reportData['allExecutionTimeData'];
                    var componentFaildData = [];
                    var allComponentFailedData = await reportData['allComponnetFailureData'];
                    var failureData = await this.getTotalFailComponentCount(await allComponentFailedData);
                    var allModuleFailedWithUpdatedValue = await this.updateModuleFailComponent(await failureData);
                    var allXaxis = await DashBoardData.ModuleScriptCountXaxis;
                    DashBoardData.FailedComponentInLastXResults =[];
                    for (let p = 0; p < await allXaxis.length; p++) {
                        var comName = await allXaxis[p];
                        try {
                            var dataToPush = allModuleFailedWithUpdatedValue[await comName];
                            if (await dataToPush === undefined) {
                                dataToPush = 0;
                            }
                        }
                        catch (error) {
                            dataToPush = 0;
                        }
                        componentFaildData.push(await dataToPush);
                    }
                    DashBoardData.FailedComponentInLastXResults.push(await componentFaildData);
                }
            }
            catch (error) { }
        }
    }

    async getTestExecutionCountDayWise(dayCounterForExecution) {
        if (Config.isDemo) {
            var testexecution = [];
            testexecution.push(await DataGeneratorUtility.getNumberArray(dayCounterForExecution, 0, 5));
            DashBoardData.DayWiseTestExecutionData = await testexecution;
        }
        else {
            try {
                var backendAPI = await Config.backendAPI;
                if (Config.backendServiceAt === 'remote') {
                    backendAPI = await Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.get(backendAPI + 'dashboard/project/' + selectedProject + '/testingtype/' + DashBoardData.SelectedTab + '/env/' + DashBoardData.SelectedEnvironment + '/executioncounter/' + await Number(dayCounterForExecution), await headers);
                var executionData = await serverResponse['data'];
                if (await Object.keys(executionData).length > 0) {
                    var executionDataXandYaxis = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await executionData);
                    var executionCounter = [];
                    executionCounter.push(await executionDataXandYaxis['value']);
                    DashBoardData.DayWiseTestExecutionData = await executionCounter;
                }

            }
            catch (error) {
            }
        }
    }

    async updateModuleFailComponent(failureData) {
        var moduleComponentFailedData = {}
        var allModuleOnServer = DashBoardData.ModuleScriptCountXaxis;
        for (let i = 0; i < allModuleOnServer.length; i++) {
            var value = await failureData[await allModuleOnServer[i]];
            if (value === undefined) {
                moduleComponentFailedData[await allModuleOnServer[i]] = 0;
            }
            else {
                moduleComponentFailedData[await allModuleOnServer[i]] = value;
            }

        }
        return moduleComponentFailedData;
    }

    async getTotalFailComponentCount(allFailedComponentList) {
        var allFailedComponent = {};
        for (let i = 0; i < await allFailedComponentList.length; i++) {
            var allComponentData = await allFailedComponentList[i];
            var failcomponentData = await Object.keys(await allComponentData);
            if (await failcomponentData.length > 0) {
                for (let j = 0; j < await failcomponentData.length; j++) {
                    var componnetName = await failcomponentData[j];
                    var componneFailCount = await allComponentData[await componnetName];
                    if (Number(await componneFailCount) > 0) {
                        if (await allFailedComponent[await componnetName] === undefined) {
                            allFailedComponent[await componnetName] = 0;
                        }
                        allFailedComponent[await componnetName] = Number(await allFailedComponent[await componnetName]) + 1;
                    }
                    // else{
                    //     allFailedComponent[await componnetName] =0;
                    // }
                }
            }
        }
        return await allFailedComponent;
    }

}
export default new DashBoardGetter();

