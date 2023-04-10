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
  Fade,
} from 'reactstrap';
import { ConfigData } from './ConfigData'
import ConfigGetter from './ConfigGetter'
import { EnvironmentURLTableHeader, EmulatorTableHeader, TestToolTableHeader } from '../WebPageTableHeader'
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import NotificationSystem from 'react-notification-system';
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import ConfigSetter from './ConfigSetter';
import { Config } from '../../../QAautoMATER/Config';
import ReactJson from 'react-json-view'

class ConfigurationPage extends React.Component {
  notificationSystem = React.createRef();
  state = {

    //****** Page Loader ***********************************************************
    isPageLoading: false,

    //****** default Configuration  ***********************************************************
    environmentList: ConfigData.EnvironmentList,
    defaultSelectedEnvironment: ConfigData.DefaultSelectedEnvironment,
    validateDefaultSelectedEnvironment: ConfigData.ValidateDefaultSelectedEnvironment,
    defaultReportTrailCount: ConfigData.DefaultReportTrailCount,
    validatedefaultReportTrailCount: ConfigData.ValidatedefaultReportTrailCount,
    defaultSaveDaysToReport: ConfigData.DefaultSaveDaysToReport,
    validatedeDefaultSaveDaysToReport: ConfigData.ValidatedeDefaultSaveDaysToReport,
    defaultSaveDaysToDevelopment: ConfigData.DefaultSaveDaysToDevelopment,
    validatedeSaveDaysToDevelopment: ConfigData.ValidatedeSaveDaysToDevelopment,
    errorMessageDefaultConfiguration: ConfigData.ErrorMessageDefaultConfiguration,

    //****** Environment URL LIst  ***********************************************************
    validateEnvNameFromURL: ConfigData.ValidateEnvNameFromURL,
    selectedRowFromUrlTable: ConfigData.SelectedRowFromUrlTable,
    envUrlList: ConfigData.EnvUrlList,
    isNameValidforUrlTable: true,

    //****** Default Screen  ***********************************************************
    isErrorOnExecutionPlatform: ConfigData.IsErrorOnExecutionPlatform,
    allExecutionPlatform: ConfigData.AllExecutionPlatform,
    defaultExecutionPlatform: ConfigData.DefaultExecutionPlatform,
    isErrorOnBrowser: ConfigData.IsErrorOnBrowser,
    allBrowserList: ConfigData.AllBrowserList,
    defaultBrowser: ConfigData.DefaultBrowser,
    isErrorOnMobileEmulator: ConfigData.IsErrorOnMobileEmulator,
    defaultMobileEmulator: ConfigData.DefaultMobileEmulator,
    allMobileEmulator: ConfigData.AllMobileEmulator,
    isErrorOnTabletEmulator: ConfigData.IsErrorOnTabletEmulator,
    defaultTabletEmulator: ConfigData.DefaultTabletEmulator,
    allTabletEmulator: ConfigData.AllTabletEmulator,

    //****** Emulator Data  *********************************************************************************
    allEmulatorTableData: ConfigData.AllEmulatorTableData,
    selectedRowFromEmulatorTable: ConfigData.SelectedRowFromEmulatorTable,
    isDataValidInEmulatorTable: ConfigData.IsDataValidInEmulatorTable,

    //****** Test Managment Tool Data  *********************************************************************************
    allTestManagementToolData: ConfigData.AllTestManagementToolData,
    selectedRowFromToolTable: ConfigData.SelectedRowFromToolTable,
    isDataValidInToolTable: ConfigData.IsDataValidInToolTable,

    //****** Capabilities setup *********************************************************************************
    allExecutionServer: ConfigData.AllExecutionServer,
    isErrorOnExecutionAt: ConfigData.IsErrorOnExecutionAt,
    executionServer: ConfigData.ExecutionServer,
    isErrorOnServerUrl: ConfigData.IsErrorOnServerUrl,
    serverUrl: ConfigData.ServerUrl,
    allCapabilities: ConfigData.AllCapabilities,

    //****** Report Clean up setup *********************************************************************************
    cleanUpEnvironment: ConfigData.CleanUpEnvironment,
    selectedDaysForDelete: ConfigData.SelectedDaysForDelete,
    isErrorOnCleanUpEnvironment: ConfigData.IsErrorOnCleanUpEnvironment,
    isErrorOnDayToDelete: ConfigData.IsErrorOnDayToDelete,

  };
  async componentDidMount() {
    window.scrollTo(0, 0);
    await ConfigGetter.uiConfigPageLoadData();

    //****** default Configuration section  ***********************************************************
    this.setState({ environmentList: ConfigData.EnvironmentList })
    this.setState({ defaultSelectedEnvironment: ConfigData.DefaultSelectedEnvironment })
    this.setState({ validateDefaultSelectedEnvironment: ConfigData.ValidateDefaultSelectedEnvironment })
    this.setState({ defaultReportTrailCount: ConfigData.DefaultReportTrailCount })
    this.setState({ validatedefaultReportTrailCount: ConfigData.ValidatedefaultReportTrailCount })
    this.setState({ defaultSaveDaysToReport: ConfigData.DefaultSaveDaysToReport })
    this.setState({ validatedeDefaultSaveDaysToReport: ConfigData.ValidatedeDefaultSaveDaysToReport })
    this.setState({ defaultSaveDaysToDevelopment: ConfigData.DefaultSaveDaysToDevelopment })


    //****** Env and URL   *********************************************************************************
    this.setState({ validateEnvNameFromURL: ConfigData.ValidateEnvNameFromURL });
    this.setState({ selectedRowFromUrlTable: ConfigData.SelectedRowFromUrlTable })
    this.setState({ envUrlList: ConfigData.EnvUrlList, })

    //****** Default Screen   *********************************************************************************
    this.setState({ isErrorOnExecutionPlatform: ConfigData.IsErrorOnExecutionPlatform });
    this.setState({ allExecutionPlatform: ConfigData.AllExecutionPlatform })
    this.setState({ defaultExecutionPlatform: ConfigData.DefaultExecutionPlatform })
    this.setState({ isErrorOnBrowser: ConfigData.IsErrorOnBrowser })
    this.setState({ allBrowserList: ConfigData.AllBrowserList })
    this.setState({ defaultBrowser: ConfigData.DefaultBrowser });
    this.setState({ isErrorOnMobileEmulator: ConfigData.IsErrorOnMobileEmulator })
    this.setState({ allMobileEmulator: ConfigData.AllMobileEmulator })
    this.setState({ defaultMobileEmulator: ConfigData.DefaultMobileEmulator })
    this.setState({ isErrorOnTabletEmulator: ConfigData.IsErrorOnTabletEmulator })
    this.setState({ allTabletEmulator: ConfigData.AllTabletEmulator })
    this.setState({ defaultTabletEmulator: ConfigData.DefaultTabletEmulator, })

    //****** Emulator Data  *********************************************************************************
    this.setState({ allEmulatorTableData: ConfigData.AllEmulatorTableData });
    this.setState({ isDataValidInEmulatorTable: ConfigData.IsDataValidInEmulatorTable });

    //****** Test Managment Tool Data  *********************************************************************************
    this.setState({ allTestManagementToolData: ConfigData.AllTestManagementToolData });
    this.setState({ isDataValidInToolTable: ConfigData.IsDataValidInToolTable });

    //****** Capabilities setup *********************************************************************************
    this.setState({ allExecutionServer: ConfigData.AllExecutionServer });
    this.setState({ isErrorOnExecutionAt: ConfigData.IsErrorOnExecutionAt });
    this.setState({ executionServer: ConfigData.ExecutionServer });
    this.setState({ isErrorOnServerUrl: ConfigData.IsErrorOnServerUrl });
    this.setState({ serverUrl: ConfigData.ServerUrl });
    this.setState({ allCapabilities: ConfigData.AllCapabilities });

    //****** Report Clean up setup *********************************************************************************
    this.setState({ cleanUpEnvironment: ConfigData.CleanUpEnvironment });
    this.setState({ selectedDaysForDelete: ConfigData.SelectedDaysForDelete });
    this.setState({ isErrorOnCleanUpEnvironment: ConfigData.IsErrorOnCleanUpEnvironment });

  }

  //************************* Notification ***************************************************************
  async getNotification(level, message) {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: message,
      level: level
    });
  }

  //****** Default Configuration ***************************************************

  selectDefaultEnvironment = async (event) => {
    this.setState({ validateDefaultSelectedEnvironment: false })
    var envChoice = await event.target.value;
    if (this.state.defaultSelectedEnvironment !== await envChoice) {

      this.setState({ defaultSelectedEnvironment: await envChoice });
      ConfigData.DefaultSelectedEnvironment = await envChoice;
      if (envChoice.trim() !== '') {
        this.setState({ validateDefaultSelectedEnvironment: false });
        ConfigData.ValidateDefaultSelectedEnvironment = false;
      }
      else {
        this.setState({ validateDefaultSelectedEnvironment: true })
        ConfigData.ValidateDefaultSelectedEnvironment = true;
      }
    }
  };

  selectReportTRailCount = async (event) => {
    this.setState({ ValidatedefaultReportTrailCount: false })
    var reportTrailChoice = await event.target.value;
    if (this.state.defaultReportTrailCount !== await reportTrailChoice) {

      this.setState({ defaultReportTrailCount: await reportTrailChoice });
      ConfigData.DefaultReportTrailCount = await reportTrailChoice;
      if (Number(await reportTrailChoice) > 0 && !reportTrailChoice.includes('.')) {
        this.setState({ validatedefaultReportTrailCount: false })
        ConfigData.ValidatedefaultReportTrailCount = false;
      }
      else {
        this.setState({ validatedefaultReportTrailCount: true })
        ConfigData.ValidatedefaultReportTrailCount = true;
      }

    }

  };

  selectSaveDaysToReport = async (event) => {
    this.setState({ validatedeDefaultSaveDaysToReport: false })
    var reportSaveDayChoice = await event.target.value;
    if (this.state.defaultSaveDaysToReport !== await reportSaveDayChoice) {

      this.setState({ defaultSaveDaysToReport: await reportSaveDayChoice });
      ConfigData.DefaultSaveDaysToReport = await reportSaveDayChoice;
      if (Number(await reportSaveDayChoice) > 0 && !reportSaveDayChoice.includes('.')) {
        this.setState({ validatedeDefaultSaveDaysToReport: false })
        ConfigData.ValidatedeDefaultSaveDaysToReport = false;
      }
      else {
        this.setState({ validatedeDefaultSaveDaysToReport: true })
        ConfigData.ValidatedeDefaultSaveDaysToReport = true;
      }

    }

  };

  selectSaveDaysForDevandExecution = async (event) => {
    this.setState({ validatedeSaveDaysToDevelopment: false })
    var devDaysChoice = await event.target.value;
    if (this.state.defaultSaveDaysToReport !== await devDaysChoice) {

      this.setState({ defaultSaveDaysToDevelopment: await devDaysChoice });
      ConfigData.DefaultSaveDaysToDevelopment = await devDaysChoice;
      if (Number(await devDaysChoice) > 0 && !devDaysChoice.includes('.')) {
        this.setState({ validatedeSaveDaysToDevelopment: false })
        ConfigData.ValidatedeSaveDaysToDevelopment = false;
      }
      else {
        this.setState({ validatedeSaveDaysToDevelopment: true })
        ConfigData.ValidatedeSaveDaysToDevelopment = true;
      }

    }

  };

  saveDefaultConfiguration = async (event) => {
    await event.preventDefault();
    var environment = this.state.defaultSelectedEnvironment;
    var reportTrail = this.state.defaultReportTrailCount;
    var daysSaveToReport = this.state.defaultSaveDaysToReport;
    var daystoSeeforDevelopment = this.state.defaultSaveDaysToDevelopment;
    if (environment.toString().trim() === '') {
      this.setState({ validateDefaultSelectedEnvironment: true })
    }
    if (reportTrail.toString().trim() === '') {
      this.setState({ validatedefaultReportTrailCount: true })
    }
    if (daysSaveToReport.toString().trim() === '') {
      this.setState({ validatedeDefaultSaveDaysToReport: true })
    }
    if (daystoSeeforDevelopment.toString().trim() === '') {
      this.setState({ validatedeSaveDaysToDevelopment: true })
    }
    if (environment.toString().trim() === '' || reportTrail.toString().trim() === '' || daysSaveToReport.toString().trim() === '' || daystoSeeforDevelopment.toString().trim() === '') {
      return await this.getNotification('error', ConfigData.ErrorMessageDefaultConfiguration);
    }
    else if (this.state.validateDefaultSelectedEnvironment || this.state.validatedefaultReportTrailCount || this.state.validatedeDefaultSaveDaysToReport || this.state.validatedeSaveDaysToDevelopment) {
      return await this.getNotification('error', ConfigData.ErrorMessageDefaultConfiguration);
    }
    else {
      this.setState({ isPageLoading: true });
      var isSaved = await ConfigSetter.saveDefaultConfiguration();
      this.setState({ isPageLoading: false });
      if (isSaved) {
        return await this.getNotification('success', ConfigData.SuccessMessageDefaultConfiguration);
      }
      else {
        return await this.getNotification('error', 'Unable to save default configuration because of ' + Config.ErrorMessage);
      }
    }
  }

  //********************* URL section ********************************//

  selectRadioButtonFromURlTable = (row, isSelect) => {
    if (isSelect) {
      ConfigData.SelectedRowFromUrlTable = row.id;
      this.setState({ selectedRowFromUrlTable: row.id });
    }

  }

  addNewUrlForEnvironment = async (event) => {
    await event.preventDefault();
    var allUrlList = this.state.envUrlList;
    if (allUrlList.length > 0) {
      var prevComponentName = allUrlList[allUrlList.length - 1]['name'];
      var prevComponentUrl = allUrlList[allUrlList.length - 1]['url'];
      if (prevComponentName.toString().trim() === "" || prevComponentUrl.toString().trim() === '') {
        this.setState({ isNameValidforUrlTable: false });
        return await this.getNotification('error', "Please add the correct Env name and Url from 'ADD NEW ENVIRONMENT' section");
      }
    }
    this.setState({ isNameValidforUrlTable: true });
    var lastId = allUrlList.length + 1;
    var newRow = { id: lastId, name: '', url: '' };
    this.setState({ envUrlList: [...this.state.envUrlList, newRow] });
    ConfigData.EnvUrlList.push(newRow);

  }

  deleteUrlFromUrlTable = async (event) => {
    await event.preventDefault();
    var allUrlList = this.state.envUrlList;
    if (allUrlList.length === 0) {
      return await this.getNotification('error', "No Environment is found under 'ADD NEW ENVIRONMENT' section");
    }
    if (Number(this.state.selectedRowFromUrlTable) > 0 && Number(this.state.selectedRowFromUrlTable) <= allUrlList.length) {
      var urlListAfterDelete = await ConfigGetter.updateRowIdAfterDelete(allUrlList, this.state.selectedRowFromUrlTable)
      this.setState({ envUrlList: [] }, () => { this.setState({ envUrlList: urlListAfterDelete }); });
      ConfigData.EnvUrlList = urlListAfterDelete;
    }
    else {
      this.setState({ isNameValidforUrlTable: false });
      return await this.getNotification('error', 'No Environment is selected for delete.');
    }
  }

  saveUrlTableData = async (event) => {
    await event.preventDefault();
    var allUrlList = this.state.envUrlList;
    if (this.state.isNameValidforUrlTable) {
      if (allUrlList.length > 0) {
        var componentName = allUrlList[allUrlList.length - 1]['name'];
        var componentUrl = allUrlList[allUrlList.length - 1]['url'];
        if (componentName.trim() === '' || componentUrl.trim() === '') {
          return await this.getNotification('error', "Please add the correct environment and URL in 'ADD NEW ENVIRONMENTs' table");
        }
      }
      ConfigData.EnvUrlList = allUrlList;
      this.setState({ isPageLoading: true });
      var isSaved = await ConfigSetter.saveURLDetails();
      this.setState({ isPageLoading: false });
      if (isSaved) {
        return await this.getNotification('success', 'Environment and Url information is successfully saved.');
      }
      else {
        return await this.getNotification('error', 'Unable to save Environment and Url information because of ' + Config.ErrorMessage);
      }

    }
    else {
      return await this.getNotification('error', "Please add the correct Component and URL in 'ADD NEW ENVIRONMENT' table");
    }
  }

  //****** Default Screen ***************************************************

  selectExecutionPlatForm = async (event) => {
    this.setState({ isErrorOnExecutionPlatform: false })
    var envChoice = await event.target.value;
    if (this.state.defaultExecutionPlatform !== await envChoice) {
      this.setState({ defaultExecutionPlatform: await envChoice });
      ConfigData.DefaultExecutionPlatform = await envChoice;
    }
  };

  selectBrowser = async (event) => {
    this.setState({ isErrorOnBrowser: false })
    var envChoice = await event.target.value;
    if (this.state.defaultBrowser !== await envChoice) {
      this.setState({ defaultBrowser: await envChoice });
      ConfigData.DefaultBrowser = await envChoice;
    }
  };

  selectMobileEmulator = async (event) => {
    this.setState({ isErrorOnMobileEmulator: false })
    var envChoice = await event.target.value;
    if (this.state.defaultMobileEmulator !== await envChoice) {
      this.setState({ defaultMobileEmulator: await envChoice });
      ConfigData.DefaultMobileEmulator = await envChoice;
    }
  };

  selectTabletEmulator = async (event) => {
    this.setState({ isErrorOnTabletEmulator: false })
    var envChoice = await event.target.value;
    if (this.state.defaultTabletEmulator !== await envChoice) {
      this.setState({ defaultTabletEmulator: await envChoice });
      ConfigData.DefaultTabletEmulator = await envChoice;
    }
  };

  saveDefaultScreen = async (event) => {
    await event.preventDefault();
    var executionPlatform = this.state.defaultExecutionPlatform;
    var browser = this.state.defaultBrowser;
    var mobileEmulator = this.state.defaultMobileEmulator;
    var tabletEmulator = this.state.defaultTabletEmulator;
    if (executionPlatform.toString().trim() === '') {
      this.setState({ isErrorOnExecutionPlatform: true })
    }
    if (browser.toString().trim() === '') {
      this.setState({ isErrorOnBrowser: true })
    }
    if (mobileEmulator.toString().trim() === '') {
      this.setState({ isErrorOnMobileEmulator: true })
    }
    if (tabletEmulator.toString().trim() === '') {
      this.setState({ isErrorOnTabletEmulator: true })
    }
    if (executionPlatform.toString().trim() === '' || browser.toString().trim() === '' || mobileEmulator.toString().trim() === '' || tabletEmulator.toString().trim() === '') {
      return await this.getNotification('error', "Please add the correct details for highlited field in 'DEFAULT SCREEN' section");
    }
    else {
      this.setState({ isPageLoading: true });
      var isSaved = await ConfigSetter.saveDefaultScreen();
      this.setState({ isPageLoading: false });
      if (isSaved) {
        return await this.getNotification('success', 'Default screen value are successfully saved.');
      }
      else {
        return await this.getNotification('error', 'Unable to save default screen configuration because of ' + Config.ErrorMessage);
      }
    }
  }

  //********************* Emulator section ********************************//

  selectRadioButtonFromEmulatorTable = (row, isSelect) => {
    if (isSelect) {
      ConfigData.SelectedRowFromEmulatorTable = row.id;
      this.setState({ selectedRowFromEmulatorTable: row.id });
    }
  }

  addNewEmulatorInfo = async (event) => {
    await event.preventDefault();
    var allDeviceDetails = this.state.allEmulatorTableData;
    if (allDeviceDetails.length > 0) {
      var deviceType = allDeviceDetails[allDeviceDetails.length - 1]['device'];
      var deviceName = allDeviceDetails[allDeviceDetails.length - 1]['name'];
      //var deviceWidth = allDeviceDetails[allDeviceDetails.length - 1]['width'];
     // var deviceHieght = allDeviceDetails[allDeviceDetails.length - 1]['height'];
      if (deviceType.toString().trim() === "" || deviceName.toString().trim() === '') {
        this.setState({ isDataValidInEmulatorTable: false });
        return await this.getNotification('error', "Please add correct detsils in 'EMULATOR SCREEN' section");
      }
    }
    this.setState({ isDataValidInEmulatorTable: true });
    var lastId = allDeviceDetails.length + 1;
    var newRow = { id: lastId, device: '', name: '' };
    this.setState({ allEmulatorTableData: [...this.state.allEmulatorTableData, newRow] });
    ConfigData.AllEmulatorTableData.push(newRow);

  }

  deleteEmulatorInfo = async (event) => {
    await event.preventDefault();
    var deviceInfo = this.state.allEmulatorTableData;
    if (deviceInfo.length === 0) {
      return await this.getNotification('error', "No Emulator information is found under 'EMULATOR SCREEN' section");
    }
    if (Number(this.state.selectedRowFromEmulatorTable) > 0 && Number(this.state.selectedRowFromEmulatorTable) <= deviceInfo.length) {
      var dataAfterDelete = await ConfigGetter.updateRowIdAfterDelete(deviceInfo, this.state.selectedRowFromEmulatorTable)
      this.setState({ allEmulatorTableData: [] }, () => { this.setState({ allEmulatorTableData: dataAfterDelete }); });
      ConfigData.AllEmulatorTableData = dataAfterDelete;
    }
    else {
      this.setState({ isDataValidInEmulatorTable: false });
      return await this.getNotification('error', 'Please select any device information for delete');
    }
  }

  saveEmulatorScreenData = async (event) => {
    await event.preventDefault();
    var allDeviceDetails = this.state.allEmulatorTableData;
    if (this.state.isDataValidInEmulatorTable) {
      if (allDeviceDetails.length > 0) {
        var deviceType = allDeviceDetails[allDeviceDetails.length - 1]['device'];
        var deviceName = allDeviceDetails[allDeviceDetails.length - 1]['name'];
        // var deviceWidth = allDeviceDetails[allDeviceDetails.length - 1]['width'];
        // var deviceHieght = allDeviceDetails[allDeviceDetails.length - 1]['height'];
        if (deviceType.toString().trim() === '' || deviceName.toString().trim() === '') {
          return await this.getNotification('error', "Please add the correct device information in 'EMULATOR SCREEN' table");
        }
      }
      ConfigData.AllEmulatorTableData = allDeviceDetails;
      this.setState({ isPageLoading: true });
      var isSaved = await ConfigSetter.saveEmulatorData();
      this.setState({ isPageLoading: false });
      if (isSaved) {
        return await this.getNotification('success', 'Emulator information is successfully saved.');
      }
      else {
        return await this.getNotification('error', 'Unable to save Emulator information because of ' + Config.ErrorMessage);
      }

    }
    else {
      return await this.getNotification('error', "Please add the correct Component and URL in 'ADD NEW ENVIRONMENT' table");
    }
  }

  //********************* Tool section ********************************//

  selectRadioButtonFromToolTable = (row, isSelect) => {
    if (isSelect) {
      ConfigData.SelectedRowFromToolTable = row.id;
      this.setState({ selectedRowFromToolTable: row.id });
    }
  }

  addNewToolInfo = async (event) => {
    await event.preventDefault();
    var allToolDetails = this.state.allTestManagementToolData;
    if (allToolDetails.length > 0) {
      var toolName = allToolDetails[allToolDetails.length - 1]['tool'];
      var url = allToolDetails[allToolDetails.length - 1]['url'];
      var userName = allToolDetails[allToolDetails.length - 1]['username'];
      var password = allToolDetails[allToolDetails.length - 1]['password'];
      if (toolName.toString().trim() === "" || url.toString().trim() === '' || userName.toString().trim() === '' || password.toString().trim() === '') {
        this.setState({ isDataValidInToolTable: false });
        return await this.getNotification('error', "Please add correct detsils in 'TEST MANAGEMENT TOOL SETUP' section");
      }
    }
    this.setState({ isDataValidInToolTable: true });
    var lastId = allToolDetails.length + 1;
    var newRow = { id: lastId, tool: '', url: '', username: '', password: '' };
    this.setState({ allTestManagementToolData: [...this.state.allTestManagementToolData, newRow] });
    ConfigData.AllTestManagementToolData.push(newRow);
  }

  deleteToolInfo = async (event) => {
    await event.preventDefault();
    var allToolDetails = this.state.allTestManagementToolData;
    if (allToolDetails.length === 0) {
      return await this.getNotification('error', "No information is found under 'TEST MANAGEMENT TOOL SETUP' section");
    }
    if (Number(this.state.selectedRowFromToolTable) > 0 && Number(this.state.selectedRowFromToolTable) <= allToolDetails.length) {
      var toolInfoAfterDelete = await ConfigGetter.updateRowIdAfterDelete(allToolDetails, this.state.selectedRowFromToolTable)
      this.setState({ allTestManagementToolData: [] }, () => { this.setState({ allTestManagementToolData: toolInfoAfterDelete }); });
      ConfigData.AllTestManagementToolData = toolInfoAfterDelete;
    }
    else {
      this.setState({ isDataValidInToolTable: false });
      return await this.getNotification('error', "No Row is selected in 'TEST MANAGEMENT TOOL SETUP' section");
    }
  }

  saveToolInfo = async (event) => {
    await event.preventDefault();
    var allToolDetails = this.state.allTestManagementToolData;
    if (this.state.isDataValidInToolTable) {
      if (allToolDetails.length > 0) {
        var toolName = allToolDetails[allToolDetails.length - 1]['tool'];
        var url = allToolDetails[allToolDetails.length - 1]['url'];
        var userName = allToolDetails[allToolDetails.length - 1]['username'];
        var password = allToolDetails[allToolDetails.length - 1]['password'];
        if (toolName.toString().trim() === '' || url.toString().trim() === '' || userName.toString().trim() === '' || password.toString().trim() === '') {
          return await this.getNotification('error', "Please add the correct device information in 'TEST MANAGEMENT TOOL SETUP table");
        }
      }
      ConfigData.AllTestManagementToolData = allToolDetails;
      this.setState({ isPageLoading: true });
      var isSaved = await ConfigSetter.saveToolsData();
      this.setState({ isPageLoading: false });
      if (isSaved) {
        return await this.getNotification('success', 'TEST MANAGEMENT TOOL SETUP information is successfully saved.');
      }
      else {
        return await this.getNotification('error', 'Unable to save information because of ' + Config.ErrorMessage);
      }

    }
    else {
      return await this.getNotification('error', "Please add the correct Component and URL in 'TEST MANAGEMENT TOOL SETUP' table");
    }
  }
  //************************* CAPABILITY setup**********************************/

  selectCapabilityServer = async (event) => {
    this.setState({ isErrorOnExecutionAt: false })
    var dataChoice = await event.target.value;
    if (this.state.executionServer !== await dataChoice) {
      this.setState({ executionServer: await dataChoice });
      ConfigData.ExecutionServer = await dataChoice;
      await ConfigGetter.setAllCapability(await dataChoice);
      this.setState({ serverUrl: ConfigData.ServerUrl })
      this.setState({ allCapabilities: ConfigData.AllCapabilities })
    }
  };

  addServerUrl = async (event) => {
    this.setState({ isErrorOnServerUrl: false })
    var dataChoice = await event.target.value;
    if (this.state.serverUrl !== await dataChoice) {
      this.setState({ serverUrl: await dataChoice });
      ConfigData.ServerUrl = await dataChoice;
      if (await dataChoice.trim() === '') {
        this.setState({ isErrorOnServerUrl: true });
        return;
      }
    }

  };

  addCapabilitiesItem = async (updated_src) => {
    var allDataSet = await updated_src['updated_src'];
    this.setState({ allCapabilities: await allDataSet });
    ConfigData.AllCapabilities = await allDataSet;
  }

  editCapabilitiesItem = async (updated_src) => {
    var allDataSet = await updated_src['updated_src'];
    this.setState({ AllCapabilities: await allDataSet });
    ConfigData.AllCapabilities = await allDataSet;
  }

  deleteCapabilitiesItem = async (updated_src) => {
    var allDataSet = await updated_src['updated_src'];
    this.setState({ AllCapabilities: await allDataSet });
    ConfigData.AllCapabilities = await allDataSet;
  }

  saveCapabilityData = async (event) => {
    await event.preventDefault();
    var executionAt = this.state.executionServer;
    if (executionAt.toString().trim() === '') {
      this.setState({ isErrorOnExecutionAt: true });
      return await this.getNotification('error', "Execution server can not be blank.");
    }
    var serverUrl = this.state.serverUrl;
    if (serverUrl.toString().trim() === '') {
      this.setState({ isErrorOnServerUrl: true });
      return await this.getNotification('error', "HUb Url can not be blank.");
    }
    var capItem = this.state.allCapabilities;
    try {
      if (Object.keys(await capItem).length === 0) {
        return await this.getNotification('error', "Please add the correct capabilities");
      }
    }
    catch (error) {
      return await this.getNotification('error', "Please add the correct capabilities");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await ConfigSetter.saveCapabilityDataOnServer();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      return await this.getNotification('success', 'Capabilities information is successfully saved.');
    }
    else {
      return await this.getNotification('error', 'Unable to save Capabilities information because of ' + Config.ErrorMessage);
    }
  }

  //****** Clean Up Configuration***************************************************

  selectCleanUpEnvironment = async (event) => {
    this.setState({ isErrorOnCleanUpEnvironment: false })
    var dataChoice = await event.target.value;
    if (this.state.cleanUpEnvironment !== await dataChoice) {
      this.setState({ cleanUpEnvironment: await dataChoice });
      ConfigData.CleanUpEnvironment = await dataChoice;
    }
  };

  selectKeepDaysToDate = async (event) => {
    this.setState({ isErrorOnDayToDelete: false })
    var dataChoice = await event.target.value;
    if (this.state.selectedDaysForDelete !== await dataChoice) {
      this.setState({ selectedDaysForDelete: await dataChoice });
      ConfigData.SelectedDaysForDelete = await dataChoice;
    }
  };

  deleteReportForDays = async (event) => {
    await event.preventDefault();
    var envforDelete = this.state.cleanUpEnvironment;
    if (await envforDelete === '') {
      this.setState({ isErrorOnCleanUpEnvironment: true });
      return await this.getNotification('error', "Please select environment first.");
    }
    var daysToDelete = this.state.selectedDaysForDelete;
    if (await daysToDelete === '') {
      this.setState({ isErrorOnDayToDelete: true });
      return await this.getNotification('error', "Please select environment first.");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await ConfigSetter.deleteReportData(await envforDelete, await daysToDelete);
    this.setState({ isPageLoading: false });
    if (isSaved) {
      return await this.getNotification('success', 'Report data is successfully cleanup.');
    }
    else {
      return await this.getNotification('error', 'Unable to delete report data because of ' + Config.ErrorMessage);
    }


  }

  deleteAllReports = async (event) => {
    await event.preventDefault();
    var envforDelete = this.state.cleanUpEnvironment;
    if (await envforDelete === '') {
      this.setState({ isErrorOnCleanUpEnvironment: true });
      return await this.getNotification('error', "Please select environment first.");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await ConfigSetter.deleteReportData(await envforDelete, 'All Days');
    this.setState({ isPageLoading: false });
    if (isSaved) {
      return await this.getNotification('success', 'Report data is successfully cleanup.');
    }
    else {
      return await this.getNotification('error', 'Unable to delete report data because of ' + Config.ErrorMessage);
    }

  }

  //****************** End */********************************** */

  render() {
    const selectRowFromUrlTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromURlTable,
      selected: [this.state.selectedRowFromUrlTable]
    };
    const selectRowFromEmulatorTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromEmulatorTable,
      selected: [this.state.selectedRowFromEmulatorTable]
    };
    const selectRowFromToolTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromToolTable,
      selected: [this.state.selectedRowFromToolTable]
    };
    return (
      <Page
        className="ConfigurationPage"
        title="UI Configuration"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          {/* <PageLoader sentences ={LoaderMessage} height ='100%' color ="black" /> */}
          <NotificationSystem ref={this.notificationSystem} />
          <Row>
            <Col lg={4} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Default Configuration
                    <Button size="sm" color='dark' onClick={this.saveDefaultConfiguration.bind(this)}>
                      <small>Save</small>
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup col>
                      <Label sm={5}>
                        Environment
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.validateDefaultSelectedEnvironment} onChange={this.selectDefaultEnvironment.bind(this)} name="defaultenvironment" value={this.state.defaultSelectedEnvironment}>
                          <DropDownOptions options={this.state.environmentList} />
                        </Input>
                      </Col>
                      <Label sm={10}>
                        Report trail count to show
                      </Label>
                      <Col>
                        <Input type="number" invalid={this.state.validatedefaultReportTrailCount} onChange={this.selectReportTRailCount.bind(this)} name="defaultreporttrail" value={this.state.defaultReportTrailCount}>
                        </Input>
                      </Col>
                      <Label sm={10}>
                        Days save to report
                      </Label>
                      <Col>
                        <Input type="number" name="defaultDaysToSave" invalid={this.state.validatedeDefaultSaveDaysToReport} value={this.state.defaultSaveDaysToReport} onChange={this.selectSaveDaysToReport.bind(this)}>
                        </Input>
                      </Col>
                      <Label sm={10}>
                        Days to see development/execution count
                      </Label>
                      <Col>
                        <Input type="number" name="defaultDevexeDays" invalid={this.state.validatedeSaveDaysToDevelopment} value={this.state.defaultSaveDaysToDevelopment} onChange={this.selectSaveDaysForDevandExecution.bind(this)}>
                        </Input>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={5} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Add new environment
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.addNewUrlForEnvironment.bind(this)}>
                        <small>Add</small>
                      </Button>
                      <Button color='info' onClick={this.saveUrlTableData.bind(this)}>
                        <small>Save</small>
                      </Button>
                      <Button color='dark' onClick={this.deleteUrlFromUrlTable.bind(this)}>
                        <small>Delete</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.envUrlList}
                      columns={EnvironmentURLTableHeader}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      selectRow={selectRowFromUrlTable}
                      cellEdit={cellEditFactory({
                        mode: 'click',
                        blurToSave: true,
                      })}
                    // pagination={paginationFactory(PagiNationData)}
                    />
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Default screen
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.saveDefaultScreen.bind(this)}>
                        <small>Save</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup col>
                      <Label sm={7}>
                        Execution Platform
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnExecutionPlatform} onChange={this.selectExecutionPlatForm.bind(this)} name="executionPlatform" value={this.state.defaultExecutionPlatform}>
                          <DropDownOptions options={this.state.allExecutionPlatform} />
                        </Input>
                      </Col>
                      <Label sm={10}>
                        Browser
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnBrowser} onChange={this.selectBrowser.bind(this)} name="browser" value={this.state.defaultBrowser}>
                          <DropDownOptions options={this.state.allBrowserList} />
                        </Input>
                      </Col>
                      <Label sm={10}>
                        Mobile Emulator
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnMobileEmulator} onChange={this.selectMobileEmulator.bind(this)} name="mobileEmulator" value={this.state.defaultMobileEmulator}>
                          <DropDownOptions options={this.state.allMobileEmulator} />
                        </Input>
                      </Col>
                      <Label sm={10}>
                        Tablet Emulator
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnTabletEmulator} onChange={this.selectTabletEmulator.bind(this)} name="tabletEmulator" value={this.state.defaultTabletEmulator}>
                          <DropDownOptions options={this.state.allTabletEmulator} />
                        </Input>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Emulator Screen
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.addNewEmulatorInfo.bind(this)}>
                        <small>Add</small>
                      </Button>
                      <Button color='info' onClick={this.saveEmulatorScreenData.bind(this)}>
                        <small>Save</small>
                      </Button>
                      <Button color='dark' onClick={this.deleteEmulatorInfo.bind(this)}>
                        <small>Delete</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.allEmulatorTableData}
                      columns={EmulatorTableHeader}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      selectRow={selectRowFromEmulatorTable}
                      cellEdit={cellEditFactory({
                        mode: 'click',
                        blurToSave: true,
                      })}
                    // pagination={paginationFactory(PagiNationData)}
                    />
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Test Management tool setup
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.addNewToolInfo.bind(this)}>
                        <small>Add</small>
                      </Button>
                      <Button color='info' onClick={this.saveToolInfo.bind(this)}>
                        <small>Save</small>
                      </Button>
                      <Button color='dark' onClick={this.deleteToolInfo.bind(this)}>
                        <small>Delete</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.allTestManagementToolData}
                      columns={TestToolTableHeader}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      selectRow={selectRowFromToolTable}
                      cellEdit={cellEditFactory({
                        mode: 'click',
                        blurToSave: true,
                      })}
                    // pagination={paginationFactory(PagiNationData)}
                    />
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Capability Setup
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.saveCapabilityData.bind(this)}>
                        <small>Save</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={5}>
                        Execution Server*
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnExecutionAt} onChange={this.selectCapabilityServer.bind(this)} name="executionAt" value={this.state.executionServer}>
                          <DropDownOptions options={this.state.allExecutionServer} />
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={5}>
                        Hub Url*
                      </Label>
                      <Col>
                        <Input type="input" invalid={this.state.isErrorOnServerUrl} onChange={this.addServerUrl.bind(this)} name="serverUrl" value={this.state.serverUrl}>
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={5}>
                        Capabilities*
                      </Label>
                      <Col>
                        <ReactJson name={true} collapsed={true} collapseStringsAfterLength={30} displayDataTypes={false} indentWidth={0} enableClipboard={true} iconStyle="circle" src={this.state.allCapabilities} onAdd={this.addCapabilitiesItem.bind(this)} onEdit={this.editCapabilitiesItem.bind(this)} onDelete={this.deleteCapabilitiesItem.bind(this)} />
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
                    Cleanup Reports
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.deleteReportForDays.bind(this)}>
                        <small>Save</small>
                      </Button>
                      <Button color='info' onClick={this.deleteAllReports.bind(this)}>
                        <small>Delete All</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={5}>
                        Environment
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnCleanUpEnvironment} onChange={this.selectCleanUpEnvironment.bind(this)} name="cleanUpEnvironment" value={this.state.cleanUpEnvironment}>
                          <DropDownOptions options={this.state.environmentList} />
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={5}>
                        Keep Report Data (timeline)
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnDayToDelete} onChange={this.selectKeepDaysToDate.bind(this)} name="keepReportData" value={this.state.selectedDaysForDelete}>
                          <option>7 Days</option>
                          <option>14 Days</option>
                          <option>30 Days</option>
                          <option>45 Days</option>
                          <option>60 Days</option>
                        </Input>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Fade>
      </Page>
    );
  }
}
export default ConfigurationPage;
