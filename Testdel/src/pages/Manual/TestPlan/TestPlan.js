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
  CardImg,
  Nav,
  Fade,
} from 'reactstrap';
import { TestPlanData } from './TestPlanData'
import TestPlanGetter from './TestPlanGetter';
import { Config, Users } from '../../../QAautoMATER/Config';
import NotificationSystem from 'react-notification-system';
import "react-widgets/styles.css";
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import { TestPlanTableHeader } from '../WebPageTableHeader'
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import { DoughnutChart, BarChart, LineChart } from '../../../uiLayout/components/chart'

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

class TestPlanPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,
      isUserSelectedNewTestPlan: TestPlanData.IsUserSelectedNewTestPlan,

      //****** Test Plan************************************************************************************
      isErrorOnNewTestPlan: TestPlanData.IsErrorOnNewTestPlan,
      newTestPlan: TestPlanData.NewTestPlan,
      listOfTestPlan: TestPlanData.ListOfTestPlan,
      selectedTestPlan: TestPlanData.SelectedTestPlan,
      isErrorOnTestPlan: TestPlanData.IsErrorOnTestPlan,

      //****** Test Execution Details ************************************************************************
      listOfTestingType: TestPlanData.ListOfTestingType,
      selectedTestingType: TestPlanData.SelectedTestingType,
      listOfScreen: TestPlanData.ListOfScreen,
      selectedScreen: TestPlanData.SelectedScreen,
      browser: TestPlanData.Browser,
      isErrorOnBrowser: TestPlanData.IsErrorOnBrowser,
      oS: TestPlanData.OS,
      releaseVersion: TestPlanData.ReleaseVersion,
      isErrorOnTestCycle: TestPlanData.IsErrorOnTestCycle,
      listOfTestCycle: TestPlanData.ListOfTestCycle,
      selectedTestCycle: TestPlanData.SelectedTestCycle,

      //****** Test Case Details ************************************************

      listOfTestCases: TestPlanData.ListOfTestCases,
      listOfRemarksDataForTestCase: TestPlanData.ListOfRemarksDataForTestCase,
      listOfPlaceHolder: TestPlanData.ListOfPlaceHolder,
      selectedPlaceHolder: TestPlanData.SelectedPlaceHolder,
      selectedTestCase: TestPlanData.SelectedTestCase,

      //****** Graph Data ************************************************************************
      executionSummaryData: TestPlanData.ExecutionSummaryData,
      executedComponentXaxis: TestPlanData.ExecutedComponentXaxis,
      executedComponentYaxis: TestPlanData.ExecutedComponentYaxis,

    };

  }
  componentWillMount = async () => {
    window.scrollTo(0, 0);
    this.setState({ isPageLoading: true })
    await TestPlanGetter.loadTestPlanPage();
    this.setState({ isUserSelectedNewTestPlan: TestPlanData.IsUserSelectedNewTestPlan })

    //****** Test Plan************************************************************************************
    this.setState({ isErrorOnNewTestPlan: TestPlanData.IsErrorOnNewTestPlan });
    this.setState({ newTestPlan: TestPlanData.NewTestPlan });
    this.setState({ listOfTestPlan: TestPlanData.ListOfTestPlan });
    this.setState({ selectedTestPlan: TestPlanData.SelectedTestPlan });
    this.setState({ isErrorOnTestPlan: TestPlanData.IsErrorOnTestPlan });

    //****** Test Execution Details ************************************************************************
    this.setState({ listOfTestingType: TestPlanData.ListOfTestingType });
    this.setState({ selectedTestingType: TestPlanData.SelectedTestingType });
    this.setState({ listOfScreen: TestPlanData.ListOfScreen });
    this.setState({ selectedScreen: TestPlanData.SelectedScreen });
    this.setState({ browser: TestPlanData.Browser });
    this.setState({ isErrorOnBrowser: TestPlanData.IsErrorOnBrowser });
    this.setState({ oS: TestPlanData.OS });
    this.setState({ releaseVersion: TestPlanData.ReleaseVersion });
    this.setState({ isErrorOnTestCycle: TestPlanData.IsErrorOnTestCycle });
    this.setState({ listOfTestCycle: TestPlanData.ListOfTestCycle });
    this.setState({ selectedTestCycle: TestPlanData.SelectedTestCycle });

    //****** Test Case Details ************************************************************************
    this.setState({ listOfTestCases: TestPlanData.ListOfTestCases });
    this.setState({ listOfRemarksDataForTestCase: TestPlanData.ListOfRemarksDataForTestCase });
    this.setState({ listOfPlaceHolder: TestPlanData.ListOfPlaceHolder });
    this.setState({ selectedPlaceHolder: TestPlanData.SelectedPlaceHolder });
    this.setState({ selectedTestCase: TestPlanData.SelectedTestCase });

    //****** Graph Data ******************************************************************************
    this.setState({ executionSummaryData: TestPlanData.ExecutionSummaryData });
    this.setState({ executedComponentXaxis: TestPlanData.ExecutedComponentXaxis });
    this.setState({ executedComponentYaxis: TestPlanData.ExecutedComponentYaxis });

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

  //************************* Test Execution Attributes *************************************************************************
  selectTestingType = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.selectedTestingType !== await dataChoice) {
      TestPlanData.SelectedTestingType = await dataChoice;
      this.setState({ selectedTestingType: await dataChoice });
    }
  };

  selectScreen = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.selectedScreen !== await dataChoice) {
      TestPlanData.SelectedScreen = await dataChoice;
      this.setState({ selectedScreen: await dataChoice });
    }
  };

  selectBrowser = async (event) => {
    this.setState({ isErrorOnBrowser: false })
    var dataChoice = await event.target.value;
    if (await this.state.browser !== await dataChoice) {
      TestPlanData.Browser = await dataChoice;
      this.setState({ browser: await dataChoice });
    }
  };

  selectOS = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.oS !== await dataChoice) {
      TestPlanData.OS = await dataChoice;
      this.setState({ oS: await dataChoice });
    }
  };

  selectReleaseVersion = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.releaseVersion !== await dataChoice) {
      TestPlanData.ReleaseVersion = await dataChoice;
      this.setState({ releaseVersion: await dataChoice });
    }
  };

  selectTestCycle = async (event) => {
    this.setState({ isErrorOnTestCycle: false })
    var dataChoice = await event.target.value;
    if (await this.state.selectedTestCycle !== await dataChoice) {
      this.setState({ isPageLoading: true });
      TestPlanData.SelectedTestCycle = await dataChoice;
      this.setState({ selectedTestCycle: await dataChoice });
      TestPlanData.ListOfTestPlan = await TestPlanGetter.getAllTestPlanFromTestCycle(await dataChoice)
      this.setState({ isPageLoading: false });
    }
  };

  //************************* Test Case Details Section ***************************************************************
  showTestResults(row) {
    var remarksData = TestPlanData.ListOfRemarksDataForTestCase[row.testid];
    if (remarksData === undefined) {
      remarksData = ''
      TestPlanData.ListOfRemarksDataForTestCase[row.testid] = ''
    }
    var boarderColor = 'default';
    return <Row>
      <Col lg={12} md={12} sm={12} xs={12}>
        <Card style={{ borderColor: boarderColor }}>
          <CardHeader>
            Remarks Regarding status
          </CardHeader>
          <CardBody>
            <Col>
              <ReactQuill theme="snow" formats={formats} value={remarksData} onChange={event => this.updateTestCaseRemarksData(event, row.testid)} />
            </Col>
          </CardBody>
        </Card>
      </Col>
    </Row>
  }

  updateTestCaseRemarksData = async (event, testid) => {
    var dataChoice = await event;
    if (TestPlanData.ListOfRemarksDataForTestCase[await testid] !== await dataChoice) {
      TestPlanData.ListOfRemarksDataForTestCase[await testid] = await dataChoice;
      TestPlanData.UpdatedRemarksData[await testid]= await dataChoice;
    }

  };

  addNewTestPlan = async (event) => {
    this.setState({ isErrorOnNewTestPlan: false })
    var dataChoice = await event.target.value;
    if (await this.state.newTestPlan !== await dataChoice) {
      TestPlanData.NewTestPlan = await dataChoice;
      this.setState({ newTestPlan: await dataChoice });
    }
  };

  selectTestPlan = async (event) => {
    this.setState({ isErrorOnTestPlan: false })
    var dataChoice = await event.target.value;
    if (await this.state.selectedTestPlan !== await dataChoice) {
      TestPlanData.ListOfTestCases = [];
      TestPlanData.ExecutedComponentXaxis = []
      TestPlanData.ExecutionSummaryData = []
      TestPlanData.ExecutedComponentYaxis = []
      TestPlanData.SelectedTestPlan = await dataChoice;
      this.setState({ selectedTestPlan: await dataChoice });
      //* Populate Data
      this.setState({ isPageLoading: true });
      await TestPlanGetter.getTestPlanDetail(TestPlanData.SelectedTestCycle, await dataChoice);
      this.setState({ selectedTestingType: TestPlanData.SelectedTestingType })
      this.setState({ selectedScreen: TestPlanData.SelectedScreen })
      this.setState({ browser: TestPlanData.Browser })
      this.setState({ oS: TestPlanData.OS })
      this.setState({ releaseVersion: TestPlanData.ReleaseVersion })
      this.setState({ listOfTestCases: TestPlanData.ListOfTestCases })
      this.setState({ listOfRemarksDataForTestCase: TestPlanData.ListOfRemarksDataForTestCase })
      this.setState({ executionSummaryData: TestPlanData.ExecutionSummaryData })
      this.setState({ executedComponentXaxis: TestPlanData.ExecutedComponentXaxis })
      this.setState({ executedComponentYaxis: TestPlanData.ExecutedComponentYaxis })
      await TestPlanGetter.getListOfUser();
      TestPlanData.SelectedTestCase = [];
      this.setState({ selectedTestCase: TestPlanData.SelectedTestCase })
      const ids = await this.state.listOfTestCases.map(r => r.id);
      TestPlanData.SelectedTestCase = await ids;
      this.setState({ selectedTestCase: await ids })
      this.setState({ isPageLoading: false });
    }
  };

  createNewTestPlan = async (event) => {

    await event.preventDefault();
    if (!this.state.isUserSelectedNewTestPlan) {
      this.setState({ isUserSelectedNewTestPlan: true });
      TestPlanData.IsUserSelectedNewTestPlan = true;
      //Reset State
      TestPlanData.ListOfTestCases = [];
      this.setState({ listOfTestCases: [] })
      TestPlanData.SelectedTestCase = [];
      this.setState({ selectedTestCase: [] })
      TestPlanData.SelectedTestingType = 'Functional';
      this.setState({ selectedTestingType: 'Functional' });
      TestPlanData.SelectedScreen = 'Desktop';
      this.setState({ selectedScreen: 'Desktop' })
      TestPlanData.Browser = '';
      this.setState({ browser: '' })
      TestPlanData.OS = '';
      this.setState({ oS: '' })
      TestPlanData.ReleaseVersion = '';
      this.setState({ releaseVersion: '' })
    }

  }

  deleteTestPlan = async (event) => {

    await event.preventDefault();
    if (!this.state.isUserSelectedNewTestPlan) {
      var selectedTestPlan = await this.state.selectedTestPlan;
      if (await selectedTestPlan === '') {
        return await this.getNotification('error', 'Please select test plan before delete.');
      }
      this.setState({ isPageLoading: true });
      var isSaved = await TestPlanGetter.deleteTestPlan(await selectedTestPlan);
      if (await isSaved) {
        await window.location.reload();
        await new Promise(wait => setTimeout(wait, 1000));
        await this.getNotification('success', 'Test plan ' + selectedTestPlan + ' is successfully deleted.');
      }
      else {
        await this.getNotification('error', 'Unable to delete Test plan ' + await selectedTestPlan + ' because of ' + Config.ErrorMessage);
      }
      this.setState({ isPageLoading: false });
    }

  }

  selectPlaceHolder = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.selectedPlaceHolder !== await dataChoice) {
      TestPlanData.SelectedPlaceHolder = await dataChoice;
      this.setState({ selectedPlaceHolder: await dataChoice });
    }
  };

  loadTestCase = async (event) => {
    await event.preventDefault();
    await this.setState({ isPageLoading: true })
    if (!await TestPlanData.IsUserSelectedNewTestPlan) {
      await TestPlanGetter.getTestPlanDetail(TestPlanData.SelectedTestCycle, TestPlanData.SelectedTestPlan);
      var existingTestCase = TestPlanData.ListOfTestCases;
    }
    TestPlanData.SelectedTestCase = [];
    await TestPlanGetter.loadAllTestCaseFromComponent('All');
    var newListOfTestCase = TestPlanData.ListOfTestCases;
    if (!await TestPlanData.IsUserSelectedNewTestPlan) {
      for (let i = 0; i < await existingTestCase.length; i++) {
        var testId = await existingTestCase[i]['testid'];
        var status = await existingTestCase[i]['status'];
        for (let j = 0; j < await newListOfTestCase.length; j++) {
          if (await testId === await newListOfTestCase[j]['testid']) {
            newListOfTestCase[j]['status'] = await status;
            TestPlanData.SelectedTestCase.push(await newListOfTestCase[j]['id'])
            break;
          }
        }
      }
    }
    TestPlanData.ListOfTestCases = await newListOfTestCase;
    this.setState({ listOfTestCases: TestPlanData.ListOfTestCases })
    this.setState({ selectedTestCase: TestPlanData.SelectedTestCase })
    await this.setState({ isPageLoading: false })
  };

  handleOnSelect = async (row, isSelect) => {
    var testId = await row.testid;
    if (await isSelect) {
      this.setState(() => ({ selectedTestCase: [...this.state.selectedTestCase, row.id] }));
      TestPlanData.SelectedTestCase = await [...this.state.selectedTestCase, row.id];
      if (TestPlanData.UpdatedTestRowData[await testId] === undefined) {
        TestPlanData.UpdatedTestRowData[await testId] = {};
        TestPlanData.UpdatedTestRowData[await testId]['id'] = await row.id;
        TestPlanData.UpdatedTestRowData[await testId]['component'] = await row.component;
        TestPlanData.UpdatedTestRowData[await testId]['testid'] = await row.testid;
        TestPlanData.UpdatedTestRowData[await testId]['testname'] = await row.testname;
        TestPlanData.UpdatedTestRowData[await testId]['assignto'] = await row.assignto;
        TestPlanData.UpdatedTestRowData[await testId]['status'] = await row.status;
        TestPlanData.UpdatedTestRowData[await testId]['executedBy'] = '';
      }
      var istestScriptWilldeleted = await TestPlanData.DeletedTestID[await testId];
      if(await istestScriptWilldeleted !== undefined)
      {
        delete TestPlanData.DeletedTestID[await testId];
      }

    } else {
      this.setState(() => ({ selectedTestCase: this.state.selectedTestCase.filter(x => x !== row.id) }));
      TestPlanData.SelectedTestCase = await this.state.selectedTestCase.filter(x => x !== row.id)
      TestPlanData.DeletedTestID[await testId]='delete';
    }

  }

  handleOnSelectAll = async (isSelect) => {
    const ids = this.state.listOfTestCases.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({ selectedTestCase: ids, }));
      TestPlanData.SelectedTestCase = ids;
      for (let i = 0; i < await TestPlanData.SelectedTestCase.length; i++) {
        var testId = TestPlanData.ListOfTestCases[i]['testid'];
        if (TestPlanData.UpdatedTestRowData[await testId] === undefined) {
          TestPlanData.UpdatedTestRowData[await testId] = {};
          TestPlanData.UpdatedTestRowData[await testId]['id'] = await Number(i)+1;;
          TestPlanData.UpdatedTestRowData[await testId]['component'] = await TestPlanData.ListOfTestCases[i]['component'];
          TestPlanData.UpdatedTestRowData[await testId]['testid'] = await testId;
          TestPlanData.UpdatedTestRowData[await testId]['testname'] =  await TestPlanData.ListOfTestCases[i]['testname'];
          TestPlanData.UpdatedTestRowData[await testId]['assignto'] = await TestPlanData.ListOfTestCases[i]['assignto'];
          TestPlanData.UpdatedTestRowData[await testId]['status'] =  await TestPlanData.ListOfTestCases[i]['status'];
          var executedBy = await TestPlanData.ListOfTestCases[i]['executedBy']
          if(await executedBy === undefined)
          {
            TestPlanData.UpdatedTestRowData[await testId]['executedBy'] = '';
          }
          else{
            TestPlanData.UpdatedTestRowData[await testId]['executedBy'] = await executedBy;
          }
          TestPlanData.DeletedTestID ={};
        }
      }
    } else {
      this.setState(() => ({ selectedTestCase: [] }));
      TestPlanData.SelectedTestCase = [];
      TestPlanData.UpdatedTestRowData = {};
      for (let i = 0; i < await TestPlanData.SelectedTestCase.length; i++) {
        var testId = TestPlanData.ListOfTestCases[i]['testid'];
        TestPlanData.DeletedTestID[await testId] = 'delete';
      }
    }
  }

  updateTestPlan = async (event) => {
    await event.preventDefault();
    var isNewTestPlan = await TestPlanData.IsUserSelectedNewTestPlan;
    var newTestPlanName = '';
    if (await isNewTestPlan) {
      newTestPlanName = await this.state.newTestPlan;
      if (await newTestPlanName.trim() === '') {
        this.setState({ isErrorOnNewTestPlan: true });
        return;
      }
    }
    else {
      newTestPlanName = this.state.selectedTestPlan;
      if (await newTestPlanName.trim() === '') {
        this.setState({ isErrorOnTestPlan: true })
        return;
      }
    }
    var testBrowser = await this.state.browser;
    if (await testBrowser.trim() === '') {
      this.setState({ isErrorOnBrowser: true });
      return;
    }
    var selectedTestCase = await this.state.selectedTestCase;
    if (await selectedTestCase.length == 0) {
      return await this.getNotification('error', 'Please choose test case before saving test plan');
    }
    if (!await isNewTestPlan) {
      if (await Object.keys(TestPlanData.UpdatedTestRowData).length === 0 && await Object.keys(TestPlanData.UpdatedRemarksData).length === 0 && await Object.keys(TestPlanData.DeletedTestID).length === 0) {
        return await this.getNotification('warning', 'No Changes to save.');
      }
    }
    this.setState({ isPageLoading: true });
    var isSaved = await TestPlanGetter.saveTestPlan(await newTestPlanName);
    if (await isSaved) {
      TestPlanData.IsUserSelectedNewTestPlan = false;
      this.setState({isUserSelectedNewTestPlan:false});
      TestPlanData.UpdatedTestRowData ={};
      TestPlanData.DeletedTestID ={};
      TestPlanData.UpdatedRemarksData ={};
      await this.getNotification('success', 'Test plan ' + newTestPlanName + ' is successfully saved.');
    }
    else {
      await this.getNotification('error', 'Unable to save Test plan ' + await newTestPlanName + ' because of ' + Config.ErrorMessage);
    }
    this.setState({ isPageLoading: false });
  };

  //****************** End /********************************** */

  render() {
    const expandRow = {
      showExpandColumn: true,
      expandByColumnOnly: true,
      renderer: this.showTestResults.bind(this)
    };
    const selectTestCase = {
      mode: 'checkbox',
      selected: this.state.selectedTestCase,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    };
    return (
      <Page
        className="testplan"
        title="Test Execution"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <NotificationSystem ref={this.notificationSystem} />
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Select or Create Test Plan
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.createNewTestPlan.bind(this)}>
                        <small>New Test Plan</small>
                      </Button>
                      {(Users.isSuperAdmin && !this.state.isUserSelectedNewTestPlan) && (<Button color='info' onClick={this.deleteTestPlan.bind(this)}>
                        <small>Delete Test Plan</small>
                      </Button>
                      )}
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={2}>
                        Test Cycle*
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.isErrorOnTestCycle} onChange={this.selectTestCycle.bind(this)} name="testCycle" value={this.state.selectedTestCycle}>
                          <DropDownOptions options={this.state.listOfTestCycle} />
                        </Input>
                      </Col>
                      {!this.state.isUserSelectedNewTestPlan && (<Label sm={2}>
                        Test Plan*
                      </Label>
                      )}
                      {!this.state.isUserSelectedNewTestPlan && (<Col>
                        <Input type="select" invalid={this.state.isErrorOnTestPlan} name="testPlan" value={this.state.selectedTestPlan} onChange={this.selectTestPlan.bind(this)}>
                          <option></option>
                          <DropDownOptions options={this.state.listOfTestPlan} />
                        </Input>
                      </Col>
                      )}
                      {this.state.isUserSelectedNewTestPlan && (<Label sm={2}>
                        New Test Plan*
                      </Label>
                      )}
                      {this.state.isUserSelectedNewTestPlan && (<Col>
                        <Input type="input" invalid={this.state.isErrorOnNewTestPlan} name="newtestPlan" value={this.state.newTestPlan} onChange={this.addNewTestPlan.bind(this)} maxLength={100}>
                        </Input>
                      </Col>
                      )}
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>Test Execution Configuration
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={2}>
                        Testing type*
                      </Label>
                      <Col>
                        <Input type="select" name="testingtype" value={this.state.selectedTestingType} onChange={this.selectTestingType.bind(this)}>
                          <DropDownOptions options={this.state.listOfTestingType} />
                        </Input>
                      </Col>
                      <Label sm={2}>
                        Screen*
                      </Label>
                      <Col>
                        <Input type="select" name="screen" value={this.state.selectedScreen} onChange={this.selectScreen.bind(this)}>
                          <DropDownOptions options={this.state.listOfScreen} />
                        </Input>
                      </Col>
                      <Label sm={2}>
                        Browser/Device*
                      </Label>
                      <Col>
                        <Input type="input" invalid={this.state.isErrorOnBrowser} name="deviceorBrowser" value={this.state.browser} onChange={this.selectBrowser.bind(this)} maxLength={50}>
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={2}>
                        OS
                      </Label>
                      <Col>
                        <Input type="input" name="os" value={this.state.oS} onChange={this.selectOS.bind(this)} maxLength={50}>
                        </Input>
                      </Col>
                      <Label sm={2}>
                        Release version
                      </Label>
                      <Col>
                        <Input type="input" name="releaseversion" value={this.state.releaseVersion} onChange={this.selectReleaseVersion.bind(this)} maxLength={100}>
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
                    Test Cases
                    {/* <div className="d-flex justify-content-between align-items-center">
                      <Col>
                        <Input type="select" name="placeHolder" value={this.state.selectedPlaceHolder} onChange={this.selectPlaceHolder.bind(this)}>
                          <DropDownOptions options={this.state.listOfPlaceHolder} />
                        </Input>
                      </Col>
                    </div> */}
                    <ButtonGroup size="sm">
                      <Button color='dark' name="loadtestCases" onClick={this.loadTestCase.bind(this)}>
                        <small>Load Test Cases</small>
                      </Button>
                      <Button color='info' name="updateTestPlan" onClick={this.updateTestPlan.bind(this)}>
                        <small>Update Test Plan</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.listOfTestCases}
                      columns={TestPlanTableHeader}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      filter={filterFactory()}
                      pagination={paginationFactory()}
                      expandRow={expandRow}
                      cellEdit={cellEditFactory({
                        mode: 'click',
                        blurToSave: true,
                        afterSaveCell: (oldValue, newValue, row, column) => {
                          if (oldValue != newValue) {
                            var testId = row.testid;
                            TestPlanData.UpdatedTestRowData[testId] = {};
                            TestPlanData.UpdatedTestRowData[testId][column.dataField] = newValue;
                          }
                        }
                      })}
                      selectRow={selectTestCase}
                    />
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {!this.state.isUserSelectedNewTestPlan && (<Row>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Execution status
                </CardHeader>
                <CardBody>
                  <Col>
                    <DoughnutChart color={['#17E798', '#F38295', '#ffcc00']} labels={['Pass', 'Fail', 'Pending']} data={this.state.executionSummaryData}></DoughnutChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={9} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Pass Fail Count Module Wise
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart color={['#17E798', '#F38295', '#ffcc00']} labels={this.state.executedComponentXaxis} data={this.state.executedComponentYaxis}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          )}
        </Fade>
      </Page>

    );
  }
}
export default TestPlanPage;
