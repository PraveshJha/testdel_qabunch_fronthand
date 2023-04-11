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
  Fade,
  Form,
  Label,
  Input,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  ModalFooter
} from 'reactstrap';
import { TestCaseData } from './TestCaseData'
import TestCaseGetter from './TestCaseGetter';
import { Config, Users } from '../../../QAautoMATER/Config';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import NotificationSystem from 'react-notification-system';
import "react-widgets/styles.css";
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-widgets/styles.css";
import { TestCaseTableHeader, TestCaseCommentHeader, TestCaseHistoryHeader } from '../WebPageTableHeader'
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import TreeMenu from 'react-simple-tree-menu';
import '../../../../node_modules/react-simple-tree-menu/dist/main.css';
const selectedProject = Config.SelectedProject;

class TestCasePagePage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //**** Test Folder*********************************************************
      folderTreeData: TestCaseData.FolderTreeData,

      //**** Test Details *********************************************************
      isErrorOnTestCase: TestCaseData.IsErrorOnTestCase,
      testcaseName: TestCaseData.TestcaseName,
      isErrorOnPlaceHolder: TestCaseData.IsErrorOnPlaceHolder,
      placeHolderName: TestCaseData.PlaceHolderName,
      listOfPlaceHolder: TestCaseData.ListOfPlaceHolder,
      listOfPriorityOptions: TestCaseData.ListOfPriorityOptions,
      testcasePriority: TestCaseData.TestcasePriority,
      listOfTestingType: TestCaseData.ListOfTestingType,
      testCaseTestingType: TestCaseData.TestCaseTestingType,
      listOfAutomationType: TestCaseData.ListOfAutomationType,
      testCaseAutomationType: TestCaseData.TestCaseAutomationType,
      listOfTestCycle: TestCaseData.ListOfTestCycle,
      isErrorOnTestCycle: TestCaseData.IsErrorOnTestCycle,
      testCaseTestCycle: TestCaseData.TestCaseTestCycle,
      testCaseReference: TestCaseData.TestCaseReference,
      testCasePreCondition: TestCaseData.TestCasePreCondition,
      testCaseTestData: TestCaseData.TestCaseTestData,
      isErrorOnTestSteps: TestCaseData.IsErrorOnTestSteps,
      testCaseTestSteps: TestCaseData.TestCaseTestSteps,
      testCaseExpectedResults: TestCaseData.TestCaseExpectedResults,

      //*** All Test Case Details***********************************/
      allTestCaseDetails: TestCaseData.AllTestCaseDetails,

      //*** Choose Placeholder ***********************************/
      selectedPlaceHolderLabel: TestCaseData.SelectedPlaceHolderLabel,
      selectedPlaceHolderPath: TestCaseData.SelectedPlaceHolderPath,
      newPlaceHolderModal: false,
      isErrorOnNewPlaceHOlder: TestCaseData.IsErrorOnNewPlaceHOlder,
      newPlaceHolderName: TestCaseData.NewPlaceHolderName,

      //****** Test Case Modal ********************************** */
      isTestCaseModalOpen: false,
      testId: TestCaseData.TestId,
      isErrorOnUPdatedTestCaseName: TestCaseData.IsErrorOnUPdatedTestCaseName,
      updatedTestName: TestCaseData.UpdatedTestName,
      updatedTestPlaceHolder: TestCaseData.UpdatedTestPlaceHolder,
      updatedTestPriority: TestCaseData.UpdatedTestPriority,
      updatedTestType: TestCaseData.UpdatedTestType,
      updatedTestAutomationType: TestCaseData.UpdatedTestAutomationType,
      updatedTestCycle: TestCaseData.UpdatedTestCycle,
      updatedTestRefence: TestCaseData.UpdatedTestRefence,
      updatedTestPrecondition: TestCaseData.UpdatedTestPrecondition,
      updatedTestData: TestCaseData.UpdatedTestData,
      isErrorOnUpdatedTestSteps: TestCaseData.IsErrorOnUpdatedTestSteps,
      updatedTestSteps: TestCaseData.UpdatedTestSteps,
      updatedExpectedResults: TestCaseData.UpdatedExpectedResults,
      testHistory: TestCaseData.TestHistory,
      testComments: TestCaseData.TestComments,
      activeTab: TestCaseData.ActiveTab,
      classNameForComment: TestCaseData.ClassNameForComment,
      classNameForHistory: TestCaseData.ClassNameForHistory,
      newTestCaseComment: TestCaseData.NewTestCaseComment,
      isErrorOnTestComment: TestCaseData.IsErrorOnTestComment,

      //****** Test Case data Modal verification********************************** */
      isTestNameSame: true,
      isTestPrioritySame: true,
      isTestTypeSame: true,
      isTestAutomationTypeSame: true,
      isTestReferneceSame: true,
      isTestPreconditionSame: true,
      isTestTestDataSame: true,
      isTestStepsSame: true,
      isTestExpectedResultSame: true,
      testCaseCreatedBy: '',
      modalForDelete: false

    };

  }
  componentDidMount = async () => {
    await window.scrollTo(0, 0);
    await TestCaseGetter.loadTestCasePage();

    //**** Test Folder*********************************************************
    this.setState({ folderTreeData: {} }, () => { this.setState({ folderTreeData: TestCaseData.FolderTreeData }); });

    //**** Test Details *********************************************************
    this.setState({ isErrorOnTestCase: TestCaseData.IsErrorOnTestCase });
    this.setState({ testcaseName: TestCaseData.TestcaseName });
    this.setState({ isErrorOnPlaceHolder: TestCaseData.IsErrorOnPlaceHolder });
    this.setState({ placeHolderName: TestCaseData.PlaceHolderName });
    this.setState({ listOfPlaceHolder: TestCaseData.ListOfPlaceHolder });
    this.setState({ listOfPriorityOptions: TestCaseData.ListOfPriorityOptions });
    this.setState({ testcasePriority: TestCaseData.TestcasePriority });
    this.setState({ listOfTestingType: TestCaseData.ListOfTestingType });
    this.setState({ testCaseTestingType: TestCaseData.TestCaseTestingType });
    this.setState({ listOfAutomationType: TestCaseData.ListOfAutomationType });
    this.setState({ testCaseAutomationType: TestCaseData.TestCaseAutomationType });
    this.setState({ listOfTestCycle: TestCaseData.ListOfTestCycle });
    this.setState({ isErrorOnTestCycle: TestCaseData.IsErrorOnTestCycle });
    this.setState({ testCaseTestCycle: TestCaseData.TestCaseTestCycle });
    this.setState({ testCaseReference: TestCaseData.TestCaseReference });
    this.setState({ testCasePreCondition: TestCaseData.TestCasePreCondition });
    this.setState({ testCaseTestData: TestCaseData.TestCaseTestData });
    this.setState({ isErrorOnTestSteps: TestCaseData.IsErrorOnTestSteps });
    this.setState({ testCaseTestSteps: TestCaseData.TestCaseTestSteps });
    this.setState({ testCaseExpectedResults: TestCaseData.TestCaseExpectedResults });

    //**** All Test Details *********************************************************
    this.setState({ allTestCaseDetails: TestCaseData.AllTestCaseDetails });

    //*** Choose Placeholder ***********************************/
    this.setState({ selectedPlaceHolderLabel: TestCaseData.SelectedPlaceHolderLabel });
    this.setState({ selectedPlaceHolderPath: TestCaseData.SelectedPlaceHolderPath });
    this.setState({ isErrorOnNewPlaceHOlder: TestCaseData.IsErrorOnNewPlaceHOlder });
    this.setState({ newPlaceHolderName: TestCaseData.NewPlaceHolderName });

    //*** Test Data Modal ***********************************/
    this.setState({ testId: TestCaseData.TestId });
    this.setState({ isErrorOnUPdatedTestCaseName: TestCaseData.IsErrorOnUPdatedTestCaseName });
    this.setState({ updatedTestName: TestCaseData.UpdatedTestName });
    this.setState({ updatedTestPlaceHolder: TestCaseData.UpdatedTestPlaceHolder });
    this.setState({ updatedTestPriority: TestCaseData.UpdatedTestPriority });
    this.setState({ updatedTestType: TestCaseData.UpdatedTestType });
    this.setState({ updatedTestAutomationType: TestCaseData.UpdatedTestAutomationType });
    this.setState({ updatedTestCycle: TestCaseData.UpdatedTestCycle });
    this.setState({ updatedTestRefence: TestCaseData.UpdatedTestRefence });
    this.setState({ updatedTestPrecondition: TestCaseData.UpdatedTestPrecondition });
    this.setState({ updatedTestData: TestCaseData.UpdatedTestData });
    this.setState({ isErrorOnUpdatedTestSteps: TestCaseData.IsErrorOnUpdatedTestSteps });
    this.setState({ updatedTestSteps: TestCaseData.UpdatedTestSteps });
    this.setState({ updatedExpectedResults: TestCaseData.UpdatedExpectedResults });
    this.setState({ testHistory: TestCaseData.TestHistory });
    this.setState({ testComments: TestCaseData.TestComments });
    this.setState({ activeTab: TestCaseData.ActiveTab });
    this.setState({ classNameForComment: TestCaseData.ClassNameForComment });
    this.setState({ classNameForHistory: TestCaseData.ClassNameForHistory });
    this.setState({ newTestCaseComment: TestCaseData.NewTestCaseComment });
    this.setState({ isErrorOnTestComment: TestCaseData.IsErrorOnTestComment });

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

  //************************* Test Case Details ***************************************************************

  addNewTestCaseName = async (event) => {
    this.setState({ isErrorOnTestCase: false })
    var dataChoice = await event.target.value;
    if (await this.state.testcaseName !== await dataChoice) {
      TestCaseData.TestcaseName = await dataChoice;
      this.setState({ testcaseName: await dataChoice });
      var format = /[^A-Za-z ]/ig;
      if (await format.test(await dataChoice)) {
        TestCaseData.isErrorOnTestCase = true;
        this.setState({ isErrorOnTestCase: true });
      }
    }
  };

  selectPlaceHolder = async (event) => {
    this.setState({ isErrorOnPlaceHolder: false })
    var dataChoice = await event.target.value;
    if (await this.state.placeHolderName !== await dataChoice) {
      TestCaseData.PlaceHolderName = await dataChoice;
      this.setState({ placeHolderName: await dataChoice });
    }
  };

  selectTestPriority = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.testcasePriority !== await dataChoice) {
      TestCaseData.TestcasePriority = await dataChoice;
      this.setState({ testcasePriority: await dataChoice });
    }
  };

  selectTestTestingType = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.testCaseTestingType !== await dataChoice) {
      TestCaseData.TestCaseTestingType = await dataChoice;
      this.setState({ testCaseTestingType: await dataChoice });
    }
  };

  selectTestAutomationType = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.testCaseAutomationType !== await dataChoice) {
      TestCaseData.TestCaseAutomationType = await dataChoice;
      this.setState({ testCaseAutomationType: await dataChoice });
    }
  };

  selectTestCycle = async (event) => {
    this.setState({ isErrorOnTestCycle: false })
    var dataChoice = await event.target.value;
    if (await this.state.testCaseTestCycle !== await dataChoice) {
      TestCaseData.TestCaseTestCycle = await dataChoice;
      this.setState({ testCaseTestCycle: await dataChoice });
    }
  };

  addTestReference = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.testCaseReference !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      TestCaseData.TestCaseReference = await dataChoice;
      this.setState({ testCaseReference: await dataChoice });
    }
  };

  addTestPrecondition = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.testCasePreCondition !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      TestCaseData.TestCasePreCondition = await dataChoice;
      this.setState({ testCasePreCondition: await dataChoice });
    }
  };

  addTestData = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.testCaseTestData !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      TestCaseData.TestCaseTestData = await dataChoice;
      this.setState({ testCaseTestData: await dataChoice });
    }
  };

  addTestSteps = async (event) => {
    this.setState({ isErrorOnTestSteps: false })
    var dataChoice = await event.target.value;
    if (await this.state.testCaseTestSteps !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      TestCaseData.TestCaseTestSteps = await dataChoice;
      this.setState({ testCaseTestSteps: await dataChoice });
    }
  };

  addTestExpectedResults = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.testCaseExpectedResults !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      TestCaseData.TestCaseExpectedResults = await dataChoice;
      this.setState({ testCaseExpectedResults: await dataChoice });
    }
  };

  saveTestCase = async (event) => {

    await event.preventDefault();

    //****** Basic Details Verification  *****************************************

    var testTitle = this.state.testcaseName;
    var placeHolder = this.state.placeHolderName;
    var testBody = this.state.testCaseTestSteps;
    var testCycle = this.state.testCaseTestCycle;
    var errorMessage = '';

    ///****   Verify Require Filed */
    if (await testTitle.toString().trim() === '') {
      errorMessage = 'Title can not be blank.'
      this.setState({ isErrorOnTestCase: true })
    }
    if (await placeHolder.toString().trim() === '') {
      errorMessage = errorMessage + 'Placeholder can not be blank.'
      this.setState({ isErrorOnPlaceHolder: true })
    }
    if (await testBody.toString().trim() === '') {
      errorMessage = errorMessage + 'Steps can not be blank.'
      this.setState({ isErrorOnTestSteps: true })
    }
    if (await testCycle.toString().trim() === '') {
      errorMessage = errorMessage + 'Cycle can not be blank.'
      this.setState({ isErrorOnTestCycle: true })
    }
    if (await errorMessage !== '') {
      return await this.getNotification('error', "Please fill the required section.");
    }
    else {
      if (await this.state.isErrorOnTestCase) {
        this.setState({ isErrorOnTestCase: true })
        return await this.getNotification('error', "Test title should have only alphabets.");
      }
      else {
        this.setState({ isPageLoading: true });
        var isSaved = await TestCaseGetter.saveTestCase();
        this.setState({ isPageLoading: false });
        if (isSaved) {
          this.setState({ testcaseName: '' });
          TestCaseData.TestcaseName = '';
          this.setState({ testcasePriority: 'Medium' });
          TestCaseData.TestcasePriority = 'Medium';
          this.setState({ testCaseTestingType: 'Functional' });
          TestCaseData.TestCaseTestingType = 'Functional';
          this.setState({ testCaseAutomationType: 'Not Automated' });
          TestCaseData.TestCaseAutomationType = 'Not Automated';
          this.setState({ testCaseReference: '' });
          TestCaseData.TestCaseReference = '';
          this.setState({ testCasePreCondition: '' });
          TestCaseData.TestCasePreCondition = '';
          this.setState({ testCaseTestData: '' });
          TestCaseData.TestCaseTestData = '';
          this.setState({ testCaseTestSteps: '' });
          TestCaseData.TestCaseTestSteps = '';
          this.setState({ testCaseExpectedResults: '' });
          TestCaseData.TestCaseExpectedResults = '';
          return await this.getNotification('success', 'Test case is successfully created.');
        }
        else {
          return await this.getNotification('error', 'Unable to save test case because of ' + Config.ErrorMessage);
        }
      }
    }
  }

  selectPlaceHolderFromTree = async (item) => {
    TestCaseData.ListOfPlaceHolder = [];
    var relativePath = await item['key'];
    var folderName = await item['label'];
    TestCaseData.SelectedPlaceHolderPath = await relativePath;
    TestCaseData.SelectedPlaceHolderLabel = await folderName;
    this.setState({ selectedPlaceHolderPath: await relativePath })
    this.setState({ selectedPlaceHolderLabel: await folderName })
    this.setState({ isErrorOnNewPlaceHOlder: false });
    if (await relativePath !== await selectedProject) {
      this.setState({ isErrorOnPlaceHolder: false });
      var allPathFolder = await relativePath.split('/');
      var actualRelativePath = ''
      for (let i = 1; i < await allPathFolder.length; i++) {
        actualRelativePath = await actualRelativePath + '/' + await allPathFolder[i];
      }
      actualRelativePath = await actualRelativePath.substring(1);
      TestCaseData.ListOfPlaceHolder.push(await actualRelativePath);
      TestCaseData.PlaceHolderName = await actualRelativePath;
      this.setState({ listOfPlaceHolder: await TestCaseData.ListOfPlaceHolder });
      this.setState({ placeHolderName: await actualRelativePath });
    }
    else {
      this.setState({ isErrorOnPlaceHolder: false });
      TestCaseData.ListOfPlaceHolder = [];
      TestCaseData.PlaceHolderName = '';
      this.setState({ listOfPlaceHolder: await TestCaseData.ListOfPlaceHolder });
      this.setState({ placeHolderName: '' });
    }
    //* Load Test Case
    this.setState({ isPageLoading: true });
    var allTestCaseFromPath = await TestCaseGetter.getAllTestCaseFromPath(await relativePath);
    this.setState({ allTestCaseDetails: await allTestCaseFromPath })
    this.setState({ isPageLoading: false });
  }

  addNewPlaceHolder = async (event) => {
    await event.preventDefault();
    this.setState({ isErrorOnNewPlaceHOlder: false });
    var labelName = this.state.selectedPlaceHolderLabel;
    if (await labelName === '') {
      return await this.getNotification('error', 'Please select any parent folder before creating new placeholder.');
    }
    this.setState({ newPlaceHolderModal: true });
  }

  toggleNewPlaceHolderModal = async () => {
    this.setState({ newPlaceHolderModal: false });
  }

  toggleDeleteModal = async () => {
    this.setState({ modalForDelete: false });
  }

  addNewPlaceHolderName = async (event) => {
    this.setState({ isErrorOnNewPlaceHOlder: false })
    var dataChoice = await event.target.value;
    if (await this.state.newPlaceHolderName !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      TestCaseData.NewPlaceHolderName = await dataChoice;
      this.setState({ newPlaceHolderName: await dataChoice });
      var format = /[^A-Za-z ]/ig;
      if (await format.test(await dataChoice)) {
        TestCaseData.isErrorOnNewPlaceHOlder = true;
        this.setState({ isErrorOnNewPlaceHOlder: true });
      }
    }
  };

  createNewPlaceHolder = async (event) => {

    await event.preventDefault();

    //****** Required Filled  *****************************************

    var newPlaceHolderForCreate = this.state.newPlaceHolderName;

    if (await newPlaceHolderForCreate.toString().trim() === '') {
      return await this.getNotification('error', "New placeholder name can not be blank.");
    }
    else {
      if (await this.state.isErrorOnNewPlaceHOlder) {
        return await this.getNotification('error', "Placeholder name only accepts alphabet.");
      }
      else {
        var isPlaceHolderExist = await TestCaseGetter.isPlaceHolderAlreadyExist();
        if (await isPlaceHolderExist) {
          this.setState({ isErrorOnNewPlaceHOlder: true });
          return await this.getNotification('error', 'Placeholder ' + TestCaseData.NewPlaceHolderName + ' is already exist.');
        }
        this.setState({ isPageLoading: true });
        var isSaved = await TestCaseGetter.createNewPlaceHolderForTestCase();
        this.setState({ isPageLoading: false });
        if (await isSaved) {
          this.setState({ newPlaceHolderModal: false });
          this.setState({ folderTreeData: TestCaseData.FolderTreeData })
          return await this.getNotification('success', 'New placeholder is successfully added.');
        }
        else {
          return await this.getNotification('error', Config.ErrorMessage);
        }
      }
    }
  }

  toggleTestCaseModal = async () => {
    this.setState({ isTestCaseModalOpen: false });
  }

  clickOnCommentsTab = async (event) => {

    await event.preventDefault();
    if (this.state.activeTab !== '1') {
      TestCaseData.ActiveTab = 1;
      this.setState({ activeTab: '1' })
      this.setState({ classNameForComment: 'active' })
      TestCaseData.ClassNameForComment = 'active';
      this.setState({ classNameForHistory: '' })
      TestCaseData.ClassNameForHistory = '';
    }
    else {
      this.setState({ classNameForHistory: 'active' })
      TestCaseData.ClassNameForHistory = 'active';
      this.setState({ classNameForComment: '' })
      TestCaseData.ClassNameForComment = '';
    }
  }

  clickOnHistoryTab = async (event) => {
    await event.preventDefault();
    if (this.state.activeTab !== '2') {
      TestCaseData.ActiveTab = 1;
      this.setState({ activeTab: '2' })
      this.setState({ classNameForHistory: 'active' })
      TestCaseData.ClassNameForHistory = 'active';
      this.setState({ classNameForComment: '' })
      TestCaseData.ClassNameForComment = '';
    }
    else {
      this.setState({ classNameForComment: 'active' })
      TestCaseData.ClassNameForComment = 'active';
      this.setState({ classNameForHistory: '' })
      TestCaseData.ClassNameForHistory = '';
    }
  }

  addTestComment = async (event) => {
    this.setState({ isErrorOnTestComment: false });
    var dataChoice = await event.target.value;
    if (await this.state.newTestCaseComment !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      TestCaseData.NewTestCaseComment = await dataChoice;
      this.setState({ newTestCaseComment: await dataChoice });
    }
  };

  saveTestComment = async (event) => {

    await event.preventDefault()
    var testComment = this.state.newTestCaseComment.toString().trim();
    ///****   Verify Require Filed */
    if (await testComment === '') {
      return this.setState({ isErrorOnTestComment: true })
    }
    this.setState({ isPageLoading: true });
    var isSaved = await TestCaseGetter.saveTestComments(await testComment);
    this.setState({ isPageLoading: false });
    if (isSaved) {
      this.setState({ newTestCaseComment: '' });
      TestCaseData.NewTestCaseComment = '';
      this.setState({ isTestCaseModalOpen: false });
      return await this.getNotification('success', 'Test comment is successfully added.');
    }
    else {
      return await this.getNotification('error', 'Unable to save test comment because of ' + Config.ErrorMessage);
    }
  }

  updateTestCaseName = async (event) => {
    this.setState({ isErrorOnUPdatedTestCaseName: false })
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestName !== await dataChoice) {
      this.setState({ isTestNameSame: false });
      TestCaseData.UpdatedTestName = await dataChoice;
      this.setState({ updatedTestName: await dataChoice });
      var format = /[^A-Za-z ]/ig;
      if (await format.test(await dataChoice)) {
        TestCaseData.IsErrorOnUPdatedTestCaseName = true;
        this.setState({ isErrorOnUPdatedTestCaseName: true });
      }
    }
    else {
      this.setState({ isTestNameSame: false });
    }
  };

  updateTestPriority = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestPriority !== await dataChoice) {
      this.setState({ isTestPrioritySame: false });
      TestCaseData.UpdatedTestPriority = await dataChoice;
      this.setState({ updatedTestPriority: await dataChoice });
    }
    else {
      this.setState({ isTestPrioritySame: true });
    }
  };

  updateTestTestingType = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestType !== await dataChoice) {
      this.setState({ isTestTypeSame: false });
      TestCaseData.UpdatedTestType = await dataChoice;
      this.setState({ updatedTestType: await dataChoice });
    }
    else {
      this.setState({ isTestTypeSame: true });
    }
  };

  updateTestAutomationType = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestAutomationType !== await dataChoice) {
      this.setState({ isTestAutomationTypeSame: false });
      TestCaseData.UpdatedTestAutomationType = await dataChoice;
      this.setState({ updatedTestAutomationType: await dataChoice });
    }
    else {
      this.setState({ isTestAutomationTypeSame: true });
    }
  };

  updateTestReference = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestRefence !== await dataChoice) {
      this.setState({ isTestReferneceSame: false });
      dataChoice = await dataChoice.toString();
      TestCaseData.UpdatedTestRefence = await dataChoice;
      this.setState({ updatedTestRefence: await dataChoice });
    }
    else {
      this.setState({ updatedTestRefence: true });
    }
  };

  updateTestPrecondition = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestPrecondition !== await dataChoice) {
      this.setState({ isTestPreconditionSame: false });
      dataChoice = await dataChoice.toString();
      TestCaseData.UpdatedTestPrecondition = await dataChoice;
      this.setState({ updatedTestPrecondition: await dataChoice });
    }
    else {
      this.setState({ updatedTestPrecondition: true });
    }
  };

  updateTestData = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestData !== await dataChoice) {
      this.setState({ isTestTestDataSame: false });
      dataChoice = await dataChoice.toString();
      TestCaseData.UpdatedTestData = await dataChoice;
      this.setState({ updatedTestData: await dataChoice });
    }
    else {
      this.setState({ isTestTestDataSame: true });
    }
  };

  updateTestSteps = async (event) => {
    this.setState({ isErrorOnUpdatedTestSteps: false })
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestSteps !== await dataChoice) {
      this.setState({ isTestStepsSame: false });
      dataChoice = await dataChoice.toString();
      TestCaseData.UpdatedTestSteps = await dataChoice;
      this.setState({ updatedTestSteps: await dataChoice });
    }
    else {
      this.setState({ isTestStepsSame: true });
    }
  };

  updateTestExpectedResults = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedExpectedResults !== await dataChoice) {
      this.setState({ isTestExpectedResultSame: false });
      dataChoice = await dataChoice.toString().trim();
      TestCaseData.UpdatedExpectedResults = await dataChoice;
      this.setState({ updatedExpectedResults: await dataChoice });
    }
    else {
      this.setState({ isTestExpectedResultSame: true });
    }
  };

  updateTestCase = async (event) => {

    await event.preventDefault();

    //****** Basic Details Verification  *****************************************

    var testTitle = this.state.updatedTestName;
    var testBody = this.state.updatedTestSteps;
    var errorMessage = '';

    ///****   Verify Require Filed */
    if (await testTitle.toString().trim() === '') {
      errorMessage = 'Title can not be blank.'
      this.setState({ isErrorOnTestCase: true })
    }
    if (await testBody.toString().trim() === '') {
      errorMessage = errorMessage + 'Steps can not be blank.'
      this.setState({ isErrorOnTestSteps: true })
    }
    if (await errorMessage !== '') {
      return await this.getNotification('error', "Please fill the required section.");
    }
    else {
      if (await this.state.isErrorOnUpdatedTestSteps) {
        this.setState({ isErrorOnUpdatedTestSteps: true })
        return await this.getNotification('error', "Test title should have only alphabets.");
      }
      else {
        var updatedField = '';
        if (!this.state.isTestNameSame) {
          updatedField = await updatedField + ', ' + 'Title'
        }
        if (!this.state.isTestPrioritySame) {
          updatedField = await updatedField + ', ' + 'Priority'
        }
        if (!this.state.isTestTypeSame) {
          updatedField = await updatedField + ', ' + 'Testing Type'
        }
        if (!this.state.isTestAutomationTypeSame) {
          updatedField = await updatedField + ', ' + 'Automation Type'
        }
        if (!this.state.isTestReferneceSame) {
          updatedField = await updatedField + ', ' + 'Reference'
        }
        if (!this.state.isTestPreconditionSame) {
          updatedField = await updatedField + ', ' + 'Precondition'
        }
        if (!this.state.isTestTestDataSame) {
          updatedField = await updatedField + ', ' + 'Test Data'
        }
        if (!this.state.isTestStepsSame) {
          updatedField = await updatedField + ', ' + 'Steps'
        }
        if (!this.state.isTestExpectedResultSame) {
          updatedField = await updatedField + ', ' + 'Expected Result'
        }
        if (updatedField === '') {
          this.setState({ isTestCaseModalOpen: false })
          return await this.getNotification('warning', 'No changes to save.');
        }
        updatedField = await updatedField.substring(1);
        var history = "Test case " + updatedField + ' field updated.';
        this.setState({ isPageLoading: true });
        var isSaved = await TestCaseGetter.updateTestCase(await history);
        this.setState({ isPageLoading: false });
        if (isSaved) {
          this.setState({ isTestCaseModalOpen: false });
          this.setState({ isTestNameSame: true });
          this.setState({ isTestPrioritySame: true });
          this.setState({ isTestTypeSame: true });
          this.setState({ isTestAutomationTypeSame: true });
          this.setState({ isTestReferneceSame: true });
          this.setState({ isTestPreconditionSame: true });
          this.setState({ isTestTestDataSame: true });
          this.setState({ isTestStepsSame: true });
          this.setState({ isTestExpectedResultSame: true });
          return await this.getNotification('success', 'Test case is successfully updated.');
        }
        else {
          return await this.getNotification('error', 'Unable to save test case because of ' + Config.ErrorMessage);
        }
      }
    }
  }

  confirmdelete = async (event) => {
    await event.preventDefault();
    this.setState({ modalForDelete: true });
  }
  deleteTestCase = async (event) => {
    this.setState({ isPageLoading: true });
    var isSaved = await TestCaseGetter.deleteTestCase();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      this.setState({ isTestCaseModalOpen: false });
      this.setState({ modalForDelete: false });
      return await this.getNotification('success', 'Test case is successfully deleted.');
    }
    else {
      return await this.getNotification('error', 'Unable to delete test case because of ' + Config.ErrorMessage);
    }
  }

  automateTestCase = async (event) => {
    await event.preventDefault();
    await TestCaseGetter.getTestAutomationSteps();
    await window.open("/ui/testscript", "_blank");
  }



  //****************** End */********************************** */

  render() {
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        this.setState({ isPageLoading: true });
        TestCaseData.TestId = row.testId;
        this.setState({ testId: row.testId })
        TestCaseData.UpdatedTestPlaceHolder = row.component;
        this.setState({ updatedTestPlaceHolder: row.component })
        TestCaseData.UpdatedTestCycle = row.cycle;
        this.setState({ updatedTestCycle: row.cycle });
        // Call API for Rest value
        Promise.resolve(TestCaseGetter.getTestIdDetails()).then((testDetails) => {
          if(Object.keys(testDetails).length ===0)
          {
            return this.getNotification('error', 'Test case does not exist on Server, Please refresh the page and try again.');
          }
          TestCaseData.UpdatedTestName = testDetails['testCaseName'];
          this.setState({ updatedTestName: testDetails['testCaseName'] })
          TestCaseData.UpdatedTestPriority = testDetails['priority'];
          this.setState({ updatedTestPriority: testDetails['priority'] })
          TestCaseData.UpdatedTestType = testDetails['testingType'];
          this.setState({ updatedTestType: testDetails['testingType'] })
          TestCaseData.UpdatedTestAutomationType = testDetails['automationType'];
          this.setState({ updatedTestAutomationType: testDetails['automationType'] });
          this.setState({ updatedTestPrecondition: testDetails['testPrecondition'] })
          TestCaseData.UpdatedTestPrecondition = testDetails['testPrecondition'];
          TestCaseData.UpdatedTestRefence = testDetails['references'];
          this.setState({ UpdatedTestRefence: testDetails['references'] });
          this.setState({ updatedTestData: testDetails['testcaseData'] })
          TestCaseData.UpdatedTestData = testDetails['testcaseData'];
          this.setState({ updatedTestSteps: testDetails['testSteps'] })
          TestCaseData.UpdatedTestSteps = testDetails['testSteps'];
          this.setState({ updatedExpectedResults: testDetails['testExpectedResult'] })
          TestCaseData.UpdatedExpectedResults = testDetails['testExpectedResult'];
          this.setState({ testHistory: testDetails['History'] })
          TestCaseData.TestHistory = testDetails['History'];
          this.setState({ testComments: testDetails['Comments'] })
          TestCaseData.TestComments = testDetails['Comments'];
          this.setState({ testCaseCreatedBy: testDetails['createdBy'] })
          this.setState({ isTestCaseModalOpen: true });
        })
        this.setState({ isPageLoading: false });

      }
    };
    return (
      <Page
        className="testcase"
        title="Test Case"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <NotificationSystem ref={this.notificationSystem} />
          <Row>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    New Test Case Details
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.saveTestCase.bind(this)}>
                        <small>Save Test Case</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup col>
                      <Label sm={3}>
                        Title*
                      </Label>
                      <Col>
                        <Input type="input" invalid={this.state.isErrorOnTestCase} onChange={this.addNewTestCaseName.bind(this)} name="testcaseName" value={this.state.testcaseName}>
                        </Input>
                      </Col>
                      <FormGroup row>
                        <Label sm={3}>
                          Placeholder*
                        </Label>
                        <Col>
                          <Input type="select" invalid={this.state.isErrorOnPlaceHolder} onChange={this.selectPlaceHolder.bind(this)} name="placeHolderName" value={this.state.placeHolderName}>
                            <DropDownOptions options={this.state.listOfPlaceHolder} />
                          </Input>
                        </Col>
                        <Label sm={3}>
                          Priority*
                        </Label>
                        <Col>
                          <Input type="select" onChange={this.selectTestPriority.bind(this)} name="priority" value={this.state.testcasePriority}>
                            <DropDownOptions options={this.state.listOfPriorityOptions} />
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={3}>
                          Type*
                        </Label>
                        <Col>
                          <Input type="select" onChange={this.selectTestTestingType.bind(this)} name="tesingType" value={this.state.testCaseTestingType}>
                            <DropDownOptions options={this.state.listOfTestingType} />
                          </Input>
                        </Col>
                        <Label sm={3}>
                          Automation type*
                        </Label>
                        <Col>
                          <Input type="select" onChange={this.selectTestAutomationType.bind(this)} name="automationType" value={this.state.testCaseAutomationType}>
                            <DropDownOptions options={this.state.listOfAutomationType} />
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={3}>
                          Cycle*
                        </Label>
                        <Col>
                          <Input type="select" invalid={this.state.isErrorOnTestCycle} onChange={this.selectTestCycle.bind(this)} name="testCycle" value={this.state.testCaseTestCycle}>
                            <DropDownOptions options={this.state.listOfTestCycle} />
                          </Input>
                        </Col>
                        <Label sm={3}>
                          References
                        </Label>
                        <Col>
                          <Input type="input" onChange={this.addTestReference.bind(this)} name="testcaseReference" value={this.state.testCaseReference}>
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup col>
                        <Label sm={3}>
                          Preconditions
                        </Label>
                        <Col>
                          <Input type="textarea" onChange={this.addTestPrecondition.bind(this)} name="testcasePrecondition" value={this.state.testCasePreCondition}>
                          </Input>
                        </Col>
                        <Label sm={3}>
                          Test data
                        </Label>
                        <Col>
                          <Input type="textarea" onChange={this.addTestData.bind(this)} name="testcaseName" value={this.state.testCaseTestData}>
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup col>
                        <Label sm={3}>
                          Steps*
                        </Label>
                        <Col>
                          <Input type="textarea" invalid={this.state.isErrorOnTestSteps} onChange={this.addTestSteps.bind(this)} name="testcaseTestSteps" value={this.state.testCaseTestSteps}>
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup col>
                        <Label sm={3}>
                          Expected Result
                        </Label>
                        <Col>
                          <Input type="textarea" onChange={this.addTestExpectedResults.bind(this)} name="testExpected" value={this.state.testCaseExpectedResults}>
                          </Input>
                        </Col>
                      </FormGroup>
                      {/* <Label sm={5}>
                        Environment
                      </Label>
                      <Col>
                        <Input type="select" invalid={this.state.validateDefaultSelectedEnvironment} onChange={this.selectDefaultEnvironment.bind(this)} name="defaultenvironment" value={this.state.defaultSelectedEnvironment}>
                          <DropDownOptions options={this.state.environmentList} />
                        </Input>
                      </Col> */}
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4} md={4} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Test Component structure
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.addNewPlaceHolder.bind(this)}>
                        <small>Create Placeholder</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <TreeMenu
                      cacheSearch
                      data={this.state.folderTreeData}
                      hasSearch={false}
                      onClickItem={this.selectPlaceHolderFromTree.bind(this)}
                    />
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
                    Test Case Details
                  </div>
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    keyField='id'
                    data={this.state.allTestCaseDetails}
                    columns={TestCaseTableHeader}
                    wrapperClasses="table-responsive"
                    striped
                    hover
                    condensed
                    pagination={paginationFactory()}
                    filter={filterFactory()}
                    rowEvents={rowEvents}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal isOpen={this.state.newPlaceHolderModal} className={this.props.className} backdrop="static">
            <ModalHeader toggle={this.toggleNewPlaceHolderModal.bind(this)}>Add New PlaceHolder</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup row>
                  <Label sm={5}>
                    New PlaceHolder*
                  </Label>
                  <Col>
                    <Input type="input" name="newPlaceHolder" invalid={this.state.isErrorOnNewPlaceHOlder} value={this.state.newPlaceHolderName} onChange={this.addNewPlaceHolderName.bind(this)}>
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Button color='dark' onClick={this.createNewPlaceHolder.bind(this)} >Save</Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
          <Modal size="xl" isOpen={this.state.isTestCaseModalOpen} className={this.props.className} backdrop="static">
            <ModalHeader toggle={this.toggleTestCaseModal.bind(this)}>Test Case Details</ModalHeader>
            <ModalBody>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Card>
                    <CardHeader>
                      <div className="d-flex justify-content-between align-items-center">
                        Test Id : {this.state.testId}
                        <ButtonGroup size="sm">
                          <Button color='dark' onClick={this.updateTestCase.bind(this)}>
                            <small>Update</small>
                          </Button>
                          <Button color='info' onClick={this.automateTestCase.bind(this)}>
                            <small>Automate</small>
                          </Button >
                          {(this.state.testCaseCreatedBy.toLocaleLowerCase().trim() === Users.userEmail.toLocaleLowerCase().trim() || Users.isSuperAdmin === true) && (<Button color='dark' onClick={this.confirmdelete.bind(this)}>
                            <small>Delete</small>
                          </Button>
                          )}
                        </ButtonGroup>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <FormGroup col>
                          <Label sm={3}>
                            Title*
                          </Label>
                          <Col>
                            <Input invalid={this.state.isErrorOnUPdatedTestCaseName} type="input" name="updatedtestcaseName" value={this.state.updatedTestName} onChange={this.updateTestCaseName.bind(this)}>
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}>
                            Placeholder*
                          </Label>
                          <Col>
                            <Input type="input" name="updatedplaceholder" value={this.state.updatedTestPlaceHolder} disabled={true}>
                            </Input>
                          </Col>
                          <Label sm={3}>
                            Priority*
                          </Label>
                          <Col>
                            <Input type="select" name="updatedpriority" value={this.state.updatedTestPriority} onChange={this.updateTestPriority.bind(this)}>
                              <DropDownOptions options={this.state.listOfPriorityOptions} />
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}>
                            Type*
                          </Label>
                          <Col>
                            <Input type="select" onChange={this.updateTestTestingType.bind(this)} name="updatedtesingType" value={this.state.updatedTestType}>
                              <DropDownOptions options={this.state.listOfTestingType} />
                            </Input>
                          </Col>
                          <Label sm={3}>
                            Automation type*
                          </Label>
                          <Col>
                            <Input type="select" onChange={this.updateTestAutomationType.bind(this)} name="updatedautomationType" value={this.state.updatedTestAutomationType}>
                              <DropDownOptions options={this.state.listOfAutomationType} />
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={3}>
                            Cycle*
                          </Label>
                          <Col>
                            <Input type="input" name="testCycle" value={this.state.updatedTestCycle} disabled={true}>
                            </Input>
                          </Col>
                          <Label sm={3}>
                            References
                          </Label>
                          <Col>
                            <Input type="input" onChange={this.updateTestReference.bind(this)} name="updatedtestcaseReference" value={this.state.updatedTestRefence}>
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup col>
                          <Label sm={3}>
                            Preconditions
                          </Label>
                          <Col>
                            <Input type="textarea" onChange={this.updateTestPrecondition.bind(this)} name="updatedtestcasePrecondition" value={this.state.updatedTestPrecondition}>
                            </Input>
                          </Col>
                          <Label sm={3}>
                            Test data
                          </Label>
                          <Col>
                            <Input type="textarea" onChange={this.updateTestData.bind(this)} name="updatedTestData" value={this.state.updatedTestData}>
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup col>
                          <Label sm={3}>
                            Steps*
                          </Label>
                          <Col>
                            <Input type="textarea" invalid={this.state.isErrorOnUpdatedTestSteps} onChange={this.updateTestSteps.bind(this)} name="updatedtestcaseTestSteps" value={this.state.updatedTestSteps}>
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup col>
                          <Label sm={3}>
                            Expected Result
                          </Label>
                          <Col>
                            <Input type="textarea" name="updatedExpectedResults" value={this.state.updatedExpectedResults} onChange={this.updateTestExpectedResults.bind(this)}>
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
                  <div>
                    <Nav tabs>
                      <NavItem >
                        <NavLink
                          className={this.state.classNameForComment}
                          onClick={this.clickOnCommentsTab.bind(this)}
                        >
                          Comments
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={this.state.classNameForHistory}
                          onClick={this.clickOnHistoryTab.bind(this)}
                        >
                          History
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId="1" activeTab={true}>
                        <Row>
                          <Col sm="12">
                            <BootstrapTable
                              keyField='id'
                              data={this.state.testComments}
                              columns={TestCaseCommentHeader}
                              wrapperClasses="table-responsive"
                              striped
                              hover
                              condensed
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Form>
                            <FormGroup row>
                              <Label sm={1}>
                                Comment
                              </Label>
                              <Col>
                                <Input type="textarea" invalid={this.state.isErrorOnTestComment} name="testCaseComment" value={this.state.newTestCaseComment} onChange={this.addTestComment.bind(this)}>
                                </Input>
                              </Col>
                              <Col>
                                <ButtonGroup size="sm">
                                  <Button color='dark' onClick={this.saveTestComment.bind(this)}>
                                    <small>Add Comment</small>
                                  </Button>
                                </ButtonGroup>
                              </Col>
                            </FormGroup>
                          </Form>
                        </Row>
                      </TabPane>
                      <TabPane tabId="2">
                        <Row>
                          <Col sm="12">
                            <BootstrapTable
                              keyField='id'
                              data={this.state.testHistory}
                              columns={TestCaseHistoryHeader}
                              wrapperClasses="table-responsive"
                              striped
                              hover
                              condensed
                            />
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
          <Modal isOpen={this.state.modalForDelete} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggleDeleteModal}>Confirmation</ModalHeader>
            <ModalBody>
              Are you sure,You want to delete test case ?
            </ModalBody>
            <ModalFooter>
              <ButtonGroup size="sm">
                <Button color='dark' onClick={this.toggleDeleteModal.bind(this)}>
                  <small>Cancel</small>
                </Button>
                <Button color='info' onClick={this.deleteTestCase.bind(this)}>
                  <small>Yes</small>
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </Modal>
        </Fade>
      </Page>

    );
  }
}
export default TestCasePagePage;
