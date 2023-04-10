import { TestScriptData } from './TestScriptData';
import { Config, Users } from '../../../QAautoMATER/Config';
import DynamicDataGetter from '../../../QAautoMATER/dynamicData/DynamicData';
import DataGetter from '../../DataGetter';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import GetData from '../../../QAautoMATER/funcLib/getData';
import ConfigGetter from '../Configuration/ConfigGetter';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
import {
  Button,
} from 'reactstrap';
const selectedProject = Config.SelectedProject;


export class TestScriptGetter {

  async loadTestScriptPage() {
    await this.initializeTestScriptPage();
    await this.getallORDATA();
    await this.getallCommonDATA();
    await this.renderComponent();
    await DataGetter.GetAllActions();
    await this.getPageFunctionList();
    if (await localStorage.getItem('testId') !== undefined && await localStorage.getItem('testId') !== null) {
      var automationSteps = await JSON.parse(await localStorage.getItem(await localStorage.getItem('testId')));
      TestScriptData.SelectedComponent = await automationSteps['component'];
      TestScriptData.IsValidComponentName = true;
      TestScriptData.IsValidTestId = true;
      TestScriptData.IsValidTestName = true;
      TestScriptData.TestId = await automationSteps['testId'];
      TestScriptData.TestName = await automationSteps['testName'];
      TestScriptData.ListOfTestSteps = await automationSteps['listOfTestSteps'];
      TestScriptData.DependentCustomFunction = await automationSteps['dependentCustomFunction'];
      TestScriptData.TestDataTableHeader = await automationSteps['testDataTableHeader'];
      TestScriptData.ListOfTestScriptData = await automationSteps['listOfTestScriptData'];
      TestScriptData.ExternalTestSteps = await automationSteps['manualTestSteps'];
    }
    try {
      await localStorage.removeItem('testId');
      await localStorage.removeItem(await localStorage.removeItem('testId'));
    }
    catch (error) { }
  }

  async initializeTestScriptPage() {
    var allconfigData = null;
    if (!await Config.isDemo) {
      allconfigData = await ConfigGetter.readConfigurationFile('Web');
      TestScriptData.AllConfigData = await allconfigData;
      try {
        var defaultEnv = await allconfigData['DefaultSelectedEnvironment'];
        var allEnv = await allconfigData['Environment'];
        if (await allEnv.length > 0) {
          if (await defaultEnv === '' || await defaultEnv === undefined) {
            defaultEnv = await allEnv[0]['name'];
          }
          var index = await GetData.getIndexForMatchingKeyValueinJsonArray(await allEnv, 'name',await defaultEnv)
          if(await index > -1)
          {
             var appUrl = await allEnv[await index]['url'];
             TestScriptData.AppUrl = await appUrl;
          }
        }
      }
      catch (error) { }
    }

  }

  async getallORDATA() {
    if (await Config.isDemo) {

    }
    else {
      try {
        var backendApi = await Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = await Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.get(backendApi + 'or/project/' + await selectedProject + '/testingtype/Web', await headers);
        var orData = await serverResponse['data']
        TestScriptData.AllORData = await orData;
        var allKeys = await Object.keys(await orData);
        TestScriptData.AllORKey = [];
        for (let i = 0; i < await allKeys.length; i++) {
          var keyName = await allKeys[i];
          TestScriptData.TestScriptORData[await keyName]= TestScriptData.AllORData[await keyName];
          TestScriptData.AllORKey.push(await keyName);
        }
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getallCommonDATA() {
    if (await Config.isDemo) {

    }
    else {
      try {
        var backendApi = await Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = await Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.get(backendApi + 'testdata/project/' + selectedProject + '/testingtype/Web', await headers);
        var commonData = await serverResponse['data'];
        var allCommonKeys = await Object.keys(await commonData);
        var allCommonTestDataRow = [];
        var allCommonKeyPair ={};
        for (let i = 0; i < await allCommonKeys.length; i++) {
          var keyName = await allCommonKeys[i];
          var rowDetails = { id: i + 1, key: await keyName, value: await commonData[await keyName] };
          allCommonTestDataRow.push(await rowDetails);
          allCommonKeyPair[await keyName] = await commonData[await keyName];
        }
        TestScriptData.AllCommonTestData = await allCommonTestDataRow;
        TestScriptData.CommonTestDataWithKeyValue = await allCommonKeyPair;
        var nonEditableRows = [];
        for (let i = 0; i < await allCommonTestDataRow.length; i++) {
          nonEditableRows.push(i + 1);
        }
        TestScriptData.CommonTestDataNonEditableRows = await nonEditableRows;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getDynamicDataValue(dataKey, param) {
    return await DynamicDataGetter.getValueFromDynamicData(await dataKey, await param);
  }

  async getTestScriptListFromComponent(componentName) {
    var allTestID = await DataGetter.getUITestScriptIDfromallComponent(await componentName, 'Web');
    TestScriptData.AllTestId = await allTestID['allTestId'];
    TestScriptData.AllTestIdWithName = await allTestID['testIdWithName'];
  }

  async renderComponent() {
    if (Config.isDemo) {
      TestScriptData.AllComponentList = ["LandingPage", "SignIn", "ProductList", "ShoppingCart", "BookingSummary"];
    }
    else {
      try {
        var backendAPI = await Config.backendAPI;
        if (Config.backendServiceAt === 'remote') {
          backendAPI = await Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.get(backendAPI + 'components/project/' + selectedProject + '/testingtype/Web', await headers);
        TestScriptData.AllComponentList = await serverResponse['data'];
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getAllUITestAttribute() {
    if (Config.isDemo) {
      TestScriptData.TestName = "My Test case Name is " + await DataGeneratorUtility.getFirstName();
    }
    else {
      var testID = TestScriptData.TestId;
      var testIdIndex = await GetData.getIndexForMatchingKeyValueinJsonArray(TestScriptData.AllTestIdWithName, 'testid', testID);
      TestScriptData.TestName = TestScriptData.AllTestIdWithName[testIdIndex]['testname'];
      var existingTestDetails = await DataGetter.getTestDetailsInJson(TestScriptData.SelectedComponent, testID, TestScriptData.TestName, 'Web');
      TestScriptData.ListOfTestSteps = await existingTestDetails['allsteps'];
      TestScriptData.DependentCustomFunction = await existingTestDetails['dependentpage'];
      TestScriptData.TestDataTableHeader = await existingTestDetails['testdatacolumn'];
      TestScriptData.ListOfTestScriptData = await existingTestDetails['testdataset'];
    }
  }

  async isValidUrl(urlString) {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
  }

  async isDataFilledforDependendentPage() {
    try {
      var allData = await TestScriptData.DependentCustomFunction;
     // var totalRows = await allData.length;
      if (allData.length === 0) {
        return true
      }
      else {
        for (let i = 0; i < await allData.length; i++) {
          var customFunction = await allData[i]['customfunction'].toString().trim();
          var parameter = await allData[i]['parameter'].toString().trim();
          if (await customFunction === '') {
            return false;
          }
          if (await parameter.toString().includes('args.')) {
            return false;
          }
          var agsList = await this.getCustomFunctionArguments(await customFunction);
          if (await agsList.length > 0) {
            var allParamList = await parameter.toString().split(',');
            if (await allParamList.length !== await agsList.length) {
              return false;
            }
          }
        }
        return true;
      }
    }
    catch (error) {
      return false;
    }
  }

  async setupDebuggerWindow() {
    if (Config.isDemo) {

    }
    else {
      try {
        var appUrl = await TestScriptData.AppUrl;
        var screen = await TestScriptData.SelectedScreenOption;
        var device = await TestScriptData.SelectedDevice;
        var degugDetails = { Step: '', Status: '', Message: '' };
        degugDetails.Step = "Launch Application " + appUrl;
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var dataforSend = {};
        dataforSend['applicationurl'] = await appUrl;
        dataforSend['screen'] = await screen;
        dataforSend['browser'] = await device;
        dataforSend['userEmail'] = await Users.userEmail;
        dataforSend['projectName'] = await selectedProject;
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.post(backendApi + 'uidebug/debuggerwindow', await headers, await dataforSend);
        var driverDetails = await serverResponse['data'];
        degugDetails.Status = await driverDetails['status'];
        degugDetails.Message = await driverDetails['message'];
        TestScriptData.DebugDetails = await degugDetails;
        var imageData = 'data:image/png;base64, ' + await driverDetails['screenshot'];
        TestScriptData.StepScreenshot = await imageData;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async GetAllDeviceAndBrowser(screenName) {
    if (Config.isDemo) {
      switch (await screenName.toString().trim().toLowerCase()) {
        case "desktop":
          TestScriptData.DeviceList = ['Chrome', 'Firefox', 'Edge', 'Safari'];
          TestScriptData.SelectedDevice = 'Chrome'
          break;
        case "mobile":
          TestScriptData.DeviceList = ['iPhone 14'];
          TestScriptData.SelectedDevice = 'iPhone 14'
          break;
        case "tablet":
          TestScriptData.DeviceList = ['iPad Air'];
          TestScriptData.SelectedDevice = 'iPad Air'
          break;
        default:
          break;

      }
    }
    else {
      var allconfigData = await TestScriptData.AllConfigData;
      switch (await screenName.toString().trim().toLowerCase()) {
        case "desktop":
          TestScriptData.DeviceList = ['Chrome', 'Firefox', 'Edge', 'Safari'];
          TestScriptData.SelectedDevice = 'Chrome'
          break;
        default:
          if (await allconfigData['Emulator'] === undefined) {
            TestScriptData.DeviceList = [];
            TestScriptData.SelectedDevice = '';
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
              TestScriptData.DeviceList = await allMobileDevice;
            }
            if (screenName === 'Tablet') {
              TestScriptData.DeviceList = await allTabletDevice;
            }
            if (await TestScriptData.DeviceList.length > 0) {
              TestScriptData.SelectedDevice = await TestScriptData.DeviceList[0];
            }
            else {
              TestScriptData.SelectedDevice = '';
            }
          }
          break;

      }
    }

  }

  async getPageFunctionList() {
    var headers ={}
    var serverResponse ={}
    if (Config.isDemo) {
      TestScriptData.ListOfPageFunction = ['Given I am on Home page', 'Given I am on Product List page', 'Given I am on Product Information page']
      TestScriptData.PageFunctionNameListWithLabelandValue = [{ label: 'Custom function 1', value: 'Custom function 1' }];
    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
         headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
         serverResponse = await restAPI.get(backendApi + 'customfunction/project/' + selectedProject + '/custom/Page', await headers);
        var customFunctionData = await serverResponse['data'];
        TestScriptData.ListOfPageFunction = await customFunctionData;
        var allFuctionWithLabelAndValue = [];
        for (let i = 0; i < await customFunctionData.length; i++) {
          var optionList = { label: '', value: '' }
          optionList.label = await customFunctionData[i];
          optionList.value = await customFunctionData[i];
          allFuctionWithLabelAndValue.push(await optionList);
        }
        TestScriptData.PageFunctionNameListWithLabelandValue = await allFuctionWithLabelAndValue;
         headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
         serverResponse = await restAPI.get(backendApi + 'customfunction/project/' + selectedProject + '/customfunctionlistwithargs', await headers);
        var customFunctionNameWithParam = await serverResponse['data'];
        TestScriptData.CustomFunctionNameWithListOfArgument = await customFunctionNameWithParam;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }

    }
  }

  async isDataFilledforTestStepTable(allData) {
    for (let i = 0; i < await allData.length; i++) {
      var stepdef = await allData[i]['stepdefinition'].toString().trim();
      var action = await allData[i]['action'].toString().trim();
      var value = await allData[i]['value'].toString().trim();
      if (stepdef === '' || action === '') {
        return false;
      }
      if (value.toString().toLowerCase().includes('args.')) {
        return false;
      }
    }
    return true;
  }
  async getCustomFunctionArguments(customFunctionName) {
    if (Config.isDemo) {
      return ['args.USERNAME'];
    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.get(backendApi + 'customfunction/project/' + selectedProject + '/custom/Page/name/' + await customFunctionName, await headers);
        var customFunctionData = await serverResponse['data'];
        return await customFunctionData['argumentlist'];
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async saveTestScriptData() {
    var dataforSend = {};
    var headers={}
    var serverResponse ={}
    var saveFile =true;
    if (Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        await localStorage.removeItem('testId');
        await localStorage.removeItem(await TestScriptData.TestId);
      }
      catch (error) { }
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var testscriptData = {};
        var newElement = {};
        var newElementList = await this.getListOfNewElementFromTestSteps(TestScriptData.ListOfTestSteps);
        newElement = await newElementList['newelement'];
        testscriptData['allsteps'] = TestScriptData.ListOfTestSteps;
        testscriptData['dependentpage'] = TestScriptData.DependentCustomFunction;
        testscriptData['testdatacolumn'] = TestScriptData.TestDataTableHeader
        testscriptData['testdataset'] = TestScriptData.ListOfTestScriptData
        if (await Object.keys(newElement).length > 0) {
           dataforSend = {};
          dataforSend['keyForAddandUpdate'] = await newElement;
           headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
           serverResponse = await restAPI.post(backendApi + 'or/project/' + selectedProject + '/testingtype/Web', await headers, await dataforSend);
          var saveOrData = await serverResponse['data'];
          if (!saveOrData['isFileSaved']) {
            Config.ErrorMessage = await saveOrData['errorMessage'];
            return;
          }
        }
        if (await Object.keys(TestScriptData.TestDataToAdd).length > 0) {
           dataforSend = {};
          dataforSend['keyForAddandUpdate'] = await TestScriptData.TestDataToAdd
           headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
           serverResponse = await restAPI.post(backendApi + 'testdata/project/' + selectedProject + '/testingtype/Web', await headers, await dataforSend);
           saveFile = await serverResponse['data'];
          if (!saveFile['isFileSaved']) {
            Config.ErrorMessage = await saveFile['errorMessage'];
            return;
          }
        }
         headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
         serverResponse = await restAPI.post(backendApi + 'testscripts/component/' + TestScriptData.SelectedComponent + '/testId/' + TestScriptData.TestId.trim() + '@' + TestScriptData.TestName.trim() + '/project/' + selectedProject + '/testingtype/Web', await headers, await testscriptData);
         saveFile = await serverResponse['data'];
        Config.ErrorMessage = await saveFile['errorMessage'];
        return await saveFile['isFileSaved'];
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getListOfNewElementFromTestSteps(allData) {
    var output = {};
    var newElement = {};
    for (let i = 0; i < await allData.length; i++) {
      var element = await allData[i]['element'].toString().trim().toUpperCase();
      if (element !== '') {
        if (await TestScriptData.TestScriptORData[element] !== undefined) {
          newElement[await element] = await TestScriptData.TestScriptORData[await element];
        }
      }

    }
    output['newelement'] = await newElement;
    return output;
  }

  async DeleteTestScriptFromServer(componentName, testId, testName) {
    if (Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        var backendAPI = await Config.backendAPI;
        if (Config.backendServiceAt === 'remote') {
          backendAPI = await Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.delete(backendAPI + 'testscripts/component/' + componentName + '/testId/' + testId + '@' + testName + '/project/' + selectedProject + '/testingtype/Web', await headers);
        var deleteFile = await serverResponse['data'];
        Config.ErrorMessage = await deleteFile['errorMessage'];
        return await deleteFile['isFileDeleted'];
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async renameTestName() {
    if (Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        var componentName = TestScriptData.SelectedComponent;
        var existingTestId = TestScriptData.TestId;
        var oldName = TestScriptData.TestName.trim();
        var newtestName = TestScriptData.NewName.trim();
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var testDetails = { oldName: existingTestId + '@' + oldName, newName: existingTestId + '@' + newtestName };
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.post(backendApi + 'testscripts/component/' + componentName + '/project/' + selectedProject + '/testingtype/Web/rename', await headers, await testDetails);
        var saveFile = await serverResponse['data'];
        Config.ErrorMessage = await saveFile['errorMessage'];
        return await saveFile['isFileSaved'];
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }

  }

  async closeDebuggerWindow() {
    if (Config.isDemo) {

    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var dataforSend = {};
        dataforSend['userEmail'] = await Users.userEmail;
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.post(backendApi + 'uidebug/debuggerwindow/quit', await headers, await dataforSend);
        var saveFile = await serverResponse['data'];
        return await saveFile;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }

  }

  async debugSingleTestStep(testStepDetails, testSpecificData, isPageFunction) {
    if (Config.isDemo) {

    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var dataforSend = {};
        dataforSend['isPageFunction'] = await isPageFunction;
        dataforSend['userEmail'] = await Users.userEmail;
        dataforSend['testStep'] = await testStepDetails;
        dataforSend['projectName'] = await selectedProject;
        dataforSend['orData'] = await this.setUpAllOrData();
        dataforSend['commonTestData'] = await TestScriptData.CommonTestDataWithKeyValue;
        dataforSend['testSpecificData'] = await testSpecificData;
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.post(backendApi + 'uidebug/debugstep', await headers, await dataforSend);
        var driverDetails = await serverResponse['data'];
        var degugDetails = { Step: '', Status: '', Message: '' };
        if (await isPageFunction) {
          degugDetails.Step = await testStepDetails[0]['customfunction'];
        }
        else {
          degugDetails.Step = await testStepDetails['stepdefinition'];
        }
        degugDetails.Status = await driverDetails['status'];
        degugDetails.Message = await driverDetails['message'];
        TestScriptData.DebugDetails = await degugDetails;
        var imageData = 'data:image/png;base64, ' + await driverDetails['screenshot'];
        TestScriptData.StepScreenshot = await imageData;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }

  }

  async setUpAllOrData() {
    var allOrData = TestScriptData.AllORData;
    var argsWithElement = await this.getListOfNewElementFromTestSteps(TestScriptData.ListOfTestSteps);
    var newElement = await argsWithElement['newelement'];
    var newlyAddedElement = await Object.keys(await newElement);
    if (await newlyAddedElement.length > 0) {
      for (let i = 0; i < await newlyAddedElement.length; i++) {
        var keyName = await newlyAddedElement[i];
        allOrData[await keyName] = {};
        allOrData[await keyName] = await newElement[await keyName];
      }
    }
    return await allOrData;
  }

  async getactionandElementFromTestStep(testStep) {
    if (Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        var backendAPI = await Config.backendAPI;
        if (Config.backendServiceAt === 'remote') {
          backendAPI = await Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.get(backendAPI + 'aistep/step/' + await testStep, await headers);
        var allAIDetails = await serverResponse['data'];
        return await allAIDetails;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async generateAutomatedStep() {
    if (Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        var allTestSteps = [];
        var counter = 1;
        var backendAPI = await Config.backendAPI;
        if (Config.backendServiceAt === 'remote') {
          backendAPI = await Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var allSteps = await TestScriptData.ExternalTestSteps;
        var lines = await allSteps.split('\n');
        var isBDD = false;
        if (await allSteps.includes('Scenario Outline:') || await allSteps.includes('Scenario:')) {
          isBDD = true;
        }
        var lineNumber = 0;
        if (await isBDD) {
          lineNumber = await this.getTestNameFromBDDFile(await lines);
          lineNumber = await this.getGivenPageName(await lines, Number(await lineNumber) + 1)
          lineNumber = Number(await lineNumber) + 1;
        }
        for (let i = await lineNumber; i < await lines.length; i++) {
          TestScriptData.ListOfTestScriptData = [];
          TestScriptData.TestDataTableHeader = [{ dataField: 'id', text: '#', headerStyle: { width: '20px' } }];
          var testStepLowerCase = await lines[i].toLowerCase().trim();
          var testStep = await lines[i].replace(/[^0-9A-Z ]+/gi, "");
          while (await testStep.match(/^\d/)) {
            testStep = await testStep.substring(1);
          }
          testStep = await testStep.trim();
          if (await testStep.trim() !== '' && await !testStepLowerCase.startsWith('example') && await !testStepLowerCase.includes('|')) {
            var steDetails = { id: await counter, stepdefinition: await testStep, action: '', element: '', value: '', isreporting: 'Yes' };
            var serverResponse = await restAPI.get(backendAPI + 'aistep/step/' + await testStep, await headers);
            var values = await serverResponse['data'];
            var actionName = await values.actionName;
            if (actionName !== '') {
              var elementName = await values.orLogicalName.trim().toUpperCase();
              var locator = await values.primaryLocator;
              var locatorProperty = await values.primaryLocatorProperty;
              var isKeyAlreadyPresent = TestScriptData.TestScriptORData[await elementName];
              var newElementAdd = { locator: await locator, locatorproperty: await locatorProperty, alternatexpath: '' }
              if (await isKeyAlreadyPresent === undefined) {
                TestScriptData.AllORData[await elementName] = {};
                TestScriptData.AllORData[await elementName] = await newElementAdd;
                TestScriptData.TestScriptORData[await elementName] = {};
                TestScriptData.TestScriptORData[await elementName] = await newElementAdd;
                if (!TestScriptData.AllORKey.includes(await elementName)) {
                  TestScriptData.AllORKey.push(await elementName)
                }

              }
              steDetails.action = await actionName;
              steDetails.element = await elementName;
            }
            if (await isBDD) {
              if (await testStepLowerCase.includes('<') && await testStepLowerCase.includes('>')) {
                var testDataValue = 't.' + await testStepLowerCase.split('<')[1].split('>')[0].toUpperCase();
                steDetails.value = await testDataValue;
              }
            }
            await allTestSteps.push(await steDetails);
            counter = Number(await counter) + 1
          }
        }
        if (await isBDD) {
          await this.setTestDataHEaderAndColumn(await lines);
        }
        if (await allTestSteps.length > 0) {
          TestScriptData.ListOfTestSteps = await allTestSteps;
          return true;
        }
        else {
          Config.ErrorMessage = 'No valid test step found.'
          return false;
        }

      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getTestNameFromBDDFile(allLines) {
    var lineNumber = 0;
    for (let i = 0; i < await allLines.length; i++) {
      var actualStep = await allLines[i];
      if (await actualStep.includes('Scenario Outline:')) {
        TestScriptData.TestName = await actualStep.split('Scenario Outline:')[1].replace(/[^0-9A-Z ]+/gi, "").trim();
        TestScriptData.IsValidTestName = true;
        lineNumber = await i;
        break;
      }
      else if (await actualStep.includes('Scenario:')) {
        TestScriptData.TestName = await actualStep.split('Scenario:')[1].replace(/[^0-9A-Z ]+/gi, "").trim();
        TestScriptData.IsValidTestName = true;
        lineNumber = await i;
        break;
      }
    }
    return await lineNumber;
  }

  async getGivenPageName(allLines, lineNumberToStart) {
    var lineNumber = 0;
    for (let i = await lineNumberToStart; i < await allLines.length; i++) {
      var testStep = await allLines[i].replace(/[^0-9A-Z ]+/gi, "");
      var testStepLowerCase = await allLines[i].replace(/[^0-9A-Z ]+/gi, "").toLowerCase();
      if (await testStepLowerCase.startsWith('given ')) {
        TestScriptData.DependentCustomFunction = []
        var depPageDetails = { id: 1, customfunction: await testStep, parameter: '' };
        TestScriptData.DependentCustomFunction.push(await depPageDetails);
        lineNumber = await i;
        break;
      }
    }
    return await lineNumber;
  }

  async setTestDataHEaderAndColumn(allLines) {
    var lineNumber = 0;
    for (let i = await 0; i < await allLines.length; i++) {
      var testStepLowerCase = await allLines[i].toLowerCase().trim();
      if (await testStepLowerCase.startsWith('example')) {
        lineNumber = await i;
        break;
      }
    }

    try {
      //Get Header
      var allHeaderList = [];
      var allHeader = await allLines[Number(await lineNumber) + 1].split('|');
      for (let i = 0; i < await allHeader.length; i++) {
        var headerName = await allHeader[i].trim();
        if (await headerName !== '') {
          await allHeaderList.push(await headerName.toUpperCase());
        }
      }
      //SEt test Data Column 
      TestScriptData.TestDataTableHeader = [];
      var firstColumn = { dataField: 'id', text: '#', headerStyle: { width: '20px' } };
      TestScriptData.TestDataTableHeader.push(await firstColumn);
      for (let i = 0; i < await allHeaderList.length; i++) {
        var baseColumn = { dataField: await allHeaderList[await i], text: await allHeaderList[await i], headerStyle: { width: '150px' } };
        TestScriptData.TestDataTableHeader.push(await baseColumn);
      }
      //@ set Value
      var listOfTestData = [];
      var counter = 0;
      for (let i = await Number(await lineNumber) + 2; i < await allLines.length; i++) {
        var allDataSet = await allLines[i].trim().split('|');
        var allValue = [];
        for (let j = 0; j < await allDataSet.length; j++) {
          if (await allDataSet[j] !== '') {
            var dataValue = await await allDataSet[j].trim();
            allValue.push(await dataValue);
          }
        }
        if (await allValue.length > 0) {
          counter = await Number(counter) + 1;
          var rowData = { id: await counter };
          for (let k = 0; k < await allHeaderList.length; k++) {
            var columnHeaderName = await allHeaderList[await k];
            var headerValue = await allValue[await k];
            rowData[await columnHeaderName] = await headerValue;
          }
          listOfTestData.push(await rowData);
        }

      }
      TestScriptData.ListOfTestScriptData = await listOfTestData;
    }
    catch (error) { }

    return await lineNumber;
  }

  async uploadFileToServer(filePath) {
    if (await Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        var backendAPI = await Config.backendAPI;
        if (Config.backendServiceAt === 'remote') {
          backendAPI = await Config.remoteBackendAPI;
        }
        let formData = new FormData();
        formData.append('file', await filePath);
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail,'Content-Type':'multipart/form-data'};
        var serverResponse = await restAPI.post(backendAPI + 'fileupload/project/' + await selectedProject, await headers,await formData);
        var allAIDetails = await serverResponse['data'];
        return await allAIDetails;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

}
export default new TestScriptGetter();

