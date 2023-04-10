import Page from '../../Page';
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
  ButtonGroup,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
  Modal, ModalHeader,
  ModalBody,
  ModalFooter,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Fade,
} from 'reactstrap';
import { TestScriptData } from './TestScriptData'
import TestScriptGetter from './TestScriptGetter';
import {
  RequestVariableTableHeader,
  AsserionTableHeader,
  RequestHttpTableHeader,
  DependentApiTableHeader,
  DependentResponseKeyTableHeader,
  StringDataHeader,
}
  from './TestScriptTableHeader'
import { ResponseAsserionTableHeader } from '../ExecutionLab/ExecutionTableHeader'
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import NotificationSystem from 'react-notification-system';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { PagiNationData } from '../../PaginationData'
import "react-widgets/styles.css";
import { Combobox } from 'react-widgets'
import ReactJson from 'react-json-view'
import DataGetter from '../../DataGetter';
import GetData from '../../../QAautoMATER/funcLib/getData';
import { DynamicData } from '../../../QAautoMATER/dynamicData/DynamicData';
import filterFactory from 'react-bootstrap-table2-filter';
import { Config } from '../../../QAautoMATER/Config';
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';

class TestScriptPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //****** Basic Details  ***********************************************************
      allComponentList: TestScriptData.AllComponentList,
      componentName: TestScriptData.ComponentName,
      isErrorOnComponentName: TestScriptData.IsErrorOnComponentName,
      allTestId: TestScriptData.AllTestId,
      testId: TestScriptData.TestId,
      IsErrorOnTestId: TestScriptData.IsErrorOnTestId,
      testName: TestScriptData.TestName,
      isErrorOnTestName: TestScriptData.IsErrorOnTestName,
      allHttpMethodName: TestScriptData.AllHttpMethodName,
      httpMethod: TestScriptData.HttpMethod,
      isErrorOnHttpMethod: TestScriptData.IsErrorOnHttpMethod,
      isErrorOnNewTestId: TestScriptData.IsErrorOnNewTestId,
      newTestId: TestScriptData.NewTestId,
      isRenameTestIdVisible:TestScriptData.IsRenameTestIdVisible,

      //****** Url Details  ***********************************************************
      allEnvironmentList: TestScriptData.AllEnvironmentList,
      selectedEnvironmentName: TestScriptData.SelectedEnvironmentName,
      isErrorOnEnvironment: TestScriptData.IsErrorOnEnvironment,
      allComponentUrlLIst: TestScriptData.AllComponentUrlLIst,
      selectedComponentUrl: TestScriptData.SelectedComponentUrl,
      isErrorOnComponentUrl: TestScriptData.IsErrorOnComponentUrl,
      apiUrl: TestScriptData.ApiUrl,
      validateApiUrl: TestScriptData.ValidateApiUrl,
      relativeUrl: TestScriptData.RelativeUrl,
      allAutherizationList: TestScriptData.AllAutherizationList,
      selectedAutherization: TestScriptData.SelectedAutherization,
      testingType: TestScriptData.TestingType,

      //****** Choose Existing API Details ***********************************************************
      // dependentComponentName: TestScriptData.DependentComponentName,
      // validateDependentComponent: TestScriptData.ValidateDependentComponent,
      // dependentTestId: TestScriptData.DependentTestId,
      // validateDependentTestId: TestScriptData.ValidateDependentTestId,
      // apiResponseModalView: false,
      // apiResponseData: TestScriptData.ApiResponseData,
      // apiVariableData: TestScriptData.ApiVariableData,
      // isExistingComponentandTestIDselected: false,
      // dependentResponseKeyData: TestScriptData.DependentResponseKeyData,
      // selectedRowDependentResponseKeyTable: TestScriptData.SelectedRowDependentResponseKeyTable,
      // dependentApiDataTable: TestScriptData.DependentApiDataTable,
      // selectedRowFromDependentApiTable: TestScriptData.SelectedRowFromDependentApiTable,

      dependentApiDataTable: TestScriptData.DependentApiDataTable,
      selectedRowFromDependentApiTable: TestScriptData.SelectedRowFromDependentApiTable,

      //****** Request Param Table  **************************************
      // allRequestParamData: TestScriptData.AllRequestParamData,
      // selectedRowFromRequestParamTable: TestScriptData.SelectedRowFromRequestParamTable,

      //****** Request Http Header Table  **************************************
      allHttpHeaderData: TestScriptData.AllHttpHeaderData,
      selectedRowFromRequestHeaderable: TestScriptData.SelectedRowFromRequestHeaderable,

      //****** Request Body Table  **************************************
      allRequestBody: TestScriptData.AllRequestBody,
      isDynamicDataButtonDisable: TestScriptData.IsDynamicDataButtonDisable,
      selectedKeyNameInRequestBody: '',
      selectedKeyNameSpaceinRequestBody: [],
      testDataModal: false,
      dynamicDataValue: '',
      selectedRowFromDynamicDataTable: TestScriptData.SelectedRowFromDynamicDataTable,

      // //****** Save Request  parameter  *********************************************
      allRequestVariables: TestScriptData.AllRequestVariables,
      selectedRowForRequestVariableTable: TestScriptData.SelectedRowForRequestVariableTable,

      //****** Assertion Table  **************************************
      allAssertionData: TestScriptData.AllAssertionData,
      selectedRowForAssertionTable: TestScriptData.SelectedRowForAssertionTable,
      responseAssertionData: TestScriptData.ResponseAssertionData,

    };

  }
  componentWillMount = async () => {
    window.scrollTo(0, 0);
    await TestScriptGetter.apiTestScriptPageLoadData();

    //****** Basic Details ***********************************************************
    await this.setState({ allComponentList: TestScriptData.AllComponentList });
    await this.setState({ componentName: TestScriptData.ComponentName });
    await this.setState({ isErrorOnComponentName: TestScriptData.IsErrorOnComponentName });
    await this.setState({ allTestId: TestScriptData.AllTestId });
    await this.setState({ testId: TestScriptData.TestId });
    await this.setState({ isErrorOnTestId: TestScriptData.IsErrorOnTestId });
    await this.setState({ testName: TestScriptData.TestName });
    await this.setState({ isErrorOnTestName: TestScriptData.IsErrorOnTestName });
    await this.setState({ allHttpMethodName: TestScriptData.AllHttpMethodName });
    await this.setState({ httpMethod: TestScriptData.HttpMethod });
    await this.setState({ isErrorOnHttpMethod: TestScriptData.IsErrorOnHttpMethod });

    //****** Url Details ***********************************************************
    await this.setState({ allEnvironmentList: TestScriptData.AllEnvironmentList });
    await this.setState({ selectedEnvironmentName: TestScriptData.SelectedEnvironmentName });
    await this.setState({ isErrorOnEnvironment: TestScriptData.IsErrorOnEnvironment });
    await this.setState({ allComponentUrlLIst: TestScriptData.AllComponentUrlLIst });
    await this.setState({ selectedComponentUrl: TestScriptData.SelectedComponentUrl });
    await this.setState({ isErrorOnComponentUrl: TestScriptData.IsErrorOnComponentUrl });
    await this.setState({ apiUrl: TestScriptData.ApiUrl });
    await this.setState({ validateApiUrl: TestScriptData.ValidateApiUrl });
    await this.setState({ relativeUrl: TestScriptData.RelativeUrl });
    await this.setState({ allAutherizationList: TestScriptData.AllAutherizationList });
    await this.setState({ selectedAutherization: TestScriptData.SelectedAutherization });

    //****** Choose Existing API Details ***********************************************************
    // await this.setState({ dependentComponentName: TestScriptData.DependentComponentName });
    // await this.setState({ validateDependentComponent: TestScriptData.ValidateDependentComponent });
    // await this.setState({ dependentTestId: TestScriptData.DependentTestId });
    // await this.setState({ validateDependentTestId: TestScriptData.ValidateDependentTestId });
    // await this.setState({ apiVariableData: TestScriptData.ApiVariableData });
    // await this.setState({ apiResponseData: TestScriptData.ApiResponseData });
    // await this.setState({ dependentResponseKeyData: TestScriptData.DependentResponseKeyData });
    // await this.setState({ selectedRowDependentResponseKeyTable: TestScriptData.SelectedRowDependentResponseKeyTable });
    // await this.setState({ dependentApiDataTable: TestScriptData.DependentApiDataTable });
    // await this.setState({ selectedRowFromDependentApiTable: TestScriptData.SelectedRowFromDependentApiTable });
    await this.setState({ dependentApiDataTable: TestScriptData.DependentApiDataTable });
    await this.setState({ selectedRowFromDependentApiTable: TestScriptData.SelectedRowFromDependentApiTable });

    //****** Request Param table Data ****************************************************
    // await this.setState({ allRequestParamData: TestScriptData.AllRequestParamData });
    // await this.setState({ selectedRowFromRequestParamTable: TestScriptData.SelectedRowFromRequestParamTable });

    //****** Request Header table Data ****************************************************
    await this.setState({ allHttpHeaderData: TestScriptData.AllHttpHeaderData });
    await this.setState({ selectedRowFromRequestHeaderable: TestScriptData.SelectedRowFromRequestHeaderable });

    //****** Request Body Table  **************************************
    await this.setState({ allRequestBody: TestScriptData.AllRequestBody });
    await this.setState({ isDynamicDataButtonDisable: TestScriptData.IsDynamicDataButtonDisable });
    await this.setState({ selectedRowFromDynamicDataTable: TestScriptData.SelectedRowFromDynamicDataTable });

    // //****** Save Request parameter  **************************************
    await this.setState({ allRequestVariables: TestScriptData.AllRequestVariables });
    await this.setState({ selectedRowForRequestVariableTable: TestScriptData.SelectedRowForRequestVariableTable });

    //****** Assetion Table *****************************************************************
    await this.setState({ allAssertionData: TestScriptData.AllAssertionData });
    await this.setState({ selectedRowForAssertionTable: TestScriptData.SelectedRowForAssertionTable });

  }

  //************************* Notification ***************************************************************
  async getNotification(level, message) {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: message,
      level: level,
      autoDismiss: 10,
    });
  }


  //************************* Basic Details ***************************************************************

  selectComponent = async (event) => {
    var dataChoice = await event;
    if (this.state.componentName !== await dataChoice) {
      TestScriptData.ComponentName = await dataChoice;
      this.setState({ componentName: TestScriptData.ComponentName })
      this.setState({ allTestId: [] })
      this.setState({ testId: '' })
      this.setState({ testName: '' })
      await TestScriptGetter.getTestScriptListFromComponent(await dataChoice);
      this.setState({ allTestId: TestScriptData.AllTestId })
      this.setState({ isErrorOnComponentName: false });
      TestScriptData.IsValidComponentName = true;
      TestScriptData.IsRenameTestIdVisible=false;
      this.setState({isRenameTestIdVisible:TestScriptData.IsRenameTestIdVisible});
    }
  }

  addNewComponent = async (event) => {
    var dataChoice = await event;
    if (this.state.componentName !== await dataChoice) {
      var format = /[^A-Za-z0-9-]/ig;
      TestScriptData.ComponentName = await dataChoice;
      this.setState({ componentName: TestScriptData.ComponentName })
      TestScriptData.IsRenameTestIdVisible=false;
      this.setState({isRenameTestIdVisible:TestScriptData.IsRenameTestIdVisible});
      this.setState({ allTestId: [] })
      this.setState({ testId: '' })
      this.setState({ testName: '' })
      if(dataChoice.toString().trim() ==='')
      {
        this.setState({ isErrorOnComponentName: true });
        TestScriptData.IsValidComponentName = false;
        return;
      }
      if (format.test(await dataChoice)) {
        this.setState({ isErrorOnComponentName: true });
        TestScriptData.IsValidComponentName = false;
      }
      else {
        TestScriptData.IsValidComponentName = true;
        this.setState({ isErrorOnComponentName: false });
      }
    }
  }

  selectTestId = async (event) => {
    var dataChoice = await event;
    if (this.state.testId !== await dataChoice) {
      TestScriptData.TestId = await dataChoice;
      this.setState({ testId: TestScriptData.TestId })
      await TestScriptGetter.getAllAPITestAttribute();
      this.setState({ testName: TestScriptData.TestName })
      this.setState({ httpMethod: TestScriptData.HttpMethod })
      this.setState({ selectedComponentUrl: TestScriptData.SelectedComponentUrl })
      this.setState({ relativeUrl: TestScriptData.RelativeUrl })
      this.setState({ selectedAutherization: TestScriptData.SelectedAutherization })
      this.setState({ allHttpHeaderData: TestScriptData.AllHttpHeaderData })
      this.setState({ allRequestBody: TestScriptData.AllRequestBody })
      this.setState({ allRequestVariables: TestScriptData.AllRequestVariables })
      this.setState({ allAssertionData: TestScriptData.AllAssertionData })
      this.setState({ dependentApiDataTable: TestScriptData.DependentApiDataTable })
      this.setState({ apiUrl: TestScriptData.ApiUrl })
      this.setState({ isErrorOnTestId: false });
      this.setState({ isErrorOnTestName: false });
      TestScriptData.IsRenameTestIdVisible=true;
      this.setState({isRenameTestIdVisible:TestScriptData.IsRenameTestIdVisible});
      TestScriptData.IsValidTestId = true;
    }
  }

  addNewTestId = async (event) => {
    var dataChoice = await event;
    if (this.state.testId !== await dataChoice) {
      var format = /[^A-Za-z0-9-]/ig;
      TestScriptData.TestId = await dataChoice;
      this.setState({ testId: TestScriptData.TestId })
      TestScriptData.IsRenameTestIdVisible=false;
      this.setState({isRenameTestIdVisible:TestScriptData.IsRenameTestIdVisible});
      if (await dataChoice.toString().trim() === '') {
        this.setState({ isErrorOnTestId: true });
        TestScriptData.IsValidTestId = false;
        return;
      }
      if (format.test(await dataChoice)) {
        this.setState({ isErrorOnTestId: true });
        TestScriptData.IsValidTestId = false;
      }
      else {
        this.setState({ isErrorOnTestId: false });
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
      var format = /[^A-Za-z0-9- ]/ig;
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

  addHttpMethod = async (event) => {
    this.setState({ isErrorOnHttpMethod: false })
    var dataChoice = await event.target.value;
    if (this.state.httpMethod !== await dataChoice) {
      this.setState({ httpMethod: await dataChoice });
      TestScriptData.HttpMethod = await dataChoice;
      if (await dataChoice === 'Post' || await dataChoice === 'Put' || await dataChoice === 'Patch') {
        var myData = this.state.allRequestBody;
        if (myData['1'] === undefined) {
          myData['1'] = ''
          myData['1'] = 'placeholder for request body';
          this.setState({ allRequestBody: myData })
          TestScriptData.AllRequestBody = myData;
        }
      }
      else {
        this.setState({ allRequestBody: {} });
        TestScriptData.AllRequestBody = {};
      }
      if (await dataChoice.toString().trim() === '') {
        this.setState({ isErrorOnHttpMethod: true })
        TestScriptData.IsValidHttpMethod = false;
      }
      else {
        this.setState({ isErrorOnHttpMethod: false })
        TestScriptData.IsValidHttpMethod = true;
      }
    }

  };

  renameExistingTestId = async (event) => {
    this.setState({ isErrorOnNewTestId: false })
    var dataChoice = await event.target.value;
    if (this.state.newTestId !== await dataChoice) {
      this.setState({ newTestId: await dataChoice });
      TestScriptData.NewTestId = await dataChoice;
      if (await dataChoice.trim() === '') {
        this.setState({ isErrorOnNewTestId: true });
        TestScriptData.IsValidNewTestId = false;
        return;
      }
      var format = /[^A-Za-z0-9-]/ig;
      if (format.test(await dataChoice)) {
        this.setState({ isErrorOnNewTestId: true });
        TestScriptData.IsValidNewTestId = false;
      }
      else {
        this.setState({ isErrorOnNewTestId: false });
        TestScriptData.IsValidNewTestId = true;
      }
    }

  };

  renameTestId = async (event) => {
    await event.preventDefault();
    var existingTestId = TestScriptData.TestId.trim();
    var existingComponent = TestScriptData.ComponentName.trim();
    if (existingTestId.toString().trim() === '') {
      return await this.getNotification('error', "Please choose any existing TestId from 'BASIC DETAILS' section.");
    }
    if (existingComponent.toString().trim() === '') {
      return await this.getNotification('error', "Please choose any existing Component from 'BASIC DETAILS' section.");
    }
    var matchingIndex = await GetData.getIndexForArrayItem(TestScriptData.AllTestId, existingTestId.toString().trim());
    if (Number(await matchingIndex) >= 0) {
      var newTestId = await TestScriptData.NewTestId;
      if (newTestId.toString().toString().trim() === '') {
        this.setState({ isErrorOnNewTestId: true });
        return await this.getNotification('error', "New Test Id can not be blank");
      }
      if (newTestId.toString().trim().toLocaleLowerCase() === existingTestId.toString().trim().toLocaleLowerCase()) {
        this.setState({ isErrorOnNewTestId: true });
        return await this.getNotification('error', "New Test Id can not be same");
      }
      if (!TestScriptData.IsValidNewTestId) {
        this.setState({ isErrorOnNewTestId: true });
        return await this.getNotification('error', "New Test Id is not in correct format");
      }
      this.setState({ isPageLoading: true });
      var isRename = await TestScriptGetter.renameTestId();
      this.setState({ isPageLoading: false });
      if (isRename) {
        return await this.getNotification('success', "New Test Id is successfully updated");
      }
      else{
        return await this.getNotification('error', "Unable to rename new Test Id");
      }
    }
    else {
      return await this.getNotification('error', "Test Id not found on the server");
    }
  }

  //************************* Url Details **********************************************

  selectEnvironment = async (event) => {
    this.setState({ isErrorOnEnvironment: false });
    var dataChoice = await event.target.value;
    if (this.state.selectedEnvironmentName !== await dataChoice) {
      this.setState({ validateApiUrl: false });
      this.setState({ selectedEnvironmentName: await dataChoice });
      TestScriptData.SelectedEnvironmentName = await dataChoice;
      await TestScriptGetter.selectEnvironment(await dataChoice);
      this.setState({ allComponentUrlLIst: TestScriptData.AllComponentUrlLIst })
      this.setState({ selectedComponentUrl: TestScriptData.SelectedComponentUrl })
      this.setState({ apiUrl: TestScriptData.ApiUrl })
      if (await dataChoice.toString().trim() === '') {
        this.setState({ isErrorOnEnvironment: true });
        TestScriptData.IsValidEnvironment = false;
      }
      else {
        this.setState({ isErrorOnEnvironment: false });
        TestScriptData.IsValidEnvironment = true;
      }
    }

  };

  selectComponentUrl = async (event) => {
    this.setState({ isErrorOnComponentUrl: false });
    var dataChoice = await event.target.value;
    if (this.state.selectedComponentUrl !== await dataChoice) {
      this.setState({ validateApiUrl: false });
      this.setState({ selectedComponentUrl: await dataChoice });
      TestScriptData.SelectedComponentUrl = await dataChoice;
      await TestScriptGetter.setApiUrlAfterSelectingComponent(TestScriptData.SelectedEnvironmentName, await dataChoice);
      this.setState({ apiUrl: TestScriptData.ApiUrl });
      if (await dataChoice.toString().trim() === '') {
        this.setState({ isErrorOnComponentUrl: true });
        TestScriptData.IsValidComponentUrl = false;
      }
      else {
        this.setState({ isErrorOnComponentUrl: false });
        TestScriptData.IsValidComponentUrl = true;
      }
    }

  };

  addApiUrl = async (event) => {
    this.setState({ validateApiUrl: false });
    var dataChoice = await event.target.value;
    if (this.state.apiUrl !== await dataChoice) {
      this.setState({ apiUrl: await dataChoice });
      TestScriptData.ApiUrl = await dataChoice;
    }

  };

  addRelativeUrl = async (event) => {
    var dataChoice = await event.target.value;
    if (this.state.relativeUrl !== await dataChoice) {
      this.setState({ relativeUrl: await dataChoice });
      TestScriptData.RelativeUrl = await dataChoice;
    }

  };

  selectAutherization = async (event) => {
    var dataChoice = await event.target.value;
    if (this.state.selectedAutherization !== await dataChoice) {

      this.setState({ selectedAutherization: await dataChoice });
      TestScriptData.SelectedAutherization = await dataChoice;
    }

  };

  selectTestingType = async (event) => {
    var selectedTestingType = await event.target.value;
    if (this.state.testingType !== await selectedTestingType) {
      this.setState({ testingType: await selectedTestingType })
      TestScriptData.TestingType = await selectedTestingType;
    }

  };

  //************************* CHOOSE EXISTING API section *****************************************

  // selectDependentComponent = async (event) => {
  //   this.setState({ validateDependentComponent: false });
  //   var dataChoice = await event.target.value;
  //   if (this.state.dependentComponentName !== await dataChoice) {
  //     TestScriptData.DependentComponentName = await dataChoice;
  //     this.setState({ dependentComponentName: await dataChoice })
  //     this.setState({ dependentTestId: '' })
  //     if (await dataChoice.trim() === '') {
  //       return this.setState({ validateDependentComponent: true });
  //     }
  //     await TestScriptGetter.getTestScriptListFromComponent(await dataChoice);
  //     this.setState({ allTestId: TestScriptData.AllTestId })
  //   }
  // }

  // selectDependentTestId = async (event) => {
  //   var dataChoice = await event.target.value;
  //   this.setState({ validateDependentTestId: false });
  //   if (this.state.dependentTestId !== await dataChoice) {
  //     TestScriptData.DependentTestId = await dataChoice;
  //     this.setState({ dependentTestId: await dataChoice })
  //     if (await dataChoice.trim() === '') {
  //       return this.setState({ validateDependentTestId: true });
  //     }
  //     this.setState({ dependentResponseKeyData: [{id:1,key:'',value:''}] });
  //     this.setState({ SelectedRowDependentResponseKeyTable: '' });
  //   }
  // }

  // debugDependentTestScript = async (event) => {
  //   var isExistingApiDetailsFilled = false;
  //   var depComponentName = this.state.dependentComponentName;
  //   if (depComponentName.trim() === '') {
  //     this.setState({ validateDependentComponent: true });
  //     isExistingApiDetailsFilled = true;
  //   }
  //   var depTestId = this.state.dependentTestId;
  //   if (depTestId.trim() === '') {
  //     this.setState({ validateDependentTestId: true });
  //     isExistingApiDetailsFilled = true;
  //   }
  //   if (isExistingApiDetailsFilled) {
  //     return await this.getNotification('error', "Please add correct details for highlighted filed from Choose Existing Api section.");
  //   }
  //   await TestScriptGetter.getApiRequestAndResponseData(depComponentName, depTestId);
  //   await this.setState({ apiResponseData: TestScriptData.ApiResponseData })
  //   await this.setState({ apiVariableData: TestScriptData.ApiVariableData })
  //   await this.setState({ apiResponseModalView: true });
  // }

  // addDependentResponseKey = async (event) => {
  //   await event.preventDefault();
  //   var isExistingApiDetailsFilled = false;
  //   var depComponentName = this.state.dependentComponentName;
  //   if (depComponentName.trim() === '') {
  //     this.setState({ validateDependentComponent: true });
  //     isExistingApiDetailsFilled = true;
  //   }
  //   var depTestId = this.state.dependentTestId;
  //   if (depTestId.trim() === '') {
  //     this.setState({ validateDependentTestId: true });
  //     isExistingApiDetailsFilled = true;
  //   }
  //   if (isExistingApiDetailsFilled) {
  //     return await this.getNotification('error', "Please add correct details for highlighted filed from Choose Existing Api section.");
  //   }
  //   var depResponseKeyData = this.state.dependentResponseKeyData;
  //   var lastId = depResponseKeyData.length + 1;
  //   var newRow = { id: lastId, key: '', value: '' }
  //   if (lastId > 1) {
  //     var perVkeyName = await depResponseKeyData[lastId - 2]['key'];
  //     var perVkeyValue = await depResponseKeyData[lastId - 2]['value'];
  //     if (perVkeyName.trim() === '' || perVkeyValue.trim() === '') {
  //       return await this.getNotification('error', "Please add correct details for key/value in 'Response Key' table");
  //     }
  //   }
  //   this.setState({ dependentResponseKeyData: [...this.state.dependentResponseKeyData, newRow] });
  //   TestScriptData.DependentResponseKeyData = this.state.dependentResponseKeyData;
  // }

  // selectRadioButtonFromDependentResponseKeyTable = async (row, isSelect) => {
  //   if (await isSelect) {
  //     TestScriptData.SelectedRowDependentResponseKeyTable = await row.id;
  //     this.setState({ selectedRowDependentResponseKeyTable: await row.id });
  //   }

  // }

  // deleteRowFromDependendentResponseKeyTable = async (event) => {
  //   await event.preventDefault();
  //   var allDataFromTable = this.state.dependentResponseKeyData;
  //   if (Number(this.state.selectedRowDependentResponseKeyTable) > 0 && Number(this.state.selectedRowDependentResponseKeyTable) <= allDataFromTable.length) {
  //     var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowDependentResponseKeyTable)
  //     this.setState({ dependentResponseKeyData: await dataAfterDelete });
  //     TestScriptData.DependentResponseKeyData = await dataAfterDelete;
  //   }
  //   else {
  //     return await this.getNotification('error', "No row is selected for delete from 'Response Key' table");
  //   }
  // }

  // saveResponseKeyDataTable = async (event) => {
  //   await event.preventDefault();
  //   var allDataFromTable = this.state.dependentResponseKeyData;
  //   var selectedRowId = this.state.selectedRowDependentResponseKeyTable;
  //   if (Number(selectedRowId) > 0 && Number(selectedRowId) <= allDataFromTable.length) {
  //     var keyNameToSave = await allDataFromTable[Number(selectedRowId) - 1]['key'];
  //     var keyValueToSave = await allDataFromTable[Number(selectedRowId) - 1]['value'];
  //     if (keyNameToSave.trim() === '' || keyValueToSave.trim() === '') {
  //       return await this.getNotification('error', "Blank key/value , Please update the correct details in 'Response Key' table");
  //     }
  //     var tableData = this.state.dependentApiDataTable;
  //     var lastId = tableData.length + 1;
  //     var keyToSend = await JSON.parse(JSON.stringify(await keyNameToSave + ":" + await keyValueToSave));
  //     var newRow = { id: lastId, component: this.state.dependentComponentName, testid: this.state.dependentTestId, key: keyToSend, sequence: lastId }
  //     if (tableData.length > 0) {
  //       var isComponentAlreadyExist = await GetData.getIndexForMatchingKeyValueinJsonArray(await tableData, 'component', this.state.dependentComponentName);
  //       if (isComponentAlreadyExist >= 0) {
  //         var isTestIdMatch = await GetData.getIndexForMatchingKeyValueinJsonArray(await tableData, 'testid', this.state.dependentTestId);
  //         if (isTestIdMatch >= 0) {
  //           var existingKey = await tableData[isTestIdMatch]['key'];
  //           var allKeyList = await existingKey.split(":");
  //           var updatedKeyName = await existingKey.split(':')[0];
  //           var updatedKeyValue = await existingKey.split(':')[1];
  //           if (updatedKeyName.toLowerCase() === await keyNameToSave.toLowerCase() && updatedKeyValue.toLowerCase() === await keyValueToSave.toLowerCase()) {
  //             return await this.getNotification('error', "Response key is already added in Dependent Api table");
  //           }
  //           else {
  //             if (updatedKeyName.toLowerCase() !== await keyNameToSave.toLowerCase()) {
  //               existingKey = await existingKey + ',' + keyToSend;
  //               existingKey = await JSON.parse(JSON.stringify(await existingKey));
  //               tableData[isTestIdMatch]['key'] = await existingKey;
  //               this.setState({ dependentApiDataTable: tableData })
  //             }
  //           }
  //         }
  //         else {
  //           this.setState({ dependentApiDataTable: [...this.state.dependentApiDataTable, newRow] });
  //         }
  //       }
  //     }
  //     else {
  //       this.setState({ dependentApiDataTable: [...this.state.dependentApiDataTable, newRow] });
  //     }
  //   }
  //   else {
  //     return await this.getNotification('error', "No row is selected from 'Response Key' table");
  //   }
  // }

  // selectRadioButtonFromDependentApiTable = async (row, isSelect) => {
  //   if (await isSelect) {
  //     TestScriptData.SelectedRowFromDependentApiTable = await row.id;
  //     this.setState({ selectedRowFromDependentApiTable: await row.id });
  //   }

  // }

  // deleteRowFromDependendentApiTable = async (event) => {
  //   await event.preventDefault();
  //   var allDataFromTable = this.state.dependentApiDataTable;
  //   if (Number(this.state.selectedRowFromDependentApiTable) > 0 && Number(this.state.selectedRowFromDependentApiTable) <= allDataFromTable.length) {
  //     var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromDependentApiTable)
  //     this.setState({ dependentApiDataTable: await dataAfterDelete });
  //     TestScriptData.DependentApiDataTable = await dataAfterDelete;
  //   }
  //   else {
  //     return await this.getNotification('error', "No row is selected for delete from 'Dependent Api' table");
  //   }
  // }

  // toggle = async () => {
  //   await this.setState({ apiResponseModalView: false });
  // }

  // wait = async (value) => {
  //   await value;
  // }

  selectRadioButtonFromDependentApiTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowFromDependentApiTable = await row.id;
      this.setState({ selectedRowFromDependentApiTable: await row.id });
    }
  }

  deleteRowFromDependendentApiTable = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.dependentApiDataTable;
    if (Number(this.state.selectedRowFromDependentApiTable) > 0 && Number(this.state.selectedRowFromDependentApiTable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromDependentApiTable)
      this.setState({ dependentApiDataTable: await dataAfterDelete });
      TestScriptData.DependentApiDataTable = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'Dependent Api' table");
    }
  }

  addNewRowForDependendentTable = async (event) => {
    await event.preventDefault();
    var tableData = this.state.dependentApiDataTable;
    var lastId = tableData.length + 1;
    var newRow = { id: lastId, component: '', testid: '', variable: 'myKey', key: 'ResponseBody[keyName]', seq: '' }
    if (lastId > 1) {
      var isDataFilled = await TestScriptGetter.isDataFilledforDependendentAPITable();
      if (!isDataFilled) {
        return await this.getNotification('error', "Please add all details for all column against each row in 'Dependendent Api' table");
      }
    }
    this.setState({ dependentApiDataTable: [...this.state.dependentApiDataTable, newRow] });
    TestScriptData.DependentApiDataTable.push(newRow);
  }

  debugDependentTestScript = async (event) => {
    await event.preventDefault();
    var apiUrl = this.state.apiUrl;
    if (await apiUrl.toString().trim() === '') {
      this.setState({ validateApiUrl: true });
      return await this.getNotification('error', "Please add correct details for highlighted filed from Choose Existing Api section.");
    }
    var selectedRowIndex = await Number(this.state.selectedRowFromDependentApiTable);
    var allDataFromTable = await this.state.dependentApiDataTable;
    if (await selectedRowIndex > 0 && await selectedRowIndex <= await allDataFromTable.length) {
      var selectedRowInfo = await allDataFromTable[selectedRowIndex - 1];
      if (await allDataFromTable[selectedRowIndex - 1]['component'] === '' || await allDataFromTable[selectedRowIndex - 1]['testid'] === '') {
        return await this.getNotification('error', "Please select component and testId for debug");
      }
      var depTestInfo = await TestScriptGetter.getDependentApiScriptAttribute(await selectedRowInfo);
      this.setState({ isPageLoading: true });
      await TestScriptGetter.callDependendtApiMethod(TestScriptData.TestingType,await apiUrl, await depTestInfo['relativeurl'], await depTestInfo['testid'], await depTestInfo['requestheader'], await depTestInfo['httpmethod'], await depTestInfo['requestbody'], await depTestInfo['childapi'], await depTestInfo['variabledata'],await depTestInfo['component'],await depTestInfo['testname']);
      this.setState({ isPageLoading: false });
      await this.setState({ apiResponseData: TestScriptData.ApiResponseData })
      await this.setState({ responseAssertionData: TestScriptData.ResponseAssertionData })
      await this.setState({ apiVariableData: TestScriptData.ApiVariableData })
      await this.setState({ apiResponseModalView: true });
      this.setState({responseAssertionData:[]})

    }
    else {
      return await this.getNotification('error', "Please select any dependendt api for debug");
    }
  }

  //***** API Response Modal *************************************************************************
  toggle = async () => {
    this.setState({ apiResponseModalView: false });
  }

  //***** Dynamic Test Data Modal *************************************************************************
  toggleTestData = async () => {
    this.setState({ testDataModal: false });
  }

  selectRadioButtonFromDynamicDataTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowFromDynamicDataTable = await row.id;
      this.setState({ selectedRowFromDynamicDataTable: await row.id });
    }

  }

  updateRequestBodyKeyData = async () => {
    var existingRequestBody ={}
    var rowChoice = Number(this.state.selectedRowFromDynamicDataTable);
    if (rowChoice > -1) {
      var dataKey = DynamicData[Number(rowChoice) - 1]['key'];
      var dataParam = DynamicData[Number(rowChoice) - 1]['custom'];
      var selectedKey = this.state.selectedKeyNameInRequestBody;
      var nameSpaceForKey = this.state.selectedKeyNameSpaceinRequestBody;
      if (selectedKey.trim() !== '') {
         existingRequestBody = this.state.allRequestBody;
        var keytoSend
        if (dataParam.trim() !== '')
          keytoSend = '{{RandomData.' + dataKey + '||' + dataParam + '}}'
        else
          keytoSend = '{{RandomData.' + dataKey + '}}'
         existingRequestBody = await TestScriptGetter.updateRequestBody(this.state.allRequestBody, await nameSpaceForKey, keytoSend);
        this.setState({ allRequestBody: {} }, () => { this.setState({ allRequestBody: existingRequestBody }); });
      }
      this.setState({ testDataModal: false });
      this.setState({ isDynamicDataButtonDisable: true });
      this.setState({ selectedRowFromDynamicDataTable: -1 });
      this.setState({ dynamicDataValue: '' });
    }
    else {
      return await this.getNotification('error', "Please select any data key before evaluating the value");
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

  //************************* Request Param Details****************************************************

  // addRowInRequestParamTable = async (event) => {
  //   await event.preventDefault();
  //   var tableData = this.state.allRequestParamData;
  //   var lastId = tableData.length + 1;
  //   var newRow = { id: lastId, key: '', value: '' }
  //   if (lastId > 1) {
  //     var perVkeyName = await tableData[lastId - 2]['key'];
  //     var perVkeyValue = await tableData[lastId - 2]['value'];
  //     if (perVkeyName.trim() === '' || perVkeyValue.trim() === '') {
  //       return await this.getNotification('error', "Please add correct details for key/value in 'Response Param' table");
  //     }
  //   }
  //   this.setState({ allRequestParamData: [...this.state.allRequestParamData, newRow] });
  //   TestScriptData.AllRequestParamData = this.state.allRequestParamData;
  // }

  // selectRadioButtonFromRequestParamTable = async (row, isSelect) => {
  //   if (await isSelect) {
  //     TestScriptData.SelectedRowFromRequestParamTable = await row.id;
  //     this.setState({ selectedRowFromRequestParamTable: await row.id });
  //   }

  // }

  // deleteRowFromRequestParamTable = async (event) => {
  //   await event.preventDefault();
  //   var allDataFromTable = this.state.allRequestParamData;
  //   if (Number(this.state.selectedRowFromRequestParamTable) > 0 && Number(this.state.selectedRowFromRequestParamTable) <= allDataFromTable.length) {
  //     var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromRequestParamTable)
  //     this.setState({ allRequestParamData: await dataAfterDelete });
  //     TestScriptData.AllRequestParamData = await dataAfterDelete;
  //   }
  //   else {
  //     return await this.getNotification('error', "No row is selected for delete from 'Request Param' table");
  //   }
  // }

  //************************* Request Header Details****************************************************

  selectRadioButtonFromRequestHeaderTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowFromRequestHeaderable = await row.id;
      this.setState({ selectedRowFromRequestHeaderable: await row.id });
    }

  }

  addRowInRequestHeaderTable = async (event) => {
    await event.preventDefault();
    var tableData = this.state.allHttpHeaderData;
    var lastId = tableData.length + 1;
    var newRow = { id: lastId, key: '', value: '' }
    if (lastId > 1) {
      var perVkeyName = await tableData[lastId - 2]['key'];
      var perVkeyValue = await tableData[lastId - 2]['value'];
      if (perVkeyName.trim() === '' || perVkeyValue.trim() === '') {
        return await this.getNotification('error', "Please add correct details for key/value in 'Response Header' table");
      }
    }
    this.setState({ allHttpHeaderData: [...this.state.allHttpHeaderData, newRow] });
    TestScriptData.AllHttpHeaderData.push(newRow);
  }

  deleteRowFromRequestHeaderTable = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.allHttpHeaderData;
    if (Number(this.state.selectedRowFromRequestHeaderable) > 0 && Number(this.state.selectedRowFromRequestHeaderable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowFromRequestHeaderable)
      this.setState({ allHttpHeaderData: await dataAfterDelete });
      TestScriptData.AllHttpHeaderData = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'Request Header' table");
    }
  }

  //************************* Request Body Details****************************************************

  addNewDataSet = async (updated_src) => {
    var allDataSet = await updated_src['updated_src'];
    this.setState({ allRequestBody: await allDataSet });
    TestScriptData.AllRequestBody = await allDataSet;
  }

  editRequestBody = async (updated_src) => {
    var allDataSet = await updated_src['updated_src'];
    this.setState({ allRequestBody: await allDataSet });
    TestScriptData.AllRequestBody = await allDataSet;
    return this.setState({ isDynamicDataButtonDisable: true });
  }

  selectKeyInRequestBody = async (updated_src) => {
    var selectedKeyName = await updated_src['name'];
    var selectedNameSpace = await updated_src['namespace'];
    selectedNameSpace.push(selectedKeyName);
    this.setState({ selectedKeyNameInRequestBody: selectedKeyName });
    this.setState({ selectedKeyNameSpaceinRequestBody: selectedNameSpace });
    return this.setState({ isDynamicDataButtonDisable: false });
  }

  openDynamicTestDataModal = async () => {
    return this.setState({ testDataModal: true });
  }



  //************************* Save Request variable section****************************************************

  selectRadioButtonFromRequestVariableTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowForRequestVariableTable = await row.id;
      this.setState({ selectedRowForRequestVariableTable: await row.id });
    }

  }

  addRowInRequestVariableTable = async (event) => {
    await event.preventDefault();
    var tableData = this.state.allRequestVariables;
    var lastId = tableData.length + 1;
    var newRow = { id: lastId, variable: '', key: '' }
    if (lastId > 1) {
      var perVkeyName = await tableData[lastId - 2]['variable'];
      var perVkeyValue = await tableData[lastId - 2]['key'];
      if (perVkeyName.trim() === '' || perVkeyValue.trim() === '') {
        return await this.getNotification('error', "Please add correct details for Variable Name/Request Key in 'SAVE REQUEST PARAMETER' table");
      }
    }
    this.setState({ allRequestVariables: [...this.state.allRequestVariables, newRow] });
    TestScriptData.AllRequestVariables.push(newRow);
  }

  deleteRowFromRequestVariableTable = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.allRequestVariables;
    if (Number(this.state.selectedRowForRequestVariableTable) > 0 && Number(this.state.selectedRowForRequestVariableTable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowForRequestVariableTable)
      this.setState({ allRequestVariables: await dataAfterDelete });
      TestScriptData.AllRequestVariables = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'SAVE REQUEST PARAMETER' table");
    }
  }
  //************************* Assertion section****************************************************

  selectRadioButtonFromAssertionTable = async (row, isSelect) => {
    if (await isSelect) {
      TestScriptData.SelectedRowForAssertionTable = await row.id;
      this.setState({ selectedRowForAssertionTable: await row.id });
    }

  }

  addRowInAssertionTable = async (event) => {
    await event.preventDefault();
    var tableData = this.state.allAssertionData;
    var lastId = tableData.length + 1;
    var newRow = { id: lastId, expression: '', function: '', expected: '' }
    if (lastId > 1) {
      var perVkeyName = await tableData[lastId - 2]['expression'];
      var perVkeyValue = await tableData[lastId - 2]['function'];
      if (perVkeyName.trim() === '' || perVkeyValue.trim() === '') {
        return await this.getNotification('error', "Please add correct details for Expression/Function in 'ASSERTION' table");
      }
    }
    this.setState({ allAssertionData: [...this.state.allAssertionData, newRow] });
    TestScriptData.AllAssertionData.push(newRow);
  }

  deleteRowFromAssertionTable = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.allAssertionData;
    if (Number(this.state.selectedRowForAssertionTable) > 0 && Number(this.state.selectedRowForAssertionTable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowForAssertionTable)
      this.setState({ allAssertionData: await dataAfterDelete });
      TestScriptData.AllAssertionData = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'Assertion' table");
    }
  }

  //************************* API script action Section****************************************************

  debugTestScript = async (event) => {
    await event.preventDefault();
    var isPreDataFilled = false;
    var httpMethodName = this.state.httpMethod;
    if (httpMethodName.trim() === '') {
      isPreDataFilled = true;
      this.setState({ IsErrorOnHttpMethod: true });
    }
    var apiUrl = this.state.apiUrl;
    if (apiUrl.trim() === '') {
      isPreDataFilled = true;
      this.setState({ validateApiUrl: true });
    }
    if (isPreDataFilled) {
      return await this.getNotification('error', "Please add correct details for highlighted filed from 'Basic/Url Details' section.");
    }
    this.setState({ isPageLoading: true });
    await TestScriptGetter.callRestApiMethod(await apiUrl, TestScriptData.RelativeUrl, TestScriptData.TestId, TestScriptData.AllHttpHeaderData, await httpMethodName, TestScriptData.AllRequestBody, TestScriptData.DependentApiDataTable, TestScriptData.AllAssertionData, TestScriptData.AllRequestVariables);
    this.setState({ isPageLoading: false });
    await this.setState({ apiResponseData: TestScriptData.ApiResponseData })
    await this.setState({ responseAssertionData: TestScriptData.ResponseAssertionData })
    await this.setState({ apiVariableData: TestScriptData.ApiVariableData })
    await this.setState({ apiResponseModalView: true });
  }

  deleteTestId = async (event) => {
    await event.preventDefault();
    var tetId = this.state.testId;
    if (tetId.toString().trim() === '') {
      return await this.getNotification('error', "Please select TestId from the 'Basic Detail' section.");
    }
    var componentName = this.state.componentName;
    if (componentName.toString().trim() === '') {
      return await this.getNotification('error', "TestId not found");
    }
    this.setState({ isPageLoading: true });
    var isdeleted = await TestScriptGetter.deleteApiTestScript(componentName, tetId);
    this.setState({ isPageLoading: false });
    if (!isdeleted) {
      return await this.getNotification('error', "TestId " + tetId + " not found");
    }
    else {
      await TestScriptGetter.apiTestScriptPageLoadData();
      TestScriptData.ComponentName = '';
      TestScriptData.TestId = '';
      TestScriptData.TestName = '';
      TestScriptData.DependentApiDataTable = [];
      TestScriptData.AllRequestBody = {};
      TestScriptData.AllRequestVariables = [];
      TestScriptData.AllAssertionData = [{ id: 1, expression: 'ResponseCode', function: 'ShouldBe', expected: 200 }];
      TestScriptData.RelativeUrl = '';
      TestScriptData.SelectedAutherization = ''
      TestScriptData.AllTestId = [];
      TestScriptData.HttpMethod = TestScriptData.AllHttpHeaderData[0];
      this.setState({ componentName: TestScriptData.ComponentName });
      this.setState({ allTestId: TestScriptData.AllTestId });
      this.setState({ testId: TestScriptData.TestId });
      this.setState({ testName: TestScriptData.TestName });
      this.setState({ dependentApiDataTable: [] })
      this.setState({ allRequestBody: {} })
      this.setState({ allHttpHeaderData: TestScriptData.AllHttpHeaderData })
      this.setState({ httpMethod: TestScriptData.HttpMethod })
      this.setState({ allRequestVariables: TestScriptData.AllRequestVariables })
      this.setState({ allAssertionData: TestScriptData.AllAssertionData })
      this.setState({ relativeUrl: TestScriptData.RelativeUrl })
      this.setState({ allEnvironmentList: TestScriptData.AllEnvironmentList })
      this.setState({ selectedEnvironmentName: TestScriptData.SelectedEnvironmentName })
      this.setState({ allComponentUrlLIst: TestScriptData.AllComponentUrlLIst });
      this.setState({ selectedComponentUrl: TestScriptData.SelectedComponentUrl });
      this.setState({ selectedAutherization: TestScriptData.SelectedAutherization });
      this.setState({ apiUrl: TestScriptData.ApiUrl });
      return await this.getNotification('success', "TestId " + tetId + " successfully deleted");
    }
  }

  saveTestScript = async (event) => {

    await event.preventDefault();

    //****** Basic Details Verification  *****************************************

    var tetId = this.state.testId;
    var componentName = this.state.componentName;
    var testName = this.state.testName
    var httpMethod = this.state.httpMethod
    var isBasicDetailsFilled = await TestScriptGetter.isAllDetailsValidInBasicDetailSection();
    if (!isBasicDetailsFilled) {
      if (tetId.toString().trim() === '') {
        this.setState({ isErrorOnTestId: true });
      }
      if (componentName.toString().trim() === '') {
        this.setState({ isErrorOnComponentName: true });
      }
      if (testName.toString().trim() === '') {
        this.setState({ isErrorOnTestName: true });
      }
      if (httpMethod.toString().trim() === '') {
        this.setState({ isErrorOnHttpMethod: true });
      }
      return await this.getNotification('error', "Please add the correct details in 'Basic Details' section.");
    }

    //****** Url Details Verification  *****************************************
    var envrinment = this.state.selectedEnvironmentName;
    var componentKey = this.state.selectedComponentUrl;
    var isUrlDerailsFilled = await TestScriptGetter.isAllDetailsValidInUrlDetailSection();
    if (!isUrlDerailsFilled) {
      if (envrinment.toString().trim() === '') {
        this.setState({ isErrorOnEnvironment: true });
      }
      if (componentKey.toString().trim() === '') {
        this.setState({ isErrorOnComponentUrl: true });
      }
      return await this.getNotification('error', "Please add the correct details in 'Url Details' section.");
    }

    //****** Dependent Table Verification  *****************************************

    //var depApiTableData = this.state.dependentApiDataTable;
    var isDependendentDetailsFilled = await TestScriptGetter.isAllDetailsValidInDependendtApiTable();
    if (!isDependendentDetailsFilled) {
      return await this.getNotification('error', "Please add the correct details in 'Select Dependent Api script' table.");
    }

    //****** Request Header Verification  *****************************************

   // var RequestHeader = this.state.allHttpHeaderData;
    var isRequestHeaderDetailsFilled = await TestScriptGetter.isAllDetailsValidForRequestHeaderTable();
    if (!isRequestHeaderDetailsFilled) {
      return await this.getNotification('error', "Please add the correct details in 'Request Header' table.");
    }

    //****** Request variable Verification  *****************************************
    //var RequestVariables = this.state.allRequestVariables;
    var isRequestVariableDetailsFilled = await TestScriptGetter.isAllDetailsValidForRequestVariableTable();
    if (!isRequestVariableDetailsFilled) {
      return await this.getNotification('error', "Please add the correct details in 'Save Request Parameter' table.");
    }

    //****** Assertion Table Verification  *****************************************
    var requestAssertion = this.state.allAssertionData;
    if (requestAssertion.length === 0) {
      return await this.getNotification('error', "Minimum 1 assertion is required in 'assertion' table");
    }
    var isRequestAssertionDetailsFilled = await TestScriptGetter.isAllDetailsValidForRequestAssertionTable();
    if (!isRequestAssertionDetailsFilled) {
      return await this.getNotification('error', "Please add the correct details in 'Assertion' table.");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await TestScriptGetter.saveTestScript();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      return await this.getNotification('success', 'Test script is successfully created/updated');
    }
    else {
      return await this.getNotification('error', 'Unable to save test script because of ' + Config.ErrorMessage);
    }

  }

  //****************** End */********************************** */

  render() {
    // const selectRowFromDependentResponseKeyTable = {
    //   mode: 'radio',
    //   onSelect: this.selectRadioButtonFromDependentResponseKeyTable,
    //   selected: [this.state.selectedRowDependentResponseKeyTable]
    // };
    const selectRowFromDependentApiTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromDependentApiTable,
      selected: [this.state.selectedRowFromDependentApiTable]
    };
    // const selectRowFromRequestParamTable = {
    //   mode: 'radio',
    //   onSelect: this.selectRadioButtonFromRequestParamTable,
    //   selected: [this.state.selectedRowFromRequestParamTable]
    // };
    const selectRowFromRequestHeaderTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromRequestHeaderTable,
      selected: [this.state.selectedRowFromRequestHeaderable]
    };
    const selectRowFromRequestVariableTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromRequestVariableTable,
      selected: [this.state.selectedRowForRequestVariableTable]
    };
    const selectRowFromAssertionTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromAssertionTable,
      selected: [this.state.selectedRowForAssertionTable]
    };
    const selectRowFromDynamicDataTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromDynamicDataTable,
      selected: [this.state.selectedRowFromDynamicDataTable],
      disabled: [0]
    };
    return (
      <Page
        className="APITestScriptPage"
        title="Api Test Script"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black"  />}
        <Fade in={!this.state.isPageLoading} className="APITestScriptPage"> 
        <NotificationSystem ref={this.notificationSystem} />
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Basic Details
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
                        value={this.state.componentName}
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
                  <FormGroup row>
                    <Label sm={5}>
                      Http Method
                    </Label>
                    <Col>
                      <Input type="select" name="httpMethod" invalid={this.state.isErrorOnHttpMethod} value={this.state.httpMethod} onChange={this.addHttpMethod.bind(this)}>
                        <DropDownOptions options={this.state.allHttpMethodName} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row style={{ visibility: this.state.isRenameTestIdVisible ? 'visible' : 'hidden' }}>
                    <Label sm={5}>
                      New TestId
                    </Label>
                    <Col>
                      <Input type="input" name="newTestId" invalid={this.state.isErrorOnNewTestId} value={this.state.newTestId} onChange={this.renameExistingTestId.bind(this)}>
                      </Input>
                    </Col>
                    <Col>
                      <ButtonGroup size="sm">
                        <Button color='dark' onClick={this.renameTestId.bind(this)}>
                          <small>Rename Test Id</small>
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Url Details
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={5}>
                      Environment
                    </Label>
                    <Col>
                      <Input type="select" invalid={this.state.isErrorOnEnvironment} name="httpMethod" value={this.state.selectedEnvironmentName} onChange={this.selectEnvironment.bind(this)}>
                        <DropDownOptions options={this.state.allEnvironmentList} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>
                      Component Url
                    </Label>
                    <Col>
                      <Input type="select" invalid={this.state.isErrorOnComponentUrl} name="httpMethod" value={this.state.selectedComponentUrl} onChange={this.selectComponentUrl.bind(this)}>
                        <DropDownOptions options={this.state.allComponentUrlLIst} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>
                      Relative Url
                    </Label>
                    <Col>
                      <Input type="input" name="testName" value={this.state.relativeUrl} onChange={this.addRelativeUrl.bind(this)}>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>
                      Autherization credentials key
                    </Label>
                    <Col>
                      <Input type="select" name="autherization" value={this.state.selectedAutherization} onChange={this.selectAutherization.bind(this)}>
                        <option></option>
                        <DropDownOptions options={this.state.allAutherizationList} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>
                      Api Url
                    </Label>
                    <Col>
                      <Input type="input" name="testUrl" invalid={this.state.validateApiUrl} value={this.state.apiUrl} onChange={this.addApiUrl.bind(this)}>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                  <Label sm={5}>
                      Testing type*
                    </Label>
                    <Col>
                      <Input type="select" name="testingType" value={this.state.testingType} onChange={this.selectTestingType.bind(this)}>
                        <option>Unit Testing</option>
                        <option>Integration Testing</option>
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
                  API scripts
                  <ButtonGroup size="sm">
                    <Button color='dark' onClick={this.debugTestScript.bind(this)}>
                      <small>Debug</small>
                    </Button>
                    <Button color='info' onClick={this.saveTestScript.bind(this)}>
                      <small>Save</small>
                    </Button>
                    <Button color='dark' onClick={this.deleteTestId.bind(this)}>
                      <small>Delete</small>
                    </Button>
                  </ButtonGroup>
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <UncontrolledAccordion >
                      <AccordionItem>
                        <AccordionHeader targetId="1">Select Dependent Api script</AccordionHeader>
                        <AccordionBody accordionId="1">
                          <Row>
                            <Col lg={12} md={12} sm={12} xs={12}>
                              <Card>
                                <CardHeader>
                                  <div className="d-flex justify-content-between align-items-center">
                                    Api
                                    <ButtonGroup size="sm">
                                      <Button color='dark' onClick={this.addNewRowForDependendentTable.bind(this)}>
                                        <small>Add</small>
                                      </Button>
                                      <Button color='info' onClick={this.debugDependentTestScript.bind(this)}>
                                        <small>Debug</small>
                                      </Button>
                                      <Button color='dark' onClick={this.deleteRowFromDependendentApiTable.bind(this)}>
                                        <small>Delete</small>
                                      </Button>
                                    </ButtonGroup>
                                  </div>
                                </CardHeader>
                                <CardBody>
                                  <Col>
                                    <BootstrapTable
                                      keyField='id'
                                      data={this.state.dependentApiDataTable}
                                      columns={DependentApiTableHeader}
                                      wrapperClasses="table-responsive"
                                      striped
                                      hover
                                      condensed
                                      selectRow={selectRowFromDependentApiTable}
                                      cellEdit={cellEditFactory({
                                        mode: 'click',
                                        blurToSave: true,
                                        afterSaveCell: (oldValue, newValue, row, column) => {
                                          this.setState({ dependentApiDataTable: TestScriptData.DependentApiDataTable })
                                        }
                                      })}
                                    // pagination={paginationFactory(PagiNationData)}

                                    />
                                  </Col>
                                </CardBody>
                              </Card>
                            </Col>
                            {/* <Col lg={3} md={6} sm={6} xs={12}>
                              <Card>
                                <CardHeader>
                                  <div className="d-flex justify-content-between align-items-center">
                                    Choose Existing Api
                                    <Button size="sm" color='dark' onClick={this.debugDependentTestScript.bind(this)}>
                                      <small>Debug</small>
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardBody>
                                  <Form>
                                    <FormGroup row>
                                      <Label sm={5}>
                                        Component
                                      </Label>
                                      <Col >
                                        <Input invalid={this.state.validateDependentComponent} type="select" name="component" value={this.state.dependentComponentName} onChange={this.selectDependentComponent.bind(this)}>
                                          <option></option>
                                          <DropDownOptions options={this.state.allComponentList} />
                                        </Input>
                                      </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                      <Label sm={5}>
                                        Test Id
                                      </Label>
                                      <Col>
                                        <Input invalid={this.state.validateDependentTestId} type="select" name="component" value={this.state.dependentTestId} onChange={this.selectDependentTestId.bind(this)}>
                                          <option></option>
                                          <DropDownOptions options={this.state.allTestId} />
                                        </Input>
                                      </Col>
                                    </FormGroup>
                                  </Form>
                                </CardBody>
                              </Card>
                            </Col>
                            <Col lg={4} md={6} sm={6} xs={12}>
                              <Card>
                                <CardHeader>
                                  <div className="d-flex justify-content-between align-items-center">
                                    Response Key
                                    <ButtonGroup size="sm">
                                      <Button color='dark' onClick={this.addDependentResponseKey.bind(this)}>
                                        <small>Add</small>
                                      </Button>
                                      <Button color='info' onClick={this.saveResponseKeyDataTable.bind(this)}>
                                        <small>Save</small>
                                      </Button>
                                      <Button color='dark' onClick={this.deleteRowFromDependendentResponseKeyTable.bind(this)}>
                                        <small>Delete</small>
                                      </Button>
                                    </ButtonGroup>
                                  </div>
                                </CardHeader>
                                <CardBody>
                                  <Col>
                                    <BootstrapTable
                                      keyField='id'
                                      data={this.state.dependentResponseKeyData}
                                      columns={DependentResponseKeyTableHeader}
                                      wrapperClasses="table-responsive"
                                      striped
                                      hover
                                      condensed
                                      selectRow={selectRowFromDependentResponseKeyTable}
                                      cellEdit={cellEditFactory({
                                        mode: 'click',
                                        blurToSave: true,
                                      })}
                                      pagination={paginationFactory(PagiNationData)}
                                    />
                                  </Col>
                                </CardBody>
                              </Card>
                            </Col>
                            <Col lg={5} md={6} sm={6} xs={12}>
                              <Card>
                                <CardHeader>
                                  <div className="d-flex justify-content-between align-items-center">
                                    Dependent Api
                                    <Button size="sm" color='dark' onClick={this.deleteRowFromDependendentApiTable.bind(this)}>
                                      <small>Delete</small>
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardBody>
                                  <Col>
                                    <BootstrapTable
                                      keyField='id'
                                      data={this.state.dependentApiDataTable}
                                      columns={DependentApiTableHeader}
                                      wrapperClasses="table-responsive"
                                      striped
                                      hover
                                      condensed
                                      selectRow={selectRowFromDependentApiTable}
                                      cellEdit={cellEditFactory({
                                        mode: 'click',
                                        blurToSave: true,
                                      })}
                                      pagination={paginationFactory(PagiNationData)}
                                    />
                                  </Col>
                                </CardBody>
                              </Card>
                            </Col> */}
                          </Row>
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion >
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card>
                      <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                          Request Header
                          <ButtonGroup size="sm">
                            <Button color='dark' onClick={this.addRowInRequestHeaderTable.bind(this)}>
                              <small>Add</small>
                            </Button>
                            <Button color='info' onClick={this.deleteRowFromRequestHeaderTable.bind(this)}>
                              <small>Delete</small>
                            </Button>
                          </ButtonGroup>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <Col>
                          <BootstrapTable
                            keyField='id'
                            data={this.state.allHttpHeaderData}
                            columns={RequestHttpTableHeader}
                            wrapperClasses="table-responsive"
                            striped
                            hover
                            condensed
                            selectRow={selectRowFromRequestHeaderTable}
                            cellEdit={cellEditFactory({
                              mode: 'click',
                              blurToSave: true,
                              afterSaveCell: (oldValue, newValue, row, column) => {
                                this.setState({ allHttpHeaderData: TestScriptData.AllHttpHeaderData })
                              }
                            })}
                          // pagination={paginationFactory(PagiNationData)}
                          />
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card>
                      <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                          Request Body
                          <Button disabled={this.state.isDynamicDataButtonDisable} color='dark' size="sm" onClick={this.openDynamicTestDataModal.bind(this)}>
                            <small>Select Dynamic Data</small>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <Col>
                          <ReactJson name={false} collapseStringsAfterLength={30} displayDataTypes={false} indentWidth={0} enableClipboard={true} iconStyle="circle" src={this.state.allRequestBody} onAdd={this.addNewDataSet.bind(this)} onEdit={this.editRequestBody.bind(this)} onSelect={this.selectKeyInRequestBody} onDelete={this.addNewDataSet.bind(this)} />
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card>
                      <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                          Save Request parameter
                          <ButtonGroup size="sm">
                            <Button color='dark' onClick={this.addRowInRequestVariableTable.bind(this)}>
                              <small>Add</small>
                            </Button>
                            <Button color='info' onClick={this.deleteRowFromRequestVariableTable.bind(this)}>
                              <small>Delete</small>
                            </Button>
                          </ButtonGroup>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <Col>
                          <BootstrapTable
                            keyField='id'
                            data={this.state.allRequestVariables}
                            columns={RequestVariableTableHeader}
                            wrapperClasses="table-responsive"
                            striped
                            hover
                            condensed
                            selectRow={selectRowFromRequestVariableTable}
                            cellEdit={cellEditFactory({
                              mode: 'click',
                              blurToSave: true,
                              afterSaveCell: (oldValue, newValue, row, column) => {
                                this.setState({ allRequestVariables: TestScriptData.AllRequestVariables })
                              }
                            })}
                            pagination={paginationFactory(PagiNationData)}
                          />
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card>
                      <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                          Assertion
                          <ButtonGroup size="sm">
                            <Button color='dark' onClick={this.addRowInAssertionTable.bind(this)}>
                              <small>Add</small>
                            </Button>
                            <Button color='info' onClick={this.deleteRowFromAssertionTable.bind(this)}>
                              <small>Delete</small>
                            </Button>
                          </ButtonGroup>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <Col>
                          <BootstrapTable
                            keyField='id'
                            data={this.state.allAssertionData}
                            columns={AsserionTableHeader}
                            wrapperClasses="table-responsive"
                            striped
                            hover
                            condensed
                            selectRow={selectRowFromAssertionTable}
                            cellEdit={cellEditFactory({
                              mode: 'click',
                              blurToSave: true,
                              afterSaveCell: (oldValue, newValue, row, column) => {
                                this.setState({ allAssertionData: TestScriptData.AllAssertionData })
                              }
                            })}
                          // pagination={paginationFactory(PagiNationData)}
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
        <Modal size="lg" isOpen={this.state.apiResponseModalView} className={this.props.className} backdrop="static">
          <ModalHeader toggle={this.toggle.bind(this)}>Api Response</ModalHeader>
          <ModalBody>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <Card>
                  <CardHeader>Expected vs Actual
                  </CardHeader>
                  <CardBody>
                    <Col>
                      <BootstrapTable
                        keyField='id'
                        data={this.state.responseAssertionData}
                        columns={ResponseAsserionTableHeader}
                        wrapperClasses="table-responsive"
                        striped
                        hover
                        condensed
                      />
                    </Col>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={12} md={12} sm={12} xs={12}>
                <Card>
                  <CardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                      Variable Data
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Col >
                      <BootstrapTable
                        keyField='id'
                        data={this.state.apiVariableData}
                        columns={DependentResponseKeyTableHeader}
                        wrapperClasses="table-responsive"
                        striped
                        hover
                        condensed
                      />
                    </Col>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={12} md={12} sm={12} xs={12}>
                <Card>
                  <CardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                      Response Data
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Col>
                      <ReactJson name={false} collapsed={true} collapseStringsAfterLength={25} displayDataTypes={false} indentWidth={0} iconStyle="circle" src={this.state.apiResponseData} />
                    </Col>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>
        <Offcanvas returnFocusAfterClose={true} isOpen={this.state.testDataModal} toggle={this.toggleTestData.bind(this)} direction="end" backdrop={false} >
          <OffcanvasHeader toggle={this.toggleTestData.bind(this)}>
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
                        <Button size="sm" color='info' onClick={this.updateRequestBodyKeyData.bind(this)}>
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
