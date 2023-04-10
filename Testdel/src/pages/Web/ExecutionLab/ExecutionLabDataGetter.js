import { ExecutionLabData } from './ExecutionLabData';
import { Config, Users } from '../../../QAautoMATER/Config';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import ConfigGetter from '../../Api/Configuration/ConfigGetter';
import { ConfigData } from '../../Api/Configuration/ConfigData';
import GetData from '../../../QAautoMATER/funcLib/getData';
import demoImage from '../../../image/profiletemplate.jpg'
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;
export class ExecutionLabDataGetter {

  async ExecutionLabPageLoadData() {
    var allconfigData = null;
    if (!Config.isDemo) {
      allconfigData = await ConfigGetter.readConfigurationFile('Web');
      ExecutionLabData.AllConfigData = await allconfigData;
    }
    await this.renderEnvironment(await allconfigData);
    await this.renderAllComponent();
    try {
      await localStorage.removeItem('defectDetails');
  }
  catch (error) { }
  try{
    await localStorage.removeItem('defectEnvironment');
  }
  catch(error)
  {}
  }
  

  async renderEnvironment(allconfigData) {
    await ConfigGetter.updateEnvironmentTableData(await allconfigData);
    ExecutionLabData.EnvironmentList = ConfigData.EnvironmentList;
    ExecutionLabData.SelectedEnvironment = ConfigData.DefaultSelectedEnvironment;
  }
  async renderAllComponent() {
    if (Config.isDemo) {
      ExecutionLabData.ComponentList = ["All", "LandingPage", "SignIn", "ProductList", "ShoppingCart", "BookingSummary"];
      ExecutionLabData.SelectedComponent = "All";
    }
    else {
      try {
        var backendAPI = await Config.backendAPI;
        if (Config.backendServiceAt === 'remote') {
          backendAPI = await Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.get(backendAPI + 'components/project/' + selectedProject + '/testingtype/Web', await headers);
        var allComponent = await serverResponse['data'];
        if (allComponent.length > 0) {
          ExecutionLabData.ComponentList = ["All"].concat(allComponent);
          ExecutionLabData.SelectedComponent = "All";
        }
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getAllTestScriptsfromComponent(selectedComponent) {
    // if (Config.isDemo) {
    //     var componentList = ExecutionLabData.ComponentList;
    //     var allTestScripts = [];
    //     let testId = 1;
    //     for (let componentCounter = 1; componentCounter < componentList.length; componentCounter++) {
    //         var randomRowCount = await DataGeneratorUtility.getNumberFromRange(1, 6);
    //         for (let i = 0; i < randomRowCount; i++) {
    //             var rowData = { id: 0, component: await componentList[componentCounter], testid: 0, testname: '', status: '' }
    //             rowData.id = testId;
    //             rowData.testid = "QA-" + await DataGeneratorUtility.getNumberFromRange(100, 500);
    //             rowData.testname = " This is test case No " + (i + 1);
    //             rowData.status = ''
    //             allTestScripts.push(rowData);
    //             testId = testId + 1;
    //         }
    //     }
    //     ExecutionLabData.ListOfTestScripts = allTestScripts;
    // }
    if (selectedComponent === 'All') {
      ExecutionLabData.ListOfTestScripts = await this.createTestSuiteForAllComponent(ExecutionLabData.ComponentList);
    }
    else {
      ExecutionLabData.ListOfTestScripts = await this.createTestSuiteForSpecificComponent(selectedComponent);
    }
  }

  async executeUITestScripts(environment, runAt, threadCount, reportInDashBoard, screenName, deviceName, screenShotOption, selectedScripts) {
    var allTestScripts = ExecutionLabData.ListOfTestScripts;
    ExecutionLabData.IsGlobalError = false;
    var totalPass = 0;
    var totalFail = 0;
    var doughnutData = [];
    var barChartDataForPass = {};
    var barChartDataForFail = {};
    var componentPassFailData = [];
    var executionTimeData = [];
    var randomNumber =10;
    var status = "Pass"
    var selectedRowId;
    if (Config.isDemo) {
      for (let i = 0; i < await selectedScripts.length; i++) {
         selectedRowId = await selectedScripts[i];
         randomNumber = await DataGeneratorUtility.getNumberFromRange(0, 1);
        status = "Pass"
        if (randomNumber === 1) {
          status = "Fail";
        }
        allTestScripts[selectedRowId - 1]['status'] = status;
      }
      var RandonExecutionTime = await DataGeneratorUtility.getNumberArray(5);
      executionTimeData.push(RandonExecutionTime);
      for (let i = 0; i < await selectedScripts.length; i++) {
       // var executionStartDate = new Date();
         selectedRowId = await selectedScripts[i];
         randomNumber = await DataGeneratorUtility.getNumberFromRange(0, 1);
         status = "Pass";
        var AssertionData = [{ "id": 1, "stepdefinition": "Given I am on Google Landing Page", "action": "LaunchApplication", "testdata": 'NA', "status": 'Pass', 'screenshot': <img alt ='screeshot' width="100" height="50" src={demoImage}></img> }]
        if (randomNumber === 1) {
          status = "Fail";
          AssertionData = [{ "id": 1, "stepdefinition": "Given I am on Google Landing Page", "action": "LaunchApplication", "testdata": 'NA', "status": 'Fail', 'screenshot': <img alt= 'screenshot' width="100" height="50" src={demoImage}></img> }]
        }
        allTestScripts[selectedRowId - 1]['status'] = status;
        ExecutionLabData.AssertionResultsForAllResults[selectedRowId] = await AssertionData;
        //var executionendDate = new Date();
        //var executionTimeInseconds = (executionendDate.getTime() - executionStartDate.getTime()) / 1000;
        // mockResultsData['Execution Time'] = await executionTimeInseconds + ' Seconds';
      }
    }
    else {
      var executionParams = {};
      executionParams['runAt'] = await runAt;
      executionParams['threadCount'] = await threadCount;
      executionParams['reportInDashBoard'] = await reportInDashBoard;
      executionParams['screenName'] = await screenName;
      executionParams['deviceName'] = await deviceName;
      executionParams['screenShotOption'] = await screenShotOption;
      executionParams['environment'] = await environment;
      var indexforEnvironment = await GetData.getIndexForMatchingKeyValueinJsonArray(ExecutionLabData.AllConfigData['Environment'], 'name', environment);
      executionParams['applicationUrl'] = await ExecutionLabData.AllConfigData['Environment'][indexforEnvironment]['url'];
      var testScriptForExecution = [];
      for (let i = 0; i < await selectedScripts.length; i++) {
        selectedRowId = await selectedScripts[i];
        var testScriptDetails = await ExecutionLabData.ListOfTestScripts[Number(await selectedRowId) - 1];
        testScriptForExecution.push(await testScriptDetails);
      }
      executionParams['testscriptforExecution'] = await testScriptForExecution;
      var backendAPI = await Config.backendAPI;
      if (Config.backendServiceAt === 'remote') {
        backendAPI = await Config.remoteBackendAPI;
      }
      var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
      var serverResponse = await restAPI.post(backendAPI + 'executor/project/' + selectedProject, await headers, await executionParams);
      var allExecutionDetails = await serverResponse['data'];
     // console.log(await allExecutionDetails);
      if (await allExecutionDetails['globalError'] !== '') {
        ExecutionLabData.IsGlobalError = true;
        ExecutionLabData.GlobalErrorMessage = await allExecutionDetails['globalError'];
        //console.log(await ExecutionLabData.GlobalErrorMessage);
       // return;
      }
      var testExecutionDetails = await allExecutionDetails['listOfTestScipts'];
      var allAssertionData = await allExecutionDetails['testscriptAssertionData'];
      var allExecutionTime = await allExecutionDetails['executionTimeForTestScripts'];
      var componentExecutionData = await allExecutionDetails['executionTimeForComponent'];
      for (let i = 0; i < await selectedScripts.length; i++) {
        allTestScripts[Number(await selectedScripts[await i]) - 1]['status'] = await testExecutionDetails[i]['status'];
        ExecutionLabData.AssertionResultsForAllResults[await selectedScripts[i]] = await allAssertionData[i+1];
        ExecutionLabData.ExecutionTimeForTestScripts[await selectedScripts[i]] = await allExecutionTime[i+1];
      }

    }
    //************ Reset Grapg for Older and Newer Run********************************************/
    ExecutionLabData.ListOfTestScripts = allTestScripts;
    for (let i = 0; i < allTestScripts.length; i++) {
      var componentName = await allTestScripts[i]['component'];
      status = await allTestScripts[i]['status'];
      if (status === "Pass") {
        totalPass = totalPass + 1;
        if (barChartDataForPass[componentName] === undefined)
          barChartDataForPass[componentName] = 1;
        else
          barChartDataForPass[componentName] = await barChartDataForPass[componentName] + 1;

      }
      else if (status === "Fail") {
        totalFail = totalFail + 1;
        if (barChartDataForFail[componentName] === undefined)
          barChartDataForFail[componentName] = 1;
        else
          barChartDataForFail[componentName] = await barChartDataForFail[componentName] + 1;
      }
    }

    //*** Total Pass and Bar Chart Data*************************************************

    await new Promise(wait => setTimeout(wait, 2000));
    doughnutData.push(totalPass);
    doughnutData.push(totalFail);
    ExecutionLabData.TotalPassFailInLastXResults = doughnutData;
    componentPassFailData.push(barChartDataForPass);
    componentPassFailData.push(barChartDataForFail);
    ExecutionLabData.BarChartDataForComponent = componentPassFailData;

    //*** ExecutionTimeData****************************************************************
    var componentPassDataxandyAxis = await GetData.getAllKeyValueInJsonArrayFromJsonObject(await componentExecutionData);
    ExecutionLabData.ExecutionTimeGraphXaxis = await await componentPassDataxandyAxis['key'];
    var executiontimeYaxisData = [];
    executiontimeYaxisData.push(await componentPassDataxandyAxis['value']);
    ExecutionLabData.ExecutionTimeGraphYaxis = await executiontimeYaxisData;
  }

  async GetAllDeviceAndBrowser(screenName) {
    if (Config.isDemo) {
      switch (await screenName.toString().trim().toLowerCase()) {
        case "desktop":
          ExecutionLabData.DeviceList = ['Chrome', 'Firefox', 'Edge', 'Safari'];
          ExecutionLabData.SelectedDevice = 'Chrome'
          break;
        case "mobile":
          ExecutionLabData.DeviceList = ['iPhone 14'];
          ExecutionLabData.SelectedDevice = 'iPhone 14'
          break;
        case "tablet":
          ExecutionLabData.DeviceList = ['iPad Air'];
          ExecutionLabData.SelectedDevice = 'iPad Air'
          break;
        default:
          break;

      }
    }
    else {
      var allconfigData = await ExecutionLabData.AllConfigData;
      switch (await screenName.toString().trim().toLowerCase()) {
        case "desktop":
          ExecutionLabData.DeviceList = ['Chrome', 'Firefox', 'Edge', 'Safari'];
          ExecutionLabData.SelectedDevice = 'Chrome'
          break;
        default:
          if (await allconfigData['Emulator'] === undefined) {
            ExecutionLabData.DeviceList = [];
            ExecutionLabData.SelectedDevice = '';
          }
          else {
            var allMobileDevice = [];
            var allTabletDevice = [];
            var allEmulator = await allconfigData['Emulator'];
            for (let i = 0; i < await allEmulator.length; i++) {
              var deviceType = await allEmulator[i]['device'];
              switch (deviceType.toString()) {
                case "Mobile":
                  allMobileDevice.push(await allEmulator[i]['name']);
                  break;
                case "Tablet":
                  allTabletDevice.push(await allEmulator[i]['name']);
                  break;
                default:
                  break;
              }
            }
            if (screenName === 'Mobile') {
              ExecutionLabData.DeviceList = await allMobileDevice;
            }
            if (screenName === 'Tablet') {
              ExecutionLabData.DeviceList = await allTabletDevice;
            }
            if (await ExecutionLabData.DeviceList.length > 0) {
              ExecutionLabData.SelectedDevice = await ExecutionLabData.DeviceList[0];
            }
            else {
              ExecutionLabData.SelectedDevice = '';
            }
          }
          break;

      }
    }

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
      var allComponentTestDetails = await GetData.getListOfTestIdAndTestName(selectedProject, 'Web', componentName);
      for (let i = 0; i < allComponentTestDetails.length; i++) {
         rowData = { id: rowId, component: await componentName, testid: await allComponentTestDetails[i]['testid'], testname: await allComponentTestDetails[i]['testname'], status: '' }
        allTestScripts.push(rowData);
        rowId = rowId + 1;
      }
    }
    return allTestScripts;
  }

}
export default new ExecutionLabDataGetter();

