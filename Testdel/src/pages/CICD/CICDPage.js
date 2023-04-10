import Page from '../Page';
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
  Nav,
  Fade,
} from 'reactstrap';
import bn from '../../utils/bemnames';
import { CICDData } from './CICDData'
import CICDGetter from './CICDGetter';
import { Config } from '../../QAautoMATER/Config';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import NotificationSystem from 'react-notification-system';
import "react-widgets/styles.css";
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../LoaderMessage';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-widgets/styles.css";
import "react-widgets/styles.css";
import { Combobox } from 'react-widgets'
import { ExecutionTableHeaderWithoutStatus } from '../Api/ExecutionLab/ExecutionTableHeader'
import DropDownOptions from '../../uiLayout/components/DropDownOptions'
const bem = bn.create('header');

class CICDPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //****** Button Color ***********************************************************
      buttonWebColor: 'dark',
      buttonApiColor: 'white',
      selectedTab: CICDData.SelectedTab,
      isWebSelected: true,

      //****** Execution Configuration  ******************************************************
      environmentList: CICDData.EnvironmentList,
      selectedEnv: CICDData.SelectedEnv,
      isErrorOnEnvironment: CICDData.IsErrorOnEnvironment,
      componentList: CICDData.ComponentList,
      selectedComponent: CICDData.SelectedComponent,
      isErrorOnComponent: CICDData.IsErrorOnComponent,
      testingType: CICDData.TestingType,
      threadList: CICDData.ThreadList,
      threadCount: CICDData.ThreadCount,
      listOfTestingType: CICDData.ListOfTestingType,

      //****** Test Suite section  ***********************************************************
      screenOptionList: CICDData.ScreenOptionList,
      selectedScreenOption: CICDData.SelectedScreenOption,
      deviceList: CICDData.DeviceList,
      selectedDevice: CICDData.SelectedDevice,
      allTestSuite: CICDData.AllTestSuite,
      selectedTestSuite: CICDData.SelectedTestSuite,
      isValidTestSuiteName: CICDData.IsValidTestSuiteName,

      //****** Test Script Table ***********************************************************
      listOfTestScripts: CICDData.ListOfTestScripts,
      selectedTestScripts: CICDData.SelectedTestScripts,

      //****** API URL  ***********************************************************
      apiUrl: CICDData.ApiUrl,
      customApiUrl: CICDData.CustomApiUrl,
      selectedRunAtOption:CICDData.SelectedRunAtOption,
      runAtOptionList:CICDData.RunAtOptionList,

    };

  }
  componentWillMount = async () => {
    window.scrollTo(0, 0);
    await CICDGetter.loadCICDPage();

    //****** Button color ***********************************************************

    this.setState({ selectedTab: CICDData.SelectedTab })
    this.setState({ buttonWebColor: await CICDGetter.getWebButtonColor() })
    this.setState({ buttonApiColor: await CICDGetter.getApiButtonColor() })

    //****** Execution Configuration  ***********************************************************

    this.setState({ environmentList: CICDData.EnvironmentList })
    this.setState({ selectedEnv: CICDData.SelectedEnv })
    this.setState({ isErrorOnEnvironment: CICDData.IsErrorOnEnvironment })
    this.setState({ componentList: CICDData.ComponentList })
    this.setState({ selectedComponent: CICDData.SelectedComponent })
    this.setState({ isErrorOnComponent: CICDData.IsErrorOnComponent })
    this.setState({ testingType: CICDData.TestingType })
    this.setState({ threadList: CICDData.ThreadList })
    this.setState({ threadCount: CICDData.ThreadCount })
    this.setState({ allTestSuite: CICDData.AllTestSuite })
    this.setState({ selectedTestSuite: CICDData.SelectedTestSuite })
    this.setState({ isValidTestSuiteName: CICDData.IsValidTestSuiteName })

    //****** Test Suite section  ***********************************************************
    this.setState({ screenOptionList: CICDData.ScreenOptionList })
    this.setState({ selectedScreenOption: CICDData.SelectedScreenOption })
    this.setState({ deviceList: CICDData.DeviceList })
    this.setState({ selectedDevice: CICDData.SelectedDevice })

    //****** Test Script Table ***********************************************************
    this.setState({ listOfTestScripts: CICDData.ListOfTestScripts })
    this.setState({ selectedTestScripts: CICDData.SelectedTestScripts })

    //****** API URL  ********************************************************************
    this.setState({ selectedRunAtOption: CICDData.SelectedRunAtOption })
    this.setState({ runAtOptionList: CICDData.RunAtOptionList })
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

  //************************* Tab Selection ***************************************************************
  selectWebDashboard = async () => {
    if (CICDData.SelectedTab !== 'Web') {
      this.setState({ isWebSelected: true })
      this.setState({ isPageLoading: true });
      CICDData.SelectedTab = 'Web';
      this.setState({ buttonWebColor: 'dark' })
      this.setState({ buttonApiColor: 'white' })
      CICDData.EnvironmentList = [];
      this.setState({ environmentList: CICDData.EnvironmentList });
      CICDData.SelectedEnv = ''
      this.setState({ selectedEnv: CICDData.SelectedEnv });
      CICDData.IsErrorOnEnvironment = false;
      this.setState({ isErrorOnEnvironment: CICDData.IsErrorOnEnvironment });
      CICDData.ComponentList = [];
      this.setState({ componentList: CICDData.ComponentList });
      CICDData.SelectedComponent = '';
      this.setState({ selectedComponent: CICDData.SelectedComponent });
      CICDData.IsErrorOnComponent = false;
      this.setState({ isErrorOnComponent: CICDData.IsErrorOnComponent });
      CICDData.ListOfTestScripts = [];
      this.setState({ listOfTestScripts: CICDData.ListOfTestScripts });
      CICDData.SelectedTestScripts = ''
      this.setState({ selectedTestScripts: CICDData.SelectedTestScripts });
      CICDData.TestingType = 'Integration Testing';
      this.setState({ testingType: CICDData.TestingType });
      CICDData.ThreadCount = 1;
      this.setState({ threadCount: CICDData.ThreadCount });
      CICDData.AllTestSuite = [];
      this.setState({ allTestSuite: CICDData.AllTestSuite })
      CICDData.SelectedTestSuite = ''
      this.setState({ selectedTestSuite: CICDData.SelectedTestSuite })

      await CICDGetter.loadCICDPage('Web');

      //****** Execution Configuration  ***********************************************************

      this.setState({ environmentList: CICDData.EnvironmentList })
      this.setState({ selectedEnv: CICDData.SelectedEnv })
      this.setState({ isErrorOnEnvironment: CICDData.IsErrorOnEnvironment })
      this.setState({ componentList: CICDData.ComponentList })
      this.setState({ selectedComponent: CICDData.SelectedComponent })
      this.setState({ isErrorOnComponent: CICDData.IsErrorOnComponent })

      //****** Test Suite section  ***********************************************************
      this.setState({ screenOptionList: CICDData.ScreenOptionList })
      this.setState({ selectedScreenOption: CICDData.SelectedScreenOption })
      this.setState({ deviceList: CICDData.DeviceList })
      this.setState({ selectedDevice: CICDData.SelectedDevice })
      this.setState({ allTestSuite: CICDData.AllTestSuite })
      this.setState({ selectedTestSuite: CICDData.SelectedTestSuite })

      //****** Test Script Table ***********************************************************

      this.setState({ listOfTestScripts: CICDData.ListOfTestScripts })
      this.setState({ selectedTestScripts: CICDData.SelectedTestScripts })
      CICDData.ListOfTestingType = ['Integration Testing'];

      this.setState({ isPageLoading: false });
    }
  }

  selectApiDashboard = async () => {
    if (CICDData.SelectedTab !== 'Api') {
      this.setState({ isWebSelected: false })
      this.setState({ isPageLoading: true });
      CICDData.SelectedTab = 'Api';
      this.setState({ buttonWebColor: 'white' })
      this.setState({ buttonApiColor: 'dark' })
      CICDData.EnvironmentList = [];
      this.setState({ environmentList: CICDData.EnvironmentList });
      CICDData.SelectedEnv = ''
      this.setState({ selectedEnv: CICDData.SelectedEnv });
      CICDData.IsErrorOnEnvironment = false;
      this.setState({ isErrorOnEnvironment: CICDData.IsErrorOnEnvironment });
      CICDData.ComponentList = [];
      this.setState({ componentList: CICDData.ComponentList });
      CICDData.SelectedComponent = '';
      this.setState({ selectedComponent: CICDData.SelectedComponent });
      CICDData.IsErrorOnComponent = false;
      this.setState({ isErrorOnComponent: CICDData.IsErrorOnComponent });
      CICDData.ListOfTestScripts = [];
      this.setState({ listOfTestScripts: CICDData.ListOfTestScripts });
      CICDData.SelectedTestScripts = ''
      this.setState({ selectedTestScripts: CICDData.SelectedTestScripts });
      CICDData.TestingType = 'Unit Testing';
      this.setState({ testingType: CICDData.TestingType });
      CICDData.ThreadCount = 1;
      this.setState({ threadCount: CICDData.ThreadCount });
      CICDData.AllTestSuite = [];
      this.setState({ allTestSuite: CICDData.AllTestSuite })
      CICDData.SelectedTestSuite = ''
      this.setState({ selectedTestSuite: CICDData.SelectedTestSuite })
      await CICDGetter.loadCICDPage('Api');

      //****** Execution Configuration  ***********************************************************

      this.setState({ environmentList: CICDData.EnvironmentList })
      this.setState({ selectedEnv: CICDData.SelectedEnv })
      this.setState({ isErrorOnEnvironment: CICDData.IsErrorOnEnvironment })
      this.setState({ componentList: CICDData.ComponentList })
      this.setState({ selectedComponent: CICDData.SelectedComponent })
      this.setState({ isErrorOnComponent: CICDData.IsErrorOnComponent })
      this.setState({ allTestSuite: CICDData.AllTestSuite })
      this.setState({ selectedTestSuite: CICDData.SelectedTestSuite })

      //****** Test Script Table ***********************************************************

      this.setState({ listOfTestScripts: CICDData.ListOfTestScripts })
      this.setState({ selectedTestScripts: CICDData.SelectedTestScripts })
      CICDData.ListOfTestingType = ['Integration Testing', 'Unit Testing'];
      this.setState({ listOfTestingType: CICDData.ListOfTestingType });
      this.setState({ isPageLoading: false });
    }
  }

  //****** Execution Configuration  ******************************************************************************

  selectEnv = async (event) => {
    this.setState({ isErrorOnEnvironment: false });
    var envName = await event.target.value;
    if (this.state.selectedEnv !== await envName) {
      this.setState({ selectedEnv: await envName })
      CICDData.SelectedEnv = await envName;
    }

  };

  selectComponent = async (event) => {
    this.setState({ isErrorOnComponent: false });
    var selectedComponent = await event.target.value;
    if (this.state.selectedComponent !== await selectedComponent) {
      this.setState({ selectedComponent: await selectedComponent })
      CICDData.SelectedComponent = await selectedComponent;
    }

  };

  selectTestingType = async (event) => {
    var selectedTestingType = await event.target.value;
    if (this.state.testingType !== await selectedTestingType) {
      this.setState({ testingType: await selectedTestingType })
      CICDData.TestingType = await selectedTestingType;
    }

  };

  selectThreadCount = async (event) => {
    var selectedThreadCount = await event.target.value;
    if (this.state.threadCount !== await selectedThreadCount) {
      this.setState({ threadCount: await selectedThreadCount })
      CICDData.ThreadCount = await selectedThreadCount;
    }

  };

  //****** Test Suite section  ******************************************************************************

  selectScreen = async (event) => {
    var screenName = await event.target.value;
    if (this.state.selectedScreenOption !== await screenName) {
      this.setState({ selectedScreenOption: await screenName })
      CICDData.SelectedScreenOption = await screenName;
      this.setState({ isPageLoading: true });
      await CICDGetter.setDeviceListData(await screenName);
      this.setState({ isPageLoading: false });
      this.setState({ deviceList: CICDData.DeviceList })
      this.setState({ SelectedDevice: CICDData.SelectedDevice })
    }

  };

  selectDevice = async (event) => {
    var deviceName = await event.target.value;
    if (this.state.selectedDevice !== await deviceName) {
      this.setState({ selectedDevice: await deviceName })
      CICDData.SelectedDevice = await deviceName;
    }

  };

  selectTestSuite = async (event) => {
    var dataChoice = await event;
    if (this.state.selectedTestSuite !== await dataChoice) {
      CICDData.SelectedTestSuite = await dataChoice;
      this.setState({ selectedTestSuite: CICDData.SelectedTestSuite })
      CICDData.IsValidTestSuiteName = true;
      this.setState({ isValidTestSuiteName: CICDData.IsValidTestSuiteName })
      this.setState({ isPageLoading: true });
      await CICDGetter.getTestSuiteData(await dataChoice);
      this.setState({ isPageLoading: false });
      this.setState({ selectedEnv: CICDData.SelectedEnv })
      this.setState({ testingType: CICDData.TestingType })
      this.setState({ threadCount: CICDData.ThreadCount })
      this.setState({ listOfTestScripts: CICDData.ListOfTestScripts })
      if (CICDData.SelectedTab === 'Web') {
        this.setState({ selectedScreenOption: CICDData.SelectedScreenOption })
        this.setState({ selectedDevice: CICDData.SelectedDevice })
      }

    }
  }

  addNewTestSuite = async (event) => {
    var dataChoice = await event;
    if (this.state.selectedTestSuite !== await dataChoice) {
      var format = /[^A-Za-z0-9-]/ig;
      CICDData.SelectedTestSuite = await dataChoice;
      this.setState({ selectedTestSuite: CICDData.SelectedTestSuite })
      CICDData.ListOfTestScripts = [];
      this.setState({ listOfTestScripts: CICDData.ListOfTestScripts })
      CICDData.SelectedTestScripts = [];
      this.setState({ selectedTestScripts: CICDData.SelectedTestScripts })
      if (dataChoice.toString().trim() === '') {
        CICDData.IsValidTestSuiteName = false;
        this.setState({ isValidTestSuiteName: CICDData.IsValidTestSuiteName })
        return;
      }
      if (format.test(await dataChoice)) {
        CICDData.IsValidTestSuiteName = false;
        this.setState({ isValidTestSuiteName: CICDData.IsValidTestSuiteName })
      }
      else {
        CICDData.IsValidTestSuiteName = true;
        this.setState({ isValidTestSuiteName: CICDData.IsValidTestSuiteName })
      }
    }
  }

  //************************* Test Script Selection **************************************************************

  handleOnSelect = async (row, isSelect) => {
    if (await isSelect) {
      CICDData.SelectedTestScripts.push(row.id);
      this.setState({ selectedTestScripts: CICDData.SelectedTestScripts });
    } else {
      CICDData.SelectedTestScripts = CICDData.SelectedTestScripts.filter(x => x !== row.id)
      this.setState({ selectedTestScripts: CICDData.SelectedTestScripts });
    }
  }

  handleOnSelectAll = async (isSelect) => {
    const ids = this.state.listOfTestScripts.map(r => r.id);
    if (isSelect) {
      CICDData.SelectedTestScripts = [];
      for (let i = 0; i < ids.length; i++) {
        CICDData.SelectedTestScripts.push(ids[i]);
      }
      this.setState({ selectedTestScripts: CICDData.SelectedTestScripts });
    } else {
      this.setState(() => ({
        selectedTestScripts: []
      }));
      CICDData.SelectedTestScripts = [];
    }
  }

  async LoadTestScripts() {
    this.setState({ selectedTestScripts: [] });
    CICDData.SelectedTestScripts = [];
    this.setState({ listOfTestScripts: [] });
    CICDData.ListOfTestScripts = [];
    var selectedComponent = this.state.selectedComponent;
    if (selectedComponent === '' || selectedComponent === undefined) {
      this.setState({ isErrorOnComponent: true });
      return await this.getNotification('error', 'Component can not be left blank.');
    }
    await this.setState({ isPageLoading: true });
    await CICDGetter.getAllTestScriptsfromComponent(CICDData.SelectedComponent);
    await this.setState({ isPageLoading: false });
    this.setState({ listOfTestScripts: CICDData.ListOfTestScripts })

  }

  async saveTestSuite() {
    var testSuiteName = this.state.selectedTestSuite;
    if (testSuiteName.toString().trim() !== '' && this.state.isValidTestSuiteName) {
      var allTestScripts = this.state.listOfTestScripts;
      if (await allTestScripts.length === 0) {
        return await this.getNotification('error', 'There is no test script found, Please load the test script before saving test suite');
      }
      var selectedScript = this.state.selectedTestScripts;
      if (selectedScript.length === 0) {
        return await this.getNotification('error', 'Please select test script before saving test suite');
      }
      this.setState({ isPageLoading: true });
      var isSaved = await CICDGetter.saveTestSuite();
      this.setState({ isPageLoading: false });
      if (isSaved) {
        return await this.getNotification('success', 'Custom Test Suite file saved successfully');
      }
      else {
        return await this.getNotification('error', 'Unable to save default custom test suite because of ' + Config.ErrorMessage);
      }
    }
    else {
      return await this.getNotification('error', 'Please add the valid Test suite name');
    }

  }

  selectRunAtOption = async (event) => {
    var runAt = await event.target.value;
    if (this.state.selectedRunAtOption !== await runAt) {
      this.setState({ selectedRunAtOption: await runAt })
      CICDData.SelectedRunAtOption = await runAt;
    }

  };

  //****************** End /********************************** */

  render() {
    const selectTestScripts = {
      mode: 'checkbox',
      selected: this.state.selectedTestScripts,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    };
    return (
      <Page
        className="ciccdpage"
        title="Integrate with CI/CD tool"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <NotificationSystem ref={this.notificationSystem} />
          <Row>
            <Nav className={bem.e('nav-right')}>
              <Col>
                <img alt ='jenkins' height="32" width="32" src="https://cdn.simpleicons.org/jenkins/grey" />
                <img alt = 'azure' height="32" width="32" src="https://cdn.simpleicons.org/AzureDevOps/black" />
                {/* <img height="32" width="32" src="https://cdn.simpleicons.org/Bamboo/blue" />
              <img height="32" width="32" src="https://cdn.simpleicons.org/GitLab/black" />
              <img height="32" width="32" src="https://cdn.simpleicons.org/TeamCity/blue" />
              <img height="32" width="32" src="https://cdn.simpleicons.org/CircleCI/black" />
              <img height="32" width="32" src="https://cdn.simpleicons.org/Buddy/blue" />
              <img height="32" width="32" src="https://cdn.simpleicons.org/TravisCI/black" />
              <img height="32" width="32" src="https://cdn.simpleicons.org/Codeship/blue" />
              <img height="32" width="32" src="https://cdn.simpleicons.org/GoCD/black" /> */}
              </Col>
              <ButtonGroup className="mr-3 mb-3" size="sm">
                <Button color={this.state.buttonWebColor} onClick={this.selectWebDashboard.bind(this)}  >Web</Button>
                <Button color={this.state.buttonApiColor} onClick={this.selectApiDashboard.bind(this)}>Api</Button>
              </ButtonGroup>
            </Nav>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Execution Configuration*
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={6}>
                        Environment*
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnEnvironment} onChange={this.selectEnv.bind(this)} name="envList" value={this.state.selectedEnv}>
                          <DropDownOptions options={this.state.environmentList} />
                        </Input>
                      </Col>
                      <Label sm={6}>
                        Testing type*
                      </Label>
                      <Col>
                        <Input type="select" name="testingType" value={this.state.testingType} onChange={this.selectTestingType.bind(this)}>
                          <DropDownOptions options={this.state.listOfTestingType} />
                        </Input>
                      </Col>
                      <Label sm={6}>
                        Thread count*
                      </Label>
                      <Col>
                        <Input type="select" name="threadCount" value={this.state.threadCount} onChange={this.selectThreadCount.bind(this)}>
                          <DropDownOptions options={this.state.threadList} />
                        </Input>
                      </Col>
                      <Label sm={6}>
                        Component*
                      </Label>
                      <Col>
                        <Input invalid={this.state.isErrorOnComponent} type="select" onChange={this.selectComponent.bind(this)} name="componentList" value={this.state.selectedComponent}>
                          <DropDownOptions options={this.state.componentList} />
                        </Input>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Create your custom test suite
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={6}>
                        Test Suite Name
                      </Label>
                      <Col >
                        <Combobox
                          value={this.state.selectedTestSuite}
                          data={this.state.allTestSuite}
                          onSelect={this.selectTestSuite.bind(this)}
                          onChange={this.addNewTestSuite.bind(this)}
                        />
                      </Col>
                    </FormGroup>
                    {this.state.isWebSelected && (<FormGroup row>
                      <Label sm={6}>
                        Screen*
                      </Label>
                      <Col>
                        <Input type="select" name="screen" value={this.state.selectedScreenOption} onChange={this.selectScreen.bind(this)}>
                          <DropDownOptions options={this.state.screenOptionList} />
                        </Input>
                      </Col>
                      <Label sm={6}>
                        Device/Browser*
                      </Label>
                      <Col>
                        <Input type="select" name="screen" value={this.state.selectedDevice} onChange={this.selectDevice.bind(this)}>
                          <DropDownOptions options={this.state.deviceList} />
                        </Input>
                      </Col>
                      <Label sm={6}>
                        Run at*
                      </Label>
                      <Col>
                        <Input type="select" onChange={this.selectRunAtOption.bind(this)} name="screenshotOptionsList" value={this.state.selectedRunAtOption}>
                          <DropDownOptions options={this.state.runAtOptionList} />
                        </Input>
                      </Col>
                    </FormGroup>
                    )}
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
                    Choose Your Test Scripts
                    <ButtonGroup size="sm">
                      <Button color='dark' name="loadTestScript" onClick={this.LoadTestScripts.bind(this)}>
                        <small>Load</small>
                      </Button>
                      <Button color='info' name="saveCustomSuite" onClick={this.saveTestSuite.bind(this)}>
                        <small>Save Test Suite</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.listOfTestScripts}
                      columns={ExecutionTableHeaderWithoutStatus}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      selectRow={selectTestScripts}
                      filter={filterFactory()}
                      pagination={paginationFactory()}
                    />
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Fade>
      </Page>

    );
  }
}
export default CICDPage;
