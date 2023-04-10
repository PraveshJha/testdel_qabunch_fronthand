import Page from 'components/Page';
import React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import genericHelper from '../funcLibraries/GenericHelper.js';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
var APIBasePath = window.ENV.APIURL;

function Options({ options }) {
  return (
    options.map(option =>
      <option key={option.Environment}>
        {option.Environment}
      </option>)
  );
}

function Tools({ options }) {
  let allitem = []
  for (let i = 0; i < options.length; i++) {
    allitem.push(options[i]);

  }
  return (
    allitem.map((i, index) =>
      <option >{allitem[index]}</option>)
  );

}

class Configuration extends React.Component {

  constructor(props) {
    super(props);
    this.state =
    {
      DefaultEnvironment: '',
      defaultBrowser: '',
      checkDashboardHistoryCount: false,
      feedbackDashboardHistoryCount: '',
      DashBoardHistoryCount: '',
      checkDashboardDays: false,
      feedbackDashboardDays: '',
      DashboardDays: '',
      HubMachineName: '',
      checkHubMachineName: false,
      feedbackHubMachineName: '',
      HubPortNumber: '',
      checkHubPort: false,
      feedbackHubPort: '',
      ConfigurationFile: [],
      CommonTestData: [],
      loader: true,
      RepotingHeaderName: '',
      ReportingHeaderColCode: '',
      ReportingSubHeaderColCode: '',
      feedbackReportingHeader: '',
      checkReportingHeader: false,
      checkHeaderColCode: false,
      feedbackHeaderColCode: '',
      checkSubHeaderColCode: false,
      feedbackSubHeaderColCode: '',
      checkSenderEmail: false,
      feedbackSenderEmailAddress: '',
      SenderEmailAddress: '',
      checkSenderPassword: false,
      feedbackSenderPassword: '',
      SenderPassword: '',
      checkReceiverEmail: false,
      ReceiverEmail: '',
      feedbackReceiverEmail: '',
      pageloadingStatus: false,
      Emulator: '',
      ScreenType: '',
      screenWidth: '',
      screenHight: '',
      checkScreenType: false,
      feedbackScreenType: '',
      checkWidth: false,
      feedbackWidth: false,
      checkHight: false,
      feedbackHight: false,
      allScreenName: [],
      defaultEmulator: '',
      defaltScreenName: '',
      allDefaultScreen: [],
      checkmanualdevURL: false,
      checkdevtoolUsername: false,
      checkdevtoolPassword: false,
      feedbackManualDevURL: '',
      feedbackUpdatedevUserName: '',
      feedbackUpdatedevPassword: '',
      manualdevURL: '',
      devtoolUserName: '',
      devtoolPassword: '',
      defaultTestManagmentTool: '',
      allTestManagmentTool: [],
      manualdevtool: '',
      manualdevURL: '',
      devtoolUserName: '',
      devtoolPassword: '',

    }
    const GetLoaderData = async () => {
      this.setState({ pageloadingStatus: true });
      const homepage = await fetch(APIBasePath + 'dashboard');
      const homepageResponse = await homepage.json();
      this.setState({ pageloadingStatus: false });
      if (homepageResponse.success) {
        this.setState({ ConfigurationFile: homepageResponse.Configuration });
        this.setState({ CommonTestData: homepageResponse.CommonTestData });
        this.setState({ DefaultEnvironment: this.state.ConfigurationFile.DefaultEnvironment });
        this.setState({ defaultBrowser: this.state.ConfigurationFile.DefaultBrowser });
        this.setState({ DashBoardHistoryCount: this.state.ConfigurationFile.DashboardHistoryCount });
        this.setState({ DashboardDays: this.state.ConfigurationFile.DashboardTotalDayCount });
        this.setState({ HubMachineName: this.state.ConfigurationFile.HUBMachineName });
        this.setState({ HubPortNumber: this.state.ConfigurationFile.HUBPort });
        this.setState({ RepotingHeaderName: this.state.ConfigurationFile.ReportingHeaderName });
        this.setState({ ReportingHeaderColCode: this.state.ConfigurationFile.HeaderColorCode });
        this.setState({ ReportingSubHeaderColCode: this.state.ConfigurationFile.SubHeaderColorCode });
        this.setState({ SenderEmailAddress: this.state.ConfigurationFile.SenderEmail });
        this.setState({ SenderPassword: this.state.ConfigurationFile.SenderPassword });
        this.setState({ ReceiverEmail: this.state.ConfigurationFile.ReceiverEmail });
        var defaultEmulation = this.state.ConfigurationFile.defaultemulation;
        var defaultExecutionScreen = this.state.ConfigurationFile.defaultscreenName;
        this.setState({ Emulator: defaultEmulation });
        this.setState({ defaultEmulator: defaultEmulation });
        this.setState({ defaltScreenName: defaultExecutionScreen });
        this.setState({ defaultTestManagmentTool: this.state.ConfigurationFile.defaultTestManagmentTool });
        var defaultTestTool = this.state.ConfigurationFile.defaultTestManagmentTool;
        this.setState({ manualdevtool: defaultTestTool });
        this.setState({ manualdevtool: defaultTestTool });
        this.setState({ manualdevURL: this.state.ConfigurationFile.TestManagmentTool[defaultTestTool]['URL'] });
        this.setState({ devtoolUserName: this.state.ConfigurationFile.TestManagmentTool[defaultTestTool]['UserName'] });
        this.setState({ devtoolPassword: this.state.ConfigurationFile.TestManagmentTool[defaultTestTool]['Password'] });
        this.setState({ allTestManagmentTool: genericHelper.common_GetListKeyFromJsonResponce(this.state.ConfigurationFile.TestManagmentTool) });
        //@ get all List
        var allItem = this.state.ConfigurationFile['Emulation'][defaultEmulation];
        var totalItem = genericHelper.common_GetListKeyFromJsonResponce(allItem);
        this.setState({ allScreenName: totalItem });
        this.setState({ allDefaultScreen: totalItem });
        this.setState({ loader: false });
      }
    }
    GetLoaderData();

  }
  UpdateEnv(event) {

    this.setState({ DefaultEnvironment: event.target.value })

  }
  UpdateBrowser(event) {
    this.setState({ defaultBrowser: event.target.value })
  }

  UpdateDefaultTestManagmentTool(event) {
    this.setState({ defaultTestManagmentTool: event.target.value })
  }

  UpdateDefaultEmulation(event) {
    var Item = event.target.value;
    if (Item !== this.state.defaultEmulator) {
      this.setState({ defaltScreenName: '' });
      this.setState({ defaultEmulator: Item });
      var allItem = this.state.ConfigurationFile['Emulation'][Item];
      var totalItem = genericHelper.common_GetListKeyFromJsonResponce(allItem);
      this.setState({ allDefaultScreen: totalItem });
    }
  }
  UpdateEmulation(event) {
    var Item = event.target.value;
    if (Item !== this.state.Emulator) {
      this.setState({ Emulator: Item })
      this.setState({ allScreenName: [] });
      this.setState({ ScreenType: '' });
      this.setState({ screenWidth: '' });
      this.setState({ screenHight: '' });
      var allItem = this.state.ConfigurationFile['Emulation'][Item];
      var totalItem = genericHelper.common_GetListKeyFromJsonResponce(allItem);
      this.setState({ allScreenName: totalItem });
    }
  }
  UpdatescreenWidth(event) {
    var Item = event.target.value;
    if (Item !== this.state.screenWidth) {
      this.setState({ screenWidth: Item })
    }
    var format = /[^0-9]/ig;
    if (format.test(Item)) {
      this.setState({ checkWidth: true });
      return this.setState({ feedbackWidth: 'Width* can have number only' });
    }
    else {
      this.setState({ checkWidth: false });
    }
  }
  UpdatescreenHight(event) {
    var Item = event.target.value.trim();
    if (Item !== this.state.screenHight) {
      this.setState({ screenHight: Item })
    }
    var format = /[^0-9]/ig;
    if (format.test(Item)) {
      this.setState({ checkHight: true });
      return this.setState({ feedbackHight: 'Hight* can have number only' });
    }
    else {
      this.setState({ checkHight: false });
    }
  }
  UpdateManualDevtool(event) {
    var Item = event.target.value.trim();
    if (Item !== this.state.manualdevtool) {
      this.setState({ manualdevtool: Item })
      this.setState({ manualdevURL: this.state.ConfigurationFile.TestManagmentTool[Item]['URL'] });
      this.setState({ devtoolUserName: this.state.ConfigurationFile.TestManagmentTool[Item]['UserName'] });
      this.setState({ devtoolPassword: this.state.ConfigurationFile.TestManagmentTool[Item]['Password'] });
    }
  }
  UpdatesManualDevURL(event) {
    this.setState({ checkmanualdevURL: false })
    var Item = event.target.value.trim();
    if (Item !== this.state.manualdevURL) {
      this.setState({ manualdevURL: Item })
    }
  }
  UpdatedevUserName(event) {
    this.setState({ checkdevtoolUsername: false })
    var Item = event.target.value.trim();
    if (Item !== this.state.devtoolUserName) {
      this.setState({ devtoolUserName: Item })

    }
  }
  UpdatedevPassword(event) {
    this.setState({ checkdevtoolPassword: false })
    var Item = event.target.value.trim();
    if (Item !== this.state.devtoolPassword) {
      this.setState({ devtoolPassword: Item })
    }
  }
  selectdefaultScreen(event) {
    var Item = event;
    if (Item !== this.state.defaltScreenName) {
      this.setState({ defaltScreenName: Item })
    }
  }
  selectScreenType(event) {
    var Item = event;
    if (Item !== this.state.ScreenType) {
      this.setState({ ScreenType: Item })
    }
  }
  UpdateScreenType(event) {
    var Item = event;
    if (Item !== this.state.ScreenType) {
      this.setState({ ScreenType: Item })
    }
    var format = /[^A-Za-z0-9- ]/ig;
    if (format.test(Item)) {
      this.setState({ checkScreenType: true });
      return this.setState({ feedbackScreenType: 'Screen Name* should not have special characters.' });
    }
    else {
      this.setState({ checkScreenType: false });
    }
  }
  afterFocusScreenType() {
    try {
      var emu = this.state.Emulator;
      var Item = this.state.ScreenType;
      var width = this.state.ConfigurationFile['Emulation'][emu][Item]['WIDTH'];
      var hight = this.state.ConfigurationFile['Emulation'][emu][Item]['HIGHT'];
      this.setState({ screenWidth: width });
      this.setState({ screenHight: hight });
    }
    catch (error) {
      this.setState({ screenWidth: '' });
      this.setState({ screenHight: '' });
    }
  }

  UpdateDashBoardHistoryCount(event) {

    this.setState({ checkDashboardHistoryCount: false })
    this.setState({ DashBoardHistoryCount: event.target.value })

  }

  UpdateHubMachineName(event) {

    this.setState({ checkHubMachineName: false })
    this.setState({ HubMachineName: event.target.value })

  }

  UpdateHubPort(event) {

    this.setState({ checkHubPort: false })
    this.setState({ HubPortNumber: event.target.value })

  }
  UpdateDashBoardDays(event) {

    this.setState({ checkDashboardDays: false })
    this.setState({ DashboardDays: event.target.value })

  }
  UpdateReportingHeaderName(event) {

    this.setState({ checkReportingHeader: false })
    this.setState({ feedbackReportingHeader: '' })
    this.setState({ RepotingHeaderName: event.target.value })
  }

  UpdateHeaderColorCode(event) {

    this.setState({ checkHeaderColCode: false })
    this.setState({ feedbackHeaderColCode: '' })
    this.setState({ ReportingHeaderColCode: event.target.value })
  }
  UpdateSubHeaderColorCode(event) {

    this.setState({ checkSubHeaderColCode: false })
    this.setState({ feedbackSubHeaderColCode: '' })
    this.setState({ ReportingSubHeaderColCode: event.target.value })
  }

  UpdateSenderEmailAddress(event) {

    this.setState({ checkSenderEmail: false })
    this.setState({ feedbackSenderEmailAddress: '' })
    this.setState({ SenderEmailAddress: event.target.value })
  }
  UpdateSenderPassword(event) {

    this.setState({ checkSenderPassword: false })
    this.setState({ feedbackSenderPassword: '' })
    this.setState({ SenderPassword: event.target.value })
  }
  UpdateRecieverEmailAddress(event) {

    this.setState({ checkReceiverEmail: false })
    this.setState({ feedbackReceiverEmail: '' })
    this.setState({ ReceiverEmail: event.target.value })
  }
  SaveConfig() {
    var env = this.state.DefaultEnvironment;
    var Browser = this.state.defaultBrowser;
    var HistoryCount = this.state.DashBoardHistoryCount;
    var DashboardDaycount = this.state.DashboardDays;
    var executionEmulation = this.state.defaultEmulator;
    var executionScreen = this.state.defaltScreenName;
    var testTool = this.state.defaultTestManagmentTool;
    var ExceptionMessage = '';
    if (isNaN(HistoryCount) || HistoryCount.trim() === "") {
      this.setState({ checkDashboardHistoryCount: true })
      this.setState({ feedbackDashboardHistoryCount: 'Dashboard History Count* takes only numeric value.' })
      ExceptionMessage = ExceptionMessage + 'Dashboard History Count* takes only numeric value..'
    }
    if (isNaN(DashboardDaycount) || DashboardDaycount.trim() === '') {
      this.setState({ checkDashboardDays: true })
      this.setState({ feedbackDashboardDays: 'Dashboard Total Day Count* takes only numeric value.' })
      ExceptionMessage = ExceptionMessage + 'Dashboard Total Day Count* takes only numeric value..'
    }
    if (executionScreen === '') {
      this.setState({ modal: true });
      this.setState({ modalValidationText: 'Default Execution Machine name can not blank.' });
      return;
    }
    if (ExceptionMessage.trim() !== "") {
      // this.setState({modal:true})
      return;
    }
    this.setState({ loader: true })
    var CommonJObject = {};
    CommonJObject["DefaultEnvironment"] = env;
    CommonJObject["DefaultBrowser"] = Browser;
    CommonJObject["DashboardHistoryCount"] = HistoryCount;
    CommonJObject["DashboardTotalDayCount"] = DashboardDaycount;
    CommonJObject["defaultemulation"] = executionEmulation;
    CommonJObject["defaultscreenName"] = executionScreen;
    CommonJObject["TestManagementTool"] = testTool;
    var configjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject)
    var configAPI = APIBasePath + 'configuration';
    var requestOptions = {
      method: 'POST',
      headers: { "Accept": "*/*", 'Content-type': 'application/json' },
      body: JSON.stringify(configjson)
    };
    const configurationRequest = async () => {
      this.setState({ pageloadingStatus: true });
      const ORResponse = await fetch(configAPI, requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({ loader: false })
      this.setState({ pageloadingStatus: false });
      this.setState({ modal: true })
      this.setState({ modalValidationText: ORJson.servermessage })
    }
    configurationRequest();

  }

  SaveManualDevToolInfo() {
    var devURL = this.state.manualdevURL;
    var devUser = this.state.devtoolUserName;
    var devPassword = this.state.devtoolPassword;
    var errorMessage = '';
    if (devURL.trim() == '') {
      errorMessage = 'URL* can not be blank.'
      this.setState({ checkmanualdevURL: true });
      this.setState({ feedbackManualDevURL: 'URL* can not be blank' });
    }
    if (devUser.trim() == '') {
      errorMessage = errorMessage + 'Username* can not be blank.'
      this.setState({ checkdevtoolUsername: true });
      this.setState({ feedbackUpdatedevUserName: 'Username* can not be blank' });
    }
    if (devPassword.trim() == '') {
      errorMessage = errorMessage + 'Password* can not be blank.'
      this.setState({ checkdevtoolPassword: true });
      this.setState({ feedbackUpdatedevPassword: 'Password* can not be blank' });
    }
    if (errorMessage.trim() !== '') {
      return;
    }
    //@ Post Request
    var postData = {};
    postData["DevTool"] = this.state.manualdevtool;
    postData["DevURL"] = devURL;
    postData["DevUserName"] = devUser;
    postData["DevPassword"] = devPassword;
    var configjson = genericHelper.common_ChangeJsoncontentforServer(postData);
    var requestAPI = APIBasePath + 'configuration/5';
    var requestOptions = {
      method: 'POST',
      headers: { "Accept": "*/*", 'Content-type': 'application/json' },
      body: JSON.stringify(configjson)
    };
    const requestforServer = async () => {
      this.setState({ loader: true })
      this.setState({ pageloadingStatus: true });
      const responseItem = await fetch(requestAPI, requestOptions);
      const responseBody = await responseItem.json();
      this.setState({ loader: false })
      this.setState({ pageloadingStatus: false });
      this.setState({ modal: true })
      this.setState({ modalValidationText: responseBody.servermessage })
    }
    requestforServer();
  }

  SaveScreenSetUp() {
    var emulation = this.state.Emulator;
    var screenName = this.state.ScreenType;
    var Width = this.state.screenWidth;
    var Hight = this.state.screenHight;
    console.log(Width)
    console.log(Hight)
    var ExceptionMessage = '';
    if (screenName.trim() === '') {
      this.setState({ checkScreenType: true })
      this.setState({ feedbackScreenType: 'Screen name* can not be blank.' })
      ExceptionMessage = ExceptionMessage + 'Screen name* can not be blank.'
      this.setState({ modal: true })
      this.setState({ modalValidationText: ExceptionMessage })
      return;

    }
    if (Width === '') {
      this.setState({ checkWidth: true })
      this.setState({ feedbackWidth: 'Screen width can not be blank.' })
      ExceptionMessage = ExceptionMessage + 'Screen width can not be blank.';
    }
    if (Hight === '') {
      this.setState({ checkHight: true })
      this.setState({ feedbackHight: 'Screen hight can not be blank.' })
      ExceptionMessage = ExceptionMessage + 'Screen hight can not be blank.';
    }
    if (ExceptionMessage.trim() !== "") {
      return;
    }
    if (this.state.checkScreenType) {
      this.setState({ modal: true })
      this.setState({ modalValidationText: ExceptionMessage })
      return;
    }
    if (this.state.checkWidth) {
      return;
    }
    if (this.state.checkHight) {
      return;
    }
    //@ Post Request
    var postData = {};
    postData["Emulation"] = emulation;
    postData["ScreenName"] = screenName;
    postData["ScreenWidth"] = Width;
    postData["ScreenHight"] = Hight;
    var configjson = genericHelper.common_ChangeJsoncontentforServer(postData);
    var requestAPI = APIBasePath + 'configuration/4';
    var requestOptions = {
      method: 'POST',
      headers: { "Accept": "*/*", 'Content-type': 'application/json' },
      body: JSON.stringify(configjson)
    };
    const requestforServer = async () => {
      this.setState({ loader: true })
      this.setState({ pageloadingStatus: true });
      const responseItem = await fetch(requestAPI, requestOptions);
      const responseBody = await responseItem.json();
      this.setState({ loader: false })
      this.setState({ pageloadingStatus: false });
      this.setState({ modal: true })
      this.setState({ modalValidationText: responseBody.servermessage })
    }
    requestforServer();

  }

  SaveHUBconfig() {
    var ExceptionMessage = '';
    var hub = this.state.HubMachineName;
    var port = this.state.HubPortNumber;
    if (hub.trim() === "") {
      this.setState({ checkHubMachineName: true })
      this.setState({ feedbackHubMachineName: 'Hub Machine Name* can not be blank' })
      ExceptionMessage = ExceptionMessage + 'Hub Machine Name* can not be blank'
    }
    if (isNaN(port)) {
      this.setState({ checkHubPort: true })
      this.setState({ feedbackHubPort: 'Port Number* takes only numeric value.' })
      ExceptionMessage = ExceptionMessage + 'Port Number* takes only numeric value..'
    }
    if (port.trim() === "") {
      this.setState({ checkHubPort: true })
      this.setState({ feedbackHubPort: 'Port Number* can not be blank' })
      ExceptionMessage = ExceptionMessage + 'Port Number* can not be blank'
    }
    if (ExceptionMessage.trim() !== "") {
      return;
    }
    this.setState({ loader: true })
    var CommonJObject = {};
    CommonJObject["HUBMachineName"] = hub;
    CommonJObject["HUBPort"] = port;
    var configjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject);
    var configAPI = APIBasePath + 'configuration/1';
    var requestOptions = {
      method: 'POST',
      headers: { "Accept": "*/*", 'Content-type': 'application/json' },
      body: JSON.stringify(configjson)
    };
    const configurationRequest = async () => {
      this.setState({ pageloadingStatus: true });
      const ORResponse = await fetch(configAPI, requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({ pageloadingStatus: false });
      this.setState({ loader: false })
      this.setState({ modal: true })
      this.setState({ modalValidationText: ORJson.servermessage })


    }
    configurationRequest();
  }

  SaveReportSettingconfig() {
    var ExceptionMessage = '';
    var headerName = this.state.RepotingHeaderName;
    var headerColCode = this.state.ReportingHeaderColCode;
    var SubheaderColCode = this.state.ReportingSubHeaderColCode;
    if (headerName.trim() === "") {
      this.setState({ checkReportingHeader: true })
      this.setState({ feedbackReportingHeader: 'Reporting Header Name* can not be blank' })
      ExceptionMessage = 'Reporting Header Name* can not be blank';
    }
    if (headerColCode.trim() === "") {
      this.setState({ checkHeaderColCode: true })
      this.setState({ feedbackHeaderColCode: 'Header Color Code* can not be blank' })
      ExceptionMessage = ExceptionMessage + 'Header Color Code* can not be blank';
    }
    if (SubheaderColCode.trim() === "") {
      this.setState({ checkSubHeaderColCode: true })
      this.setState({ feedbackSubHeaderColCode: 'SubHeader Color Code* can not be blank' })
      ExceptionMessage = ExceptionMessage + 'SubHeader Color Code* can not be blank';
    }
    if (ExceptionMessage.trim() !== "") {
      return;
    }
    this.setState({ loader: true })
    var CommonJObject = {};
    CommonJObject["ReportingHeaderName"] = headerName;
    CommonJObject["HeaderColorCode"] = headerColCode;
    CommonJObject["SubHeaderColorCode"] = SubheaderColCode;
    var configjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject);
    var configAPI = APIBasePath + 'configuration/2';
    var requestOptions = {
      method: 'POST',
      headers: { "Accept": "*/*", 'Content-type': 'application/json' },
      body: JSON.stringify(configjson)
    };
    const configurationRequest = async () => {
      this.setState({ pageloadingStatus: true });
      const ORResponse = await fetch(configAPI, requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({ loader: false })
      this.setState({ pageloadingStatus: false });
      this.setState({ modal: true })
      this.setState({ modalValidationText: ORJson.servermessage })

    }
    configurationRequest();
  }

  SaveEmailSetUp() {
    var ExceptionMessage = '';
    var senderEmail = this.state.SenderEmailAddress;
    var Password = this.state.SenderPassword;
    var RecEmailAddress = this.state.ReceiverEmail;
    if (senderEmail.trim() === "") {
      this.setState({ checkSenderEmail: true })
      this.setState({ feedbackSenderEmailAddress: 'Sender Email Address* can not be blank' })
      ExceptionMessage = 'Sender Email Address* can not be blank';
    }
    if (Password.trim() === "") {
      this.setState({ checkSenderPassword: true })
      this.setState({ feedbackSenderPassword: 'Password* can not be blank' })
      ExceptionMessage = ExceptionMessage + 'Password* can not be blank';
    }
    if (RecEmailAddress.trim() === "") {
      this.setState({ checkReceiverEmail: true })
      this.setState({ feedbackReceiverEmail: 'Receiver Email Address* can not be blank' })
      ExceptionMessage = ExceptionMessage + 'Receiver Email Address* can not be blank';
    }
    if (ExceptionMessage.trim() !== "") {
      return;
    }
    this.setState({ loader: true })
    var CommonJObject = {};
    CommonJObject["SenderEmail"] = senderEmail;
    CommonJObject["SenderPassword"] = Password;
    CommonJObject["ReceiverEmail"] = RecEmailAddress;
    var configjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject)
    var configAPI = APIBasePath + 'configuration/3';
    var requestOptions = {
      method: 'POST',
      headers: { "Accept": "*/*", 'Content-type': 'application/json' },
      body: JSON.stringify(configjson)
    };
    const configurationRequest = async () => {
      this.setState({ pageloadingStatus: true });
      const ORResponse = await fetch(configAPI, requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({ loader: false })
      this.setState({ pageloadingStatus: false });
      this.setState({ modal: true })
      this.setState({ modalValidationText: ORJson.servermessage })

    }
    configurationRequest();
  }

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  render() {

    return (
      <Page title="Configuration Setup" breadcrumbs={[{ name: 'Configuration', active: true }]}>
        <Loader
          type="ThreeDots"
          color="#00BFFF"
          height={50}
          width={100}
          timeout={120000} //3 secs
          visible={this.state.loader}
        />
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Execution Setup</CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Default Environment*
                    </Label>
                    <Col>
                      <Input disabled={this.state.pageloadingStatus} type="select" name="envlist" value={this.state.DefaultEnvironment} onChange={this.UpdateEnv.bind(this)}>
                        <Options options={this.state.CommonTestData} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Default Browser*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} type="select" name="defaultbrowser" value={this.state.defaultBrowser} onChange={this.UpdateBrowser.bind(this)}>
                        <option>CHROME</option>
                        <option>FIREFOX</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Dashboard History Count*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkDashboardHistoryCount} type="input" name="DashboardHistory" value={this.state.DashBoardHistoryCount} onChange={this.UpdateDashBoardHistoryCount.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackDashboardHistoryCount}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Dashboard Total Day Count*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkDashboardDays} type="input" name="DashboardDay" value={this.state.DashboardDays} onChange={this.UpdateDashBoardDays.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackDashboardDays}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Default Emulation*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} type="select" name="defaultapplicationType" value={this.state.defaultEmulator} onChange={this.UpdateDefaultEmulation.bind(this)}>
                        <option>Web</option>
                        <option>Mobile</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Default Execution Screen*
                    </Label>
                    <Col >
                      <Combobox disabled={this.state.pageloadingStatus} name="defaultScreenType"
                        value={this.state.defaltScreenName}
                        data={this.state.allDefaultScreen}
                        onSelect={this.selectdefaultScreen.bind(this)}
                      />
                      <FormFeedback>
                        {this.state.feedbackScreenType}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Default Test Development Tool*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} type="select" name="defaulttestManagmentTool" value={this.state.defaultTestManagmentTool} onChange={this.UpdateDefaultTestManagmentTool.bind(this)}>
                        <Tools options={this.state.allTestManagmentTool} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <Col >
                    <Button disabled={this.state.pageloadingStatus} onClick={this.SaveConfig.bind(this)} color="primary" name="SaveConfiguration">Save</Button>
                  </Col>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle()}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggle()}> Information</ModalHeader>
                    <ModalBody >
                      {this.state.modalValidationText}
                    </ModalBody>
                    <ModalFooter>
                      <Button disabled={this.state.pageloadingStatus} color="secondary" onClick={this.toggle()}>
                        OK
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Selenium Grid Setup</CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Hub Machine IP*
                    </Label>
                    <Col>
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkHubMachineName} type="input" name="DashboardHistory" value={this.state.HubMachineName} onChange={this.UpdateHubMachineName.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackHubMachineName}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Port Number*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkHubPort} type="input" name="DashboardHistory" value={this.state.HubPortNumber} onChange={this.UpdateHubPort.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackHubPort}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <Col >
                    <Button disabled={this.state.pageloadingStatus} onClick={this.SaveHUBconfig.bind(this)} color="primary" name="SaveConfiguration">Save</Button>
                  </Col>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Reporting Setup</CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Reporting Header Name*
                    </Label>
                    <Col>
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkReportingHeader} type="input" name="ReportingHeaderName" value={this.state.RepotingHeaderName} onChange={this.UpdateReportingHeaderName.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackReportingHeader}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Header Color Code*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkHeaderColCode} type="input" name="ReportingHeaderColCode" value={this.state.ReportingHeaderColCode} onChange={this.UpdateHeaderColorCode.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackHeaderColCode}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      SubHeader Color Code*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkSubHeaderColCode} type="input" name="ReportingSubHeaderColCode" value={this.state.ReportingSubHeaderColCode} onChange={this.UpdateSubHeaderColorCode.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackSubHeaderColCode}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <Col >
                    <Button disabled={this.state.pageloadingStatus} onClick={this.SaveReportSettingconfig.bind(this)} color="primary" name="SaveReportingSetting">Save</Button>
                  </Col>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Email Configuration</CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Sender Email Address*
                    </Label>
                    <Col>
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkSenderEmail} type="input" name="senderEmailAddress" value={this.state.SenderEmailAddress} onChange={this.UpdateSenderEmailAddress.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackSenderEmailAddress}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Password*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkSenderPassword} type="password" name="SenderPassword" value={this.state.SenderPassword} onChange={this.UpdateSenderPassword.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackSenderPassword}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Receiver Email Address*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkReceiverEmail} type="input" name="ReceiverEmail" value={this.state.ReceiverEmail} onChange={this.UpdateRecieverEmailAddress.bind(this)} />
                      <FormFeedback>
                        {this.state.feedbackReceiverEmail}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <Col >
                    <Button disabled={this.state.pageloadingStatus} onClick={this.SaveEmailSetUp.bind(this)} color="primary" name="SaveEmailSetUp">Save</Button>
                  </Col>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Responsive testing Set Up</CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Emulation*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} type="select" name="defaultapplicationType" value={this.state.Emulator} onChange={this.UpdateEmulation.bind(this)}>
                        <option>Web</option>
                        <option>Mobile</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Screen Name*
                    </Label>
                    <Col >
                      <Combobox disabled={this.state.pageloadingStatus} invalid={this.state.checkScreenType} name="defaultScreenType"
                        value={this.state.ScreenType}
                        data={this.state.allScreenName}
                        caseSensitive={false}
                        minLength={3}
                        filter='contains'
                        onSelect={this.selectScreenType.bind(this)}
                        onChange={this.UpdateScreenType.bind(this)}
                        onBlur={this.afterFocusScreenType.bind(this)}
                      />
                      <FormFeedback>
                        {this.state.feedbackScreenType}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Width*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkWidth} type="input" name="screenWidth" value={this.state.screenWidth} onChange={this.UpdatescreenWidth.bind(this)}>
                      </Input>
                      <FormFeedback>
                        {this.state.feedbackWidth}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Hight*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkHight} type="input" name="defaultapplicationType" value={this.state.screenHight} onChange={this.UpdatescreenHight.bind(this)}>
                      </Input>
                      <FormFeedback>
                        {this.state.feedbackHight}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <Col >
                    <Button disabled={this.state.pageloadingStatus} onClick={this.SaveScreenSetUp.bind(this)} color="primary" name="SaveScreenSetup">Save</Button>
                  </Col>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Test Development Tool Set Up</CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Development Tool*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} type="select" name="testdevtool" value={this.state.manualdevtool} onChange={this.UpdateManualDevtool.bind(this)}>
                        <Tools options={this.state.allTestManagmentTool} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      URL*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkmanualdevURL} type="input" name="manualdevURL" value={this.state.manualdevURL} onChange={this.UpdatesManualDevURL.bind(this)}>
                      </Input>
                      <FormFeedback>
                        {this.state.feedbackManualDevURL}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Username*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkdevtoolUsername} type="input" name="defaultapplicationType" value={this.state.devtoolUserName} onChange={this.UpdatedevUserName.bind(this)}>
                      </Input>
                      <FormFeedback>
                        {this.state.feedbackUpdatedevUserName}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={6}>
                      Password*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkdevtoolPassword} type="password" name="defaultapplicationType" value={this.state.devtoolPassword} onChange={this.UpdatedevPassword.bind(this)}>
                      </Input>
                      <FormFeedback>
                        {this.state.feedbackUpdatedevPassword}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                  <Col >
                    <Button disabled={this.state.pageloadingStatus} onClick={this.SaveManualDevToolInfo.bind(this)} color="primary" name="SaveDevToolInfo">Save</Button>
                  </Col>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
};

export default Configuration;
