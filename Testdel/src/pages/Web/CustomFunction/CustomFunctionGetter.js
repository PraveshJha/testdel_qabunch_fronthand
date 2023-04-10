import { CustomFunctionData } from './CustomFunctionData';
import { Config, Users } from '../../../QAautoMATER/Config';
import DynamicDataGetter from '../../../QAautoMATER/dynamicData/DynamicData';
import DataGetter from '../../DataGetter';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';
import GetData from '../../../QAautoMATER/funcLib/getData';
import ConfigGetter from '../Configuration/ConfigGetter';
import restAPI from '../../../QAautoMATER/funcLib/restAPI';
const selectedProject = Config.SelectedProject;

export class CustomFunctionGetter {

  async loadCustomFunctionPage() {
    var allconfigData = null;
    if (!Config.isDemo) {
      allconfigData = await ConfigGetter.readConfigurationFile('Web');
      CustomFunctionData.AllConfigData = await allconfigData;
    }
    await this.initializeCustomPage();
    await this.getCustomFunctionList();
    await this.getallORDATA();
    await DataGetter.GetAllActions();
    await this.getallCommonDATA();
  }

  async getCustomFunctionList() {
    var headers ={}
    var serverResponse ={}
    if (Config.isDemo) {
      CustomFunctionData.ListOfCustomFunction = ['Given I am on Home page', 'Given I am on Product List page', 'Given I am on Product Information page']
      CustomFunctionData.CustomFunctionListWithLabelandValue = [{ label: 'Custom function 1', value: 'Custom function 1' }];
    }
    else {
      var backendApi = await Config.backendAPI;
      var backendServiceLocation = await Config.backendServiceAt;
      if (backendServiceLocation === 'remote') {
        backendApi = await Config.remoteBackendAPI;
      }
      try {
         headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        serverResponse = await restAPI.get(backendApi + 'customfunction/project/' + selectedProject + '/custom/' + await CustomFunctionData.ReusableType, await headers);
        var customFunctionData = await serverResponse['data'];
        CustomFunctionData.ListOfCustomFunction = await customFunctionData;
        var allFuctionWithLabelAndValue = [];
        for (let i = 0; i < await customFunctionData.length; i++) {
          var optionList = { label: '', value: '' }
          optionList.label = await customFunctionData[await i];
          optionList.value = await customFunctionData[i];
          await allFuctionWithLabelAndValue.push(await optionList);
        }
        CustomFunctionData.CustomFunctionListWithLabelandValue = await allFuctionWithLabelAndValue;
         headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        serverResponse = await restAPI.get(backendApi + 'customfunction/project/' + selectedProject + '/customfunctionlistwithargs', await headers);
        var customFunctionNameWithParam = await serverResponse['data'];
        CustomFunctionData.CustomFunctionNameWithListOfArgument = await customFunctionNameWithParam;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getallCommonDATA() {
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
        var serverResponse = await restAPI.get(backendApi + 'testdata/project/' + selectedProject + '/testingtype/Web', await headers);
        var commonData = await serverResponse['data'];
        CustomFunctionData.CommonTestDataWithKeyValue = await commonData;
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getCustomFunctionDetails(customFunctionName) {
    if (Config.isDemo) {
      var allSteps = [];
      allSteps.push({ id: 1, stepdefinition: 'Launch Application', action: 'Launch', element: '', value: '', isreporting: 'Yes' })
      var step = { id: 2, stepdefinition: 'Launch Application', action: 'Click', element: '', value: '', isreporting: 'Yes' }
      var runTimeVariable = await DataGeneratorUtility.getFirstName();
      step.stepdefinition = 'When I click on link ' + runTimeVariable;
      step.element = 'Link' + runTimeVariable;
      allSteps.push(step);
      CustomFunctionData.ListOfTestSteps = await allSteps;
    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.get(backendApi + 'customfunction/project/' + selectedProject + '/custom/' + CustomFunctionData.ReusableType + '/name/' + await customFunctionName, await headers);
        var customFunctionData = await serverResponse['data'];
        CustomFunctionData.ListOfTestSteps = await customFunctionData['allsteps'];
        if (CustomFunctionData.ReusableType === 'Page') {
          if (await customFunctionData['dependentpage'] === undefined) {
            CustomFunctionData.DependentCustomFunction = [];
          }
          else
            CustomFunctionData.DependentCustomFunction = await customFunctionData['dependentpage'];
        }
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getallORDATA() {
    if (Config.isDemo) {

    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.get(backendApi + 'or/project/' + selectedProject + '/testingtype/Web', await headers);
        var orData = await serverResponse['data'];
        CustomFunctionData.AllORData = await orData;
        var allKeys = await Object.keys(await orData);
        CustomFunctionData.AllORKey = [];
        for (let i = 0; i < await allKeys.length; i++) {
          var keyName = await allKeys[i];
          CustomFunctionData.TestScriptORData[await keyName]= CustomFunctionData.AllORData[await keyName];
          await CustomFunctionData.AllORKey.push(await keyName);
        }
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
      }
    }
  }

  async getDynamicDataValue(dataKey, param) {
    return await DynamicDataGetter.getValueFromDynamicData(dataKey, param);
  }

  async getTestScriptListFromComponent(componentName) {
    var allTestID = await DataGetter.getUITestScriptIDfromallComponent(componentName, 'Web');
    CustomFunctionData.AllTestId = await allTestID['allTestId'];
    CustomFunctionData.AllTestIdWithName = await allTestID['testIdWithName'];
  }

  async getAllUITestAttribute() {
    if (Config.isDemo) {
      CustomFunctionData.TestName = "My Test case Name is " + await DataGeneratorUtility.getFirstName();
    }
    else {
      var testID = CustomFunctionData.TestId;
      var testIdIndex = await GetData.getIndexForMatchingKeyValueinJsonArray(CustomFunctionData.AllTestIdWithName, 'testid', testID);
      CustomFunctionData.TestName = CustomFunctionData.AllTestIdWithName[testIdIndex]['testname'];
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

  async isDataFilledforDependendentAPITable() {
    var allData = CustomFunctionData.DependentCustomFunction;
    for (let i = 0; i < allData.length; i++) {
      var customfunction = await allData[i]['customfunction'].toString().trim();
      if (customfunction === '') {
        return false;
      }
    }
    return true;
  }

  async setupDebuggerWindow() {
    if (Config.isDemo) {

    }
    else {
      try {
        var appUrl = await CustomFunctionData.AppUrl;
        var screen = await CustomFunctionData.SelectedScreenOption;
        var device = await CustomFunctionData.SelectedDevice;
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
        CustomFunctionData.DebugDetails = await degugDetails;
        var imageData = 'data:image/png;base64, ' + await driverDetails['screenshot'];
        CustomFunctionData.StepScreenshot = await imageData;
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
        await restAPI.post(backendApi + 'uidebug/debuggerwindow/quit', await headers, await dataforSend);
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
      if (stepdef === '' || action === '') {
        return false;
      }
    }
    return true;
  }

  async saveCustomPageMethod() {
    var headers ={}
    var serverResponse ={}
    if (Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var fileData = {};
        var newElement = {};
        var pageFunctionType = CustomFunctionData.ReusableType;
        fileData['fileName'] = await CustomFunctionData.SelectedCustomFunction;
        var allData = {};
        var argsWithElement = await this.getListOfArgumentsAndNewElementFromTestSteps(CustomFunctionData.ListOfTestSteps);
        allData['argumentlist'] = await argsWithElement['argumentList'];
        newElement = await argsWithElement['newelement'];
        allData['allsteps'] = CustomFunctionData.ListOfTestSteps;
        allData['dependentpage'] = CustomFunctionData.DependentCustomFunction;
        fileData['fileData'] = await allData;
        if (await Object.keys(newElement).length > 0) {
          var dataforSend = {};
          dataforSend['keyForAddandUpdate'] = await newElement
         headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
          serverResponse = await restAPI.post(backendApi + 'or/project/' + selectedProject + '/testingtype/Web', await headers, await dataforSend);
          var saveOrData = await serverResponse['data'];
          if (!await saveOrData['isFileSaved']) {
            Config.ErrorMessage = await saveOrData['errorMessage'];
            return;
          }
        }
         headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
         serverResponse = await restAPI.post(backendApi + 'customfunction/project/' + selectedProject + '/custom/' + pageFunctionType, await headers, await fileData);
        var saveFile = await serverResponse['data'];
        Config.ErrorMessage = await saveFile['errorMessage'];
        return await saveFile['isFileSaved'];
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
        return false;
      }
    }
  }

  async getListOfArgumentsAndNewElementFromTestSteps(allData) {

    var resuableType = CustomFunctionData.ReusableType;
    var output = {};
    var allArguments = [];
    if (resuableType === 'Page') {
      var allDependentData = CustomFunctionData.DependentCustomFunction;
      if (allDependentData.length > 0) {

        for (let i = 1; i <= allDependentData.length; i++) {
          var param = await allDependentData[i - 1]['parameter'];
          var allParams = await param.toString().split(',');
          if (await allParams.length > 0) {
            for (let j = 0; j < await allParams.length; j++) {
              var allParamInAction = await allParams[j].trim();
              var paramToSave = await DataGetter.getArgumentListFromParameter(await allParamInAction);
              for(let k=0;j<await paramToSave.length;k++)
              {
                var argsParamName = await paramToSave[k];
                if(!await allArguments.includes(await argsParamName))
                {
                  allArguments.push(await argsParamName);
                }
              }
            }
          }
        }

      }
    }
    var newElement = await this.getListOfNewElementFromTestSteps(await allData)
    //var newElement = CustomFunctionData.NewElementToAddinOR;
    for (let i = 0; i < await allData.length; i++) {
      var value = await allData[i]['value'].toString().trim();
      var paramToSave = await DataGetter.getArgumentListFromParameter(await value);
      for(let j=0;j<await paramToSave.length;j++)
      {
        var argsParamName = await paramToSave[j];
        if(!await allArguments.includes(await argsParamName))
        {
          allArguments.push(await argsParamName);
        }
      }
     }
     newElement = await newElement['newelement']
    output['argumentList'] = await allArguments;
    output['newelement'] = await newElement;
    return output;
  }
  async getListOfNewElementFromTestSteps(allData) {
    var output = {};
    var newElement = {};
    for (let i = 0; i < await allData.length; i++) {
      var element = await allData[i]['element'].toString().trim().toUpperCase();
      if (await element !== '') {
        if (await CustomFunctionData.TestScriptORData[element] !== undefined) {
          newElement[await element] = await CustomFunctionData.TestScriptORData[await element];
        }
      }

    }
    output['newelement'] = await newElement;
    return output;
  }

  async DeleteCustomFunction() {
    if (Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.delete(backendApi + 'customfunction/project/' + selectedProject + '/custom/' + CustomFunctionData.ReusableType + '/name/' + await CustomFunctionData.SelectedCustomFunction, await headers);
        var saveFile = await serverResponse['data'];
        Config.ErrorMessage = await saveFile['errorMessage'];
        return await saveFile['isFileDeleted'];
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
        return false;
      }
    }
  }

  async RenameCustomPageFunction() {
    if (Config.isDemo) {
      await new Promise(wait => setTimeout(wait, 3000));
      return true;
    }
    else {
      try {
        var backendApi = Config.backendAPI;
        var backendServiceLocation = await Config.backendServiceAt;
        if (backendServiceLocation === 'remote') {
          backendApi = Config.remoteBackendAPI;
        }
        var postData = {};
        postData['oldName'] = CustomFunctionData.SelectedCustomFunction;
        postData['newName'] = CustomFunctionData.NewName;
        var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
        var serverResponse = await restAPI.post(backendApi + 'customfunction/project/' + selectedProject + '/custom/' + CustomFunctionData.ReusableType + '/rename', await headers, await postData);
        var saveFile = await serverResponse['data'];
        Config.ErrorMessage = await saveFile['errorMessage'];
        return await saveFile['isFileSaved'];
      }
      catch (error) {
        Config.ErrorMessage = await error.message;
        return false;
      }
    }
  }

  async isDataFilledforDependenPage() {
    var allData = CustomFunctionData.DependentCustomFunction;
    //var totalRows = await allData.length;
    if (allData.length === 0) {
      return true
    }
    else {
      var name = CustomFunctionData.SelectedCustomFunction;
      var allCustomFunctionName = await GetData.jsonArrayGetallKeyValue(await allData, 'customfunction');
      if (allCustomFunctionName.includes(name)) {
        return false;
      }
      for (let i = 0; i < await allData.length; i++) {
        var customFunction = await allData[i]['customfunction'].toString().trim();
        var parameter = await allData[i]['parameter'].toString().trim();
        if (customFunction === '') {
          return false;
        }
        var agsList = await this.getCustomFunctionArguments(await customFunction);
        if (await agsList.length > 0) {
          var allParamList = await parameter.toString().split(',');
          if (allParamList.length !== agsList.length) {
            return false;
          }
        }
      }
      return true;
    }

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
        var serverResponse = await restAPI.get(backendApi + 'customfunction/project/' + selectedProject + '/custom/' + CustomFunctionData.ReusableType + '/name/' + await customFunctionName, await headers);
        var customFunctionData = await serverResponse['data'];
        return await customFunctionData['argumentlist'];
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
          CustomFunctionData.DeviceList = ['Chrome', 'Firefox', 'Edge', 'Safari'];
          CustomFunctionData.SelectedDevice = 'Chrome'
          break;
        case "mobile":
          CustomFunctionData.DeviceList = ['iPhone 14'];
          CustomFunctionData.SelectedDevice = 'iPhone 14'
          break;
        case "tablet":
          CustomFunctionData.DeviceList = ['iPad Air'];
          CustomFunctionData.SelectedDevice = 'iPad Air'
          break;
        default:
          break;

      }
    }
    else {
      var allconfigData = await CustomFunctionData.AllConfigData;
      switch (await screenName.toString().trim().toLowerCase()) {
        case "desktop":
          CustomFunctionData.DeviceList = ['Chrome', 'Firefox', 'Edge', 'Safari'];
          CustomFunctionData.SelectedDevice = 'Chrome'
          break;
        default:
          if (await allconfigData['Emulator'] === undefined) {
            CustomFunctionData.DeviceList = [];
            CustomFunctionData.SelectedDevice = '';
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
              CustomFunctionData.DeviceList = await allMobileDevice;
            }
            if (screenName === 'Tablet') {
              CustomFunctionData.DeviceList = await allTabletDevice;
            }
            if (await CustomFunctionData.DeviceList.length > 0) {
              CustomFunctionData.SelectedDevice = await CustomFunctionData.DeviceList[0];
            }
            else {
              CustomFunctionData.SelectedDevice = '';
            }
          }
          break;

      }
    }

  }

  async debugSingleTestStep(testStepDetails, testSpecificData, isPageFunction) {
    if (Config.isDemo) {

    }
    else {
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
      dataforSend['commonTestData'] = await CustomFunctionData.CommonTestDataWithKeyValue;
      dataforSend['testSpecificData'] = await testSpecificData;
      var headers = { 'Authorization': await Users.userToken, userEmail: await Users.userEmail };
      var serverResponse = await restAPI.post(backendApi + 'uidebug/debugstep', await headers,await dataforSend);
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
      CustomFunctionData.DebugDetails = await degugDetails;
      var imageData = 'data:image/png;base64, ' + await driverDetails['screenshot'];
      CustomFunctionData.StepScreenshot = await imageData;
    }

  }

  async setUpAllOrData() {
    var allOrData = CustomFunctionData.AllORData;
    var argsWithElement = await this.getListOfArgumentsAndNewElementFromTestSteps(CustomFunctionData.ListOfTestSteps);
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
  async initializeCustomPage() {
    var allconfigData = null;
    if (!await Config.isDemo) {
      allconfigData = await ConfigGetter.readConfigurationFile('Web');
      CustomFunctionData.AllConfigData = await allconfigData;
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
             CustomFunctionData.AppUrl = await appUrl;
          }
        }
      }
      catch (error) { }
    }

  }
}

export default new CustomFunctionGetter();

