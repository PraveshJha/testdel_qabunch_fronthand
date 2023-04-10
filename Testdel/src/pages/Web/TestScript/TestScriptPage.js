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
import { TestScriptData } from './TestScriptData'
import ConfigGetter from '../Configuration/ConfigGetter';
import TestScriptGetter from './TestScriptGetter';
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
import { TestScriptTableHeader, CommonTestDataHeaderTable, DependentCustomFunctionHeader } from '../WebPageTableHeader'
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

class TestScriptPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);

    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //**** Basic Details*********************************************************
      allComponentList: TestScriptData.AllComponentList,
      selectedComponent: TestScriptData.SelectedComponent,
      allTestId: TestScriptData.AllTestId,
      testId: TestScriptData.TestId,
      testName: TestScriptData.TestName,
      isErrorOnTestName: TestScriptData.IsErrorOnTestName,
      isValidComponentName: TestScriptData.IsValidComponentName,
      isRenameButtonDisabled: TestScriptData.IsRenameButtonDisabled,
      newName: TestScriptData.NewName,
      isErrorOnNewName: TestScriptData.IsErrorOnNewName,
      isNewNameSectionDisplayed: TestScriptData.IsNewNameSectionDisplayed,

      //**** Debug your Test *************************************************************
      isErrorOnAppUrl: TestScriptData.IsErrorOnAppUrl,
      appUrl: TestScriptData.AppUrl,
      testingMethod: TestScriptData.TestingMethod,
      screenOptionList: TestScriptData.ScreenOptionList,
      selectedScreenOption: TestScriptData.SelectedScreenOption,
      deviceList: TestScriptData.DeviceList,
      selectedDevice: TestScriptData.SelectedDevice,

      //**** Dependendent Custom function *************************************************************
      dependentCustomFunction: TestScriptData.DependentCustomFunction,
      selectedRowFromDependentCustomFunctionTable: TestScriptData.SelectedRowFromDependentCustomFunctionTable,

      //**** Test Steps *************************************************************
      listOfTestSteps: TestScriptData.ListOfTestSteps,
      selectedRowFromTestStepsTable: TestScriptData.SelectedRowFromTestStepsTable,

      //**** Test script Test Data *************************************************************
      listOfTestScriptData: TestScriptData.ListOfTestScriptData,
      selectedRowFromTestDataSetTable: TestScriptData.SelectedRowFromTestDataSetTable,
      allCommonTestData: TestScriptData.AllCommonTestData,
      selectedRowFromCommonTestDataTable: TestScriptData.SelectedRowFromCommonTestDataTable,
      commonTestDataNonEditableRows: TestScriptData.CommonTestDataNonEditableRows,
      selectedRowFromDynamicDataTable: TestScriptData.SelectedRowFromDynamicDataTable,
      utilityDataModal: false,
      dynamicDataValue: '',
      testDataTableHeader: TestScriptData.TestDataTableHeader,
      isErrorOnColumnName: TestScriptData.IsErrorOnColumnName,
      columnName: TestScriptData.ColumnName,

      //**** Test Inspector window *************************************************************
      isInspectorWindowOpen: false,

      //**** OR Modal *************************************************************
      isOrModalVisible: TestScriptData.IsOrModalVisible,
      isErrorOnLocator: TestScriptData.IsErrorOnLocator,
      isErrorOnLocatorProperty: TestScriptData.IsErrorOnLocatorProperty,
      locatorProperty: TestScriptData.LocatorProperty,
      locator: TestScriptData.Locator,
      allORKey: TestScriptData.AllORKey,
      allORData: TestScriptData.AllORData,
      orElementName: TestScriptData.ORElementName,
      isErrorOnElementName: TestScriptData.IsErrorOnElementName,
      rowIndexForOR: -1,

      //**** Test Steps *************************************************************
      isErrorOnExternalTestSteps: TestScriptData.IsErrorOnExternalTestSteps,
      externalTestSteps: TestScriptData.ExternalTestSteps,

      //**** File Upload *************************************************************
      isFileUploadButtonDisplayed:TestScriptData.IsFileUploadButtonDisplayed,

    };

  }
  componentWillMount = async () => {
    this.setState({ isPageLoading: true })
    window.scrollTo(0, 0);
    await TestScriptGetter.loadTestScriptPage();
    try {
      //**** Basic Details ********************************************************
      this.setState({ allComponentList: TestScriptData.AllComponentList });
      this.setState({ selectedComponent: TestScriptData.SelectedComponent });
      this.setState({ allTestId: TestScriptData.AllTestId });
      this.setState({ testId: TestScriptData.TestId });
      this.setState({ testName: TestScriptData.TestName });
      this.setState({ isErrorOnTestName: TestScriptData.IsErrorOnTestName });
      this.setState({ isValidComponentName: TestScriptData.IsValidComponentName });
      this.setState({ isRenameButtonDisabled: TestScriptData.IsRenameButtonDisabled });
      this.setState({ newName: TestScriptData.NewName });
      this.setState({ isErrorOnNewName: TestScriptData.IsErrorOnNewName });
      this.setState({ isNewNameSectionDisplayed: TestScriptData.IsNewNameSectionDisplayed });

      //**** Debug your Test *************************************************************
      this.setState({ appUrl: TestScriptData.AppUrl });
      this.setState({ isErrorOnAppUrl: TestScriptData.IsErrorOnAppUrl });
      this.setState({ testingMethod: TestScriptData.TestingMethod });
      this.setState({ screenOptionList: TestScriptData.ScreenOptionList });
      this.setState({ selectedScreenOption: TestScriptData.SelectedScreenOption });
      this.setState({ deviceList: TestScriptData.DeviceList });
      this.setState({ selectedDevice: TestScriptData.SelectedDevice });

      //**** Dependendent Custom function *************************************************************
      this.setState({ dependentCustomFunction: TestScriptData.DependentCustomFunction });
      this.setState({ selectedRowFromDependentCustomFunctionTable: TestScriptData.SelectedRowFromDependentCustomFunctionTable });


      //**** Test Steps *************************************************************
      this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps });
      this.setState({ selectedRowFromTestStepsTable: TestScriptData.SelectedRowFromTestStepsTable });

      //**** Test script Test Data *************************************************************
      this.setState({ listOfTestScriptData: TestScriptData.ListOfTestScriptData });
      this.setState({ selectedRowFromTestDataSetTable: TestScriptData.SelectedRowFromTestDataSetTable });
      this.setState({ allCommonTestData: TestScriptData.AllCommonTestData })
      this.setState({ selectedRowFromCommonTestDataTable: TestScriptData.SelectedRowFromCommonTestDataTable })
      this.setState({ commonTestDataNonEditableRows: TestScriptData.CommonTestDataNonEditableRows })
      this.setState({ newlyAddedCommonTestData: TestScriptData.NewlyAddedCommonTestData })
      this.setState({ selectedRowFromDynamicDataTable: TestScriptData.SelectedRowFromDynamicDataTable })
      this.setState({ testDataTableHeader: TestScriptData.TestDataTableHeader });
      this.setState({ isErrorOnColumnName: TestScriptData.IsErrorOnColumnName });
      this.setState({ columnName: TestScriptData.ColumnName });

      //**** OR Data Modal *************************************************************
      this.setState({ allORData: TestScriptData.AllORData });
      this.setState({ allORKey: TestScriptData.AllORKey });
      //**** Test Steps *************************************************************
      this.setState({ isErrorOnExternalTestSteps: TestScriptData.IsErrorOnExternalTestSteps });
      this.setState({ externalTestSteps: TestScriptData.ExternalTestSteps });
      this.setState({ isPageLoading: false })

      //**** File Upload *************************************************************
      this.setState({ isFileUploadButtonDisplayed: TestScriptData.IsFileUploadButtonDisplayed })
    }
    catch (error) {
    }
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

  //************************* Basic Details ***************************************************************
  selectComponent = async (event) => {
    var dataChoice = await event;
    if (this.state.selectedComponent !== await dataChoice) {
      TestScriptData.SelectedComponent = await dataChoice;
      this.setState({ selectedComponent: await dataChoice })
      this.setState({ allTestId: [] })
      this.setState({ testId: '' })
      this.setState({ testName: '' })
      await TestScriptGetter.getTestScriptListFromComponent(await dataChoice);
      this.setState({ allTestId: TestScriptData.AllTestId })
      TestScriptData.IsValidComponentName = true;
    }
  }

  addNewComponent = async (event) => {
    var dataChoice = await event;
    if (this.state.selectedComponent !== await dataChoice) {
      var format = /[^A-Za-z ]/ig;
      TestScriptData.SelectedComponent = await dataChoice;
      this.setState({ selectedComponent: await dataChoice })
      this.setState({ allTestId: [] })
      this.setState({ testId: '' })
      this.setState({ testName: '' })
      if (dataChoice.toString().trim() === '') {
        TestScriptData.IsValidComponentName = false;
        return;
      }
      if (format.test(await dataChoice)) {
        TestScriptData.IsValidComponentName = false;
      }
      else {
        TestScriptData.IsValidComponentName = true;
      }
    }
  }

  selectTestId = async (event) => {
    var dataChoice = await event;
    if (this.state.testId !== await dataChoice) {
      TestScriptData.TestId = await dataChoice;
      this.setState({ testId: await dataChoice })
      TestScriptData.TestName = '';
      this.setState({ testName: TestScriptData.TestName })
      TestScriptData.ListOfTestSteps = [];
      this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps });
      TestScriptData.DependentCustomFunction = [];
      this.setState({ dependentCustomFunction: TestScriptData.DependentCustomFunction })
      TestScriptData.TestDataTableHeader = [];
      this.setState({ testDataTableHeader: TestScriptData.TestDataTableHeader })
      TestScriptData.ListOfTestScriptData = [];
      this.setState({ listOfTestScriptData: TestScriptData.ListOfTestScriptData })
      await TestScriptGetter.getAllUITestAttribute();
      this.setState({ testName: TestScriptData.TestName })
      TestScriptData.IsValidTestId = true;
      TestScriptData.IsValidTestName = true;
      this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps });
      this.setState({ dependentCustomFunction: TestScriptData.DependentCustomFunction })
      this.setState({ testDataTableHeader: TestScriptData.TestDataTableHeader })
      this.setState({ listOfTestScriptData: TestScriptData.ListOfTestScriptData })
      this.setState({ isRenameButtonDisabled: false });
      TestScriptData.IsRenameButtonDisabled = false;
      this.setState({ isNewNameSectionDisplayed: true });
      TestScriptData.IsNewNameSectionDisplayed = true;
      TestScriptData.NewName = ''
      this.setState({ newName: '' });
      this.setState({ isErrorOnNewName: false });
      TestScriptData.IsErrorOnNewName = false;
    }
  }

  addNewTestId = async (event) => {
    var dataChoice = await event;
    if (this.state.testId !== await dataChoice) {
      var format = /[^A-Za-z0-9-]/ig;
      TestScriptData.TestId = await dataChoice;
      this.setState({ testId: await dataChoice })
      this.setState({ isRenameButtonDisabled: true });
      TestScriptData.IsRenameButtonDisabled = true;
      this.setState({ isNewNameSectionDisplayed: false });
      TestScriptData.IsNewNameSectionDisplayed = false;
      if (await dataChoice.toString().trim() === '') {
        TestScriptData.IsValidTestId = false;
        return;
      }
      if (format.test(await dataChoice)) {
        TestScriptData.IsValidTestId = false;
      }
      else {
        TestScriptData.IsValidTestId = true;
      }
    }
  }

  addTestName = async (event) => {
    this.setState({ isErrorOnTestName: false })
    var dataChoice = await event.target.value;
    if (this.state.testName !== await dataChoice) {
      this.setState({ testName: await dataChoice });
      TestScriptData.TestName = await dataChoice;
      if (await dataChoice.trim() === '') {
        this.setState({ isErrorOnTestName: true });
        TestScriptData.IsValidTestName = false;
        return;
      }
      var format = /[^A-Za-z ]/ig;
      if (format.test(await dataChoice)) {
        this.setState({ isErrorOnTestName: true });
        TestScriptData.IsValidTestName = false;
      }
      else {
        this.setState({ isErrorOnTestName: false });
        TestScriptData.IsValidTestName = true;
      }
    }

  };

  saveTestScript = async (event) => {
    await event.preventDefault();
    var component = this.state.selectedComponent.toString().trim();
    var testId = this.state.testId.toString().trim();
    var testName = this.state.testName.toString().trim();
    if (testName === '') {
      this.setState({ isErrorOnTestName: true });
    }
    if (component === '' || testId === '' || testName === '') {
      return await this.getNotification('error', "Test script component, Name and Id can not be blank.Please add the correct input");
    }
    if (!TestScriptData.IsValidComponentName) {
      return await this.getNotification('error', "Please add correct component name, component name only accept alphabets.");
    }
    if (!TestScriptData.IsValidTestId) {
      return await this.getNotification('error', "Please add correct TestId, TestId accept only alphanumerics.");
    }
    if (!TestScriptData.IsValidTestName) {
      return await this.getNotification('error', "Please add correct TestName, Name accept only alphabets.");
    }
    var allTestSteps = this.state.listOfTestSteps;
    if (allTestSteps.length === 0) {
      return await this.getNotification('error', "Please add test steps , No step is found under 'AUTOMATE MANUAL TEST STEPS' table");
    }
    var isDataFilled = await TestScriptGetter.isDataFilledforTestStepTable(await allTestSteps);
    if (!isDataFilled) {
      return await this.getNotification('error', "Please add correct details for unfilled test step under and Parameterize the custom function.");
    }
    var isPrePagehasCorrectData = await TestScriptGetter.isDataFilledforDependendentPage();
    if (!isPrePagehasCorrectData) {
      return await this.getNotification('error', "Please add correct details in 'Pre Dependent Page', Please check you are passing correct argument, If issue is still exist , Please make sure Custom Page function is present.");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await TestScriptGetter.saveTestScriptData();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      await this.getNotification('success', 'Test script is successfully saved.');
    }
    else {
      return await this.getNotification('error', 'Unable to save test script because of ' + Config.ErrorMessage);
    }
  }

  deleteTestScript = async (event) => {
    await event.preventDefault();
    var component = this.state.selectedComponent.toString().trim();
    var testId = this.state.testId.toString().trim();
    var testName = this.state.testName.toString().trim();
    if (testName === '') {
      this.setState({ isErrorOnTestName: true });
    }
    if (component === '' || testId === '' || testName === '') {
      return await this.getNotification('error', "Test script component, Name and Id can not be blank.Please add the correct input");
    }
    if (!await TestScriptData.AllTestId.includes(testId)) {
      return await this.getNotification('error', "Test Script does not exist on server");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await TestScriptGetter.DeleteTestScriptFromServer(component, testId, testName);
    this.setState({ isPageLoading: false });
    if (isSaved) {
      await this.getNotification('success', 'test script is successfully deleted.');
      await new Promise(wait => setTimeout(wait, 3000));
      await window.location.reload();
    }
    else {
      return await this.getNotification('error', 'Unable to delete test script because of ' + Config.ErrorMessage);
    }
  }

  addNewNameForTestScript = async (event) => {
    var dataChoice = await event.target.value;
    if (this.state.newName !== await dataChoice) {
      var format = /[^A-Za-z ]/ig;
      TestScriptData.NewName = await dataChoice;
      this.setState({ newName: await dataChoice })
      if (dataChoice.toString().trim() === '') {
        TestScriptData.IsErrorOnNewName = true;
        this.setState({ isErrorOnNewName: true });
        return;
      }
      if (format.test(await dataChoice)) {
        this.setState({ isErrorOnNewName: true });
        TestScriptData.IsErrorOnNewName = true;
      }
      else {
        this.setState({ isErrorOnNewName: false });
        TestScriptData.IsErrorOnNewName = false;
      }
    }
  }

  renameTestScript = async (event) => {
    await event.preventDefault();
    var oldFunctionName = this.state.testName.toString().trim();
    var newFunctionName = this.state.newName.toString().trim();
    if (oldFunctionName === '' || newFunctionName === '') {
      this.setState({ isErrorOnNewName: true })
      return await this.getNotification('error', "Old/New Name can not be blank");
    }
    if (this.state.isErrorOnNewName) {
      this.setState({ isErrorOnNewName: true })
      return await this.getNotification('error', "Please add the correct Name, New  Name only accep alphabet");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await TestScriptGetter.renameTestName();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      await this.getNotification('success', 'Test script renamed successfully.');
      await new Promise(wait => setTimeout(wait, 3000));
      await window.location.reload();
    }
    else {
      return await this.getNotification('error', 'Unable to rename test script because of ' + Config.ErrorMessage);
    }

  }

  //**** Debug your Test *******************************************************************************

  addApplicationUrl = async (event) => {
    this.setState({ isErrorOnAppUrl: false })
    var dataChoice = await event.target.value;
    if (this.state.appUrl !== await dataChoice) {
      this.setState({ appUrl: await dataChoice });
      TestScriptData.AppUrl = await dataChoice;
      if (await dataChoice.trim() === '') {
        this.setState({ isErrorOnAppUrl: true });
        return;
      }
      var isValid = await TestScriptGetter.isValidUrl(await dataChoice)
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
      TestScriptData.TestingMethod = await selectedTestingType;
    }

  };

  selectScreen = async (event) => {
    var screenName = await event.target.value;
    if (this.state.selectedScreenOption !== await screenName) {
      this.setState({ selectedScreenOption: await screenName })
      TestScriptData.SelectedScreenOption = await screenName;
      this.setState({ deviceList: [] })
      TestScriptData.DeviceList = [];
      TestScriptData.SelectedDevice = ''
      this.setState({ selectedDevice: '' })
      await TestScriptGetter.GetAllDeviceAndBrowser(await screenName);
      this.setState({ deviceList: TestScriptData.DeviceList })
      this.setState({ selectedDevice: TestScriptData.SelectedDevice })
    }

  };

  selectDevice = async (event) => {
    var deviceName = await event.target.value;
    if (this.state.selectedDevice !== await deviceName) {
      this.setState({ selectedDevice: await deviceName })
      TestScriptData.SelectedDevice = await deviceName;
    }

  };

  //************************* Dependendt Custom Function ******************************************************************

  selectRadioButtonFromCustomFunctionTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowFromDependentCustomFunctionTable = await row.id;
      this.setState({ selectedRowFromDependentCustomFunctionTable: await row.id });
    }
  }

  addNewRowInCustomFunctionTable = async (event) => {
    await event.preventDefault();
    var tableData = this.state.dependentCustomFunction;
    var lastId = tableData.length + 1;
    var newRow = { id: lastId, customfunction: '', parameter: '' }
    if (lastId > 1) {
      var isDataFilled = await TestScriptGetter.isDataFilledforDependendentPage();
      if (!isDataFilled) {
        return await this.getNotification('error', "Please add all details for all column against each row in 'Custom Function' table");
      }
    }
    if (await lastId === 2) {
      return await this.getNotification('error', "Only 1 Pre dependent page can be added.");
    }
    this.setState({ dependentCustomFunction: [...this.state.dependentCustomFunction, newRow] });
    TestScriptData.DependentCustomFunction.push(newRow);
  }

  deleteRowInCustomFunctionTable = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.dependentCustomFunction;
    if (Number(this.state.selectedRowFromDependentCustomFunctionTable) > 0 && Number(this.state.selectedRowFromDependentCustomFunctionTable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromDependentCustomFunctionTable)
      this.setState({ dependentCustomFunction: await dataAfterDelete });
      TestScriptData.DependentCustomFunction = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'Custom Function' table");
    }
  }

  //************************* Test Steps ******************************************************************

  selectRadioButtonFromTestStepsTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowFromTestStepsTable = await row.id;
      this.setState({ selectedRowFromTestStepsTable: await row.id });
      if(await row.action ==='FileUpload')
      {
        this.setState({isFileUploadButtonDisplayed:true});
        TestScriptData.IsFileUploadButtonDisplayed = true;
      }
      else{
        this.setState({isFileUploadButtonDisplayed:false});
        TestScriptData.IsFileUploadButtonDisplayed = false;
      }
    }
  }

  addNewTestStep = async (event) => {
    await event.preventDefault();
    var tableData = this.state.listOfTestSteps;
    var lastId = await tableData.length + 1;
    var newRow = { id: lastId, stepdefinition: '', action: '', element: '', value: '', isreporting: '' }
    if (lastId > 1) {
      var isRowFilled = await TestScriptGetter.isDataFilledforTestStepTable(await tableData);
      if (! await isRowFilled) {
        return await this.getNotification('error', "Please add correct details for unfilled test step in 'AUTOMATE MANUAL TEST STEPS' table.");
      }
    }
    // add step between selected Steps
    var selectedStep = await this.state.selectedRowFromTestStepsTable;
    if (await selectedStep === undefined || await selectedStep === '' || Number(await selectedStep) === 0) {
      this.setState({ listOfTestSteps: [...this.state.listOfTestSteps, newRow] });
      TestScriptData.ListOfTestSteps.push(newRow);
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
      TestScriptData.ListOfTestSteps = await allRowAfterRearrange;
      this.setState({ selectedRowFromTestStepsTable: Number(selectedStep) + 1 });
      TestScriptData.SelectedRowFromTestStepsTable = await Number(selectedStep) + 1;
    }

  }

  deleteRowFromTestStep = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.listOfTestSteps;
    var selectedRowId = await Number(await this.state.selectedRowFromTestStepsTable)
    if (await selectedRowId > 0 && await selectedRowId <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromTestStepsTable)
      this.setState({ listOfTestSteps: await dataAfterDelete });
      TestScriptData.ListOfTestSteps = await dataAfterDelete;
      this.setState({ selectedRowFromTestStepsTable: await Number(selectedRowId) - 1 })
    }
    else {
      return await this.getNotification('error', "No row is selected for delete");
    }
  }

  //************************* Test DataSet ******************************************************************

  selectRadioButtonFromTestDataSetTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowFromTestDataSetTable = await row.id;
      this.setState({ selectedRowFromTestDataSetTable: await row.id });
    }
  }

  selectRadioButtonFromCommonTestDataTable = (row, isSelect) => {
    if (isSelect) {
      TestScriptData.SelectedRowFromCommonTestDataTable = row.id;
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
    TestScriptData.AllCommonTestData.push(newRow);
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
      TestScriptData.AllCommonTestData = dataInfoAfterDelete;
    }
    else {
      this.setState({ isDataValidInCommonTestDataTable: false });
      return await this.getNotification('error', "No Row is selected in 'Common Test Data' table section");
    }
  }

  selectRadioButtonFromDynamicDataTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowFromDynamicDataTable = await row.id;
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
      var dataValue = await TestScriptGetter.getDynamicDataValue(dataKey, dataParam);
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
      var rowToUpdate = TestScriptData.SelectedRowFromTestStepsTable;
      TestScriptData.ListOfTestSteps[Number(rowToUpdate) - 1]['value'] = keytoSend;
      this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps }); });
      this.setState({ utilityDataModal: false });
    }
    else {
      return await this.getNotification('error', "Please select any data key before adding in test step");
    }
  }

  addNewColumnInTestData = async (event) => {
    await event.preventDefault();
    var newColmnName = TestScriptData.ColumnName;
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
    TestScriptData.TestDataTableHeader.push(newColumn);
    TestScriptData.ColumnName = '';
    this.setState({ columnName: TestScriptData.ColumnName })
    //Set Row Data Again
    var allTestData = this.state.listOfTestScriptData;
    if (await allTestData.length > 0) {
      for (let i = 0; i < allTestData.length; i++) {
        allTestData[i][newColmnName.trim().toUpperCase()] = '';
      }
      TestScriptData.ListOfTestScriptData = await allTestData;
      this.setState({ listOfTestScriptData: TestScriptData.ListOfTestScriptData })
    }
  }

  deleteColumnFromTestData = async (event) => {
    await event.preventDefault();
    var newColmnName = TestScriptData.ColumnName;
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
    TestScriptData.TestDataTableHeader = await dataAfterDelete;
    TestScriptData.ColumnName = '';
    this.setState({ columnName: TestScriptData.ColumnName })
    //Set Row Data Again
    var allTestData = this.state.listOfTestScriptData;
    if (allTestData.length > 0) {
      for (var i = 0; i < allTestData.length; i++) {
        delete allTestData[i][newColmnName.trim().toUpperCase()];
      }
      TestScriptData.ListOfTestScriptData = await allTestData;
      this.setState({ listOfTestScriptData: TestScriptData.ListOfTestScriptData });
    }
  }

  addColumnName = async (event) => {
    this.setState({ isErrorOnColumnName: false })
    var dataChoice = await event.target.value;
    if (this.state.columnName !== await dataChoice) {
      this.setState({ columnName: await dataChoice });
      TestScriptData.ColumnName = await dataChoice;
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
    TestScriptData.ListOfTestScriptData.push(rowProperty);
  }

  deleteRowInTestData = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.listOfTestScriptData;
    if (Number(this.state.selectedRowFromTestDataSetTable) > 0 && Number(this.state.selectedRowFromTestDataSetTable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromTestDataSetTable)
      this.setState({ listOfTestScriptData: await dataAfterDelete });
      TestScriptData.ListOfTestScriptData = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'Test Data' table");
    }
  }

  //***** Toggle Inspector window *************************************************************************

  toggleInspectorWindow = async () => {
    this.setState({ isPageLoading: true });
    await TestScriptGetter.closeDebuggerWindow();
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
      TestScriptData.AppUrl = await applicationUrl;
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
      await TestScriptGetter.setupDebuggerWindow();
      this.setState({ isPageLoading: false });
      this.setState({ debugDetails: TestScriptData.DebugDetails })
      this.setState({ stepScreenshot: TestScriptData.StepScreenshot })
      this.setState({ isInspectorWindowOpen: true });
    }

  }

  debugTestStep = async (event) => {
    await event.preventDefault();
    if (!await this.state.isInspectorWindowOpen) {
      return await this.getNotification('error', "Please Open Debugger window first");
    }
    var selectedStep = TestScriptData.SelectedRowFromTestStepsTable;
    if (await selectedStep === '' || await selectedStep === undefined) {
      return await this.getNotification('error', "Please select test step before debug");
    }
    var testStepDetails = await this.state.listOfTestSteps[Number(selectedStep) - 1];
    var testSpecificData = await this.state.listOfTestScriptData;
    this.setState({ isPageLoading: true });
    await TestScriptGetter.debugSingleTestStep(await testStepDetails, await testSpecificData, false);
    this.setState({ debugDetails: TestScriptData.DebugDetails })
    this.setState({ stepScreenshot: TestScriptData.StepScreenshot })
    this.setState({ isPageLoading: false });

  }

  debugPageFunction = async (event) => {
    await event.preventDefault();
    if (!await this.state.isInspectorWindowOpen) {
      return await this.getNotification('error', "Please Open Debugger window first");
    }
    var selectedStep = TestScriptData.SelectedRowFromDependentCustomFunctionTable;
    if (await selectedStep === '' || await selectedStep === undefined) {
      return await this.getNotification('error', "Please select pre dependent page method first.");
    }
    var testStepDetails = await this.state.dependentCustomFunction;
    var testSpecificData = await this.state.listOfTestScriptData;
    this.setState({ isPageLoading: true });
    await TestScriptGetter.debugSingleTestStep(await testStepDetails, await testSpecificData, true);
    this.setState({ debugDetails: TestScriptData.DebugDetails })
    this.setState({ stepScreenshot: TestScriptData.StepScreenshot })
    this.setState({ isPageLoading: false });

  }

  //***** OR Modal ******************************************************************************************

  toggleOrModal = async () => {
    this.setState({ isOrModalVisible: false });
    TestScriptData.IsOrModalVisible = false;
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
      TestScriptData.ORElementName = await dataChoice;
      TestScriptData.Locator = TestScriptData.AllORData[await dataChoice]['locator'];
      if (TestScriptData.Locator === undefined) {
        TestScriptData.Locator = ''
      }
      TestScriptData.LocatorProperty = TestScriptData.AllORData[await dataChoice]['locatorproperty'];
      if (TestScriptData.LocatorProperty === undefined) {
        TestScriptData.LocatorProperty = ''
      }
      this.setState({ locator: TestScriptData.Locator })
      this.setState({ locatorProperty: TestScriptData.LocatorProperty })
    }
  }

  addNewOr = async (event) => {
    var dataChoice = await event;
    if (this.state.orElementName !== await dataChoice) {
      var format = /[^A-Za-z]/ig;
      TestScriptData.ORElementName = await dataChoice.toString().toUpperCase();
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
      TestScriptData.Locator = await dataChoice;
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
      TestScriptData.LocatorProperty = await dataChoice;
      if (await dataChoice.toString().trim() === '') {
        this.setState({ isErrorOnLocatorProperty: true });
      }
    }
  }

  addORinTestStep = async (event) => {
    await event.preventDefault();
    var elementName = this.state.orElementName.toString().trim().replace(/ /g, "");
    var locator = this.state.locator.toString().trim();;
    var locatorProperty = this.state.locatorProperty.toString().trim();;
    if (locator === '') {
      this.setState({ isErrorOnLocator: true });
    }
    if (await locatorProperty === '') {
      this.setState({ isErrorOnLocatorProperty: true });
    }
    if (await elementName === '' || await locator === '' || await locatorProperty === '') {
      return await this.getNotification('error', "Elelemnet Name, locator and locator property can not be blank.");
    }
    if (this.state.isErrorOnElementName) {
      return await this.getNotification('error', "Please add the valid Element Name, element name accept only alphabets");
    }
    var rowIndex = this.state.rowIndexForOR;
    TestScriptData.ListOfTestSteps[rowIndex]['element'] = ''
    TestScriptData.ListOfTestSteps[rowIndex]['element'] = await elementName;
    this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps }); });
    var isKeyAlreadyPresent = await TestScriptData.TestScriptORData[elementName];
    var newElementAdd = { locator: await locator, locatorproperty: await locatorProperty, alternatexpath: '' }
    if (await isKeyAlreadyPresent === undefined) {
      TestScriptData.AllORData[await elementName] = {};
      TestScriptData.AllORData[await elementName] = newElementAdd;
      if (!TestScriptData.AllORKey.includes(await elementName)) {
        TestScriptData.AllORKey.push(await elementName)
      }

    }
    var addOrInTestData = await TestScriptData.TestScriptORData[elementName];
    if (addOrInTestData === undefined) {
      TestScriptData.TestScriptORData[elementName] = {};
      TestScriptData.TestScriptORData[elementName] = newElementAdd;
    }
    else {
      TestScriptData.TestScriptORData[elementName]['locator'] = locator;
      TestScriptData.TestScriptORData[elementName]['locatorproperty'] = locatorProperty;
    }
    this.setState({ isOrModalVisible: false });
    TestScriptData.IsOrModalVisible = false;
  }

  removeOrObject = async (event) => {
    await event.preventDefault();
    var rowIndex = this.state.rowIndexForOR;
    TestScriptData.ListOfTestSteps[rowIndex]['element'] = ''
    this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps }); });
    this.setState({ isOrModalVisible: false });
    TestScriptData.IsOrModalVisible = false;
  }

  //******* Paste External Test Steps ******************************************************/

  pasteExternalTestSteps = async (event) => {
    this.setState({ isErrorOnExternalTestSteps: false })
    var dataChoice = await event.target.value;
    if (this.state.externalTestSteps !== await dataChoice) {
      this.setState({ externalTestSteps: await dataChoice })
      TestScriptData.ExternalTestSteps = await await dataChoice;
    }

  };

  generateExternalTestScripts = async (event) => {
    await event.preventDefault();
    var allSteps = this.state.externalTestSteps.toString().trim();
    if (allSteps === '') {
      this.setState({ isErrorOnExternalTestSteps: true });
      return await this.getNotification('error', 'Manual test steps can not be blank.');
    }
    this.setState({ isPageLoading: true });
    var isSaved = await TestScriptGetter.generateAutomatedStep();
    this.setState({ isPageLoading: false });
    if (await isSaved) {
      this.setState({ testName: TestScriptData.TestName });
      this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps });
      this.setState({ dependentCustomFunction: TestScriptData.DependentCustomFunction });
      this.setState({ testDataTableHeader: TestScriptData.TestDataTableHeader })
      this.setState({ listOfTestScriptData: TestScriptData.ListOfTestScriptData })
      await this.getNotification('success', 'Automated step generated , Please dubug your test steps before saving the test scripts');
    }
    else {
      return await this.getNotification('error', 'Unable to generate test step because of ' + Config.ErrorMessage);
    }
  }

  onChangeHandler = async (event) => {
    event.preventDefault()
    var selectedRow = await this.state.selectedRowFromTestStepsTable;
    if(await selectedRow === undefined || await selectedRow === '')
    {
      return await this.getNotification('error', 'Please select test step before uploading the file.');
    }
    var selectId = await Number(await selectedRow);
    if(await selectId > 0)
    {
      var actionName = await TestScriptData.ListOfTestSteps[await Number(selectId)-1]['action'];
      if(await actionName ==='FileUpload')
      {
          this.setState({isPageLoading:true})
          var selectedFile = await event.target.files[0];
          var fileUploadDetails = await TestScriptGetter.uploadFileToServer(await selectedFile);
          if(await fileUploadDetails['isSuccess'])
          {
             this.setState({isFileUploadButtonDisplayed:false});
             TestScriptData.IsFileUploadButtonDisplayed = false;
             TestScriptData.ListOfTestSteps[await Number(selectId)-1]['value'] = await fileUploadDetails['fileName'];
             this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps }); });
             await this.getNotification('success', 'File is saved on server , now you can debug and execute your test scripts');
          }
          else{
            await this.getNotification('error', 'Unable to upload file because of '+await fileUploadDetails['errorMessage']);
          }
          this.setState({isPageLoading:false})
      }
      else{
        return await this.getNotification('error', 'File Upload is only valid for method FileUpload');
      }
    }
    else{
      return await this.getNotification('error', 'Selected Test step number '+ selectId+ ' is not Valid. Please refresh the page and try again.');
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
    const selectTestDataSet = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromTestDataSetTable,
      selected: [this.state.selectedRowFromTestDataSetTable]
    };
    const selectRowCommonTestDataTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromCommonTestDataTable,
      selected: [this.state.selectedRowFromCommonTestDataTable]
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
        className="testscriptpage"
        title="UI Test Script"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <NotificationSystem ref={this.notificationSystem} />
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <UncontrolledAccordion >
                <AccordionItem>
                  <AccordionHeader targetId="1">Paste your manual test case</AccordionHeader>
                  <AccordionBody accordionId="1">
                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <FormGroup row>
                          <Label sm={4}>
                            Paste Manual Test Steps
                          </Label>
                          <Col>
                            <Input type="textarea" name="manualtestStep" invalid={this.state.isErrorOnExternalTestSteps} value={this.state.externalTestSteps} onChange={this.pasteExternalTestSteps.bind(this)}>
                            </Input>
                          </Col>
                          <Col>
                            <ButtonGroup size="sm">
                              <Button color='dark' onClick={this.generateExternalTestScripts.bind(this)}>
                                <small>Generate Automated Script</small>
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </AccordionBody>
                </AccordionItem>
              </UncontrolledAccordion >
            </Col>
          </Row>
          <Row >
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Basic Details
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.saveTestScript.bind(this)}>
                        <small>Save</small>
                      </Button>
                      <Button color='info' onClick={this.deleteTestScript.bind(this)}>
                        <small>Delete</small>
                      </Button>
                      <Button color='dark' disabled={this.state.isRenameButtonDisabled} onClick={this.renameTestScript.bind(this)}>
                        <small>Rename</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={5}>
                        Component
                      </Label>
                      <Col >
                        <Combobox
                          value={this.state.selectedComponent}
                          data={this.state.allComponentList}
                          onSelect={this.selectComponent.bind(this)}
                          onChange={this.addNewComponent.bind(this)}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={5}>
                        Test Id
                      </Label>
                      <Col>
                        <Combobox
                          value={this.state.testId}
                          data={this.state.allTestId}
                          onSelect={this.selectTestId.bind(this)}
                          onChange={this.addNewTestId.bind(this)}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={5}>
                        Test Name
                      </Label>
                      <Col>
                        <Input type="input" name="testName" invalid={this.state.isErrorOnTestName} value={this.state.testName} onChange={this.addTestName.bind(this)}>
                        </Input>
                      </Col>
                    </FormGroup>
                    {this.state.isNewNameSectionDisplayed && (<FormGroup row>
                      <Label sm={5}>
                        New Name
                      </Label>
                      <Col>
                        <Input type="input" name="newName" invalid={this.state.isErrorOnNewName} value={this.state.newName} onChange={this.addNewNameForTestScript.bind(this)}>
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
                    Debug Test script
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
                    Automate Manual Test Steps
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
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <UncontrolledAccordion >
                        <AccordionItem>
                          <AccordionHeader targetId="1">Select Pre-Dependent Page</AccordionHeader>
                          <AccordionBody accordionId="1">
                            <Row>
                              <Col lg={12} md={12} sm={12} xs={12}>
                                <Card>
                                  <CardHeader>
                                    <div className="d-flex justify-content-between align-items-center">
                                      Page Function
                                      <ButtonGroup size="sm" >
                                        <Button color='dark' onClick={this.addNewRowInCustomFunctionTable.bind(this)}>
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
                                        columns={DependentCustomFunctionHeader}
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
                                              if (newValue.toLowerCase().includes('args.')) {
                                                row.parameter = newValue.toUpperCase();
                                              }
                                            }
                                            this.setState({ dependentCustomFunction: TestScriptData.DependentCustomFunction })
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
                        afterSaveCell: (oldValue, newValue, row, column, columnIndex) => {
                          if (column.dataField === 'action') {
                            var actionName = row.action;
                            var customFunName = TestScriptData.CustomFunctionNameWithListOfArgument[actionName];
                            if (customFunName !== undefined) {
                              row.value = customFunName.toString();
                            }
                            else {
                              if (row.value.toString().toLowerCase().includes('args.')) {
                                row.value = '';
                              }
                            }
                          }
                          else if (column.dataField === 'stepdefinition') {
                            this.setState({isFileUploadButtonDisplayed:false});
                            TestScriptData.IsFileUploadButtonDisplayed = false;
                            var testStep = row.stepdefinition;
                            if (testStep.trim() !== '') {
                              if ((row.element === undefined || row.element === '') && (row.action === undefined || row.action === '')) {
                                this.setState({ isPageLoading: true });
                                this.setState({ isPageLoading: true })
                                var myData = TestScriptGetter.getactionandElementFromTestStep(testStep);
                                Promise.resolve(myData).then((values) => {
                                  this.setState({ isPageLoading: false })
                                  var actionName = values.actionName
                                  if (actionName !== '') {
                                    var elementName = values.orLogicalName.trim().toUpperCase();
                                    var locator = values.primaryLocator;
                                    var locatorProperty = values.primaryLocatorProperty;
                                    row.action = actionName;
                                    var isKeyAlreadyPresent = TestScriptData.TestScriptORData[elementName];
                                    var newElementAdd = { locator: locator, locatorproperty: locatorProperty, alternatexpath: '' }
                                    if (isKeyAlreadyPresent === undefined) {
                                      TestScriptData.AllORData[elementName] = {};
                                      TestScriptData.AllORData[elementName] = newElementAdd;
                                      TestScriptData.TestScriptORData[elementName] = {};
                                      TestScriptData.TestScriptORData[elementName] = newElementAdd;
                                      if (!TestScriptData.AllORKey.includes(elementName)) {
                                        TestScriptData.AllORKey.push(elementName)
                                      }

                                    }
                                    TestScriptData.ListOfTestSteps[Number(row.id) - 1]['action'] = actionName;
                                    TestScriptData.ListOfTestSteps[Number(row.id) - 1]['element'] = elementName;
                                    this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps }); });
                                  }
                                })
                              }
                            }
                          }
                          this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps })
                          // this.setState({ listOfTestSteps: [] }, () => { this.setState({ listOfTestSteps: TestScriptData.ListOfTestSteps }); });
                        },
                        onStartEdit: (row, column, rowIndex, columnIndex) => {
                          if (columnIndex === 3) {
                            if (row.stepdefinition.toString().trim() !== '' && row.action.toString().trim() !== '') {
                              if (row.element.toString().trim() === '') {
                                TestScriptData.ORElementName = ''
                                TestScriptData.Locator = ''
                                TestScriptData.LocatorProperty = ''
                              }
                              else {
                                TestScriptData.ORElementName = row.element.toString();
                                try {
                                  TestScriptData.Locator = TestScriptData.AllORData[row.element.toString()]['locator'];
                                  if (TestScriptData.Locator === undefined) {
                                    TestScriptData.Locator = ''
                                  }
                                  TestScriptData.LocatorProperty = TestScriptData.AllORData[row.element.toString()]['locatorproperty'];
                                  if (TestScriptData.LocatorProperty === undefined) {
                                    TestScriptData.LocatorProperty = ''
                                  }
                                }
                                catch (error) { }
                              }
                              this.setState({ isErrorOnLocatorProperty: false })
                              this.setState({ orElementName: TestScriptData.ORElementName })
                              this.setState({ locator: TestScriptData.Locator })
                              this.setState({ locatorProperty: TestScriptData.LocatorProperty })
                              this.setState({ rowIndexForOR: Number(row.id) - 1 })
                              TestScriptData.IsOrModalVisible = true;
                              this.setState({ isOrModalVisible: TestScriptData.IsOrModalVisible });
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
          <Row>
            <UncontrolledAccordion >
              <AccordionItem>
                <AccordionHeader targetId="1">Add or Select Test Data</AccordionHeader>
                <AccordionBody accordionId="1">
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <Card>
                        <CardHeader>
                          <div className="d-flex justify-content-between align-items-center">
                            Add or Select data
                            <ButtonGroup size="sm">
                              {/* <Button color='dark'>
                              <small>Common Data</small>
                            </Button>
                            <Button color='info'>
                              <small>Test Data</small>
                            </Button> */}
                              <Button color='dark' onClick={this.openUtilityData.bind(this)}>
                                <small>Utility Data</small>
                              </Button>
                            </ButtonGroup>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                              <Card>
                                <CardHeader>
                                  <div className="d-flex justify-content-between align-items-center">
                                    Common Data Set
                                    <ButtonGroup size="sm">
                                      <Button color='dark' onClick={this.addNewData.bind(this)}>
                                        <small>Add</small>
                                      </Button>
                                      <Button color='info' onClick={this.deleteTestData.bind(this)}>
                                        <small>Delete</small>
                                      </Button>
                                    </ButtonGroup>
                                  </div>
                                </CardHeader>
                                <CardBody>
                                  <Col>
                                    <BootstrapTable
                                      keyField='id'
                                      data={this.state.allCommonTestData}
                                      columns={CommonTestDataHeaderTable}
                                      wrapperClasses="table-responsive"
                                      striped
                                      hover
                                      condensed
                                      selectRow={selectRowCommonTestDataTable}
                                      cellEdit={cellEditFactory({
                                        mode: 'click',
                                        blurToSave: true,
                                        nonEditableRows: () => this.state.commonTestDataNonEditableRows,
                                        afterSaveCell: (oldValue, newValue, row, column) => {
                                          if (column.dataField === 'key') {
                                            row.key = row.key.toString().trim().toUpperCase();
                                          }
                                          var keyName = row.key.toString().trim();
                                          if (keyName !== '') {
                                            try {
                                              var keyValue = ''
                                              keyValue = row.value.toString().trim();
                                            }
                                            catch (error) { }
                                            TestScriptData.TestDataToAdd[keyName] = keyValue;
                                            TestScriptData.CommonTestDataWithKeyValue[keyName] = keyValue;
                                          }

                                        },
                                      })}
                                      pagination={paginationFactory()}
                                      filter={filterFactory()}
                                    />
                                  </Col>
                                </CardBody>
                              </Card>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                              <Card>
                                <CardHeader>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <FormGroup row>
                                      <Col>
                                        <Input sm={3} placeholder="Add column" type="input" name="columnName" invalid={this.state.isErrorOnColumnName} value={this.state.columnName} onChange={this.addColumnName.bind(this)}></Input>
                                      </Col>
                                      <Col>
                                        <ButtonGroup size="sm">
                                          <Button color='dark' onClick={this.addNewColumnInTestData.bind(this)}>
                                            <small>Add Column</small>
                                          </Button>
                                          <Button color='info' onClick={this.deleteColumnFromTestData.bind(this)}>
                                            <small>Delete Column</small>
                                          </Button>
                                          <Button color='dark' onClick={this.addNewRowInTestData.bind(this)}>
                                            <small>Add Row</small>
                                          </Button>
                                          <Button color='info' onClick={this.deleteRowInTestData.bind(this)}>
                                            <small>Delete Row</small>
                                          </Button>
                                        </ButtonGroup>
                                      </Col>
                                    </FormGroup>
                                  </div>
                                </CardHeader>
                                <CardBody>
                                  <Col>
                                    <BootstrapTable
                                      keyField='id'
                                      data={this.state.listOfTestScriptData}
                                      columns={this.state.testDataTableHeader}
                                      wrapperClasses="table-responsive"
                                      striped
                                      hover
                                      condensed
                                      selectRow={selectTestDataSet}
                                      cellEdit={cellEditFactory({
                                        mode: 'click',
                                        blurToSave: true,
                                        afterSaveCell: (oldValue, newValue, row, column) => {
                                          this.setState({ listOfTestScriptData: TestScriptData.ListOfTestScriptData })
                                        },
                                      })}
                                    />
                                  </Col>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </AccordionBody>
              </AccordionItem>
            </UncontrolledAccordion >
          </Row>
          <Draggable>
            <Offcanvas style={{ width: 1000, height: '400px', 'background-color': 'lightblue' }} returnFocusAfterClose={true} isOpen={this.state.isInspectorWindowOpen} toggle={this.toggleInspectorWindow.bind(this)} direction="start" backdrop={false} >
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
                      <DropDownOptions options={TestScriptData.AllLocatorList} />
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
export default TestScriptPage;
