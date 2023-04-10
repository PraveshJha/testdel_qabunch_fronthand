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
} from 'reactstrap';
import { ExecutionLabData } from './ExecutionLabData'
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import ExecutionLabDataGetter from './ExecutionLabDataGetter'
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import filterFactory from 'react-bootstrap-table2-filter';
import { ExecutionTableHeader, ResponseAsserionTableHeader } from './ExecutionTableHeader'
import { DoughnutChart, BarChart,LineChart } from '../../../uiLayout/components/chart'
import NotificationSystem from 'react-notification-system';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ReactJson from 'react-json-view'
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';

class ExecutionLabPage extends React.Component {
  notificationSystem = React.createRef();
  state = {

     //****** Page Loader ***********************************************************
     isPageLoading: false,

    //****** Environment and Component Data ********************************************

    environmentList: ExecutionLabData.EnvironmentList,
    selectedEnv: ExecutionLabData.SelectedEnvironment,
    componentList: ExecutionLabData.ComponentList,
    selectedComponent: ExecutionLabData.SelectedComponent,
    showErrorOnEnvironment: false,
    showErrorOnComponent: false,

    //****** Execution Parameter ********************************************
    threadList: ExecutionLabData.ThreadList,
    threadCount: ExecutionLabData.ThreadCount,
    testingType: ExecutionLabData.TestingType,
    reportingInDashboard: ExecutionLabData.ReportingInDashboard,

    //****** Test Data section ********************************************

    listOfTestScripts: ExecutionLabData.ListOfTestScripts,
    selectedTestScripts: ExecutionLabData.SelectedTestScripts,
    executionProgressBar: false,

    //****** Pass Fail Section ********************************************

    totalPassFailInLastXResults: ExecutionLabData.TotalPassFailInLastXResults,

    //****** Component Pass Fail Section ********************************************

    barChartDataForComponent: ExecutionLabData.BarChartDataForComponent,

    //****** Execution Result Data********************************************

    assertionResultsForAllResults: ExecutionLabData.AssertionResultsForAllResults,
    responseDataForAllResults: ExecutionLabData.ResponseDataForAllResults,

    //****** Execution Graph Xaxis ********************************************
    executionTimeGraphXaxis: ExecutionLabData.ExecutionTimeGraphXaxis,
    executionTimeGraphYaxis: ExecutionLabData.ExecutionTimeGraphYaxis,
    executionTimeColor: ExecutionLabData.ExecutionTimeColor,

  };
  async componentDidMount() {
    window.scrollTo(0, 0);
    await ExecutionLabDataGetter.apiExecutionLabPageLoadData();

    //****** Environment and Component Data ********************************************
    this.setState({ environmentList: ExecutionLabData.EnvironmentList })
    this.setState({ selectedEnv: ExecutionLabData.SelectedEnvironment })
    this.setState({ componentList: ExecutionLabData.ComponentList })
    this.setState({ selectedComponent: ExecutionLabData.SelectedComponent })

    //****** Execution Parameter  ********************************************
    this.setState({ threadList: ExecutionLabData.ThreadList })
    this.setState({ threadCount: ExecutionLabData.ThreadCount })
    this.setState({ testingType: ExecutionLabData.TestingType })
    this.setState({ reportingInDashboard: ExecutionLabData.ReportingInDashboard })

    //****** Test script section ********************************************************
    this.setState({ executionProgressBar: false })
    this.setState({ listOfTestScripts: ExecutionLabData.ListOfTestScripts });
    this.setState({ selectedTestScripts: ExecutionLabData.SelectedTestScripts });

    //****** Summary section ********************************************************
    this.setState({ totalPassFailInLastXResults: ExecutionLabData.TotalPassFailInLastXResults })

    //****** Result section ********************************************************
    this.setState({ barChartDataForComponent: ExecutionLabData.BarChartDataForComponent })

    //****** Execution time  data ********************************************
    this.setState({ executionTimeGraphXaxis: ExecutionLabData.ExecutionTimeGraphXaxis })
    this.setState({ executionTimeGraphYaxis: ExecutionLabData.ExecutionTimeGraphYaxis })
    ExecutionLabData.ExecutionTimeColor = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ executionTimeColor: ExecutionLabData.ExecutionTimeColor  })

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
    this.setState({ showErrorOnEnvironment: false });
    var envName = await event.target.value;
    if (this.state.selectedEnv !== await envName) {
      this.setState({ selectedEnv: await envName })
      ExecutionLabData.SelectedEnvironment = await envName;
    }

  };

  selectComponent = async (event) => {
    this.setState({ showErrorOnComponent: false });
    var selectedComponent = await event.target.value;
    if (this.state.selectedComponent !== await selectedComponent) {
      this.setState({ selectedComponent: await selectedComponent })
      ExecutionLabData.SelectedComponent = await selectedComponent;
    }

  };

  //****** Execution Parameter ***********************************************

  selectThreadCount = async (event) => {
    var selectedThreadCount = await event.target.value;
    if (this.state.threadCount !== await selectedThreadCount) {

      this.setState({ threadCount: await selectedThreadCount })
      ExecutionLabData.ThreadCount = await selectedThreadCount;
    }

  };

  selectTestingType = async (event) => {
    var selectedTestingType = await event.target.value;
    if (this.state.testingType !== await selectedTestingType) {
      this.setState({ testingType: await selectedTestingType })
      ExecutionLabData.TestingType = await selectedTestingType;
    }

  };

  selectReportingInDashBoard = async (event) => {
    var selectedReportingInDashBoard = await event.target.value;
    if (this.state.reportingInDashboard !== await selectedReportingInDashBoard) {

      this.setState({ reportingInDashboard: await selectedReportingInDashBoard })
      ExecutionLabData.ReportingInDashboard = await await selectedReportingInDashBoard;
    }

  };

  //****** Load and Execute Test scripts ***********************************************

  async LoadTestScripts() {
    this.setState({ selectedTestScripts: [] });
    ExecutionLabData.SelectedTestScripts = [];
    this.setState({ listOfTestScripts: [] });
    ExecutionLabData.ListOfTestScripts = [];
    var selectedComponent = this.state.selectedComponent;
    if (selectedComponent === '' || selectedComponent === undefined) {
      this.setState({ showErrorOnComponent: true });
      return await this.getNotification('error', 'Component can not be left blank.');
    }
    await this.setState({isPageLoading:true});
    await ExecutionLabDataGetter.getAllTestScriptsfromComponent(ExecutionLabData.SelectedComponent);
    await this.setState({isPageLoading:false});
    this.setState({ listOfTestScripts: ExecutionLabData.ListOfTestScripts })

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

  ExecuteAPIScripts = async () => {
    var environment = this.state.selectedEnv;
    if (environment === '' || environment === undefined) {
      this.setState({ showErrorOnEnvironment: true });
      return await this.getNotification('error', 'Please select Environment before test script execution.');
    }
    var threadCount = this.state.threadCount;
    var testingType = this.state.testingType;
    var reportInDashBoard = this.state.reportingInDashboard;
    var selectedScripts = this.state.selectedTestScripts;
    if (selectedScripts.length === 0) {
      return await this.getNotification('error', 'Please select atleast one test script for execution');
    }
    else {
      this.setState({ executionProgressBar: true });
      await ExecutionLabDataGetter.executeAPITestScripts(await environment, threadCount, testingType, reportInDashBoard, selectedScripts);
      this.setState({ listOfTestScripts: [] }, () => { this.setState({ listOfTestScripts: ExecutionLabData.ListOfTestScripts }); });
      this.setState({ totalPassFailInLastXResults: ExecutionLabData.TotalPassFailInLastXResults });
      this.setState({ barChartDataForComponent: ExecutionLabData.BarChartDataForComponent })
      this.setState({ executionTimeGraphXaxis: ExecutionLabData.ExecutionTimeGraphXaxis })
      this.setState({ executionTimeGraphYaxis: ExecutionLabData.ExecutionTimeGraphYaxis })
      ExecutionLabData.ExecutionTimeColor = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ executionTimeColor: ExecutionLabData.ExecutionTimeColor  })
      this.setState({ executionProgressBar: false });
    }
  }

  showTestResults(row) {
    var boarderColor='default';
    var assertionData = [];
    if (ExecutionLabData.AssertionResultsForAllResults[row.id] !== undefined) {
      assertionData = ExecutionLabData.AssertionResultsForAllResults[row.id];
    }
    var testResultData = {};
    if (ExecutionLabData.ResponseDataForAllResults[row.id] !== undefined) {
      testResultData = ExecutionLabData.ResponseDataForAllResults[row.id];
    }
    if (ExecutionLabData.ListOfTestScripts[Number(row.id)-1]['status'] === 'Pass') {
      boarderColor ='#17E798';
    }
    if (ExecutionLabData.ListOfTestScripts[Number(row.id)-1]['status'] === 'Fail') {
      boarderColor ='#FF5733'
    }
    return <Row>
      <Col lg={6} md={6} sm={6} xs={12}>
        <Card style={{ borderColor: boarderColor}}>
          <CardHeader>Expected vs Actual
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
              />
            </Col>
          </CardBody>
        </Card>
      </Col>
      <Col lg={6} md={6} sm={6} xs={12}>
        <Card style={{ borderColor: boarderColor}}>
          <CardHeader>Test results data
          </CardHeader>
          <CardBody>
            <Col>
              <ReactJson name={false} collapsed={true} collapseStringsAfterLength={25} displayDataTypes={false} indentWidth={0} iconStyle="circle" src={testResultData} />
            </Col>
          </CardBody>
        </Card>
      </Col>
    </Row>
  }

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
      renderer: this.showTestResults
    };
    return (
      <Page
        className="ExecutionLabPage"
        title="Api Test Execution Lab"
      >
        <NotificationSystem ref={this.notificationSystem} />
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>select Environment and component*
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={6}>
                      Environment*
                    </Label>
                    <Col>
                      <Input type="select" invalid={this.state.showErrorOnEnvironment} onChange={this.selectEnv.bind(this)} name="envList" value={this.state.selectedEnv}>
                        <DropDownOptions options={this.state.environmentList} />
                      </Input>
                    </Col>
                    <Label sm={6}>
                      Component*
                    </Label>
                    <Col>
                      <Input invalid={this.state.showErrorOnComponent} type="select" onChange={this.selectComponent.bind(this)} name="componentList" value={this.state.selectedComponent}>
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
              <CardHeader>Execution parameter
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={6}>
                      Thread count*
                    </Label>
                    <Col>
                      <Input type="select" name="threadCount" value={this.state.threadCount} onChange={this.selectThreadCount.bind(this)}>
                        <DropDownOptions options={this.state.threadList} />
                      </Input>
                    </Col>
                    <Label sm={6}>
                      Testing type*
                    </Label>
                    <Col>
                      <Input type="select" name="testingType" value={this.state.testingType} onChange={this.selectTestingType.bind(this)}>
                        <option>Unit Testing</option>
                        <option>Integration Testing</option>
                      </Input>
                    </Col>
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
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  API Test Scripts
                  <ButtonGroup size="sm">
                    <Button color='dark' name="loadTestScript" onClick={this.LoadTestScripts.bind(this)}>
                      <small>Load</small>
                    </Button>
                    <Button color='info' onClick={this.ExecuteAPIScripts.bind(this)}>
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
                    selectRow={selectTestScripts}
                    filter={filterFactory()}
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
              <CardHeader>Component Test Results
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
              <CardHeader>Execution time in seconds
              </CardHeader>
              <CardBody>
                <Col>
                  <LineChart labels={this.state.executionTimeGraphXaxis} data={this.state.executionTimeGraphYaxis} color={this.state.executionTimeColor}></LineChart>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>

    );
  }
}
export default ExecutionLabPage;
