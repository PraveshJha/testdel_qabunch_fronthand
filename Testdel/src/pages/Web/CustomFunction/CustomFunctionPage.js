import Page from '../../Page';
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  ButtonGroup,
  Form,
  Label,
  FormGroup,
  Input,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Modal,
  ModalBody,
  ModalHeader,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
  Fade,
} from 'reactstrap';
import { CustomFunctionData } from './CustomFunctionData'
import ConfigGetter from '../Configuration/ConfigGetter';
import CustomFunctionGetter from './CustomFunctionGetter';
import { Config } from '../../../QAautoMATER/Config';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import NotificationSystem from 'react-notification-system';
import "react-widgets/styles.css";
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-widgets/styles.css";
import { TestScriptTableHeader, CustomFunctionDependentHeader } from '../WebPageTableHeader'
import "react-widgets/styles.css";
import { Combobox } from 'react-widgets'
import DataGetter from '../../DataGetter';
import DropDownOptions from '../../../uiLayout/components/DropDownOptions';
import { DynamicData } from '../../../QAautoMATER/dynamicData/DynamicData';
import {
  StringDataHeader,
}
  from '../../Api/TestScript/TestScriptTableHeader'
import GetData from '../../../QAautoMATER/funcLib/getData';
import Draggable from 'react-draggable';
import ReactJson from 'react-json-view'
import TestScriptGetter from '../../Web/TestScript/TestScriptGetter';

class CustomFunctionPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //****** Function Detail Section ***********************************************************
      listOfCustomFunction: CustomFunctionData.ListOfCustomFunction,
      selectedCustomFunction: CustomFunctionData.SelectedCustomFunction,
      isCustomFunctionNameValid: CustomFunctionData.IsCustomFunctionNameValid,
      reusableType: CustomFunctionData.ReusableType,
      isPreDependentSectionDisplayed: CustomFunctionData.IsPreDependentSectionDisplayed,
      isRenameButtonDisabled: CustomFunctionData.IsRenameButtonDisabled,
      newName: CustomFunctionData.NewName,
      isErrorOnNewName: CustomFunctionData.IsErrorOnNewName,
      isNewNameSectionDisplayed: CustomFunctionData.IsNewNameSectionDisplayed,

      //**** Dependendent Custom function *************************************************************
      dependentCustomFunction: CustomFunctionData.DependentCustomFunction,
      selectedRowFromDependentCustomFunctionTable: CustomFunctionData.SelectedRowFromDependentCustomFunctionTable,

      //*//**** End *************************************************************

      //**** Basic Details*********************************************************
      allComponentList: CustomFunctionData.AllComponentList,
      selectedComponent: CustomFunctionData.SelectedComponent,
      allTestId: CustomFunctionData.AllTestId,
      testId: CustomFunctionData.TestId,
      testName: CustomFunctionData.TestName,
      isErrorOnTestName: CustomFunctionData.IsErrorOnTestName,
      isValidComponentName: CustomFunctionData.IsValidComponentName,

      //**** Debug your Test *************************************************************
      isErrorOnAppUrl: CustomFunctionData.IsErrorOnAppUrl,
      appUrl: CustomFunctionData.AppUrl,
      testingMethod: CustomFunctionData.TestingMethod,
      screenOptionList: CustomFunctionData.ScreenOptionList,
      selectedScreenOption: CustomFunctionData.SelectedScreenOption,
      deviceList: CustomFunctionData.DeviceList,
      selectedDevice: CustomFunctionData.SelectedDevice,
      debugDetails: CustomFunctionData.DebugDetails,
      stepScreenshot: CustomFunctionData.StepScreenshot,
      driver: CustomFunctionData.Driver,


      //**** Test Steps *************************************************************
      listOfTestSteps: CustomFunctionData.ListOfTestSteps,
      selectedRowFromTestStepsTable: CustomFunctionData.SelectedRowFromTestStepsTable,

      //**** Test script Test Data *************************************************************
      listOfTestScriptData: CustomFunctionData.ListOfTestScriptData,
      selectedRowFromTestDataSetTable: CustomFunctionData.SelectedRowFromTestDataSetTable,
      allCommonTestData: CustomFunctionData.AllCommonTestData,
      selectedRowFromCommonTestDataTable: CustomFunctionData.SelectedRowFromCommonTestDataTable,
      commonTestDataNonEditableRows: CustomFunctionData.CommonTestDataNonEditableRows,
      selectedRowFromDynamicDataTable: CustomFunctionData.SelectedRowFromDynamicDataTable,
      utilityDataModal: false,
      dynamicDataValue: '',
      testDataTableHeader: CustomFunctionData.TestDataTableHeader,
      isErrorOnColumnName: CustomFunctionData.IsErrorOnColumnName,
      columnName: CustomFunctionData.ColumnName,

      //**** Test Inspector window *************************************************************
      isInspectorWindowOpen: false,
      socket: null,

      //**** OR Modal *************************************************************
      isOrModalVisible: CustomFunctionData.IsOrModalVisible,
      isErrorOnLocator: CustomFunctionData.IsErrorOnLocator,
      isErrorOnLocatorProperty: CustomFunctionData.IsErrorOnLocatorProperty,
      locatorProperty: CustomFunctionData.LocatorProperty,
      locator: CustomFunctionData.Locator,
      allORKey: CustomFunctionData.AllORKey,
      allORData: CustomFunctionData.AllORData,
      orElementName: CustomFunctionData.ORElementName,
      isErrorOnElementName: CustomFunctionData.IsErrorOnElementName,
      rowIndexForOR: -1,

      //**** File Upload *************************************************************
      isFileUploadButtonDisplayed: CustomFunctionData.IsFileUploadButtonDisplayed,

    };

  }
  componentWillMount = async () => {
    window.scrollTo(0, 0);
    await CustomFunctionGetter.loadCustomFunctionPage();

    //****** Function Detail Section ***********************************************************
    this.setState({ listOfCustomFunction: CustomFunctionData.ListOfCustomFunction });
    this.setState({ selectedCustomFunction: CustomFunctionData.SelectedCustomFunction });
    this.setState({ isCustomFunctionNameValid: CustomFunctionData.IsCustomFunctionNameValid });
    this.setState({ reusableType: CustomFunctionData.ReusableType });
    this.setState({ isPreDependentSectionDisplayed: CustomFunctionData.IsPreDependentSectionDisplayed });
    this.setState({ isRenameButtonDisabled: CustomFunctionData.IsRenameButtonDisabled });
    this.setState({ newName: CustomFunctionData.NewName });
    this.setState({ isErrorOnNewName: CustomFunctionData.IsErrorOnNewName });
    this.setState({ isNewNameSectionDisplayed: CustomFunctionData.IsNewNameSectionDisplayed });

    //**** Dependendent Custom function *************************************************************
    this.setState({ dependentCustomFunction: CustomFunctionData.DependentCustomFunction });
    this.setState({ selectedRowFromDependentCustomFunctionTable: CustomFunctionData.SelectedRowFromDependentCustomFunctionTable });

    //************* End ***********************************************/

    //**** Basic Details ********************************************************
    this.setState({ allComponentList: CustomFunctionData.AllComponentList });
    this.setState({ selectedComponent: CustomFunctionData.SelectedComponent });
    this.setState({ allTestId: CustomFunctionData.AllTestId });
    this.setState({ testId: CustomFunctionData.TestId });
    this.setState({ testName: CustomFunctionData.TestName });
    this.setState({ isErrorOnTestName: CustomFunctionData.IsErrorOnTestName });
    this.setState({ isValidComponentName: CustomFunctionData.IsValidComponentName });

    //**** Debug your Test *************************************************************
    this.setState({ appUrl: CustomFunctionData.AppUrl });
    this.setState({ isErrorOnAppUrl: CustomFunctionData.IsErrorOnAppUrl });
    this.setState({ testingMethod: CustomFunctionData.TestingMethod });
    this.setState({ screenOptionList: CustomFunctionData.ScreenOptionList });
    this.setState({ selectedScreenOption: CustomFunctionData.SelectedScreenOption });
    this.setState({ deviceList: CustomFunctionData.DeviceList });
    this.setState({ selectedDevice: CustomFunctionData.SelectedDevice });
    this.setState({ debugDetails: CustomFunctionData.DebugDetails });
    this.setState({ stepScreenshot: CustomFunctionData.StepScreenshot });
    this.setState({ driver: CustomFunctionData.Driver });

    //**** Test Steps *************************************************************
    this.setState({ listOfTestSteps: CustomFunctionData.ListOfTestSteps });
    this.setState({ selectedRowFromTestStepsTable: CustomFunctionData.SelectedRowFromTestStepsTable });

    //**** Test script Test Data *************************************************************
    this.setState({ listOfTestScriptData: CustomFunctionData.ListOfTestScriptData });
    this.setState({ selectedRowFromTestDataSetTable: CustomFunctionData.SelectedRowFromTestDataSetTable });
    this.setState({ allCommonTestData: CustomFunctionData.AllCommonTestData })
    this.setState({ selectedRowFromCommonTestDataTable: CustomFunctionData.SelectedRowFromCommonTestDataTable })
    this.setState({ commonTestDataNonEditableRows: CustomFunctionData.CommonTestDataNonEditableRows })
    this.setState({ newlyAddedCommonTestData: CustomFunctionData.NewlyAddedCommonTestData })
    this.setState({ selectedRowFromDynamicDataTable: CustomFunctionData.SelectedRowFromDynamicDataTable })
    this.setState({ testDataTableHeader: CustomFunctionData.TestDataTableHeader });
    this.setState({ isErrorOnColumnName: CustomFunctionData.IsErrorOnColumnName });
    this.setState({ columnName: CustomFunctionData.ColumnName });

    //**** OR Data Modal *************************************************************
    this.setState({ allORData: CustomFunctionData.AllORData });
    this.setState({ allORKey: CustomFunctionData.AllORKey });

    //**** File Upload *************************************************************
    this.setState({ isFileUploadButtonDisplayed: CustomFunctionData.IsFileUploadButtonDisplayed })

  }

  //************************* Notification ***************************************************************
  async getNotification(level, message) {
    const notification = await this.notificationSystem.current;
    notification.addNotification({
      message: message,
      level: level,
      autoDismiss: 10,
    });
  }

  //****** Function Detail Section ***********************************************************************

  selectCustomFunction = async (event) => {
    var dataChoice = await event;
    if (this.state.selectedCustomFunction !== await dataChoice) {
      CustomFunctionData.SelectedCustomFunction = await dataChoice;
      this.setState({ selectedCustomFunction: CustomFunctionData.SelectedCustomFunction })
      CustomFunctionData.IsCustomFunctionNameValid = true;
      this.setState({ isCustomFunctionNameValid: true })
      CustomFunctionData.ListOfTestSteps = [];
      this.setState({ listOfTestSteps: [] })
      await CustomFunctionGetter.getCustomFunctionDetails(await dataChoice);
      if (CustomFunctionData.ReusableType === 'Page') {
        this.setState({ dependentCustomFunction: CustomFunctionData.DependentCustomFunction })
      }
      this.setState({ listOfTestSteps: CustomFunctionData.ListOfTestSteps })
      this.setState({ isRenameButtonDisabled: false });
      CustomFunctionData.IsRenameButtonDisabled = false;
      this.setState({ isNewNameSectionDisplayed: true });
      CustomFunctionData.IsNewNameSectionDisplayed = true;
    }
  }

  addNewCustomFunction = async (event) => {
    var dataChoice = await event;
    if (this.state.selectedCustomFunction !== await dataChoice) {
      var format = /[^A-Za-z ]/ig;
      CustomFunctionData.SelectedCustomFunction = await dataChoice;
      this.setState({ selectedCustomFunction: await dataChoice })
      CustomFunctionData.ListOfTestSteps = [];
      this.setState({ listOfTestSteps: [] })
      this.setState({ isRenameButtonDisabled: true });
      CustomFunctionData.IsRenameButtonDisabled = true;
      this.setState({ isNewNameSectionDisplayed: false });
      CustomFunctionData.IsNewNameSectionDisplayed = false;
      if (dataChoice.toString().trim() === '') {
        CustomFunctionData.IsCustomFunctionNameValid = false;
        this.setState({ isCustomFunctionNameValid: false });
        return;
      }
      if (format.test(await dataChoice)) {
        this.setState({ isCustomFunctionNameValid: false });
        CustomFunctionData.IsCustomFunctionNameValid = false;
      }
      else {
        this.setState({ isCustomFunctionNameValid: true });
        CustomFunctionData.IsCustomFunctionNameValid = true;
      }
    }
  }

  selectReusableType = async (event) => {
    var dataChoice = await event.target.value;
    if (this.state.reusableType !== await dataChoice) {
      this.setState({ reusableType: await dataChoice })
      CustomFunctionData.ReusableType = await dataChoice;
      if (await dataChoice === 'Page') {
        this.setState({ isPreDependentSectionDisplayed: true })
        CustomFunctionData.IsPreDependentSectionDisplayed = true;
      }
      else {
        this.setState({ isPreDependentSectionDisplayed: false })
        CustomFunctionData.IsPreDependentSectionDisplayed = false;
      }
      this.setState({ listOfCustomFunction: [] });
      this.setState({ selectedCustomFunction: '' });
      await CustomFunctionGetter.getCustomFunctionList();
      this.setState({ listOfCustomFunction: CustomFunctionData.ListOfCustomFunction })
      CustomFunctionData.SelectedCustomFunction = ''
      this.setState({ isRenameButtonDisabled: true });
      CustomFunctionData.IsRenameButtonDisabled = true;
      this.setState({ isNewNameSectionDisplayed: false });
      this.setState({ isErrorOnNewName: false });
      this.setState({ newName: '' });
      CustomFunctionData.IsNewNameSectionDisplayed = false;
      CustomFunctionData.IsErrorOnNewName = false;
      CustomFunctionData.NewName = '';
    }

  };

  addNewNameForCustomFunction = async (event) => {
    var dataChoice = await event.target.value;
    if (this.state.newName !== await dataChoice) {
      var format = /[^A-Za-z ]/ig;
      CustomFunctionData.NewName = await dataChoice;
      this.setState({ newName: await dataChoice })
      if (dataChoice.toString().trim() === '') {
        CustomFunctionData.IsErrorOnNewName = true;
        this.setState({ isErrorOnNewName: true });
        return;
      }
      if (format.test(await dataChoice)) {
        this.setState({ isErrorOnNewName: true });
        CustomFunctionData.IsErrorOnNewName = true;
      }
      else {
        this.setState({ isErrorOnNewName: false });
        CustomFunctionData.IsErrorOnNewName = false;
      }
    }
  }

  saveCustomPageFunction = async (event) => {
    await event.preventDefault();
    var pageFunctiomType = this.state.reusableType.toString().trim();
    var functionName = this.state.selectedCustomFunction.toString().trim();
    if (pageFunctiomType === '' || functionName === '') {
      return await this.getNotification('error', "Reusable type and Page/Function name can not be blank.");
    }
    if (!this.state.isCustomFunctionNameValid) {
      return await this.getNotification('error', "Please add correct Page/Function Name, it accept only alphabets.");
    }
    var allReusableSteps = this.state.listOfTestSteps;
    if (allReusableSteps.length === 0) {
      return await this.getNotification('error', "Please add Reusable step , No step is found under 'ADD REUSABLE TEST STEPS' table");
    }
    if (pageFunctiomType === 'Page') {
      var isPrePagehasCorrectData = await CustomFunctionGetter.isDataFilledforDependenPage();
      if (!isPrePagehasCorrectData) {
        return await this.getNotification('error', "Please add correct details in 'Pre Dependent Page', Please check self dependency, parameter and arguments.");
      }
    }
    var isDataFilled = await CustomFunctionGetter.isDataFilledforTestStepTable(await allReusableSteps);
    if (!isDataFilled) {
      return await this.getNotification('error', "Please add correct details for unfilled test step in 'ADD REUSABLE TEST STEPS' table.");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await CustomFunctionGetter.saveCustomPageMethod();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      await this.getNotification('success', 'Custom Page/Function is successfully saved.');
    }
    else {
      return await this.getNotification('error', 'Unable to save Custom Page/Function because of ' + Config.ErrorMessage);
    }
  }

  deleteCustomPageFunction = async (event) => {
    await event.preventDefault();
    var pageFunctiomType = this.state.reusableType.toString().trim();
    var functionName = this.state.selectedCustomFunction.toString().trim();
    if (pageFunctiomType === '' || functionName === '') {
      return await this.getNotification('error', "Reusable type and Page/Function name can not be blank.");
    }
    if (!await CustomFunctionData.ListOfCustomFunction.includes(functionName)) {
      return await this.getNotification('error', "Selected Custom Page/Function does not exist on server");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await CustomFunctionGetter.DeleteCustomFunction();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      await this.getNotification('success', 'Custom Page/Function is successfully deleted.');
      await new Promise(wait => setTimeout(wait, 3000));
      await window.location.reload();
    }
    else {
      return await this.getNotification('error', 'Unable to delete Custom Page/Function because of ' + Config.ErrorMessage);
    }
  }

  renameCustomPageFunction = async (event) => {
    await event.preventDefault();
    var oldFunctionName = this.state.selectedCustomFunction.toString().trim();
    var newFunctionName = this.state.newName.toString().trim();
    if (oldFunctionName === '' || newFunctionName === '') {
      this.setState({ isErrorOnNewName: true })
      return await this.getNotification('error', "New Name can not be blank");
    }
    if (this.state.isErrorOnNewName) {
      this.setState({ isErrorOnNewName: true })
      return await this.getNotification('error', "Please add the correct Name, New  Name only accep alphabet");
    }
    if (CustomFunctionData.ListOfCustomFunction.includes(newFunctionName)) {
      this.setState({ isErrorOnNewName: true })
      return await this.getNotification('error', "New Name is already Exist on Server");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await CustomFunctionGetter.RenameCustomPageFunction();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      await this.getNotification('success', 'Custom Page/Function is successfully Renamed.');
      await new Promise(wait => setTimeout(wait, 3000));
      window.location.reload();
    }
    else {
      return await this.getNotification('error', 'Unable to rename Custom Page/Function because of ' + Config.ErrorMessage);
    }
  }

  //****** Dependendt Custom Function *********************************************************************

  selectRadioButtonFromCustomFunctionTable = async (row, isSelect) => {
    if (await isSelect) {
      CustomFunctionData.SelectedRowFromDependentCustomFunctionTable = await row.id;
      this.setState({ selectedRowFromDependentCustomFunctionTable: await row.id });
    }
  }

  addNewRowInCustomFunctionTable = async (event) => {
    await event.preventDefault();
    var tableData = this.state.dependentCustomFunction;
    var lastId = tableData.length + 1;
    var newRow = { id: lastId, customfunction: '', parameter: '' }
    if (lastId > 1) {
      var isDataFilled = await CustomFunctionGetter.isDataFilledforDependendentAPITable();
      if (!isDataFilled) {
        return await this.getNotification('error', "Please add all mandatory details in 'Dependent Custom Function' table");
      }
    }
    if (await lastId === 2) {
      return await this.getNotification('error', "Only 1 Pre dependent function can be added.");
    }
    this.setState({ dependentCustomFunction: [...this.state.dependentCustomFunction, newRow] });
    CustomFunctionData.DependentCustomFunction.push(newRow);
  }

  deleteRowInCustomFunctionTable = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.dependentCustomFunction;
    if (Number(this.state.selectedRowFromDependentCustomFunctionTable) > 0 && Number(this.state.selectedRowFromDependentCustomFunctionTable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromDependentCustomFunctionTable)
      this.setState({ dependentCustomFunction: await dataAfterDelete });
      CustomFunctionData.DependentCustomFunction = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'Custom Function' table");
    }
  }

  //************************* End*************************************************************************

  //************************* Basic Details ***************************************************************


  //**** Debug your Test *******************************************************************************

  addApplicationUrl = async (event) => {
    this.setState({ isErrorOnAppUrl: false })
    var dataChoice = await event.target.value;
    if (this.state.appUrl !== await dataChoice) {
      this.setState({ appUrl: await dataChoice });
      CustomFunctionData.AppUrl = await dataChoice;
      if (await dataChoice.trim() === '') {
        this.setState({ isErrorOnAppUrl: true });
        return;
      }
      var isValid = await CustomFunctionGetter.isValidUrl(await dataChoice)
      if (!isValid) {
        this.setState({ isErrorOnAppUrl: true });
      }
      else {
        this.setState({ isErrorOnAppUrl: false });
      }
    }

  };

  selectTestingMethod = async (event) => {
    var selectedTestingType = await event.target.value;
    if (this.state.testingMethod !== await selectedTestingType) {
      this.setState({ testingMethod: await selectedTestingType })
      CustomFunctionData.TestingMethod = await selectedTestingType;
    }

  };

  selectScreen = async (event) => {
    var screenName = await event.target.value;
    if (this.state.selectedScreenOption !== await screenName) {
      this.setState({ selectedScreenOption: await screenName })
      CustomFunctionData.SelectedScreenOption = await screenName;
      this.setState({ deviceList: [] })
      CustomFunctionData.DeviceList = [];
      CustomFunctionData.SelectedDevice = ''
      this.setState({ selectedDevice: '' })
      await CustomFunctionGetter.GetAllDeviceAndBrowser(await screenName);
      this.setState({ deviceList: CustomFunctionData.DeviceList })
      this.setState({ selectedDevice: CustomFunctionData.SelectedDevice })
    }

  };

  selectDevice = async (event) => {
    var deviceName = await event.target.value;
    if (this.state.selectedDevice !== await deviceName) {
      this.setState({ selectedDevice: await deviceName })
      CustomFunctionData.SelectedDevice = await deviceName;
    }

  };

  //************************* Test Steps ******************************************************************

  selectRadioButtonFromTestStepsTable = async (row, isSelect) => {
    if (await isSelect) {
      CustomFunctionData.SelectedRowFromTestStepsTable = await row.id;
      this.setState({ selectedRowFromTestStepsTable: await row.id });
      if (await row.action === 'FileUpload') {
        this.setState({ isFileUploadButtonDisplayed: true });
        CustomFunctionData.IsFileUploadButtonDisplayed = true;
      }
      else {
        this.setState({ isFileUploadButtonDisplayed: false });
        CustomFunctionData.IsFileUploadButtonDisplayed = false;
      }
    }
  }

  addNewTestStep = async (event) => {
    await event.preventDefault();
    var tableData = this.state.listOfTestSteps;
    var lastId = tableData.length + 1;
    var newRow = { id: lastId, stepdefinition: '', action: '', element: '', value: '', isreporting: '' }
    if (lastId > 1) {
      var isDataFilled = await CustomFunctionGetter.isDataFilledforTestStepTable(await tableData);
      if (!isDataFilled) {
        return await this.getNotification('error', "Please add correct details for unfilled test step in 'ADD REUSABLE TEST STEPS' table.");
      }
    }
    var selectedStep = this.state.selectedRowFromTestStepsTable
    if (await selectedStep === undefined || await selectedStep === '' || Number(await selectedStep) === 0) {
      this.setState({ listOfTestSteps: [...this.state.listOfTestSteps, newRow] });
      CustomFunctionData.ListOfTestSteps.push(newRow);
    }
    else {
      var allRowAfterRearrange = []
      for (let i = 0; i < await Number(await selectedStep); i++) {
        allRowAfterRearrange[i] = this.state.listOfTestSteps[i];
      }
      newRow.id = Number(selectedStep) + 1;
      allRowAfterRearrange.push(await newRow)
      for (let i = Number(selectedStep); i < await tableData.length; i++) {
        tableData[i]['id'] = i + 2;
        allRowAfterRearrange.push(tableData[i]);
      }
      this.setState({ listOfTestSteps: await allRowAfterRearrange });
      CustomFunctionData.ListOfTestSteps = await allRowAfterRearrange;
      this.setState({ selectedRowFromTestStepsTable: Number(selectedStep) + 1 });
      CustomFunctionData.SelectedRowFromTestStepsTable = await Number(selectedStep) + 1;
    }
  }

  deleteRowFromTestStep = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.listOfTestSteps;
    var selectedRowId = await Number(await this.state.selectedRowFromTestStepsTable)
    if (await selectedRowId > 0 && await selectedRowId <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromTestStepsTable)
      this.setState({ listOfTestSteps: await dataAfterDelete });
      CustomFunctionData.ListOfTestSteps = await dataAfterDelete;
      this.setState({ selectedRowFromTestStepsTable: await Number(selectedRowId) - 1 })
    }
    else {
      return await this.getNotification('error', "No row is selected for delete");
    }
  }

  //************************* Test DataSet ******************************************************************

  selectRadioButtonFromTestDataSetTable = async (row, isSelect) => {
    if (await isSelect) {
      CustomFunctionData.SelectedRowFromTestDataSetTable = await row.id;
      this.setState({ selectedRowFromTestDataSetTable: await row.id });
    }
  }

  selectRadioButtonFromCommonTestDataTable = (row, isSelect) => {
    if (isSelect) {
      CustomFunctionData.SelectedRowFromCommonTestDataTable = row.id;
      this.setState({ selectedRowFromCommonTestDataTable: row.id });
    }

  }
  addNewData = async (event) => {
    await event.preventDefault();
    var dataDetails = this.state.allCommonTestData;
    if (dataDetails.length > 0) {
      var dataKey = dataDetails[dataDetails.length - 1]['key'];
      var dataValue = dataDetails[dataDetails.length - 1]['value'];
      if (dataKey.toString().trim() === "" || dataValue.toString().trim() === '') {
        this.setState({ isDataValidInCommonTestDataTable: false });
        return await this.getNotification('error', "Please add correct details in 'Common Test data' table section");
      }
    }
    this.setState({ isDataValidInCommonTestDataTable: true });
    var lastId = dataDetails.length + 1;
    var newRow = { id: lastId, key: '', value: '' };
    this.setState({ allCommonTestData: [...this.state.allCommonTestData, newRow] });
    CustomFunctionData.AllCommonTestData.push(newRow);
  }

  deleteTestData = async (event) => {
    await event.preventDefault();
    var dataDetails = this.state.allCommonTestData;
    if (dataDetails.length === 0) {
      return await this.getNotification('error', "No information is found under 'Common Test Data' table section");
    }
    if (this.state.selectedRowFromCommonTestDataTable <= this.state.commonTestDataNonEditableRows.length) {
      this.setState({ isDataValidInCommonTestDataTable: false });
      return await this.getNotification('error', "You can not delete existing common data set");
    }
    if (Number(this.state.selectedRowFromCommonTestDataTable) > 0 && Number(this.state.selectedRowFromCommonTestDataTable) <= dataDetails.length) {
      var dataInfoAfterDelete = await ConfigGetter.updateRowIdAfterDelete(dataDetails, this.state.selectedRowFromCommonTestDataTable)
      this.setState({ allCommonTestData: [] }, () => { this.setState({ allCommonTestData: dataInfoAfterDelete }); });
      CustomFunctionData.AllCommonTestData = dataInfoAfterDelete;
    }
    else {
      this.setState({ isDataValidInCommonTestDataTable: false });
      return await this.getNotification('error', "No Row is selected in 'Common Test Data' table section");
    }
  }

  selectRadioButtonFromDynamicDataTable = async (row, isSelect) => {
    if (await isSelect) {
      CustomFunctionData.SelectedRowFromDynamicDataTable = await row.id;
      this.setState({ selectedRowFromDynamicDataTable: await row.id });
    }

  }

  toggleUtilityModal = async () => {
    this.setState({ utilityDataModal: false });
  }

  openUtilityData = async (event) => {
    await event.preventDefault();
    var selectedId = this.state.selectedRowFromTestStepsTable;
    if (Number(selectedId) >= 1) {
      this.setState({ utilityDataModal: true });
    }
    else {
      return await this.getNotification('error', "Please select test step before adding Utility data");
    }

  }

  evaluateDymanicDataValue = async () => {
    var rowChoice = Number(this.state.selectedRowFromDynamicDataTable);
    if (rowChoice > -1) {
      var dataKey = DynamicData[Number(rowChoice) - 1]['key'];
      var dataParam = DynamicData[Number(rowChoice) - 1]['custom'];
      var dataValue = await CustomFunctionGetter.getDynamicDataValue(dataKey, dataParam);
      this.setState({ dynamicDataValue: dataValue });
    }
    else {
      return await this.getNotification('error', "Please select any data key before evaluating the value");
    }
  }
  addUtilityDataInTestSteps = async () => {
    var rowChoice = Number(this.state.selectedRowFromDynamicDataTable);
    if (rowChoice > -1) {
      var dataKey = DynamicData[Number(rowChoice) - 1]['key'];
      var dataParam = DynamicData[Number(rowChoice) - 1]['custom'];
      var keytoSend = ''
      if (dataParam.trim() !== '')
        keytoSend = 'Utility.' + dataKey + '||' + dataParam;
      else {
        keytoSend = 'Utility.' + dataKey;

      }
      var rowToUpdate = CustomFunctionData.SelectedRowFromTestStepsTable;
      CustomFunctionData.ListOfTestSteps[Number(rowToUpdate) - 1]['value'] = keytoSend;
      this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: CustomFunctionData.ListOfTestSteps }); });
      this.setState({ utilityDataModal: false });
    }
    else {
      return await this.getNotification('error', "Please select any data key before adding in test step");
    }
  }

  addNewColumnInTestData = async (event) => {
    await event.preventDefault();
    var newColmnName = CustomFunctionData.ColumnName;
    if (newColmnName.toString().trim() === '') {
      return this.setState({ isErrorOnColumnName: true })
    }
    if (this.state.isErrorOnColumnName) {
      return this.setState({ isErrorOnColumnName: true })
    }
    var columnData = this.state.testDataTableHeader;
    var allColumn = await GetData.jsonArrayGetallKeyValue(columnData, 'text');
    if (allColumn.includes(newColmnName.trim().toUpperCase())) {
      return this.setState({ isErrorOnColumnName: true })
    }
    var newColumn = { dataField: newColmnName.trim().toUpperCase(), text: newColmnName.trim().toUpperCase(), headerStyle: { width: '150px' } }
    this.setState({ testDataTableHeader: [...this.state.testDataTableHeader, newColumn] });
    CustomFunctionData.TestDataTableHeader.push(newColumn);
    CustomFunctionData.ColumnName = '';
    this.setState({ columnName: CustomFunctionData.ColumnName })
    //Set Row Data Again
    var allTestData = this.state.listOfTestScriptData;
    if (await allTestData.length > 0) {
      for (let i = 0; i < allTestData.length; i++) {
        allTestData[i][newColmnName.trim().toUpperCase()] = '';
      }
      CustomFunctionData.ListOfTestScriptData = await allTestData;
      this.setState({ listOfTestScriptData: CustomFunctionData.ListOfTestScriptData })
    }
  }

  deleteColumnFromTestData = async (event) => {
    await event.preventDefault();
    var newColmnName = CustomFunctionData.ColumnName;
    if (newColmnName.toString().trim() === '') {
      return this.setState({ isErrorOnColumnName: true })
    }
    if (this.state.isErrorOnColumnName) {
      return this.setState({ isErrorOnColumnName: true })
    }
    var columnData = this.state.testDataTableHeader;
    var isPresent = await GetData.getIndexForMatchingKeyValueinJsonArray(columnData, 'text', newColmnName.trim().toUpperCase());
    if (isPresent === -1) {
      return this.setState({ isErrorOnColumnName: true })
    }
    var dataAfterDelete = await DataGetter.updateTableAfterDeletecolumndataField(columnData, newColmnName.trim().toUpperCase());
    this.setState({ testDataTableHeader: [] }, () => { this.setState({ testDataTableHeader: dataAfterDelete }); });
    CustomFunctionData.TestDataTableHeader = await dataAfterDelete;
    CustomFunctionData.ColumnName = '';
    this.setState({ columnName: CustomFunctionData.ColumnName })
    //Set Row Data Again
    var allTestData = this.state.listOfTestScriptData;
    if (allTestData.length > 0) {
      for (var i = 0; i < allTestData.length; i++) {
        delete allTestData[i][newColmnName.trim().toUpperCase()];
      }
      CustomFunctionData.ListOfTestScriptData = await allTestData;
      this.setState({ listOfTestScriptData: CustomFunctionData.ListOfTestScriptData });
    }
  }

  addColumnName = async (event) => {
    this.setState({ isErrorOnColumnName: false })
    var dataChoice = await event.target.value;
    if (this.state.columnName !== await dataChoice) {
      this.setState({ columnName: await dataChoice });
      CustomFunctionData.ColumnName = await dataChoice;
      if (await dataChoice.trim() === '') {
        this.setState({ isErrorOnColumnName: true });
        return;
      }
      var format = /[^A-Za-z]/ig;
      if (format.test(await dataChoice)) {
        this.setState({ isErrorOnColumnName: true });
      }
      else {
        this.setState({ isErrorOnTestName: false });
      }
    }

  };

  addNewRowInTestData = async (event) => {
    await event.preventDefault();
    var columnData = this.state.testDataTableHeader;
    if (columnData.length === 1) {
      return this.setState({ isErrorOnColumnName: true })
    }
    var dataDetails = this.state.listOfTestScriptData;
    if (dataDetails.length > 0) {
      for (let i = 1; i <= await columnData.length; i++) {
        var dataKey = dataDetails[dataDetails.length - 1][columnData[i - 1]['dataField']];
        if (dataKey.toString().trim() === "") {
          return await this.getNotification('error', "Please add all details against each column in Test Data table");
        }
      }
    }
    var lastId = dataDetails.length + 1;
    var rowProperty = {};
    rowProperty['id'] = lastId;
    for (let i = 2; i <= await columnData.length; i++) {
      rowProperty[await columnData[i - 1]['dataField']] = '';
    }
    this.setState({ listOfTestScriptData: [...this.state.listOfTestScriptData, rowProperty] });
    CustomFunctionData.ListOfCustomFunctionData.push(rowProperty);
  }

  deleteRowInTestData = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.listOfTestScriptData;
    if (Number(this.state.selectedRowFromTestDataSetTable) > 0 && Number(this.state.selectedRowFromTestDataSetTable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromTestDataSetTable)
      this.setState({ listOfTestScriptData: await dataAfterDelete });
      CustomFunctionData.ListOfTestScriptData = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'Test Data' table");
    }
  }

  //***** Toggle Inspector window *************************************************************************

  toggleInspectorWindow = async () => {
    this.setState({ isPageLoading: true });
    await CustomFunctionGetter.closeDebuggerWindow();
    this.setState({ isPageLoading: false });
    this.setState({ isInspectorWindowOpen: false });
  }
  openDebuggerWindow = async (event) => {
    await event.preventDefault();
    if (!await this.state.isInspectorWindowOpen) {
      var applicationUrl = this.state.appUrl;
      if (applicationUrl.toString().trim() === '') {
        return await this.getNotification('error', "Application Url can not be blank.");
      }
      if (this.state.isErrorOnAppUrl) {
        return await this.getNotification('error', "Please add correct application url details");
      }
      this.setState({ appUrl: applicationUrl });
      CustomFunctionData.AppUrl = await applicationUrl;
      //@ check Screen
      var screen = await this.state.selectedScreenOption;
      if (await screen === '') {
        return await this.getNotification('error', "Please select screen before debugging");
      }
      var device = await this.state.selectedDevice;
      if (await device === '') {
        return await this.getNotification('error', "Please select device/browser before debugging");
      }
      this.setState({ isPageLoading: true });
      await CustomFunctionGetter.setupDebuggerWindow();
      this.setState({ isPageLoading: false });
      this.setState({ debugDetails: CustomFunctionData.DebugDetails })
      this.setState({ stepScreenshot: CustomFunctionData.StepScreenshot })
      this.setState({ isInspectorWindowOpen: true });
    }

  }

  debugTestStep = async (event) => {
    await event.preventDefault();
    if (!await this.state.isInspectorWindowOpen) {
      return await this.getNotification('error', "Please Open Debugger window first");
    }
    var selectedStep = CustomFunctionData.SelectedRowFromTestStepsTable;
    if (await selectedStep === '' || await selectedStep === undefined) {
      return await this.getNotification('error', "Please select test step before debug");
    }
    var testStepDetails = await this.state.listOfTestSteps[Number(selectedStep) - 1];
    var testSpecificData = {};
    this.setState({ isPageLoading: true });
    await CustomFunctionGetter.debugSingleTestStep(await testStepDetails, await testSpecificData, false);
    this.setState({ debugDetails: CustomFunctionData.DebugDetails })
    this.setState({ stepScreenshot: CustomFunctionData.StepScreenshot })
    this.setState({ isPageLoading: false });

  }

  debugPageFunction = async (event) => {
    await event.preventDefault();
    if (!await this.state.isInspectorWindowOpen) {
      return await this.getNotification('error', "Please Open Debugger window first");
    }
    var selectedStep = CustomFunctionData.SelectedRowFromDependentCustomFunctionTable;
    if (await selectedStep === '' || await selectedStep === undefined) {
      return await this.getNotification('error', "Please select pre dependent page method first.");
    }
    var testStepDetails = await this.state.dependentCustomFunction;
    var testSpecificData = {};
    this.setState({ isPageLoading: true });
    await CustomFunctionGetter.debugSingleTestStep(await testStepDetails, await testSpecificData, true);
    this.setState({ debugDetails: CustomFunctionData.DebugDetails })
    this.setState({ stepScreenshot: CustomFunctionData.StepScreenshot })
    this.setState({ isPageLoading: false });

  }

  //***** OR Modal ******************************************************************************************

  toggleOrModal = async () => {
    this.setState({ isOrModalVisible: false });
    CustomFunctionData.IsOrModalVisible = false;
  }

  // selectExistingOR = async (event) => {
  //   var dataChoice = await event;
  //   if (this.state.componentName !== await dataChoice) {

  //   }
  // }

  selectExistingOR = async (event) => {
    var dataChoice = await event;
    if (this.state.orElementName !== await dataChoice) {
      this.setState({ orElementName: await dataChoice });
      CustomFunctionData.ORElementName = await dataChoice;
      CustomFunctionData.Locator = CustomFunctionData.AllORData[await dataChoice]['locator'];
      if (CustomFunctionData.Locator === undefined) {
        CustomFunctionData.Locator = ''
      }
      CustomFunctionData.LocatorProperty = CustomFunctionData.AllORData[await dataChoice]['locatorproperty'];
      if (CustomFunctionData.LocatorProperty === undefined) {
        CustomFunctionData.LocatorProperty = ''
      }
      this.setState({ locator: CustomFunctionData.Locator })
      this.setState({ locatorProperty: CustomFunctionData.LocatorProperty })
    }
  }

  addNewOr = async (event) => {
    var dataChoice = await event;
    if (this.state.orElementName !== await dataChoice) {
      var format = /[^A-Za-z]/ig;
      CustomFunctionData.ORElementName = await dataChoice.toString().toUpperCase();
      this.setState({ orElementName: await dataChoice.toString().toUpperCase() });
      if (dataChoice.toString().trim() === '') {
        this.setState({ isErrorOnElementName: true });
        return;
      }
      if (format.test(await dataChoice)) {
        this.setState({ isErrorOnElementName: true });
      }
      else {
        this.setState({ isErrorOnElementName: false });
      }
    }
  }

  selectLocator = async (event) => {
    this.setState({ isErrorOnLocator: false });
    var dataChoice = await event.target.value;
    if (this.state.locator !== await dataChoice) {
      this.setState({ locator: await dataChoice });
      CustomFunctionData.Locator = await dataChoice;
      if (await dataChoice.toString().trim() === '') {
        this.setState({ isErrorOnLocator: true });
      }
    }
  }

  selectLocatorProperty = async (event) => {
    this.setState({ isErrorOnLocatorProperty: false });
    var dataChoice = await event.target.value;
    if (this.state.locatorProperty !== await dataChoice) {
      this.setState({ locatorProperty: await dataChoice });
      CustomFunctionData.LocatorProperty = await dataChoice;
      if (await dataChoice.toString().trim() === '') {
        this.setState({ isErrorOnLocatorProperty: true });
      }
      if (this.state.locator.trim() !== '' && this.state.orElementName.trim() !== '') {
        var orElementName = this.state.orElementName.trim();
        var newElementAdd = { locator: this.state.locator, locatorproperty: await dataChoice, alternatexpath: '' }
        CustomFunctionData.NewElementToAddinOR[await orElementName] = await newElementAdd;
        CustomFunctionData.AllORData[await orElementName] = await newElementAdd;
      }
    }
  }

  addORinTestStep = async (event) => {
    await event.preventDefault();
    var elementName = this.state.orElementName.toString().trim();
    var locator = this.state.locator.toString().trim();;
    var locatorProperty = this.state.locatorProperty.toString().trim();;
    if (locator === '') {
      this.setState({ isErrorOnLocator: true });
    }
    if (locatorProperty === '') {
      this.setState({ isErrorOnLocatorProperty: true });
    }
    if (elementName === '' || locator === '' || locatorProperty === '') {
      return await this.getNotification('error', "Elelemnet Name, locator and locator property can not be blank.");
    }
    if (this.state.isErrorOnElementName) {
      return await this.getNotification('error', "Please add the valid Element Name, element name accept only alphabets");
    }
    var rowIndex = this.state.rowIndexForOR;
    CustomFunctionData.ListOfTestSteps[rowIndex]['element'] = ''
    CustomFunctionData.ListOfTestSteps[rowIndex]['element'] = elementName;
    this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: CustomFunctionData.ListOfTestSteps }); });
    var isKeyAlreadyPresent = await CustomFunctionData.TestScriptORData[elementName];
    var newElementAdd = { locator: locator, locatorproperty: locatorProperty, alternatexpath: '' }
    if (isKeyAlreadyPresent === undefined) {
      CustomFunctionData.AllORData[elementName] = {};
      CustomFunctionData.NewElementToAddinOR[await elementName] = await newElementAdd;
      CustomFunctionData.AllORData[elementName] = newElementAdd;
      if (!CustomFunctionData.AllORKey.includes(await elementName)) {
        CustomFunctionData.AllORKey.push(elementName)
      }

    }
    var addOrInTestData = await CustomFunctionData.TestScriptORData[elementName];
    if (addOrInTestData === undefined) {
      CustomFunctionData.TestScriptORData[elementName] = {};
      CustomFunctionData.TestScriptORData[elementName] = newElementAdd;
    }
    else {
      CustomFunctionData.TestScriptORData[elementName]['locator'] = locator;
      CustomFunctionData.TestScriptORData[elementName]['locatorproperty'] = locatorProperty;
    }
    this.setState({ isOrModalVisible: false });
    CustomFunctionData.IsOrModalVisible = false;
  }

  removeOrObject = async (event) => {
    await event.preventDefault();
    var rowIndex = this.state.rowIndexForOR;
    CustomFunctionData.ListOfTestSteps[rowIndex]['element'] = ''
    this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: CustomFunctionData.ListOfTestSteps }); });
    this.setState({ isOrModalVisible: false });
    CustomFunctionData.IsOrModalVisible = false;
  }

  onChangeHandler = async (event) => {
    event.preventDefault()
    var selectedRow = await this.state.selectedRowFromTestStepsTable;
    if (await selectedRow === undefined || await selectedRow === '') {
      return await this.getNotification('error', 'Please select test step before uploading the file.');
    }
    var selectId = await Number(await selectedRow);
    if (await selectId > 0) {
      var actionName = await CustomFunctionData.ListOfTestSteps[await Number(selectId) - 1]['action'];
      if (await actionName === 'FileUpload') {
        this.setState({ isPageLoading: true })
        var selectedFile = await event.target.files[0];
        var fileUploadDetails = await TestScriptGetter.uploadFileToServer(await selectedFile);
        if (await fileUploadDetails['isSuccess']) {
          this.setState({ isFileUploadButtonDisplayed: false });
          CustomFunctionData.IsFileUploadButtonDisplayed = false;
          CustomFunctionData.ListOfTestSteps[await Number(selectId) - 1]['value'] = await fileUploadDetails['fileName'];
          this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: CustomFunctionData.ListOfTestSteps }); });
          await this.getNotification('success', 'File is saved on server , now you can debug and execute your test scripts');
        }
        else {
          await this.getNotification('error', 'Unable to upload file because of ' + await fileUploadDetails['errorMessage']);
        }
        this.setState({ isPageLoading: false })
      }
      else {
        return await this.getNotification('error', 'File Upload is only valid for method FileUpload');
      }
    }
    else {
      return await this.getNotification('error', 'Selected Test step number ' + selectId + ' is not Valid. Please refresh the page and try again.');
    }
  }


  //****************** End /********************************** */

  render() {

    //****** Select Test Steps********************************
    const selectTestSteps = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromTestStepsTable,
      selected: [this.state.selectedRowFromTestStepsTable]
    };
    const selectRowFromDynamicDataTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromDynamicDataTable,
      selected: [this.state.selectedRowFromDynamicDataTable],
      disabled: [0]
    };
    const selectRowFromDependentCustomFunctionTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromCustomFunctionTable,
      selected: [this.state.selectedRowFromDependentCustomFunctionTable]
    };
    return (
      <Page
        className="customfunctionpage"
        title="Custom Page Function"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <NotificationSystem ref={this.notificationSystem} />
          <Row>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Custom Page/Function
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.saveCustomPageFunction.bind(this)}>
                        <small>Save</small>
                      </Button>
                      <Button color='info' onClick={this.deleteCustomPageFunction.bind(this)}>
                        <small>Delete</small>
                      </Button>
                      <Button color='dark' disabled={this.state.isRenameButtonDisabled} onClick={this.renameCustomPageFunction.bind(this)}>
                        <small>Rename</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={4}>
                        Reusable
                      </Label>
                      <Col>
                        <Input type="select" name="testingType" value={this.state.reusableType} onChange={this.selectReusableType.bind(this)}>
                          <option>Page</option>
                          <option>Function</option>
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4}>
                        Page/Function Name
                      </Label>
                      <Col>
                        <Combobox
                          value={this.state.selectedCustomFunction}
                          data={this.state.listOfCustomFunction}
                          onSelect={this.selectCustomFunction.bind(this)}
                          onChange={this.addNewCustomFunction.bind(this)}
                        />
                      </Col>
                    </FormGroup>
                    {this.state.isNewNameSectionDisplayed && (<FormGroup row>
                      <Label sm={4}>
                        New Name
                      </Label>
                      <Col>
                        <Input type="input" name="newName" invalid={this.state.isErrorOnNewName} value={this.state.newName} onChange={this.addNewNameForCustomFunction.bind(this)}>
                        </Input>
                      </Col>
                    </FormGroup>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Debug Custom Function
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.openDebuggerWindow.bind(this)}>
                        <small>Debugger Window</small>
                      </Button>
                      <Button color='info' onClick={this.debugTestStep.bind(this)}>
                        <small>Debug step</small>
                      </Button>
                      <Button color='dark' onClick={this.debugPageFunction.bind(this)}>
                        <small>Debug page function</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={5}>
                        Application Url*
                      </Label>
                      <Col>
                        <Input type="input" name="testUrl" invalid={this.state.isErrorOnAppUrl} value={this.state.appUrl} onChange={this.addApplicationUrl.bind(this)}>
                        </Input>
                      </Col>
                    </FormGroup>
                    {/* <FormGroup row>
                    <Label sm={5}>
                      Testing type*
                    </Label>
                    <Col>
                      <Input type="select" name="testingType" value={this.state.testingMethod} onChange={this.selectTestingMethod.bind(this)}>
                        <option>Unit Testing</option>
                        <option>Integration Testing</option>
                      </Input>
                    </Col>
                  </FormGroup> */}
                    <FormGroup row>
                      <Label sm={5}>
                        Screen*
                      </Label>
                      <Col>
                        <Input type="select" name="screen" value={this.state.selectedScreenOption} onChange={this.selectScreen.bind(this)}>
                          <DropDownOptions options={this.state.screenOptionList} />
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={5}>
                        Device/Browser*
                      </Label>
                      <Col>
                        <Input type="select" name="screen" value={this.state.selectedDevice} onChange={this.selectDevice.bind(this)}>
                          <DropDownOptions options={this.state.deviceList} />
                        </Input>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Add Reusable Test Steps
                    <div className="d-flex justify-content-between align-items-center">
                      <Input style={{ visibility: this.state.isFileUploadButtonDisplayed ? 'visible' : 'hidden' }} type="file" name="sampleFile" onChange={this.onChangeHandler.bind(this)} />
                    </div>
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.addNewTestStep.bind(this)}>
                        <small>Add Step</small>
                      </Button>
                      <Button color='info' onClick={this.deleteRowFromTestStep.bind(this)}>
                        <small>Delete Step</small>
                      </Button>
                      <Button color='dark' onClick={this.openUtilityData.bind(this)}>
                        <small>Utility Data</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  {this.state.isPreDependentSectionDisplayed && (<Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <UncontrolledAccordion >
                        <AccordionItem>
                          <AccordionHeader targetId="1">Select Pre Dependent Page</AccordionHeader>
                          <AccordionBody accordionId="1">
                            <Row>
                              <Col lg={12} md={12} sm={12} xs={12}>
                                <Card>
                                  <CardHeader>
                                    <div className="d-flex justify-content-between align-items-center">
                                      Page Function
                                      <ButtonGroup size="sm" onClick={this.addNewRowInCustomFunctionTable.bind(this)}>
                                        <Button color='dark' >
                                          <small>Add</small>
                                        </Button>
                                        <Button color='info' onClick={this.deleteRowInCustomFunctionTable.bind(this)}>
                                          <small>Delete</small>
                                        </Button>
                                      </ButtonGroup>
                                    </div>
                                  </CardHeader>
                                  <CardBody>
                                    <Col>
                                      <BootstrapTable
                                        keyField='id'
                                        data={this.state.dependentCustomFunction}
                                        columns={CustomFunctionDependentHeader}
                                        wrapperClasses="table-responsive"
                                        striped
                                        hover
                                        condensed
                                        selectRow={selectRowFromDependentCustomFunctionTable}
                                        cellEdit={cellEditFactory({
                                          mode: 'click',
                                          blurToSave: true,
                                          afterSaveCell: (oldValue, newValue, row, column) => {
                                            if (column.dataField === 'parameter') {
                                              // if (newValue.toLowerCase().includes('args.')) {
                                              //   row.parameter = newValue.toUpperCase();
                                              // }
                                            }
                                            this.setState({ dependentCustomFunction: CustomFunctionData.DependentCustomFunction })
                                          }
                                        })}
                                      />
                                    </Col>
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>
                          </AccordionBody>
                        </AccordionItem>
                      </UncontrolledAccordion >
                    </Col>
                  </Row>
                  )}
                  <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.listOfTestSteps}
                      columns={TestScriptTableHeader}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      selectRow={selectTestSteps}
                      pagination={paginationFactory()}
                      cellEdit={cellEditFactory({
                        mode: 'click',
                        blurToSave: true,
                        afterSaveCell: (oldValue, newValue, row, column) => {
                          if (column.dataField === 'action') {
                            var actionName = row.action;
                            var customFunName = CustomFunctionData.CustomFunctionNameWithListOfArgument[actionName];
                            if (customFunName !== undefined) {
                              row.value = customFunName.toString();
                            }
                            else {
                              row.value = '';
                            }
                          }
                          if (column.dataField === 'value') {
                            if (newValue.toLowerCase().includes('args.')) {
                              var re = new RegExp('args.', 'gi');
                              row.value = row.value.replace(re, 'ARGS.');
                            }
                          }
                          if (column.dataField === 'stepdefinition') {
                            var testStep = row.stepdefinition;
                            if (testStep.trim() !== '') {
                              if ((row.element === undefined || row.element === '') && (row.action === undefined || row.action === '')) {
                                this.setState({ isPageLoading: true })
                                var myData = TestScriptGetter.getactionandElementFromTestStep(testStep);
                                Promise.resolve(myData).then((values) => {
                                  this.setState({ isPageLoading: false })
                                  var actionName = values.actionName
                                  if (actionName !== '') {
                                    var elementName = values.orLogicalName;
                                    var locator = values.primaryLocator;
                                    var locatorProperty = values.primaryLocatorProperty;
                                    row.action = actionName;
                                    var isKeyAlreadyPresent = CustomFunctionData.TestScriptORData[elementName];
                                    var newElementAdd = { locator: locator, locatorproperty: locatorProperty, alternatexpath: '' }
                                    if (isKeyAlreadyPresent === undefined) {
                                      CustomFunctionData.NewElementToAddinOR[elementName.toUpperCase()] = newElementAdd;
                                      CustomFunctionData.AllORData[elementName] = {};
                                      CustomFunctionData.AllORData[elementName] = newElementAdd;
                                      CustomFunctionData.TestScriptORData[elementName] = {};
                                      CustomFunctionData.TestScriptORData[elementName] = newElementAdd;
                                      if (!CustomFunctionData.AllORKey.includes(elementName)) {
                                        CustomFunctionData.AllORKey.push(elementName)
                                      }
                                    }
                                    CustomFunctionData.ListOfTestSteps[Number(row.id) - 1]['action'] = actionName;
                                    CustomFunctionData.ListOfTestSteps[Number(row.id) - 1]['element'] = elementName;
                                    this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: CustomFunctionData.ListOfTestSteps }); });
                                  }
                                })
                                this.setState({ isPageLoading: false })
                              }
                            }
                          }
                          this.setState({ listOfTestSteps: CustomFunctionData.ListOfTestSteps })
                        },
                        onStartEdit: (row, column, rowIndex, columnIndex) => {
                          if (columnIndex === 3) {
                            if (row.stepdefinition.toString().trim() !== '' && row.action.toString().trim() !== '') {
                              if (row.element.toString().trim() === '') {
                                CustomFunctionData.ORElementName = ''
                                CustomFunctionData.Locator = ''
                                CustomFunctionData.LocatorProperty = ''
                              }
                              else {
                                if (Config.isDemo) {
                                  CustomFunctionData.ORElementName = row.element.toString();
                                  CustomFunctionData.Locator = 'LinkText';
                                  CustomFunctionData.LocatorProperty = CustomFunctionData.ORElementName.replace('Link', '');
                                }
                                else {
                                  CustomFunctionData.ORElementName = row.element.toString();
                                  try {
                                    CustomFunctionData.Locator = CustomFunctionData.AllORData[row.element.toString()]['locator'];
                                    if (CustomFunctionData.Locator === undefined) {
                                      CustomFunctionData.Locator = ''
                                    }
                                    CustomFunctionData.LocatorProperty = CustomFunctionData.AllORData[row.element.toString()]['locatorproperty'];
                                    if (CustomFunctionData.LocatorProperty === undefined) {
                                      CustomFunctionData.LocatorProperty = ''
                                    }
                                  }
                                  catch (error) {
                                    CustomFunctionData.Locator = '';
                                    CustomFunctionData.LocatorProperty = ''
                                  }
                                }
                              }
                              this.setState({ isErrorOnLocatorProperty: false })
                              this.setState({ orElementName: CustomFunctionData.ORElementName })
                              this.setState({ locator: CustomFunctionData.Locator })
                              this.setState({ locatorProperty: CustomFunctionData.LocatorProperty })
                              this.setState({ rowIndexForOR: rowIndex })
                              CustomFunctionData.IsOrModalVisible = true;
                              this.setState({ isOrModalVisible: CustomFunctionData.IsOrModalVisible });
                            }
                          }
                        }
                      })}
                    />
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Draggable>
            <Offcanvas style={{ width: 1000, height: '400px' }} returnFocusAfterClose={true} isOpen={this.state.isInspectorWindowOpen} toggle={this.toggleInspectorWindow.bind(this)} direction="start" backdrop={false} >
              <OffcanvasHeader style={{ 'background-color': 'lightblue' }} toggle={this.toggleInspectorWindow.bind(this)}>
                Please watch your debug action
              </OffcanvasHeader>
              <OffcanvasBody style={{ 'background-color': 'lightblue' }}>
                <Card>
                  <CardHeader>Step Details</CardHeader>
                  <CardBody>
                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <Form>
                          <FormGroup row>
                            <img alt='stepscreenshot' src={this.state.stepScreenshot}></img>
                          </FormGroup>
                          <FormGroup row>
                            <ReactJson name={false} collapseStringsAfterLength={20} displayDataTypes={false} indentWidth={0} enableClipboard={true} iconStyle="circle" src={this.state.debugDetails} />
                          </FormGroup>
                        </Form>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </OffcanvasBody>
            </Offcanvas>
          </Draggable>
          {/* <Modal size="xl" isOpen={this.state.isInspectorWindowOpen} className={this.props.className} backdrop="static">
          <ModalHeader toggle={this.toggleInspectorWindow.bind(this)}>We are here for save your precious time</ModalHeader>
          <ModalBody>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <Form>
                  <FormGroup row>
                    qa
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </ModalBody>
        </Modal> */}
          <Modal isOpen={this.state.isOrModalVisible} className={this.props.className} backdrop="static">
            <ModalHeader toggle={this.toggleOrModal.bind(this)}>Add or Select existing Element</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup row>
                  <Label sm={5}>
                    Element Name*
                  </Label>
                  <Col>
                    <Combobox
                      value={this.state.orElementName}
                      data={this.state.allORKey}
                      onSelect={this.selectExistingOR.bind(this)}
                      onChange={this.addNewOr.bind(this)}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={5}>
                    Locator*
                  </Label>
                  <Col>
                    <Input type="select" name="locator" invalid={this.state.isErrorOnLocator} value={this.state.locator} onChange={this.selectLocator.bind(this)}>
                      <option></option>
                      <DropDownOptions options={CustomFunctionData.AllLocatorList} />
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={5}>
                    Locator Property*
                  </Label>
                  <Col>
                    <Input type="input" name="locatorproperty" invalid={this.state.isErrorOnLocatorProperty} value={this.state.locatorProperty} onChange={this.selectLocatorProperty.bind(this)}>
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <ButtonGroup size="sm">
                    <Button color='dark' onClick={this.addORinTestStep.bind(this)}>
                      <small>Add</small>
                    </Button>
                    <Button color='info' onClick={this.removeOrObject.bind(this)}>
                      <small>Remove</small>
                    </Button>
                  </ButtonGroup>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
          <Offcanvas returnFocusAfterClose={true} isOpen={this.state.utilityDataModal} toggle={this.toggleUtilityModal.bind(this)} direction="end" backdrop={false} >
            <OffcanvasHeader toggle={this.toggleUtilityModal.bind(this)}>
              Dynamic Data : {this.state.dynamicDataValue}
            </OffcanvasHeader>
            <OffcanvasBody>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Card>
                    <CardHeader>
                      <div className="d-flex justify-content-between align-items-center">
                        Choose Data
                        <ButtonGroup size="sm">
                          <Button color='dark' onClick={this.evaluateDymanicDataValue.bind(this)}>
                            <small>Evaluate</small>
                          </Button>
                          <Button size="sm" color='info' onClick={this.addUtilityDataInTestSteps.bind(this)}>
                            <small>Update</small>
                          </Button>
                        </ButtonGroup>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Col>
                        <BootstrapTable
                          keyField='id'
                          data={DynamicData}
                          columns={StringDataHeader}
                          wrapperClasses="table-responsive"
                          striped
                          hover
                          condensed
                          selectRow={selectRowFromDynamicDataTable}
                          filter={filterFactory()}
                          pagination={paginationFactory()}
                          cellEdit={cellEditFactory({
                            mode: 'click',
                            blurToSave: true,
                            nonEditableRows: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                          })}
                        />
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </OffcanvasBody>
          </Offcanvas>
        </Fade>
      </Page>

    );
  }
}
export default CustomFunctionPage;
