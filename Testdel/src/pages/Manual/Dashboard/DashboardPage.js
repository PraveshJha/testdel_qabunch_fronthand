import Page from '../../Page';
import React from 'react';
import {
  Col,
  Row,
  Fade,
  Card,
  CardHeader,
  Input,
  CardBody,
} from 'reactstrap';
import { TextWidget, NumberWidget } from '../../../uiLayout/components/widget';
import { DashboardData } from './DashboardData'
import DashboardGetter from './DashboardGetter';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import NotificationSystem from 'react-notification-system';
import "react-widgets/styles.css";
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import "react-widgets/styles.css";
import '../../../../node_modules/react-simple-tree-menu/dist/main.css';
import 'react-quill/dist/quill.snow.css';
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import { DoughnutChart, BarChart, LineChart } from '../../../uiLayout/components/chart'
import DataGeneratorUtility from '../../../QAautoMATER/funcLib/DataGeneratorUtility';



class DefectPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //****** Test Cycle***********************************************************
      listOfTestCycle: DashboardData.ListOfTestCycle,
      selectedTestCycle: DashboardData.SelectedTestCycle,

      //************Widget Data*******************************************************
      totalTestCase: DashboardData.TotalTestCase,
      totalDefects: DashboardData.TotalDefects,
      totalTestPlan: DashboardData.TotalTestPlan,
      totalTestCaseOnLastExecution: DashboardData.TotalTestCaseOnLastExecution,
      passPercentageInLastExecution: DashboardData.PassPercentageInLastExecution,

      //************Dought Data*******************************************************
      automatedandNotAutomatedData: DashboardData.AutomatedandNotAutomatedData,
      colorCodeForAutomatedGraph: DashboardData.ColorCodeForAutomatedGraph,
      testPriorityDataXaxis: DashboardData.TestPriorityDataXaxis,
      testPriorityDataYaxis: DashboardData.TestPriorityDataYaxis,
      colorCodeForTestPriority: DashboardData.ColorCodeForTestPriority,
      componentTestCaseCountXaxisData: DashboardData.ComponentTestCaseCountXaxisData,
      componentTestCaseCountYaxisData: DashboardData.ComponentTestCaseCountYaxisData,
      colorCodeForComponentTestCaseCount: DashboardData.ColorCodeForComponentTestCaseCount,
      defectPriorityDataXaxis: DashboardData.DefectPriorityDataXaxis,
      defectPriorityDataYaxis: DashboardData.DefectPriorityDataYaxis,
      colorCodeOfDefectPriority: DashboardData.ColorCodeOfDefectPriority,
      defectComponentDataXaxis: DashboardData.DefectComponentDataXaxis,
      defectComponentDataYAxis: DashboardData.DefectComponentDataYAxis,
      colorCodeForDefectComponentData: DashboardData.ColorCodeForDefectComponentData,
      defectStatusDataXaxis: DashboardData.DefectStatusDataXaxis,
      defectStatusDataYaxis: DashboardData.DefectStatusDataYaxis,
      colorCodeOfDefectStatus: DashboardData.ColorCodeOfDefectStatus,

      //************Test Plan Data*******************************************************
      testPlanTotalDataXaxis: DashboardData.TestPlanTotalDataXaxis,
      testPlanTotalDataYaxis: DashboardData.TestPlanTotalDataYaxis,
      colorCodeOfTestPlanTotalData: DashboardData.ColorCodeOfTestPlanTotalData,

      //************Test Plan Component Pass Fail******************************************
      testPlanExecutedComponentXaxis: DashboardData.TestPlanExecutedComponentXaxis,
      testPlanExecutedComponentYaxis: DashboardData.TestPlanExecutedComponentYaxis,

      //************Test Plan Test Suite Pass Fail******************************************
      testPlanTestSuiteXaxis: DashboardData.TestPlanTestSuiteXaxis,
      testPlanTestSuiteYaxis: DashboardData.TestPlanTestSuiteYaxis,

      //************Test case created By User ******************************************
      testCaseCreatedByXaxis: DashboardData.TestCaseCreatedByXaxis,
      testCaseCreatedByYaxis: DashboardData.TestCaseCreatedByYaxis,
      colorCodeOfTestCaseCreatedBy :DashboardData.ColorCodeOfTestCaseCreatedBy,

      //************Defect created By User ******************************************
      defectCreatedByXaxis: DashboardData.DefectCreatedByXaxis,
      defectCreatedByYaxis: DashboardData.DefectCreatedByYaxis,
      colorCodeOfDefectCreatedBy :DashboardData.ColorCodeOfDefectCreatedBy,

      //************Test Case Executed By ******************************************
      testCaseExecutedByXaxis: DashboardData.TestCaseExecutedByXaxis,
      testCaseExecutedByYaxis: DashboardData.TestCaseExecutedByYaxis,
      colorCodeOfTestCaseExecutedBy :DashboardData.ColorCodeOfTestCaseExecutedBy,

    };

  }
  componentDidMount = async () => {
    await window.scrollTo(0, 0);
    this.setState({ isPageLoading: true })
    await DashboardGetter.loadDashboardPage();

    //************Test Cycle*******************************************************
    this.setState({ listOfTestCycle: DashboardData.ListOfTestCycle })
    this.setState({ selectedTestCycle: DashboardData.SelectedTestCycle })

    //************Widget Data*******************************************************
    this.setState({ totalTestCase: DashboardData.TotalTestCase })
    this.setState({ totalDefects: DashboardData.TotalDefects })
    this.setState({ totalTestPlan: DashboardData.TotalTestPlan })
    this.setState({ totalTestCaseOnLastExecution: DashboardData.TotalTestCaseOnLastExecution })
    this.setState({ passPercentageInLastExecution: DashboardData.PassPercentageInLastExecution })

    //************Dought Data*******************************************************
    this.setState({ automatedandNotAutomatedData: DashboardData.AutomatedandNotAutomatedData })
    DashboardData.ColorCodeForAutomatedGraph = await DataGeneratorUtility.gerHexaColorCodeForArray(3);
    this.setState({ colorCodeForAutomatedGraph: DashboardData.ColorCodeForAutomatedGraph })
    this.setState({ testPriorityDataXaxis: DashboardData.TestPriorityDataXaxis })
    this.setState({ testPriorityDataYaxis: DashboardData.TestPriorityDataYaxis })
    DashboardData.ColorCodeForTestPriority = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.TestPriorityDataXaxis.length);
    this.setState({ colorCodeForTestPriority: DashboardData.ColorCodeForTestPriority })
    this.setState({ componentTestCaseCountXaxisData: DashboardData.ComponentTestCaseCountXaxisData })
    this.setState({ componentTestCaseCountYaxisData: DashboardData.ComponentTestCaseCountYaxisData })
    DashboardData.ColorCodeForComponentTestCaseCount = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.ComponentTestCaseCountXaxisData.length);
    this.setState({ colorCodeForComponentTestCaseCount: DashboardData.ColorCodeForComponentTestCaseCount })
    this.setState({ defectPriorityDataXaxis: DashboardData.DefectPriorityDataXaxis })
    this.setState({ defectPriorityDataYaxis: DashboardData.DefectPriorityDataYaxis })
    DashboardData.ColorCodeOfDefectPriority = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.DefectPriorityDataXaxis.length);
    this.setState({ colorCodeOfDefectPriority: DashboardData.ColorCodeOfDefectPriority })
    this.setState({ defectComponentDataXaxis: DashboardData.DefectComponentDataXaxis })
    this.setState({ defectComponentDataYAxis: DashboardData.DefectComponentDataYAxis })
    DashboardData.ColorCodeForDefectComponentData = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.DefectComponentDataXaxis.length);
    this.setState({ colorCodeForDefectComponentData: DashboardData.ColorCodeForDefectComponentData })
    this.setState({ defectStatusDataXaxis: DashboardData.DefectStatusDataXaxis })
    this.setState({ defectStatusDataYaxis: DashboardData.DefectStatusDataYaxis })
    DashboardData.ColorCodeOfDefectStatus = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.DefectStatusDataXaxis.length);
    this.setState({ colorCodeOfDefectStatus: DashboardData.ColorCodeOfDefectStatus })

    //************Test Plan Data*******************************************************
    this.setState({ testPlanTotalDataXaxis: DashboardData.TestPlanTotalDataXaxis })
    this.setState({ testPlanTotalDataYaxis: DashboardData.TestPlanTotalDataYaxis })
    DashboardData.ColorCodeOfTestPlanTotalData = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.TestPlanTotalDataXaxis.length);
    this.setState({ colorCodeOfTestPlanTotalData: DashboardData.ColorCodeOfTestPlanTotalData })

    //************Test Plan Component Pass Fail******************************************
    this.setState({ testPlanExecutedComponentXaxis: DashboardData.TestPlanExecutedComponentXaxis })
    this.setState({ testPlanExecutedComponentYaxis: DashboardData.TestPlanExecutedComponentYaxis })

    //************Test Plan Test Suite Pass Fail******************************************
    this.setState({ testPlanTestSuiteXaxis: DashboardData.TestPlanTestSuiteXaxis })
    this.setState({ testPlanTestSuiteYaxis: DashboardData.TestPlanTestSuiteYaxis })

    //************Test Case Created BY *******************************************************
    this.setState({ testCaseCreatedByXaxis: DashboardData.TestCaseCreatedByXaxis })
    this.setState({ testCaseCreatedByYaxis: DashboardData.TestCaseCreatedByYaxis })
    DashboardData.ColorCodeOfTestCaseCreatedBy = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.TestCaseCreatedByXaxis.length);
    this.setState({ colorCodeOfTestCaseCreatedBy: DashboardData.ColorCodeOfTestCaseCreatedBy })

    //************Defect Created BY *******************************************************
    this.setState({ defectCreatedByXaxis: DashboardData.DefectCreatedByXaxis })
    this.setState({ defectCreatedByYaxis: DashboardData.DefectCreatedByYaxis })
    DashboardData.ColorCodeOfDefectCreatedBy = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.DefectCreatedByXaxis.length);
    this.setState({ colorCodeOfDefectCreatedBy: DashboardData.ColorCodeOfDefectCreatedBy })

    //************Test Case Executed By *******************************************************
    this.setState({ testCaseExecutedByXaxis: DashboardData.TestCaseExecutedByXaxis })
    this.setState({ testCaseExecutedByYaxis: DashboardData.TestCaseExecutedByYaxis })
    DashboardData.ColorCodeOfTestCaseExecutedBy = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.TestCaseExecutedByXaxis.length);
    this.setState({ colorCodeOfTestCaseExecutedBy: DashboardData.ColorCodeOfTestCaseExecutedBy })

    this.setState({ isPageLoading: false })

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

  //************************** Test Cycle ***************************************************************

  selectTestCycle = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.selectedTestCycle !== await dataChoice) {
      DashboardData.SelectedTestCycle = await dataChoice;
      this.setState({ selectedTestCycle: await dataChoice });
      await DashboardGetter.getDashBoardData(await dataChoice);
      this.setState({ isPageLoading: true })
    
      //************Widget Data*******************************************************
      this.setState({ totalTestCase: DashboardData.TotalTestCase })
      this.setState({ totalDefects: DashboardData.TotalDefects })
      this.setState({ totalTestPlan: DashboardData.TotalTestPlan })
      this.setState({ totalTestCaseOnLastExecution: DashboardData.TotalTestCaseOnLastExecution })
      this.setState({ passPercentageInLastExecution: DashboardData.PassPercentageInLastExecution })
  
      //************Dought Data*******************************************************
      this.setState({ automatedandNotAutomatedData: DashboardData.AutomatedandNotAutomatedData })
      DashboardData.ColorCodeForAutomatedGraph = await DataGeneratorUtility.gerHexaColorCodeForArray(3);
      this.setState({ colorCodeForAutomatedGraph: DashboardData.ColorCodeForAutomatedGraph })
      this.setState({ testPriorityDataXaxis: DashboardData.TestPriorityDataXaxis })
      this.setState({ testPriorityDataYaxis: DashboardData.TestPriorityDataYaxis })
      DashboardData.ColorCodeForTestPriority = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.TestPriorityDataXaxis.length);
      this.setState({ colorCodeForTestPriority: DashboardData.ColorCodeForTestPriority })
      this.setState({ componentTestCaseCountXaxisData: DashboardData.ComponentTestCaseCountXaxisData })
      this.setState({ componentTestCaseCountYaxisData: DashboardData.ComponentTestCaseCountYaxisData })
      DashboardData.ColorCodeForComponentTestCaseCount = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.ComponentTestCaseCountXaxisData.length);
      this.setState({ colorCodeForComponentTestCaseCount: DashboardData.ColorCodeForComponentTestCaseCount })
      this.setState({ defectPriorityDataXaxis: DashboardData.DefectPriorityDataXaxis })
      this.setState({ defectPriorityDataYaxis: DashboardData.DefectPriorityDataYaxis })
      DashboardData.ColorCodeOfDefectPriority = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.DefectPriorityDataXaxis.length);
      this.setState({ colorCodeOfDefectPriority: DashboardData.ColorCodeOfDefectPriority })
      this.setState({ defectComponentDataXaxis: DashboardData.DefectComponentDataXaxis })
      this.setState({ defectComponentDataYAxis: DashboardData.DefectComponentDataYAxis })
      DashboardData.ColorCodeForDefectComponentData = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.DefectComponentDataXaxis.length);
      this.setState({ colorCodeForDefectComponentData: DashboardData.ColorCodeForDefectComponentData })
      this.setState({ defectStatusDataXaxis: DashboardData.DefectStatusDataXaxis })
      this.setState({ defectStatusDataYaxis: DashboardData.DefectStatusDataYaxis })
      DashboardData.ColorCodeOfDefectStatus = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.DefectStatusDataXaxis.length);
      this.setState({ colorCodeOfDefectStatus: DashboardData.ColorCodeOfDefectStatus })
  
      //************Test Plan Data*******************************************************
      this.setState({ testPlanTotalDataXaxis: DashboardData.TestPlanTotalDataXaxis })
      this.setState({ testPlanTotalDataYaxis: DashboardData.TestPlanTotalDataYaxis })
      DashboardData.ColorCodeOfTestPlanTotalData = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.TestPlanTotalDataXaxis.length);
      this.setState({ colorCodeOfTestPlanTotalData: DashboardData.ColorCodeOfTestPlanTotalData })
  
      //************Test Plan Component Pass Fail******************************************
      this.setState({ testPlanExecutedComponentXaxis: DashboardData.TestPlanExecutedComponentXaxis })
      this.setState({ testPlanExecutedComponentYaxis: DashboardData.TestPlanExecutedComponentYaxis })
  
      //************Test Plan Test Suite Pass Fail******************************************
      this.setState({ testPlanTestSuiteXaxis: DashboardData.TestPlanTestSuiteXaxis })
      this.setState({ testPlanTestSuiteYaxis: DashboardData.TestPlanTestSuiteYaxis })
  
      //************Test Case Created BY *******************************************************
      this.setState({ testCaseCreatedByXaxis: DashboardData.TestCaseCreatedByXaxis })
      this.setState({ testCaseCreatedByYaxis: DashboardData.TestCaseCreatedByYaxis })
      DashboardData.ColorCodeOfTestCaseCreatedBy = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.TestCaseCreatedByXaxis.length);
      this.setState({ colorCodeOfTestCaseCreatedBy: DashboardData.ColorCodeOfTestCaseCreatedBy })
  
      //************Defect Created BY *******************************************************
      this.setState({ defectCreatedByXaxis: DashboardData.DefectCreatedByXaxis })
      this.setState({ defectCreatedByYaxis: DashboardData.DefectCreatedByYaxis })
      DashboardData.ColorCodeOfDefectCreatedBy = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.DefectCreatedByXaxis.length);
      this.setState({ colorCodeOfDefectCreatedBy: DashboardData.ColorCodeOfDefectCreatedBy })
  
      //************Test Case Executed By *******************************************************
      this.setState({ testCaseExecutedByXaxis: DashboardData.TestCaseExecutedByXaxis })
      this.setState({ testCaseExecutedByYaxis: DashboardData.TestCaseExecutedByYaxis })
      DashboardData.ColorCodeOfTestCaseExecutedBy = await DataGeneratorUtility.gerHexaColorCodeForArray(DashboardData.TestCaseExecutedByXaxis.length);
      this.setState({ colorCodeOfTestCaseExecutedBy: DashboardData.ColorCodeOfTestCaseExecutedBy })
  
      this.setState({ isPageLoading: false })
    }
  };

  //****************** End */********************************** */

  render() {
    return (
      <Page
        className="dashboard"
        title="Dashboard"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <NotificationSystem ref={this.notificationSystem} />
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Select Test Cycle
                    <div className="d-flex justify-content-between align-items-center">
                      <Col>
                        <Input type="select" name="placeHolder" value={this.state.selectedTestCycle} onChange={this.selectTestCycle.bind(this)}>
                          <DropDownOptions options={this.state.listOfTestCycle} />
                        </Input>
                      </Col>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={6} sm={6} xs={12}>
              <TextWidget
                title="Total test cases"
                number={this.state.totalTestCase}
                color="black"
              />
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <TextWidget
                title="Total defects"
                number={this.state.totalDefects}
                color="black"
              />
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <TextWidget
                title="Total test plan"
                number={this.state.totalTestPlan}
                color="black"
              />
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <NumberWidget
                title="Last Execution Results"
                number={this.state.totalTestCaseOnLastExecution}
                color="success"
                progress={
                  {
                    value: this.state.passPercentageInLastExecution,
                    label: 'Pass',
                  }
                }
              />
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Test Case Automation Type
                </CardHeader>
                <CardBody>
                  <Col>
                    <DoughnutChart color={this.state.colorCodeForAutomatedGraph} labels={['Automated', 'Not Automated', 'Not a right candidate']} data={this.state.automatedandNotAutomatedData}></DoughnutChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Test case count based on Priority
                </CardHeader>
                <CardBody>
                  <Col>
                    <DoughnutChart color={this.state.colorCodeForTestPriority} labels={this.state.testPriorityDataXaxis} data={this.state.testPriorityDataYaxis}></DoughnutChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Component
                  <small> Script count</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.componentTestCaseCountXaxisData} data={this.state.componentTestCaseCountYaxisData} color={this.state.colorCodeForComponentTestCaseCount}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Defect Count based on Priority
                </CardHeader>
                <CardBody>
                  <Col>
                    <DoughnutChart color={this.state.colorCodeOfDefectPriority} labels={this.state.defectPriorityDataXaxis} data={this.state.defectPriorityDataYaxis}></DoughnutChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Defect Count based on Status
                </CardHeader>
                <CardBody>
                  <Col>
                    <DoughnutChart color={this.state.colorCodeOfDefectStatus} labels={this.state.defectStatusDataXaxis} data={this.state.defectStatusDataYaxis}></DoughnutChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Component
                  <small> Defect count</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.defectComponentDataXaxis} data={this.state.defectComponentDataYAxis} color={this.state.colorCodeForDefectComponentData}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={2} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Test Execution Count
                </CardHeader>
                <CardBody>
                  <Col>
                    <DoughnutChart color={this.state.colorCodeOfTestPlanTotalData} labels={this.state.testPlanTotalDataXaxis} data={this.state.testPlanTotalDataYaxis}></DoughnutChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={5} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Pass Fail Pending
                  <small> Component wise</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.testPlanExecutedComponentXaxis} label={['Pass', 'Fail', 'Pending']} data={this.state.testPlanExecutedComponentYaxis} color={['#17E798', '#F38295', '#ffcc00']}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={5} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Pass Fail Pending
                  <small> By Test Plan</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.testPlanTestSuiteXaxis} label={['Pass', 'Fail', 'Pending']} data={this.state.testPlanTestSuiteYaxis} color={['#17E798', '#F38295', '#ffcc00']}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Test Case
                  <small> Created By</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.testCaseCreatedByXaxis} data={this.state.testCaseCreatedByYaxis} color={this.state.colorCodeOfTestCaseCreatedBy}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Test Case
                  <small> Executed By</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.testCaseExecutedByXaxis} data={this.state.testCaseExecutedByYaxis} color={this.state.colorCodeOfTestCaseExecutedBy}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Defect
                  <small> Created By</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.defectCreatedByXaxis} data={this.state.defectCreatedByYaxis} color={this.state.colorCodeOfDefectCreatedBy}></BarChart>
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
export default DefectPage;
