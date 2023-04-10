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
import { DefectData } from './DefectData'
import DefectGetter from './DefectGetter';
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
import {TestCaseCommentHeader, TestCaseHistoryHeader,DefectTableHeader } from '../WebPageTableHeader'
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import TreeMenu from 'react-simple-tree-menu';
import '../../../../node_modules/react-simple-tree-menu/dist/main.css';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const selectedProject = Config.SelectedProject;
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

class DefectPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //**** Test Folder*********************************************************
      folderTreeData: DefectData.FolderTreeData,

      //**** Test Details *********************************************************
      isErrorOnDefectTitle: DefectData.IsErrorOnDefectTitle,
      defectTitle: DefectData.DefectTitle,
      isErrorOnPlaceHolder: DefectData.IsErrorOnPlaceHolder,
      placeHolderName: DefectData.PlaceHolderName,
      listOfPlaceHolder: DefectData.ListOfPlaceHolder,
      listOfPriorityOptions: DefectData.ListOfPriorityOptions,
      defectPriority: DefectData.DefectPriority,
      listOfSeverity: DefectData.ListOfSeverity,
      defectSeverity: DefectData.DefectSeverity,
      listOfDefectStatus: DefectData.ListOfDefectStatus,
      defectStatus: DefectData.DefectStatus,
      listOfAssignedUsers: DefectData.ListOfAssignedUsers,
      defectAssignedTo: DefectData.DefectAssignedTo,
      listOfTestCycle: DefectData.ListOfTestCycle,
      isErrorOnTestCycle: DefectData.IsErrorOnTestCycle,
      testCaseTestCycle: DefectData.TestCaseTestCycle,
      lisOfTestID:DefectData.LisOfTestID,
      selectedTestId:DefectData.SelectedTestId,
      isErrorOnDefectSteps: DefectData.IsErrorOnDefectSteps,
      defectStepsToReproduce: DefectData.DefectStepsToReproduce,

      //*** All Test Case Details***********************************/
      allDefectDetails: DefectData.AllDefectDetails,

      //*** Choose Placeholder ***********************************/
      selectedPlaceHolderLabel: DefectData.SelectedPlaceHolderLabel,
      selectedPlaceHolderPath: DefectData.SelectedPlaceHolderPath,
      isErrorOnNewPlaceHOlder: DefectData.IsErrorOnNewPlaceHOlder,
      newPlaceHolderName: DefectData.NewPlaceHolderName,

      //****** Test Case Modal ********************************** */
      isDefectModalOpen: false,
      defectId: DefectData.DefectId,
      isErrorOnUpdatedDefectTitle: DefectData.IsErrorOnUpdatedDefectTitle,
      updatedDefectTitle: DefectData.UpdatedDefectTitle,
      updatedTestPlaceHolder: DefectData.UpdatedTestPlaceHolder,
      updatedTestPriority: DefectData.UpdatedTestPriority,
      updateddefectSeverity:DefectData.UpdateddefectSeverity,
      updatedDefectStatus:DefectData.UpdatedDefectStatus,
      defectNewAssignee:DefectData.DefectNewAssignee,
      updatedTestCycle: DefectData.UpdatedTestCycle,
      updatedTestID:DefectData.UpdatedTestID,
      updatedDefectSteps: DefectData.UpdatedDefectSteps,
      testHistory: DefectData.TestHistory,
      testComments: DefectData.TestComments,
      activeTab: DefectData.ActiveTab,
      classNameForComment: DefectData.ClassNameForComment,
      classNameForHistory: DefectData.ClassNameForHistory,
      newTestCaseComment: DefectData.NewTestCaseComment,
      isErrorOnTestComment: DefectData.IsErrorOnTestComment,

      //****** Test Case data Modal verification********************************** */
      isDefectNameSame: true,
      isDefectPrioritySame: true,
      isDefectSeveritySame: true,
      isDefectStatusSame: true,
      isDefectAssignedToSame: true,
      isDefectTestIdSame: true,
      isDefectStepsToReproduceSame: true,
      testCaseCreatedBy: '',
      modalForDelete: false

    };

  }
  componentDidMount = async () => {
    await window.scrollTo(0, 0);
    await DefectGetter.loadDefectPage();

    //**** Test Folder*********************************************************
    this.setState({ folderTreeData: {} }, () => { this.setState({ folderTreeData: DefectData.FolderTreeData }); });

    //**** Test Details *********************************************************
    this.setState({ isErrorOnDefectTitle: DefectData.IsErrorOnDefectTitle });
    this.setState({ defectTitle: DefectData.DefectTitle });
    this.setState({ isErrorOnPlaceHolder: DefectData.IsErrorOnPlaceHolder });
    this.setState({ placeHolderName: DefectData.PlaceHolderName });
    this.setState({ listOfPlaceHolder: DefectData.ListOfPlaceHolder });
    this.setState({ listOfPriorityOptions: DefectData.ListOfPriorityOptions });
    this.setState({ defectPriority: DefectData.DefectPriority });
    this.setState({ listOfSeverity: DefectData.ListOfSeverity });
    this.setState({ defectSeverity: DefectData.DefectSeverity });
    this.setState({ listOfDefectStatus: DefectData.ListOfDefectStatus });
    this.setState({ defectStatus: DefectData.DefectStatus });
    this.setState({ listOfAssignedUsers: DefectData.ListOfAssignedUsers });
    this.setState({ defectAssignedTo: DefectData.DefectAssignedTo });
    this.setState({ listOfTestCycle: DefectData.ListOfTestCycle });
    this.setState({ isErrorOnTestCycle: DefectData.IsErrorOnTestCycle });
    this.setState({ testCaseTestCycle: DefectData.TestCaseTestCycle });
    this.setState({ lisOfTestID: DefectData.LisOfTestID });
    this.setState({ selectedTestId: DefectData.SelectedTestId });
    this.setState({ isErrorOnDefectSteps: DefectData.IsErrorOnDefectSteps });
    this.setState({ defectStepsToReproduce: DefectData.DefectStepsToReproduce });

    //**** All Test Details *********************************************************
    this.setState({ allDefectDetails: DefectData.AllDefectDetails });

    //*** Choose Placeholder ***********************************/
    this.setState({ selectedPlaceHolderLabel: DefectData.SelectedPlaceHolderLabel });
    this.setState({ selectedPlaceHolderPath: DefectData.SelectedPlaceHolderPath });
    this.setState({ isErrorOnNewPlaceHOlder: DefectData.IsErrorOnNewPlaceHOlder });
    this.setState({ newPlaceHolderName: DefectData.NewPlaceHolderName });

    //*** Test Data Modal ***********************************/
    this.setState({ defectId: DefectData.DefectId });
    this.setState({ isErrorOnUpdatedDefectTitle: DefectData.IsErrorOnUpdatedDefectTitle });
    this.setState({ updatedDefectTitle: DefectData.UpdatedDefectTitle });
    this.setState({ updatedTestPlaceHolder: DefectData.UpdatedTestPlaceHolder });
    this.setState({ updatedTestPriority: DefectData.UpdatedTestPriority });
    this.setState({ updateddefectSeverity: DefectData.UpdateddefectSeverity });
    this.setState({ updatedDefectStatus: DefectData.UpdatedDefectStatus });
    this.setState({ defectNewAssignee: DefectData.DefectNewAssignee });
    this.setState({ updatedTestCycle: DefectData.UpdatedTestCycle });
    this.setState({ updatedTestID: DefectData.UpdatedTestID });
    this.setState({ updatedDefectSteps: DefectData.UpdatedDefectSteps });
    this.setState({ testHistory: DefectData.TestHistory });
    this.setState({ testComments: DefectData.TestComments });
    this.setState({ activeTab: DefectData.ActiveTab });
    this.setState({ classNameForComment: DefectData.ClassNameForComment });
    this.setState({ classNameForHistory: DefectData.ClassNameForHistory });
    this.setState({ newTestCaseComment: DefectData.NewTestCaseComment });
    this.setState({ isErrorOnTestComment: DefectData.IsErrorOnTestComment });

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

  addNewDefectTitle = async (event) => {
    this.setState({ isErrorOnDefectTitle: false })
    var dataChoice = await event.target.value;
    if (await this.state.defectTitle !== await dataChoice) {
      DefectData.DefectTitle = await dataChoice;
      this.setState({ defectTitle: await dataChoice });
      var format = /[^A-Za-z ]/ig;
      if (await format.test(await dataChoice)) {
        DefectData.IsErrorOnDefectTitle = true;
        this.setState({ isErrorOnDefectTitle: true });
      }
    }
  };

  selectPlaceHolder = async (event) => {
    this.setState({ isErrorOnPlaceHolder: false })
    var dataChoice = await event.target.value;
    if (await this.state.placeHolderName !== await dataChoice) {
      DefectData.PlaceHolderName = await dataChoice;
      this.setState({ placeHolderName: await dataChoice });
    }
  };

  selectDefectPriority = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.defectPriority !== await dataChoice) {
      DefectData.DefectPriority = await dataChoice;
      this.setState({ defectPriority: await dataChoice });
    }
  };

  selectDefectSeverity = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.defectSeverity !== await dataChoice) {
      DefectData.DefectSeverity = await dataChoice;
      this.setState({ defectSeverity: await dataChoice });
    }
  };

  updateDefectSeverity = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updateddefectSeverity !== await dataChoice) {
      this.setState({isDefectSeveritySame:true})
      DefectData.UpdateddefectSeverity = await dataChoice;
      this.setState({ updateddefectSeverity: await dataChoice });
    }
    else{
      this.setState({isDefectSeveritySame:true})
    }
  };

  selectDefectStatus = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.defectStatus !== await dataChoice) {
      DefectData.DefectStatus = await dataChoice;
      this.setState({ defectStatus: await dataChoice });
    }
  };

  updateDefectStatus = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedDefectStatus !== await dataChoice) {
      this.setState({isDefectStatusSame:false})
      DefectData.UpdatedDefectStatus = await dataChoice;
      this.setState({ updatedDefectStatus: await dataChoice });
    }
    else{
      this.setState({isDefectStatusSame:true})
    }
  };

  selectTestCycle = async (event) => {
    this.setState({ isErrorOnTestCycle: false })
    var dataChoice = await event.target.value;
    if (await this.state.testCaseTestCycle !== await dataChoice) {
      DefectData.TestCaseTestCycle = await dataChoice;
      this.setState({ testCaseTestCycle: await dataChoice });
    }
  };

  addStepsToRepduce = async (event) => {
    this.setState({ isErrorOnDefectSteps: false })
    var dataChoice = await event.target.value;
    if (await this.state.defectStepsToReproduce !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      DefectData.DefectStepsToReproduce = await dataChoice;
      this.setState({ defectStepsToReproduce: await dataChoice });
    }
  };

  addDefectStepsToRepduce = async (event) => {
    var dataChoice = await event;
    if (await this.state.defectStepsToReproduce !== await dataChoice) {
      DefectData.DefectStepsToReproduce = await dataChoice;
      this.setState({ defectStepsToReproduce: await dataChoice });
    }
  };

  mapTestCase = async (event) => {
  //  DefectData.SelectedTestId =[];
  //  for(let i=0;i<await event.length;i++)
  //  {
  //    var selectedId =await event[i]['value'];
  //    DefectData.SelectedTestId.push(await selectedId);
  //  }
   DefectData.SelectedTestId = await event;
   this.setState({selectedTestId:DefectData.SelectedTestId});
  };

  mapUpdatedTestCase = async (event) => {
    if(this.state.updatedTestID !== await event)
    {
     DefectData.UpdatedTestID = await event;
     this.setState({updatedTestID:DefectData.UpdatedTestID});
     this.setState({isDefectTestIdSame:false})
    }
    else{
      this.setState({isDefectTestIdSame:true})
    }
    };

  selectEmail = async (event) => {
    DefectData.DefectAssignedTo = await event;
    this.setState({defectAssignedTo:DefectData.DefectAssignedTo});
   };

   updateEmail = async (event) => {
    if(await this.state.defectNewAssignee !== await event)
    {
    DefectData.DefectNewAssignee = await event;
    this.setState({defectNewAssignee:DefectData.DefectNewAssignee});
    this.setState({isDefectAssignedToSame:false});
    }
    else{
      this.setState({isDefectAssignedToSame:true});
    }

   };

  createNewDefect = async (event) => {

    await event.preventDefault();

    //****** Basic Details Verification  *****************************************

    var defectTitle = this.state.defectTitle;
    var placeHolder = this.state.placeHolderName;
    var testBody = this.state.defectStepsToReproduce;
    var testCycle = this.state.testCaseTestCycle;
    var errorMessage = '';

    ///****   Verify Require Filed */
    if (await defectTitle.toString().trim() === '') {
      errorMessage = 'Title can not be blank.'
      this.setState({ isErrorOnDefectTitle: true })
    }
    if (await placeHolder.toString().trim() === '') {
      errorMessage = errorMessage + 'Placeholder can not be blank.'
      this.setState({ isErrorOnPlaceHolder: true })
    }
    if (await testBody.toString().trim() === '') {
      errorMessage = errorMessage + 'Steps to reproduce can not be blank.'
      this.setState({ isErrorOnDefectSteps: true })
    }
    if (await testCycle.toString().trim() === '') {
      errorMessage = errorMessage + 'Cycle can not be blank.'
      this.setState({ isErrorOnTestCycle: true })
    }
    if (await errorMessage !== '') {
      return await this.getNotification('error', await errorMessage);
    }
    else {
      if (await this.state.isErrorOnDefectTitle) {
        this.setState({ isErrorOnDefectTitle: true })
        return await this.getNotification('error', "Defect title should have only alphabets.");
      }
      else {
        this.setState({ isPageLoading: true });
        var isSaved = await DefectGetter.addNewDefect();
        this.setState({ isPageLoading: false });
        if (isSaved) {
          this.setState({ defectTitle: '' });
          DefectData.DefectTitle = '';
          this.setState({ defectPriority: 'Medium' });
          DefectData.DefectPriority = 'Medium';
          this.setState({ defectSeverity: 'Minor' });
          DefectData.DefectSeverity = 'Monor';
          this.setState({ defectStatus: 'Open' });
          DefectData.DefectStatus = 'Open';
          this.setState({ defectStepsToReproduce: '' });
          DefectData.DefectStepsToReproduce = '';
          this.setState({defectAssignedTo:[]})
          DefectData.DefectAssignedTo =[];
          this.setState({selectedTestId:[]})
          DefectData.SelectedTestId =[];
          return await this.getNotification('success', 'Defect is successfully created.');
        }
        else {
          return await this.getNotification('error', 'Unable to create new defect because of ' + Config.ErrorMessage);
        }
      }
    }
  }

  selectPlaceHolderFromTree = async (item) => {
    DefectData.ListOfPlaceHolder = [];
    var relativePath = await item['key'];
    var folderName = await item['label'];
    DefectData.SelectedPlaceHolderPath = await relativePath;
    DefectData.SelectedPlaceHolderLabel = await folderName;
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
      DefectData.ListOfPlaceHolder.push(await actualRelativePath);
      DefectData.PlaceHolderName = await actualRelativePath;
      this.setState({ listOfPlaceHolder: await DefectData.ListOfPlaceHolder });
      this.setState({ placeHolderName: await actualRelativePath });
    }
    else {
      this.setState({ isErrorOnPlaceHolder: false });
      DefectData.ListOfPlaceHolder = [];
      DefectData.PlaceHolderName = '';
      this.setState({ listOfPlaceHolder: await DefectData.ListOfPlaceHolder });
      this.setState({ placeHolderName: '' });
    }
    DefectData.SelectedTestId =[];
    this.setState({selectedTestId:[]});
    this.setState({ isPageLoading: true });
    var allTestIdFromPath = await DefectGetter.getAllTestIDfromPath(await relativePath);
    this.setState({ lisOfTestID: await allTestIdFromPath })
    DefectData.LisOfTestID = await allTestIdFromPath;
    DefectData.AllDefectDetails =[];
    this.setState({allDefectDetails:[]})
    var allDefectDetails = await DefectGetter.getAllDefectFromPath(await relativePath);
    DefectData.AllDefectDetails = await allDefectDetails;
    this.setState({allDefectDetails:await allDefectDetails})
    this.setState({ isPageLoading: false });
  }

  toggleDeleteModal = async () => {
    this.setState({ modalForDelete: false });
  }

  addNewPlaceHolderName = async (event) => {
    this.setState({ isErrorOnNewPlaceHOlder: false })
    var dataChoice = await event.target.value;
    if (await this.state.newPlaceHolderName !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      DefectData.NewPlaceHolderName = await dataChoice;
      this.setState({ newPlaceHolderName: await dataChoice });
      var format = /[^A-Za-z ]/ig;
      if (await format.test(await dataChoice)) {
        DefectData.isErrorOnNewPlaceHOlder = true;
        this.setState({ isErrorOnNewPlaceHOlder: true });
      }
    }
  };

  toggleDefectModal = async () => {
    this.setState({ isDefectModalOpen: false });
  }

  clickOnCommentsTab = async (event) => {

    await event.preventDefault();
    if (this.state.activeTab !== '1') {
      DefectData.ActiveTab = 1;
      this.setState({ activeTab: '1' })
      this.setState({ classNameForComment: 'active' })
      DefectData.ClassNameForComment = 'active';
      this.setState({ classNameForHistory: '' })
      DefectData.ClassNameForHistory = '';
    }
    else {
      this.setState({ classNameForHistory: 'active' })
      DefectData.ClassNameForHistory = 'active';
      this.setState({ classNameForComment: '' })
      DefectData.ClassNameForComment = '';
    }
  }

  clickOnHistoryTab = async (event) => {
    await event.preventDefault();
    if (this.state.activeTab !== '2') {
      DefectData.ActiveTab = 1;
      this.setState({ activeTab: '2' })
      this.setState({ classNameForHistory: 'active' })
      DefectData.ClassNameForHistory = 'active';
      this.setState({ classNameForComment: '' })
      DefectData.ClassNameForComment = '';
    }
    else {
      this.setState({ classNameForComment: 'active' })
      DefectData.ClassNameForComment = 'active';
      this.setState({ classNameForHistory: '' })
      DefectData.ClassNameForHistory = '';
    }
  }

  addTestComment = async (event) => {
    this.setState({ isErrorOnTestComment: false });
    var dataChoice = await event.target.value;
    if (await this.state.newTestCaseComment !== await dataChoice) {
      dataChoice = await dataChoice.toString();
      DefectData.NewTestCaseComment = await dataChoice;
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
    var isSaved = await DefectGetter.saveTestComments(await testComment);
    this.setState({ isPageLoading: false });
    if (isSaved) {
      this.setState({ newTestCaseComment: '' });
      DefectData.NewTestCaseComment = '';
      this.setState({ isDefectModalOpen: false });
      return await this.getNotification('success', 'Defect comment is successfully added.');
    }
    else {
      return await this.getNotification('error', 'Unable to save defect comment because of ' + Config.ErrorMessage);
    }
  }

  updateDefectTitle = async (event) => {
    this.setState({ isErrorOnUpdatedDefectTitle: false })
    var dataChoice = await event.target.value;
    if (await this.state.updatedDefectTitle !== await dataChoice) {
      this.setState({ isDefectNameSame: false });
      DefectData.UpdatedDefectTitle = await dataChoice;
      this.setState({ updatedDefectTitle: await dataChoice });
      var format = /[^A-Za-z ]/ig;
      if (await format.test(await dataChoice)) {
        DefectData.IsErrorOnUpdatedDefectTitle = true;
        this.setState({ isErrorOnUpdatedDefectTitle: true });
      }
    }
    else {
      this.setState({ isDefectNameSame: false });
    }
  };

  updateTestPriority = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedTestPriority !== await dataChoice) {
      this.setState({ isDefectPrioritySame: false });
      DefectData.UpdatedTestPriority = await dataChoice;
      this.setState({ updatedTestPriority: await dataChoice });
    }
    else {
      this.setState({ isDefectPrioritySame: true });
    }
  };

  updateDefectSteps = async (event) => {
    var dataChoice = await event.target.value;
    if (await this.state.updatedDefectSteps !== await dataChoice) {
      this.setState({ isTestStepsSame: false });
      dataChoice = await dataChoice.toString();
      DefectData.UpdatedDefectSteps = await dataChoice;
      this.setState({ updatedDefectSteps: await dataChoice });
    }
    else {
      this.setState({ isTestStepsSame: true });
    }
  };

  updateDefectStepsToReproduce = async (event) => {
    if (await this.state.updatedDefectSteps !== await event) {
      this.setState({ isDefectStepsToReproduceSame: false });
      DefectData.UpdatedDefectSteps = await event;
      this.setState({ updatedDefectSteps: await event });
    }
    else {
      this.setState({ isDefectStepsToReproduceSame: true });
    }
  };


  updateDefect = async (event) => {

    await event.preventDefault();

    //****** Basic Details Verification  *****************************************

    var defectTitle = this.state.updatedDefectTitle;
    var testBody = this.state.updatedDefectSteps;
    var errorMessage = '';

    ///****   Verify Require Filed */
    if (await defectTitle.toString().trim() === '') {
      errorMessage = 'Title can not be blank.'
      this.setState({ isErrorOnUpdatedDefectTitle: true })
    }
    if (await testBody.toString().trim() === '') {
      errorMessage = errorMessage + 'Steps to reproduce can not be blank.'
    }
    if (await errorMessage !== '') {
      return await this.getNotification('error', await errorMessage);
    }
    else {
      if (await this.state.isErrorOnUpdatedDefectTitle) {
        this.setState({ isErrorOnUpdatedDefectTitle: true })
        return await this.getNotification('error', "Defect title should have only alphabets.");
      }
      else {
        var updatedField = '';
        if (!this.state.isDefectNameSame) {
          updatedField = await updatedField + ', ' + 'Title'
        }
        if (!this.state.isDefectPrioritySame) {
          updatedField = await updatedField + ', ' + 'Priority'
        }
        if (!this.state.isDefectSeveritySame) {
          updatedField = await updatedField + ', ' + 'Severity'
        }
        if (!this.state.isDefectStatusSame) {
          updatedField = await updatedField + ', ' + 'Status'
        }
        if (!this.state.isDefectAssignedToSame) {
          updatedField = await updatedField + ', ' + 'Assigned to'
        }
        if (!this.state.isDefectTestIdSame) {
          updatedField = await updatedField + ', ' + 'Test Id'
        }
        if (!this.state.isDefectStepsToReproduceSame) {
          updatedField = await updatedField + ', ' + 'Steps to reproduce'
        }
        if (updatedField === '') {
          this.setState({ isDefectModalOpen: false })
          return await this.getNotification('warning', 'No changes to save.');
        }
        updatedField = await updatedField.substring(1);
        var history = "Defect" + updatedField + ' field updated.';
        this.setState({ isPageLoading: true });
        var isSaved = await DefectGetter.updateDefectField(await history);
        this.setState({ isPageLoading: false });
        if (await isSaved) {
          this.setState({ isDefectModalOpen: false });
          this.setState({ isDefectNameSame: true });
          this.setState({ isDefectPrioritySame: true });
          this.setState({ isDefectSeveritySame: true });
          this.setState({ isDefectStatusSame: true });
          this.setState({ isDefectAssignedToSame: true });
          this.setState({ isDefectTestIdSame: true });
          this.setState({ isDefectStepsToReproduceSame: true });
          return await this.getNotification('success', 'Defect is successfully updated.');
        }
        else {
          return await this.getNotification('error', 'Unable to save defect because of ' + Config.ErrorMessage);
        }
      }
    }
  }

  confirmdelete = async (event) => {
    await event.preventDefault();
    this.setState({ modalForDelete: true });
  }
  deleteDefectId = async (event) => {
    this.setState({ isPageLoading: true });
    var isSaved = await DefectGetter.deleteDefect();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      this.setState({ isDefectModalOpen: false });
      this.setState({ modalForDelete: false });
      return await this.getNotification('success', 'Defect is successfully deleted.');
    }
    else {
      return await this.getNotification('error', 'Unable to delete defect case because of ' + Config.ErrorMessage);
    }
  }

  automateTestCase = async (event) => {
    await event.preventDefault();
    await DefectGetter.getTestAutomationSteps();
    await window.open("/ui/testscript", "_blank");
  }

  //****************** End */********************************** */

  render() {
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        this.setState({ isErrorOnUpdatedDefectTitle: false })
        this.setState({ isErrorOnTestComment: false })
        this.setState({ isPageLoading: true });
        DefectData.DefectId = row.defectid;
        this.setState({ defectId: row.defectid })
        DefectData.UpdatedTestPlaceHolder = row.component;
        this.setState({ updatedTestPlaceHolder: row.component })
        DefectData.UpdatedTestCycle = row.cycle;
        this.setState({ updatedTestCycle: row.cycle });
        // Call API for Rest value
        Promise.resolve(DefectGetter.getDefectIdDetails()).then((defectDetails) => {
          if (Object.keys(defectDetails).length === 0) {
            return this.getNotification('error', 'Test case does not exist on Server, Please refresh the page and try again.');
          }
          DefectData.UpdatedDefectTitle = defectDetails['defectName'];
          this.setState({ updatedDefectTitle: defectDetails['defectName'] })
          DefectData.UpdatedTestPriority = defectDetails['priority'];
          this.setState({ updatedTestPriority: defectDetails['priority'] })
          DefectData.UpdateddefectSeverity = defectDetails['severity'];
          this.setState({ updateddefectSeverity: defectDetails['severity'] })
          DefectData.UpdatedDefectStatus = defectDetails['status'];
          this.setState({ updatedDefectStatus: defectDetails['status'] })
          DefectData.DefectNewAssignee = defectDetails['assignedTo'];
          this.setState({ defectNewAssignee: defectDetails['assignedTo'] })
          DefectData.UpdatedTestID = defectDetails['testId'];
          this.setState({ updatedTestID: defectDetails['testId'] })
          this.setState({ updatedDefectSteps: defectDetails['defectSteps'] })
          DefectData.UpdatedDefectSteps = defectDetails['defectSteps'];
          this.setState({ testHistory: defectDetails['History'] })
          DefectData.TestHistory = defectDetails['History'];
          this.setState({ testComments: defectDetails['Comments'] })
          DefectData.TestComments = defectDetails['Comments'];
          this.setState({ testCaseCreatedBy: defectDetails['createdBy'] })
          this.setState({ isDefectModalOpen: true });
        })
        this.setState({ isPageLoading: false });

      }
    };
    return (
      <Page
        className="defect"
        title="Defect"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <NotificationSystem ref={this.notificationSystem} />
          <Row>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Add new defect
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.createNewDefect.bind(this)}>
                        <small>Create new defect</small>
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
                        <Input type="input" invalid={this.state.isErrorOnDefectTitle} onChange={this.addNewDefectTitle.bind(this)} name="defectTitle" value={this.state.defectTitle}>
                        </Input>
                      </Col>
                      <FormGroup row>
                        <Label sm={2}>
                          Placeholder*
                        </Label>
                        <Col>
                          <Input type="select" invalid={this.state.isErrorOnPlaceHolder} onChange={this.selectPlaceHolder.bind(this)} name="placeHolderName" value={this.state.placeHolderName}>
                            <DropDownOptions options={this.state.listOfPlaceHolder} />
                          </Input>
                        </Col>
                        <Label sm={2}>
                          Priority*
                        </Label>
                        <Col>
                          <Input type="select" onChange={this.selectDefectPriority.bind(this)} name="priority" value={this.state.defectPriority}>
                            <DropDownOptions options={this.state.listOfPriorityOptions} />
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={2}>
                          Severity*
                        </Label>
                        <Col>
                          <Input type="select" onChange={this.selectDefectSeverity.bind(this)} name="BugSeverity" value={this.state.defectSeverity}>
                            <DropDownOptions options={this.state.listOfSeverity} />
                          </Input>
                        </Col>
                        <Label sm={2}>
                          Status*
                        </Label>
                        <Col>
                          <Input type="select" onChange={this.selectDefectStatus.bind(this)} name="automationType" value={this.state.defectStatus}>
                            <DropDownOptions options={this.state.listOfDefectStatus} />
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={2}>
                          Assigned to
                        </Label>
                        <Col>
                        <Select
                            defaultValue={this.state.defectAssignedTo}
                            name="testId"
                            options={this.state.listOfAssignedUsers}
                            className="basic-single"
                            classNamePrefix="select"
                            onChange={this.selectEmail.bind(this)}
                          />
                          {/* <Combobox
                            value={this.state.defectAssignedTo}
                            data={this.state.listOfAssignedUsers}
                            onSelect={this.selectAssignedToUsers.bind(this)}
                            onChange={this.searchComponent.bind(this)}
                            filter='contains'

                          /> */}
                          {/* <Input type="select" invalid={this.state.isErrorOnTestCycle} onChange={this.selectTestCycle.bind(this)} name="testCycle" value={this.state.defectAssignedTo}>
                            <DropDownOptions options={this.state.listOfAssignedUsers} />
                          </Input> */}
                        </Col>
                        <Label sm={2}>
                          Cycle*
                        </Label>
                        <Col>
                          <Input type="select" invalid={this.state.isErrorOnTestCycle} onChange={this.selectTestCycle.bind(this)} name="testCycle" value={this.state.testCaseTestCycle}>
                            <DropDownOptions options={this.state.listOfTestCycle} />
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={2}>
                          Test Id
                        </Label>
                        <Col>
                          <Select
                            defaultValue={this.state.selectedTestId}
                            isMulti
                            name="testId"
                            options={this.state.lisOfTestID}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.mapTestCase.bind(this)}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup col>
                      </FormGroup>
                      <FormGroup col>
                        <Label sm={3}>
                          Steps to reproduce*
                        </Label>
                        <Col>
                          {/* <Input type="textarea" invalid={this.state.isErrorOnDefectSteps} onChange={this.addStepsToRepduce.bind(this)} name="testcaseTestSteps" value={this.state.defectStepsToReproduce}>
                          </Input> */}
                          <ReactQuill theme="snow" formats={formats} value={this.state.defectStepsToReproduce} onChange={this.addDefectStepsToRepduce.bind(this)} />
                        </Col>
                      </FormGroup>
                      <FormGroup col>
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
                    Test Component
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup col>
                      <Col>
                        <TreeMenu
                          cacheSearch
                          data={this.state.folderTreeData}
                          hasSearch={false}
                          onClickItem={this.selectPlaceHolderFromTree.bind(this)}
                        />
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
                    Defect Details
                  </div>
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    keyField='id'
                    data={this.state.allDefectDetails}
                    columns={DefectTableHeader}
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
          <Modal size="xl" isOpen={this.state.isDefectModalOpen} className={this.props.className} backdrop="static">
            <ModalHeader toggle={this.toggleDefectModal.bind(this)}>Defect Details</ModalHeader>
            <ModalBody>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Card>
                    <CardHeader>
                      <div className="d-flex justify-content-between align-items-center">
                        Defect Id : {this.state.defectId}
                        <ButtonGroup size="sm">
                          <Button color='dark' onClick={this.updateDefect.bind(this)}>
                            <small>Update</small>
                          </Button>
                          {Users.isSuperAdmin && (<Button color='info' onClick={this.confirmdelete.bind(this)}>
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
                            <Input invalid={this.state.isErrorOnUpdatedDefectTitle} type="input" name="updatedDefectTitle" value={this.state.updatedDefectTitle} onChange={this.updateDefectTitle.bind(this)}>
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={2}>
                            Placeholder*
                          </Label>
                          <Col>
                            <Input type="input" name="updatedplaceholder" value={this.state.updatedTestPlaceHolder} disabled={true}>
                            </Input>
                          </Col>
                          <Label sm={2}>
                            Priority*
                          </Label>
                          <Col>
                            <Input type="select" name="updatedpriority" value={this.state.updatedTestPriority} onChange={this.updateTestPriority.bind(this)}>
                              <DropDownOptions options={this.state.listOfPriorityOptions} />
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label sm={2}>
                          Severity*
                        </Label>
                        <Col>
                          <Input type="select" onChange={this.updateDefectSeverity.bind(this)} name="BugSeverity" value={this.state.updateddefectSeverity}>
                            <DropDownOptions options={this.state.listOfSeverity} />
                          </Input>
                        </Col>
                        <Label sm={2}>
                          Status*
                        </Label>
                        <Col>
                          <Input type="select" onChange={this.updateDefectStatus.bind(this)} name="automationType" value={this.state.updatedDefectStatus}>
                            <DropDownOptions options={this.state.listOfDefectStatus} />
                          </Input>
                        </Col>
                      </FormGroup>
                        <FormGroup row>
                        <Label sm={2}>
                          Assigned to
                        </Label>
                        <Col>
                        <Select
                            defaultValue={this.state.defectNewAssignee}
                            name="testId"
                            options={this.state.listOfAssignedUsers}
                            className="basic-single"
                            classNamePrefix="select"
                            onChange={this.updateEmail.bind(this)}
                          />
                        </Col>
                          <Label sm={2}>
                            Cycle*
                          </Label>
                          <Col>
                            <Input type="input" name="testCycle" value={this.state.updatedTestCycle} disabled={true}>
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label sm={2}>
                          Test Id
                        </Label>
                        <Col>
                          <Select
                            defaultValue={this.state.updatedTestID}
                            isMulti
                            name="testId"
                            options={this.state.lisOfTestID}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.mapUpdatedTestCase.bind(this)}
                          />
                        </Col>
                      </FormGroup>
                        <FormGroup col>
                          <Label sm={3}>
                          Steps to reproduce*
                          </Label>
                          <Col>
                            {/* <Input type="textarea" invalid={this.state.isErrorOnUpdatedTestSteps} onChange={this.updateDefectSteps.bind(this)} name="updatedtestcaseTestSteps" value={this.state.updatedDefectSteps}>
                            </Input> */}
                            <ReactQuill theme="snow" formats={formats} value={this.state.updatedDefectSteps} onChange={this.updateDefectStepsToReproduce.bind(this)} />
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
              Are you sure,You want to delete the defect?
            </ModalBody>
            <ModalFooter>
              <ButtonGroup size="sm">
                <Button color='dark' onClick={this.toggleDeleteModal.bind(this)}>
                  <small>Cancel</small>
                </Button>
                <Button color='info' onClick={this.deleteDefectId.bind(this)}>
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
export default DefectPage;
