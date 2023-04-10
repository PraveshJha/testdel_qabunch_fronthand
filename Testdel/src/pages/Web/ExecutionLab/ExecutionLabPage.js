import React from 'react';
import Page from '../../Page';
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
  Progress,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import { ExecutionLabData } from './ExecutionLabData'
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import ExecutionLabDataGetter from './ExecutionLabDataGetter'
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { ExecutionTableHeader, ResponseAsserionTableHeader } from './ExecutionTableHeader'
import { DoughnutChart, BarChart, LineChart } from '../../../uiLayout/components/chart'
import NotificationSystem from 'react-notification-system';
import paginationFactory from 'react-bootstrap-table2-paginator';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';

class ExecutionLabPage extends React.Component {
  notificationSystem = React.createRef();
  state = {

    //****** Environment and Component Data ********************************************

    environmentList: ExecutionLabData.EnvironmentList,
    selectedEnv: ExecutionLabData.SelectedEnvironment,
    componentList: ExecutionLabData.ComponentList,
    selectedComponent: ExecutionLabData.SelectedComponent,
    screenShotList: ExecutionLabData.ScreenShotList,
    selectedScreenShot: ExecutionLabData.SelectedScreenShot,
    runAtOptionList: ExecutionLabData.RunAtOptionList,
    selectedRunAtOption: ExecutionLabData.SelectedRunAtOption,
    threadCountList: ExecutionLabData.ThreadCountList,
    selectedThreadCount: ExecutionLabData.SelectedThreadCount,
    reportingInDashboard: ExecutionLabData.ReportingInDashboard,
    isErrorOnComponent: ExecutionLabData.IsErrorOnComponent,

    //****** ScreenData  ********************************************
    screenOptionList: ExecutionLabData.ScreenOptionList,
    selectedScreenOption: ExecutionLabData.SelectedScreenOption,
    deviceList: ExecutionLabData.DeviceList,
    selectedDevice: ExecutionLabData.SelectedDevice,

    //****** Test Execution section ********************************************

    listOfTestScripts: ExecutionLabData.ListOfTestScripts,
    selectedTestScripts: ExecutionLabData.SelectedTestScripts,
    executionProgressBar: false,

    //****** Pass Fail Section ********************************************

    totalPassFailInLastXResults: ExecutionLabData.TotalPassFailInLastXResults,

    //****** Component Pass Fail Section ********************************************

    barChartDataForComponent: ExecutionLabData.BarChartDataForComponent,

    //****** Execution Graph Xaxis ********************************************
    executionTimeGraphXaxis: ExecutionLabData.ExecutionTimeGraphXaxis,
    executionTimeGraphYaxis: ExecutionLabData.ExecutionTimeGraphYaxis,
    executionTimeColor: ExecutionLabData.ExecutionTimeColor,

    //********** Modal For Global Error****************************************
    isGlobalError: ExecutionLabData.IsGlobalError,
    globalErrorMessage: ExecutionLabData.GlobalErrorMessage,

    //********** Screenshot MOdal****************************************
    isScreenshotModalOpen: ExecutionLabData.IsScreenshotModalOpen,
    imageData: ExecutionLabData.ImageData,
    stepsDetailsForScreenshot: ExecutionLabData.StepsDetailsForScreenshot,
    

  };
  async componentDidMount() {
    window.scrollTo(0, 0);
    await ExecutionLabDataGetter.ExecutionLabPageLoadData();

    //****** Environment and Component Data ********************************************
    this.setState({ environmentList: ExecutionLabData.EnvironmentList })
    this.setState({ selectedEnv: ExecutionLabData.SelectedEnvironment })
    this.setState({ componentList: ExecutionLabData.ComponentList })
    this.setState({ selectedComponent: ExecutionLabData.SelectedComponent })
    this.setState({ isErrorOnComponent: ExecutionLabData.IsErrorOnComponent })

    //****** Screen section ********************************************************
    this.setState({ screenOptionList: ExecutionLabData.ScreenOptionList })
    this.setState({ selectedScreenOption: ExecutionLabData.SelectedScreenOption })
    this.setState({ deviceList: ExecutionLabData.DeviceList })
    this.setState({ selectedDevice: ExecutionLabData.SelectedDevice })
    this.setState({ screenShotList: ExecutionLabData.ScreenShotList })
    this.setState({ selectedScreenShot: ExecutionLabData.SelectedScreenShot })
    this.setState({ selectedRunAtOption: ExecutionLabData.SelectedRunAtOption })

    //****** Test execution section ********************************************************
    this.setState({ executionProgressBar: false })
    this.setState({ listOfTestScripts: ExecutionLabData.ListOfTestScripts });
    this.setState({ selectedTestScripts: ExecutionLabData.SelectedTestScripts })

    //****** Execution time  data ********************************************
    this.setState({ executionTimeGraphXaxis: ExecutionLabData.ExecutionTimeGraphXaxis })
    this.setState({ executionTimeGraphYaxis: ExecutionLabData.ExecutionTimeGraphYaxis })
    ExecutionLabData.ExecutionTimeColor = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ executionTimeColor: ExecutionLabData.ExecutionTimeColor })

    //********** Modal For Global Error****************************************
    this.setState({ isGlobalError: ExecutionLabData.IsGlobalError })
    this.setState({ globalErrorMessage: ExecutionLabData.GlobalErrorMessage })

    //********** Screenshot Modal****************************************
    this.setState({ isScreenshotModalOpen: ExecutionLabData.IsScreenshotModalOpen })
    this.setState({ imageData: ExecutionLabData.ImageData })
    this.setState({ stepsDetailsForScreenshot: ExecutionLabData.StepsDetailsForScreenshot })

  }

  //************************* Notification ***************************************************************
  async getNotification(level, message) {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: message,
      level: level
    });
  }

  //****** Environment and Component Data ***********************************************

  selectEnv = async (event) => {
    var selectedEnv = await event.target.value;
    if (this.state.selectedEnv !== await selectedEnv) {
      this.setState({ selectedEnv: await selectedEnv })
      ExecutionLabData.SelectedEnvironment = await selectedEnv;
    }

  };

  selectComponent = async (event) => {
    this.setState({ isErrorOnComponent: false })
    var selectedComponent = await event.target.value;
    if (this.state.selectedComponent !== await selectedComponent) {
      this.setState({ selectedComponent: await selectedComponent })
      ExecutionLabData.SelectedComponent = await selectedComponent;
    }

  };

  selectRunAtOption = async (event) => {
    var runAt = await event.target.value;
    if (this.state.selectedRunAtOption !== await runAt) {
      this.setState({ selectedRunAtOption: await runAt })
      ExecutionLabData.SelectedRunAtOption = await runAt;
      // switch (await runAt) {
      //   case "Server":
      //     ExecutionLabData.ThreadCountList = [1, 2, 3, 4, 5];
      //     this.setState({threadCountList:ExecutionLabData.ThreadCountList});
      //     ExecutionLabData.SelectedThreadCount =1;
      //     this.setState({selectedThreadCount:ExecutionLabData.SelectedThreadCount});
      //     break;
      //   case "BrowserStack":
      //   case "LamdaTest":
      //   case "SauceLabs":
      //     ExecutionLabData.ThreadCountList = [5, 10, 15, 20, 25,30,35,40,45,50];
      //     this.setState({threadCountList:ExecutionLabData.ThreadCountList});
      //     ExecutionLabData.SelectedThreadCount =5;
      //     this.setState({selectedThreadCount:ExecutionLabData.SelectedThreadCount});
      //     break;
      //     default:
      //       ExecutionLabData.ThreadCountList = [1];
      //       this.setState({threadCountList:ExecutionLabData.ThreadCountList});
      //       ExecutionLabData.SelectedThreadCount =1;
      //       this.setState({selectedThreadCount:ExecutionLabData.SelectedThreadCount});
      //       break;
      // }
    }

  };

  selectReportingInDashBoard = async (event) => {
    var selectedReportingInDashBoard = await event.target.value;
    if (this.state.reportingInDashboard !== await selectedReportingInDashBoard) {
      this.setState({ reportingInDashboard: await selectedReportingInDashBoard })
      ExecutionLabData.ReportingInDashboard = await selectedReportingInDashBoard;
    }

  };

  selectThreadCount = async (event) => {
    var selectedThreadCount = await event.target.value;
    if (this.state.selectedThreadCount !== await selectedThreadCount) {
      this.setState({ selectedThreadCount: await selectedThreadCount })
      ExecutionLabData.SelectedThreadCount = await selectedThreadCount;
    }

  };

  //****** Screen Data section ***********************************************

  selectScreen = async (event) => {
    var screenName = await event.target.value;
    if (this.state.selectedScreenOption !== await screenName) {
      this.setState({ selectedScreenOption: await screenName })
      ExecutionLabData.SelectedScreenOption = await screenName;
      this.setState({ deviceList: [] })
      ExecutionLabData.DeviceList = [];
      ExecutionLabData.SelectedDevice = ''
      this.setState({ selectedDevice: '' })
      await ExecutionLabDataGetter.GetAllDeviceAndBrowser(await screenName);
      this.setState({ deviceList: ExecutionLabData.DeviceList })
      this.setState({ selectedDevice: ExecutionLabData.SelectedDevice })
    }

  };

  selectDevice = async (event) => {
    var deviceName = await event.target.value;
    if (this.state.selectedDevice !== await deviceName) {
      this.setState({ selectedDevice: await deviceName })
      ExecutionLabData.SelectedDevice = await deviceName;
    }

  };

  selectScreenshotOptions = async (event) => {
    var screenshotName = await event.target.value;
    if (this.state.selectedScreenShot !== await screenshotName) {
      this.setState({ selectedScreenShot: await screenshotName })
      ExecutionLabData.SelectedScreenShot = await screenshotName;
    }

  };


  //****** Load and Execute Test scripts ***********************************************

  async LoadTestScripts() {
    this.setState({ selectedTestScripts: [] });
    this.setState({ listOfTestScripts: [] });
    var selectedComponent = this.state.selectedComponent;
    if (selectedComponent === '' || selectedComponent === undefined) {
      this.setState({ isErrorOnComponent: true });
      return await this.getNotification('error', 'Component can not be left blank.');
    }
    await this.setState({ isPageLoading: true });
    await ExecutionLabDataGetter.getAllTestScriptsfromComponent(selectedComponent);
    this.setState({ listOfTestScripts: ExecutionLabData.ListOfTestScripts });
    await this.setState({ isPageLoading: false });
  }

  handleOnSelect = async (row, isSelect) => {
    if (await isSelect) {
      this.setState(() => ({
        selectedTestScripts: [...this.state.selectedTestScripts, row.id]
      }));
    } else {
      this.setState(() => ({
        selectedTestScripts: this.state.selectedTestScripts.filter(x => x !== row.id)
      }));
    }
    ExecutionLabData.SelectedTestScripts = this.state.selectedTestScripts;
  }

  handleOnSelectAll = async (isSelect) => {
    const ids = this.state.listOfTestScripts.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        selectedTestScripts: ids
      }));
    } else {
      this.setState(() => ({
        selectedTestScripts: []
      }));
    }
    ExecutionLabData.SelectedTestScripts = this.state.selectedTestScripts;
  }

  async ExecuteUIScripts() {

    var environment = this.state.selectedEnv;
    var runAt = this.state.selectedRunAtOption;
    var threadCount = this.state.selectedThreadCount;
    var reportInDashBoard = this.state.reportingInDashboard;
    var screenName = this.state.selectedScreenOption;
    var deviceName = this.state.selectedDevice;
    var screenShotChoice = this.state.selectedScreenShot;
    var selectedScripts = this.state.selectedTestScripts;
    if (selectedScripts.length === 0) {
      return await this.getNotification('error', 'Please select atleast one test script for execution');
    }
    else {
      try{
        await localStorage.setItem('defectEnvironment', await environment);
      }
      catch(error)
      {}
      ExecutionLabData.SelectedTestScripts = selectedScripts;
      this.setState({ executionProgressBar: true });
      await ExecutionLabDataGetter.executeUITestScripts(environment, runAt, threadCount, reportInDashBoard, screenName, deviceName, screenShotChoice, selectedScripts);
      this.setState({ isGlobalError: ExecutionLabData.IsGlobalError });
      this.setState({ globalErrorMessage: ExecutionLabData.GlobalErrorMessage });
      this.setState({ listOfTestScripts: [] }, () => { this.setState({ listOfTestScripts: ExecutionLabData.ListOfTestScripts }); });
      this.setState({ totalPassFailInLastXResults: ExecutionLabData.TotalPassFailInLastXResults });
      this.setState({ barChartDataForComponent: ExecutionLabData.BarChartDataForComponent })
      this.setState({ executionTimeGraphXaxis: ExecutionLabData.ExecutionTimeGraphXaxis })
      this.setState({ executionTimeGraphYaxis: ExecutionLabData.ExecutionTimeGraphYaxis })
      ExecutionLabData.ExecutionTimeColor = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ executionTimeColor: ExecutionLabData.ExecutionTimeColor })
      this.setState({ assertionResultsForAllResults: ExecutionLabData.AssertionResultsForAllResults })
      this.setState({ executionProgressBar: false });

    }
  }

  //****** Expand Results ***********************************************

  showTestResults(row) {
    var boarderColor = 'default';
    var assertionData = [];
   // var executionTime = '';
    if (ExecutionLabData.AssertionResultsForAllResults[row.id] !== undefined) {
      assertionData = ExecutionLabData.AssertionResultsForAllResults[row.id];
    }
    return <Row>
      <Col lg={12} md={12} sm={12} xs={12}>
        <Card style={{ borderColor: boarderColor }}>
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              Test Step Results ({ExecutionLabData.ExecutionTimeForTestScripts[row.id]} seconds)
              {row.status ==='Fail' && (<ButtonGroup size="sm">
                <Button color='dark' name="createnewDefect" onClick={(e) => this.createNewDefect(assertionData, e)} >
                  <small>Create new defect</small>
                </Button>
              </ButtonGroup>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <Col>
              <BootstrapTable
                keyField='id'
                data={assertionData}
                columns={ResponseAsserionTableHeader}
                wrapperClasses="table-responsive"
                striped
                hover
                condensed
                cellEdit={cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  onStartEdit: (row, column, rowIndex, columnIndex) => {
                    if (columnIndex === 5) {
                      this.setState({ isScreenshotModalOpen: true });
                      this.setState({ stepsDetailsForScreenshot: ExecutionLabData.StepsDetailsForScreenshot })
                      this.setState({ imageData: ExecutionLabData.ImageData })
                    }
                  }
                })}
              />
            </Col>
          </CardBody>
        </Card>
      </Col>
    </Row>
  }

  //***** Global Error Window ******************************************************************************************

  toggleGlobalError = async () => {
    this.setState({ isGlobalError: false });
    ExecutionLabData.IsGlobalError = false;
  }

  toggleScreenshotModal = async () => {
    this.setState({ isScreenshotModalOpen: false });
    ExecutionLabData.IsScreenshotModalOpen = false;
  }

    //****** Create New Defect***********************************************

    createNewDefect = async (assertionData) => {
      try {
        await localStorage.removeItem('defectDetails');
    }
    catch (error) { }
      try{
        var defectDetails = await assertionData;
        await localStorage.setItem('defectDetails', await JSON.stringify(await defectDetails));
        await window.open("/mn/defects", "_blank");
      }
      catch(error)
      {}
  
    };

  render() {

    //****** Select Test Scripts********************************
    const selectTestScripts = {
      mode: 'checkbox',
      selected: this.state.selectedTestScripts,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    };
    const expandRow = {
      showExpandColumn: true,
      expandByColumnOnly: false,
      renderer: this.showTestResults.bind(this)
    };


    return (
      <Page
        className="ExecutionLabPage"
        title="UI Test Execution Lab"
      >
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Execution Configuration
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={6}>
                      Environment*
                    </Label>
                    <Col>
                      <Input type="select" onChange={this.selectEnv.bind(this)} name="envList" value={this.state.selectedEnv}>
                        <DropDownOptions options={this.state.environmentList} />
                      </Input>
                    </Col>
                    <Label sm={6}>
                      Component*
                    </Label>
                    <Col>
                      <Input type="select" invalid={this.state.isErrorOnComponent} onChange={this.selectComponent.bind(this)} name="componentList" value={this.state.selectedComponent}>
                        <DropDownOptions options={this.state.componentList} />
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
                    {this.state.selectedRunAtOption === 'Server' && (<Label sm={6}>
                      Thread count*
                    </Label>
                    )}
                    {this.state.selectedRunAtOption === 'Server' && (<Col>
                      <Input type="select" name="threadCount" value={this.state.selectedThreadCount} onChange={this.selectThreadCount.bind(this)}>
                        <DropDownOptions options={this.state.threadCountList} />
                      </Input>
                    </Col>
                    )}
                    <Label sm={6}>
                      Want to add report in Dashboard*
                    </Label>
                    <Col>
                      <Input type="select" name="reportingInDashBoard" value={this.state.reportingInDashboard} onChange={this.selectReportingInDashBoard.bind(this)}>
                        <option>Yes</option>
                        <option>No</option>
                      </Input>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Choose your screen
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
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
                    {/* <Label sm={6}>
                      Screenshot*
                    </Label>
                    <Col>
                      <Input type="select" onChange={this.selectScreenshotOptions.bind(this)} name="screenshotOptionsList" value={this.state.selectedScreenShot}>
                        <DropDownOptions options={this.state.screenShotList} />
                      </Input>
                    </Col> */}
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
                <NotificationSystem ref={this.notificationSystem} />
                <div className="d-flex justify-content-between align-items-center">
                  UI Test Scripts
                  <ButtonGroup size="sm">
                    <Button color='dark' name="loadTestScript" onClick={this.LoadTestScripts.bind(this)}>
                      <small>Load</small>
                    </Button>
                    <Button color='info' name="run" onClick={this.ExecuteUIScripts.bind(this)}>
                      <small>Run</small>
                    </Button>
                  </ButtonGroup>
                </div>
              </CardHeader>
              <CardBody>
                <Col>
                  <Progress style={{ visibility: this.state.executionProgressBar ? 'visible' : 'hidden' }}
                    key={0}
                    animated
                    color={'dark'}
                    value={100}
                    className="mb-3"
                  />
                </Col>
                <Col>
                  <BootstrapTable
                    keyField='id'
                    data={this.state.listOfTestScripts}
                    columns={ExecutionTableHeader}
                    wrapperClasses="table-responsive"
                    striped
                    hover
                    condensed
                    filter={filterFactory()}
                    selectRow={selectTestScripts}
                    pagination={paginationFactory()}
                    expandRow={expandRow}
                  />
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Pass fail count
              </CardHeader>
              <CardBody>
                <Col>
                  <DoughnutChart color={['#17E798', '#F38295']} labels={['Pass', 'Fail']} data={this.state.totalPassFailInLastXResults}></DoughnutChart>
                </Col>
              </CardBody>
            </Card>
          </Col>
          <Col lg={5} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Pass Fail Count Module Wise
              </CardHeader>
              <CardBody>
                <Col>
                  <BarChart color={['#17E798', '#F38295']} labels={this.state.executionTimeGraphXaxis} data={this.state.barChartDataForComponent}></BarChart>
                </Col>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Execution time for Each Module
              </CardHeader>
              <CardBody>
                <Col>
                  <LineChart labels={this.state.executionTimeGraphXaxis} data={this.state.executionTimeGraphYaxis} color={this.state.executionTimeColor}></LineChart>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.isGlobalError} className={this.props.className} backdrop="static">
          <ModalHeader toggle={this.toggleGlobalError.bind(this)}>Oh Sorry,we encountered an error</ModalHeader>
          <ModalBody>
            {this.state.globalErrorMessage}
          </ModalBody>
        </Modal>
        <Modal size="xl" isOpen={this.state.isScreenshotModalOpen} className={this.props.className} backdrop="static">
          <ModalHeader toggle={this.toggleScreenshotModal.bind(this)}>Screenshot-{this.state.stepsDetailsForScreenshot}</ModalHeader>
          <ModalBody>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <Form>
                  <FormGroup row>
                    <img alt ='screenshot' src={this.state.imageData}></img>;
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </Page>

    );
  }
}
export default ExecutionLabPage;
