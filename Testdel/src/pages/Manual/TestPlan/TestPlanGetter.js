import { TestPlanData } from './TestPlanData';
import { Config, Users } from '../../../QAautoMATER/Config';
import ConfigGetter from '../Configuration/ConfigGetter';
import { ConfigData } from '../Configuration/ConfigData';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;


export class TestPlanGetter {

    async loadTestPlanPage() {

        await ConfigGetter.manualConfigPageLoad();
        TestPlanData.ListOfTestCycle = await ConfigData.ListOfTestCycle;
        TestPlanData.SelectedTestCycle = await ConfigData.CurrentTestCycle;
        TestPlanData.ListOfTestPlan = await this.getAllTestPlanFromTestCycle(TestPlanData.SelectedTestCycle);
        await this.getAllPlaceHolderName();
    }

    async getListOfUser() {
        TestPlanData.ListOfUsers = [];
        var firstRow = { label: '', value: '' };
        TestPlanData.ListOfUsers.push(await firstRow);
        var allUsers = await ConfigGetter.getListOfUsers();
        for (let i = 0; i < await allUsers.length; i++) {
            var datatoPush = { label: await allUsers[i], value: await allUsers[i] };
            TestPlanData.ListOfUsers.push(await datatoPush);
        }
    }

    async getAllTestPlanFromTestCycle(testCycle) {
        if (Config.isDemo) {
            return;
        }
        else {
            try {
                var testBody = {}
                testBody['testCycle'] = await testCycle;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(await backendApi + 'testplan/project/' + selectedProject + '/gettestplanname', await headers, await testBody);
                var allTestPlan = await serverResponse['data'];
                return await allTestPlan;
            }
            catch (error) {
                return [];
            }
        }
    }

    async getAllPlaceHolderName() {
        if (Config.isDemo) {
            return;
        }
        else {
            try {
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.get(await backendApi + 'testplan/project/' + selectedProject + '/getallplaceholder', await headers);
                var allPlaceHolder = await serverResponse['data'];
                if (await allPlaceHolder.length > 0) {
                    TestPlanData.ListOfPlaceHolder = [];
                    TestPlanData.SelectedPlaceHolder = '';
                    TestPlanData.ListOfPlaceHolder.push('All');
                    TestPlanData.SelectedPlaceHolder = 'All';
                    TestPlanData.ListOfPlaceHolder = await TestPlanData.ListOfPlaceHolder.concat(await allPlaceHolder);
                }
                else {
                    TestPlanData.ListOfPlaceHolder = [];
                    TestPlanData.SelectedPlaceHolder = '';
                }

            }
            catch (error) {
                return [];
            }
        }
    }

    async getTestPlanDetail(testCycle, testPlanName) {
        if (Config.isDemo) {
            return;
        }
        else {
            try {
                var testBody = {}
                testBody['testCycle'] = await testCycle;
                testBody['testPlanName'] = await testPlanName;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(await backendApi + 'testplan/project/' + selectedProject, await headers, await testBody);
                var alltestDetails = await serverResponse['data'];
                if (await Object.keys(await alltestDetails).length === 0) {
                    TestPlanData.SelectedTestingType = 'Functional';
                    TestPlanData.SelectedScreen = 'Desktop';
                    TestPlanData.Browser = '';
                    TestPlanData.OS = ''
                    TestPlanData.ReleaseVersion = ''
                    TestPlanData.ListOfTestCases = [];
                    TestPlanData.ListOfRemarksDataForTestCase = {};
                    TestPlanData.ExecutionSummaryData = [];
                    TestPlanData.ExecutedComponentXaxis = [];
                    TestPlanData.ExecutedComponentYaxis = [];
                }
                else {
                    TestPlanData.SelectedTestingType = await alltestDetails['testingType'];
                    TestPlanData.SelectedScreen = await alltestDetails['screen'];
                    TestPlanData.Browser = await alltestDetails['browser'];
                    TestPlanData.OS = await alltestDetails['oS'];
                    TestPlanData.ReleaseVersion = await alltestDetails['releaseVersion'];
                    TestPlanData.ListOfTestCases = await alltestDetails['testExecutionDetails'];
                    TestPlanData.ListOfRemarksDataForTestCase = await alltestDetails['testExecutionEvidence'];
                    await this.generateGraphData();
                }

                return await alltestDetails;
            }
            catch (error) {
                return [];
            }
        }
    }

    async loadAllTestCaseFromComponent(placeholderName) {
        if (Config.isDemo) {
            return;
        }
        else {
            try {
                TestPlanData.ListOfUsers = [];
                await this.getListOfUser();
                TestPlanData.ListOfTestCases = [];
                var testBody = {}
                testBody['placeHolderName'] = await placeholderName;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(await backendApi + 'testplan/project/' + selectedProject + '/getalltestcase', await headers, await testBody);
                var alltestDetails = await serverResponse['data'];
                TestPlanData.ListOfTestCases = await alltestDetails;
                return await alltestDetails;
            }
            catch (error) {
                return [];
            }
        }
    }

    async saveTestPlan(testPlanName) {
        if (Config.isDemo) {
            return true;
        }
        else {
            try {
                var testBody = {}
                var isNewPlan = await TestPlanData.IsUserSelectedNewTestPlan;
                testBody['testPlanName'] = await testPlanName;
                testBody['testingType'] = await TestPlanData.SelectedTestingType;
                testBody['screen'] = await TestPlanData.SelectedScreen;
                testBody['browser'] = await TestPlanData.Browser;
                testBody['oS'] = await TestPlanData.OS;
                testBody['releaseVersion'] = await TestPlanData.ReleaseVersion;
                testBody['testCycle'] = await TestPlanData.SelectedTestCycle;
                if (await isNewPlan) {
                    testBody['testExecutionDetails'] = await this.getselectedTestCase(await TestPlanData.SelectedTestCase);
                }
                else {
                    testBody['testExecutionDetails'] = await TestPlanData.UpdatedTestRowData;
                }
                testBody['deleteTestCase'] = await TestPlanData.DeletedTestID;
                testBody['testExecutionEvidence'] = await TestPlanData.UpdatedRemarksData;
                testBody['createdBy'] = await Users.userEmail;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(await backendApi + 'testplan/project/' + await selectedProject + '/savetestplan/newtestplan/' + await isNewPlan, await headers, await testBody);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileSaved'];
            }
            catch (error) {
                return [];
            }
        }
    }

    async getselectedTestCase(selectedTestId) {
        var output = [];
        var allTestCaseList = TestPlanData.ListOfTestCases;
        for (let i = 0; i < await selectedTestId.length; i++) {
            var selectedIndex = Number(await selectedTestId[Number(i)]) - 1;
            var selectedTestInfo = { id: Number(i) + 1, component: await allTestCaseList[await selectedIndex]['component'], testid: await allTestCaseList[await selectedIndex]['testid'], testname: await allTestCaseList[await selectedIndex]['testname'], assignto: await allTestCaseList[await selectedIndex]['assignto'], status: await allTestCaseList[await selectedIndex]['status'] }
            output.push(await selectedTestInfo);
        }
        return await output;
    }

    async generateGraphData() {
        var totalPass = 0;
        var totalFail = 0;
        var totalPending = 0;
        var xComponent = [];
        var yComponent = [];
        var componentData = {};
        var allTestCase = await TestPlanData.ListOfTestCases;
        for (let i = 0; i < await allTestCase.length; i++) {
            var component = await allTestCase[i]['component'];
            if (!await xComponent.includes(await component)) {
                xComponent.push(await component);
                componentData[await component] = {}
                componentData[await component]['pass'] = 0;
                componentData[await component]['fail'] = 0;
                componentData[await component]['pending'] = 0;
            }
            var status = await allTestCase[i]['status'];
            switch (await status) {
                case "Pending":
                    totalPending = await Number(await totalPending) + 1;
                    componentData[await component]['pending'] = await Number(componentData[await component]['pending']) + 1;
                    break;
                case "Pass":
                    totalPass = await Number(await totalPass) + 1;
                    componentData[await component]['pass'] = await Number(componentData[await component]['pass']) + 1;
                    break;
                case "Fail":
                    totalFail = await Number(await totalFail) + 1
                    componentData[await component]['fail'] = await Number(componentData[await component]['fail']) + 1;
                    break;
                default:
                    break;
            }
        }
        TestPlanData.ExecutionSummaryData.push(await totalPass)
        TestPlanData.ExecutionSummaryData.push(await totalFail)
        TestPlanData.ExecutionSummaryData.push(await totalPending)
        TestPlanData.ExecutedComponentXaxis = await xComponent;
        var allPassForComponent = []
        var allFailForComponent = []
        var allpendingForComponent = []
        for (let i = 0; i < await xComponent.length; i++) {
            var compName = await xComponent[i];
            allPassForComponent.push(await componentData[await compName]['pass']);
            allFailForComponent.push(await componentData[await compName]['fail']);
            allpendingForComponent.push(await componentData[await compName]['pending']);
        }
        yComponent.push(await allPassForComponent);
        yComponent.push(await allFailForComponent);
        yComponent.push(await allpendingForComponent);
        TestPlanData.ExecutedComponentYaxis = await yComponent;
    }

    async deleteTestPlan(testPlanName) {
        if (Config.isDemo) {
            return true;
        }
        else {
            try {
                var testBody = {}
                testBody['testPlanName'] = await testPlanName;
                testBody['testCycle'] = await TestPlanData.SelectedTestCycle;
                var backendApi = Config.backendAPI;
                var backendServiceLocation = await Config.backendServiceAt;
                if (backendServiceLocation === 'remote') {
                    backendApi = Config.remoteBackendAPI;
                }
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.post(await backendApi + 'testplan/project/' + await selectedProject + '/deletetestplan', await headers, await testBody);
                var saveFile = await serverResponse['data'];
                Config.ErrorMessage = await saveFile['errorMessage'];
                return await saveFile['isFileDeleted'];
            }
            catch (error) {
                return [];
            }
        }
    }
}
export default new TestPlanGetter();

