import { DashboardData } from './DashboardData';
import { Config, Users } from '../../../QAautoMATER/Config';
import ConfigGetter from '../Configuration/ConfigGetter';
import { ConfigData } from '../Configuration/ConfigData';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
import  GetData  from '../../../QAautoMATER/funcLib/getData';
const selectedProject = Config.SelectedProject;

export class DashboardGetter {

    async loadDashboardPage() {

        await ConfigGetter.manualConfigPageLoad();
        DashboardData.ListOfTestCycle = await ConfigData.ListOfTestCycle;
        DashboardData.SelectedTestCycle = await ConfigData.CurrentTestCycle;
        var dashboardData= await this.getDashBoardData(DashboardData.SelectedTestCycle);
    }

    async getDashBoardData(testCycleName)
    {
        if(await Config.isDemo)
        {

        }
        else{
            if(await testCycleName === '' || await testCycleName === undefined)
            {
                return;
            }
            try {
                var testBody = {}
                testBody['testCycle'] = await testCycleName;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(await backendApi + 'manualdashboard/project/' + await selectedProject + '/getdashboarddata', await headers, await testBody);
                var allDashBoardData = await serverResponse['data'];
                DashboardData.TotalTestCase = await allDashBoardData['totaltestcase'];
                DashboardData.TotalDefects = await allDashBoardData['totaldefect'];
                DashboardData.TotalTestPlan = await allDashBoardData['totaltestplan'];
                DashboardData.TotalTestCaseOnLastExecution = await allDashBoardData['totaltestcaseonlastexecution'];
                DashboardData.PassPercentageInLastExecution = await allDashBoardData['passpercentageinlastexecution'];
                DashboardData.AutomatedandNotAutomatedData = await allDashBoardData['automatedgraphdata'];
                var testPriorityData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['testprioritydata']);
                DashboardData.TestPriorityDataXaxis = await testPriorityData['key']
                DashboardData.TestPriorityDataYaxis = await testPriorityData['value']
                var componentTestCaseData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['componenttestcasedata']);
                DashboardData.ComponentTestCaseCountXaxisData =[];
                DashboardData.ComponentTestCaseCountYaxisData =[]
                DashboardData.ComponentTestCaseCountXaxisData= await componentTestCaseData['key'];
                DashboardData.ComponentTestCaseCountYaxisData.push(await componentTestCaseData['value']);
                var defectPriorityData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['defectprioritydata']);
                DashboardData.DefectPriorityDataXaxis = await defectPriorityData['key']
                DashboardData.DefectPriorityDataYaxis = await defectPriorityData['value']
                var defectComponentTestData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['defectComponentData']);
                DashboardData.DefectComponentDataXaxis =[];
                DashboardData.DefectComponentDataYAxis =[];
                DashboardData.DefectComponentDataXaxis= await defectComponentTestData['key'];
                DashboardData.DefectComponentDataYAxis.push(await defectComponentTestData['value']);
                var defectStatusData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['defectStatusData']);
                DashboardData.DefectStatusDataXaxis = await defectStatusData['key']
                DashboardData.DefectStatusDataYaxis = await defectStatusData['value']
                var testPlanTotalData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['testPlanTotalTestData']);
                DashboardData.TestPlanTotalDataXaxis = await testPlanTotalData['key']
                DashboardData.TestPlanTotalDataYaxis = await testPlanTotalData['value']
                DashboardData.TestPlanExecutedComponentXaxis = await allDashBoardData['testPlanComponentPassFailXaxis']
                DashboardData.TestPlanExecutedComponentYaxis = await allDashBoardData['testPlanComponentPassFailYaxis'];
                DashboardData.TestPlanTestSuiteXaxis = await allDashBoardData['testPlanPassFailXaxis']
                DashboardData.TestPlanTestSuiteYaxis = await allDashBoardData['testPlanPassFailYaxis'];
                var testcaseCreatedByData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['testCaseCreationByUser']);
                DashboardData.TestCaseCreatedByXaxis =[];
                DashboardData.TestCaseCreatedByYaxis =[]
                DashboardData.TestCaseCreatedByXaxis = await testcaseCreatedByData['key']
                DashboardData.TestCaseCreatedByYaxis.push(await testcaseCreatedByData['value']);
                var defectCreatedByData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['defectCreationByUser']);
                DashboardData.DefectCreatedByXaxis =[];
                DashboardData.DefectCreatedByYaxis =[]
                DashboardData.DefectCreatedByXaxis = await defectCreatedByData['key']
                DashboardData.DefectCreatedByYaxis.push(await defectCreatedByData['value']);
                var testExecutedByData  = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await allDashBoardData['testCaseExecutedByUser']);
                DashboardData.TestCaseExecutedByXaxis =[];
                DashboardData.TestCaseExecutedByYaxis =[]
                DashboardData.TestCaseExecutedByXaxis = await testExecutedByData['key']
                DashboardData.TestCaseExecutedByYaxis.push(await testExecutedByData['value']);
                return await allDashBoardData;
            }
            catch (error) {
                DashboardData.TotalTestCase = 0;
                DashboardData.TotalDefects = 0;
                DashboardData.TotalTestPlan = 0;
                DashboardData.TotalTestCaseOnLastExecution = 0;
                DashboardData.PassPercentageInLastExecution = 0;
                DashboardData.AutomatedandNotAutomatedData =[]
                DashboardData.TestPriorityDataXaxis =[];
                DashboardData.TestPriorityDataYaxis =[];
                DashboardData.ComponentTestCaseCountXaxisData = []
                DashboardData.ComponentTestCaseCountYaxisData = []
                DashboardData.DefectPriorityDataXaxis = []
                DashboardData.DefectPriorityDataYaxis = []
                DashboardData.DefectComponentDataXaxis =[];
                DashboardData.DefectComponentDataYAxis =[];
                DashboardData.DefectStatusDataXaxis = []
                DashboardData.DefectStatusDataYaxis = []
                DashboardData.TestPlanTotalDataXaxis = []
                DashboardData.TestPlanTotalDataYaxis = []
                DashboardData.TestPlanExecutedComponentXaxis = []
                DashboardData.TestPlanExecutedComponentYaxis = []
                DashboardData.TestPlanTestSuiteXaxis = []
                DashboardData.TestPlanTestSuiteYaxis = []
                DashboardData.TestCaseCreatedByXaxis = []
                DashboardData.TestCaseCreatedByYaxis = []
                DashboardData.DefectCreatedByXaxis =[];
                DashboardData.DefectCreatedByYaxis =[];
                DashboardData.TestCaseExecutedByXaxis =[];
                DashboardData.TestCaseExecutedByYaxis =[]
            }
        }
    }

}
export default new DashboardGetter();

