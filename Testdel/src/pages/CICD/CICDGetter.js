import { CICDData } from './CICDData';
import { Config, Users } from '../../QAautoMATER/Config';
import ConfigGetter from '../Api/Configuration/ConfigGetter';
import GetData from '../../QAautoMATER/funcLib/getData';
import DataGeneratorUtility from '../../QAautoMATER/funcLib/DataGeneratorUtility';
import restAPI from '../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;

export class CICDGetter {

    async loadCICDPage() {
        await this.initializeCICDPage();
        await this.getTestSuiteFile(CICDData.SelectedTab);
    }

    async initializeCICDPage() {
        var allconfigData = null;
        if (!Config.isDemo) {
            allconfigData = await ConfigGetter.readConfigurationFile(CICDData.SelectedTab);
            CICDData.AllConfigData = await allconfigData;
        }
        await this.renderEnvironment(await allconfigData);
        await this.renderAllComponent();
    }
    async getWebButtonColor() {
        if (CICDData.SelectedTab === 'Web') {
            return 'dark'
        }
        else {
            return 'white'
        }
    }

    async getApiButtonColor() {
        if (CICDData.SelectedTab === 'Api') {
            return 'dark'
        }
        else {
            return 'white'
        }
    }

    async renderEnvironment(allconfigData) {
        if (Config.isDemo) {
            CICDData.EnvironmentList = ['Dev', 'QA', 'STG'];
            CICDData.SelectedEnv = 'Dev';
        }
        else {
            var allEnvList = await GetData.jsonArrayGetallKeyValue(await allconfigData['Environment'], 'name');
            if (await allEnvList === undefined) {
                CICDData.EnvironmentList = [];
                CICDData.SelectedEnv = '';
            }
            else {
                CICDData.EnvironmentList = await allEnvList;
                if (await allconfigData['DefaultSelectedEnvironment'] === undefined) {
                    if (CICDData.EnvironmentList.length > 0) {
                        CICDData.SelectedEnv = await CICDData.EnvironmentList[0];
                    }
                }
                else {
                    CICDData.SelectedEnv = await allconfigData['DefaultSelectedEnvironment'];
                }

            }
        }
    }

    async renderAllComponent() {
        if (Config.isDemo) {
            CICDData.ComponentList = ["All", "LandingPage", "SignIn", "ProductList", "ShoppingCart", "BookingSummary"];
            CICDData.SelectedComponent = "All";
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendAPI + 'components/project/' + selectedProject + '/testingtype/' + CICDData.SelectedTab, await headers);
            var allComponent = await serverResponse['data'];
            if (allComponent.length > 0) {
                CICDData.ComponentList = ["All"].concat(allComponent);
                CICDData.SelectedComponent = "All";
            }
        }
    }

    async getAllTestScriptsfromComponent(componentName) {
        if (componentName === 'All') {
            CICDData.ListOfTestScripts = await this.createTestSuiteForAllComponent(CICDData.ComponentList);
        }
        else {
            CICDData.ListOfTestScripts = await this.createTestSuiteForSpecificComponent(componentName);
        }
    }

    async createTestSuiteForSpecificComponent(componentName, rowId = 1) {
        var allTestScripts = [];
        if (Config.isDemo) {
            var randomRowCount = await DataGeneratorUtility.getNumberFromRange(10, 20);
            for (let i = 0; i < randomRowCount; i++) {
                var rowData = { id: 0, component: await componentName, testid: 0, testname: '', status: '' }
                rowData.id = rowId;
                rowData.testid = "QA-" + await DataGeneratorUtility.getNumberFromRange(100, 500);
                rowData.testname = " This is test case No " + (i + 1);
                rowData.status = ''
                allTestScripts.push(rowData);
                rowId = rowId + 1;
            }
        }
        else {
            var allComponentTestDetails = await GetData.getListOfTestIdAndTestName(selectedProject, CICDData.SelectedTab, componentName);
            for (let i = 0; i < allComponentTestDetails.length; i++) {
                var rowData = { id: rowId, component: await componentName, testid: await allComponentTestDetails[i]['testid'], testname: await allComponentTestDetails[i]['testname'], status: '' }
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

    async setDeviceListData(selectedScreen) {
        if (Config.isDemo) {
            switch (selectedScreen) {
                case "Desktop":
                    CICDData.DeviceList = ['Chrome', 'Firefox', 'Edge', 'Safari'];
                    CICDData.SelectedDevice = 'Chrome';
                    break;
                case "Mobile":
                    CICDData.DeviceList = ['iPhone 12 Pro', 'Pixel 5'];
                    CICDData.SelectedDevice = 'iPhone 12 Pro';
                    break;
                case "Tablet":
                    CICDData.DeviceList = ['iPad Air', 'iPad Mini'];
                    CICDData.SelectedDevice = 'iPad Air';
                    break;
            }
        }
        else {
            if (selectedScreen === 'Desktop') {
                CICDData.DeviceList = ['Chrome', 'Firefox', 'Edge', 'Safari'];
                CICDData.SelectedDevice = 'Chrome';
            }
            else {
                var emulatorData = await CICDData.AllConfigData['Emulator'];
                if (await emulatorData === undefined) {
                    CICDData.DeviceList = [];
                    CICDData.SelectedDevice = '';
                }
                else {
                    var allMobileDevice = [];
                    var allTabletDevice = [];
                    for (let i = 0; i < await emulatorData.length; i++) {
                        var deviceType = await emulatorData[i]['device'];
                        switch (deviceType.toString()) {
                            case "Mobile":
                                allMobileDevice.push(await emulatorData[i]['name']);
                                break;
                            case "Tablet":
                                allTabletDevice.push(await emulatorData[i]['name']);
                                break;
                            default:
                                break;
                        }
                    }
                    switch (selectedScreen) {
                        case "Mobile":
                            CICDData.DeviceList = await allMobileDevice;
                            break;
                        case "Tablet":
                            CICDData.DeviceList = await allTabletDevice;
                            break;
                    }
                    if (CICDData.DeviceList.length > 0) {
                        CICDData.SelectedDevice = await CICDData.DeviceList[0];
                    }


                }
            }
        }
    }

    async getTestSuiteFile(testingType) {
        if (Config.isDemo) {
            CICDData.AllTestSuite = ['Regression', 'Smoke', 'Sanity'];
        }
        else {
            var backendAPI = await Config.backendAPI;
            if (Config.backendServiceAt === 'remote') {
                backendAPI = await Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.get(backendAPI + 'cicd/project/' + selectedProject + '/testingtype/' + testingType, await headers);
            var allSuite = await serverResponse['data'];
            if (allSuite !== undefined && allSuite.length > 0) {
                CICDData.AllTestSuite = await allSuite;
            }
            else {
                CICDData.AllTestSuite = [];
            }
        }

    }

    async saveTestSuite() {
        if (Config.isDemo) {
            await new Promise(wait => setTimeout(wait, 2000));
            return true;
        }
        else {

            var testSuiteData = {};
            testSuiteData["fileName"] = CICDData.SelectedTestSuite;
            testSuiteData["environment"] = CICDData.SelectedEnv;
            testSuiteData["testingtype"] = CICDData.TestingType;
            testSuiteData["threadcount"] = CICDData.ThreadCount;
            if (CICDData.SelectedTab === 'Web') {
                testSuiteData["runat"] = CICDData.SelectedRunAtOption;
                testSuiteData["screen"] = CICDData.SelectedScreenOption;
                testSuiteData["device"] = CICDData.SelectedDevice;
            }
            var testList = [];
            for (let i = 0; i < CICDData.SelectedTestScripts.length; i++) {
                testList.push(CICDData.ListOfTestScripts[CICDData.SelectedTestScripts[i] - 1]);
            }
            testSuiteData["testsuite"] = await testList;
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
            var serverResponse = await restAPI.post(backendApi + 'cicd/project/' + selectedProject + '/testingtype/' + CICDData.SelectedTab, await headers, await testSuiteData);
            var saveFile = await serverResponse['data'];
            Config.ErrorMessage = await saveFile['errorMessage'];
            return await saveFile['isFileSaved'];
        }
    }

    async getTestSuiteData(testSuiteName) {
        if (Config.isDemo) {

        }
        else {
            var backendApi = Config.backendAPI;
            var backendServiceLocation = await Config.backendServiceAt;
            if (backendServiceLocation === 'remote') {
                backendApi = Config.remoteBackendAPI;
            }
            try {
                var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
                var serverResponse = await restAPI.get(backendApi + 'cicd/project/' + selectedProject + '/testingtype/' + CICDData.SelectedTab + '/testsuite/' + testSuiteName, await headers);
                var testSuiteData = await serverResponse['data'];
                if (Object.keys(testSuiteData).length > 0) {
                    CICDData.SelectedEnv = await testSuiteData['environment'];
                    CICDData.TestingType = await testSuiteData['testingtype'];
                    CICDData.ThreadCount = await testSuiteData['threadcount'];
                    if (CICDData.SelectedTab === 'Web') {
                        CICDData.SelectedScreenOption = await testSuiteData['screen'];
                        CICDData.SelectedDevice = await testSuiteData['device'];
                    }
                    CICDData.ListOfTestScripts = await testSuiteData['testsuite'];
                }
            }
            catch (error) { }
        }

    }
}
export default new CICDGetter;

