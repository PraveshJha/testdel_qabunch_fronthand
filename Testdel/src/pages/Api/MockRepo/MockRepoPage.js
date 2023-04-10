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
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Fade,
} from 'reactstrap';
import { MockData } from './MockData'
import MockRepoGetter from './MockRepoGetter';
import { Config } from '../../../QAautoMATER/Config';
import { ResponseHttpTableHeader, UtilityFunctionHeader } from './MockTableHeader'
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import NotificationSystem from 'react-notification-system';
import "react-widgets/styles.css";
import ReactJson from 'react-json-view'
import DataGetter from '../../DataGetter';
import { DynamicData } from '../../../QAautoMATER/dynamicData/DynamicData';
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-widgets/styles.css";


class MockRepoPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //****** Basic Details  ***********************************************************
      allComponentList: MockData.AllComponentList,
      selectedComponent: MockData.SelectedComponent,
      isErrorOnComponentName: MockData.IsErrorOnComponentName,
      allTestId: MockData.AllTestId,
      selectedTestId: MockData.SelectedTestId,
      isErrorOnTestId: MockData.IsErrorOnTestId,
      testName: MockData.TestName,

      //****** Response Header Table  **************************************
      responseHeaderData: MockData.ResponseHeaderData,
      selectedRowForResponseHeaderTable: MockData.SelectedRowForResponseHeaderTable,

      //****** Response Body Table  **************************************
      responseBody: MockData.ResponseBody,
      isDynamicDataButtonDisable: MockData.IsDynamicDataButtonDisable,
      selectedKeyNameInRequestBody: '',
      selectedKeyNameSpaceinRequestBody: [],
      testDataModal: false,
      dynamicDataValue: '',
      selectedRowFromDynamicDataTable: MockData.SelectedRowFromDynamicDataTable,

    };

  }
  componentWillMount = async () => {
    window.scrollTo(0, 0);
    await MockRepoGetter.apiMockRepoPageLoadData();

    //****** Basic Details ***********************************************************
    this.setState({ allComponentList: MockData.AllComponentList });
    this.setState({ selectedComponent: MockData.SelectedComponent });
    this.setState({ isErrorOnComponentName: MockData.IsErrorOnComponentName });
    this.setState({ allTestId: MockData.AllTestId });
    this.setState({ selectedTestId: MockData.SelectedTestId });
    this.setState({ isErrorOnTestId: MockData.IsErrorOnTestId });
    this.setState({ testName: MockData.TestName });

    //****** Request Header table Data ****************************************************
    this.setState({ responseHeaderData: MockData.ResponseHeaderData });
    this.setState({ selectedRowForResponseHeaderTable: MockData.SelectedRowForResponseHeaderTable });

    //****** Request Body Table  **************************************
    this.setState({ responseBody: MockData.ResponseBody });
    this.setState({ isDynamicDataButtonDisable: MockData.IsDynamicDataButtonDisable });
    this.setState({ selectedRowFromDynamicDataTable: MockData.SelectedRowFromDynamicDataTable });

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
    var dataChoice = await event.target.value;
    this.setState({ isErrorOnComponentName: false });
    if (this.state.selectedComponent !== await dataChoice) {
      MockData.SelectedComponent = await dataChoice;
      this.setState({ selectedComponent: MockData.SelectedComponent })
      this.setState({ allTestId: [] })
      this.setState({ selectedTestId: '' })
      this.setState({ testName: '' })
      await MockRepoGetter.getTestIdAndTestName(await dataChoice);
      this.setState({ allTestId: MockData.AllTestId })
    }
  }

  selectTestId = async (event) => {
    var dataChoice = await event.target.value;
    this.setState({ isErrorOnTestId: false });
    if (this.state.selectedTestId !== await dataChoice) {
      MockData.SelectedTestId = await dataChoice;
      this.setState({ selectedTestId: MockData.SelectedTestId })
      await MockRepoGetter.getTestName(await dataChoice);
      this.setState({ testName: MockData.TestName })
      var mockDetailsIfAlreadyPresent = await MockRepoGetter.getMockDataForExistingTestId(MockData.SelectedComponent,MockData.SelectedTestId,MockData.TestName,'Api');
      if (Object.keys(mockDetailsIfAlreadyPresent).length > 0) {
        this.setState({ responseHeaderData: await mockDetailsIfAlreadyPresent['ResponseHeader'] })
        this.setState({ responseBody: await mockDetailsIfAlreadyPresent['ResponseBody'] })
        MockData.ResponseBody = await mockDetailsIfAlreadyPresent['ResponseBody'];
        MockData.ResponseHeaderData = await mockDetailsIfAlreadyPresent['ResponseHeader'];
        MockData.IsMockedTestIdOnServer = true;
      }
      else{
        this.setState({ responseHeaderData: [{id:1,key:'content-type',value:'application/json'}] })
        this.setState({ responseBody: {'MockedResponseBody':'Paste Mock Response Body here'} })
        MockData.IsMockedTestIdOnServer = false;
      }
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
      MockData.SelectedRowFromDynamicDataTable = await row.id;
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
         existingRequestBody = this.state.responseBody;
        var keytoSend
        if (dataParam.trim() !== '')
          keytoSend = '{{RandomData.' + dataKey + '||' + dataParam + '}}'
        else
          keytoSend = '{{RandomData.' + dataKey + '}}'
         existingRequestBody = await MockRepoGetter.updateRequestBody(this.state.responseBody, await nameSpaceForKey, keytoSend);
        this.setState({ responseBody: {} }, () => { this.setState({ responseBody: existingRequestBody }); });
        MockData.ResponseBody = this.state.responseBody;
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
      var dataValue = await MockRepoGetter.getDynamicDataValue(dataKey, dataParam);
      this.setState({ dynamicDataValue: dataValue });
    }
    else {
      return await this.getNotification('error', "Please select any data key before evaluating the value");
    }
  }

  //************************* Request Header Details****************************************************

  selectRadioButtonFromResponseHeaderTable = async (row, isSelect) => {
    if (await isSelect) {
      MockData.SelectedRowForResponseHeaderTable = await row.id;
      this.setState({ selectedRowForResponseHeaderTable: await row.id });
    }

  }

  addRowInResponseHeaderTable = async (event) => {
    await event.preventDefault();
    var tableData = this.state.responseHeaderData;
    var lastId = tableData.length + 1;
    var newRow = { id: lastId, key: '', value: '' }
    if (lastId > 1) {
      var perVkeyName = await tableData[lastId - 2]['key'];
      var perVkeyValue = await tableData[lastId - 2]['value'];
      if (perVkeyName.trim() === '' || perVkeyValue.trim() === '') {
        return await this.getNotification('error', "Please add correct details for key/value in 'Response Header' table");
      }
    }
    this.setState({ responseHeaderData: [...this.state.responseHeaderData, newRow] });
    if (MockData.ResponseHeaderData === undefined) {
      MockData.ResponseHeaderData = [];
    }
    MockData.ResponseHeaderData.push(newRow);
  }

  deleteRowFromResponseHeaderTable = async (event) => {
    await event.preventDefault();
    var allDataFromTable = this.state.responseHeaderData;
    if (Number(this.state.selectedRowForResponseHeaderTable) > 0 && Number(this.state.selectedRowForResponseHeaderTable) <= allDataFromTable.length) {
      var dataAfterDelete = await DataGetter.updateTableAfterDeleteRowId(allDataFromTable, this.state.selectedRowForResponseHeaderTable)
      this.setState({ responseHeaderData: await dataAfterDelete });
      MockData.ResponseHeaderData = await dataAfterDelete;
    }
    else {
      return await this.getNotification('error', "No row is selected for delete from 'Request Header' table");
    }
  }

  //************************* Response Body Details****************************************************

  // addNewDataSet = async (updated_src) => {
  //   var allDataSet = await updated_src['updated_src'];
  //   this.setState({ responseBody: await allDataSet });
  //   MockData.ResponseBody = await allDataSet;
  // }

  editRequestBody = async (updated_src) => {
    var allDataSet = await updated_src['updated_src'];
    this.setState({ responseBody: await allDataSet });
    MockData.ResponseBody = await allDataSet;
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

  saveMockData = async (event) => {
    await event.preventDefault();
    var componentName = this.state.selectedComponent;
    var testId = this.state.selectedTestId;
    if (componentName.toString().trim() === '') {
      this.setState({ isErrorOnComponentName: true })
    }
    if (testId.toString().trim() === '') {
      this.setState({ isErrorOnTestId: true })
    }
    if (componentName.trim() === '' || testId.toString().trim() === '') {
      return await this.getNotification('error', 'Component/TestId can not be blank, Please add the value in highlited field');
    }
    //verify Response Header Table
    var isResponseHeaderValid = MockRepoGetter.isAllDetailsValidForResponseHeaderTable();
    if (!await isResponseHeaderValid) {
      return await this.getNotification('error', 'Response header data is not valid , please add the correct data in Response Header table');
    }
    //@ verify Response Body
    var isBodyValid = await MockRepoGetter.isResponseBodyValid();
    if (!await isBodyValid) {
      return await this.getNotification('error', 'Response Body is not valid , Mocked Response body should be in JSON format');
    }
    this.setState({ isPageLoading: true });
    var isSaved = await MockRepoGetter.saveMockData();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      MockData.IsMockedTestIdOnServer = true;
      return await this.getNotification('success', 'Mock data is successfully saved.');
    }
    else {
      MockData.IsMockedTestIdOnServer = false;
      return await this.getNotification('error', 'Unable to save Mock Data because of ' + Config.ErrorMessage);
    }

  }

  deleteMockData = async (event) => {
    await event.preventDefault();
    var componentName = this.state.selectedComponent;
    var testId = this.state.selectedTestId;
    if (componentName.toString().trim() === '') {
      this.setState({ isErrorOnComponentName: true })
    }
    if (testId.toString().trim() === '') {
      this.setState({ isErrorOnTestId: true })
    }
    if (componentName.trim() === '' || testId.toString().trim() === '') {
      return await this.getNotification('error', 'Component/TestId can not be blank, Please add the value in highlited field');
    }

    if (!await MockData.IsMockedTestIdOnServer) {
      return await this.getNotification('error', 'Mocked Response data is not found on server for testId '+testId);
    }
    this.setState({ isPageLoading: true });
    var isSaved = await MockRepoGetter.deleteMockedDataForTestId();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      MockData.IsMockedTestIdOnServer = false;
      this.setState({selectedComponent:""})
      this.setState({selectedTestId:""})
      this.setState({testName:""})
      MockData.SelectedComponent='';
      MockData.SelectedTestId='';
      MockData.TestName='';
      MockData.ResponseBody ={'MockedResponseBody':'Paste Mock Response Body here'};
      MockData.ResponseHeaderData =[{id:1,key:'content-type',value:'application/json'}];
      this.setState({responseBody:MockData.ResponseBody})
      this.setState({responseHeaderData:MockData.ResponseHeaderData})
      return await this.getNotification('success', 'Mocked Response data is successfully deleted for testId '+testId);
    }
    else {
      MockData.IsMockedTestIdOnServer = true;
      return await this.getNotification('error', 'Unable to delete Mocked Response data because of ' + Config.ErrorMessage);
    }

  }

  //****************** End */********************************** */

  render() {
    const selectRowFromResponseHeaderTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromResponseHeaderTable,
      selected: [this.state.selectedRowForResponseHeaderTable]
    };
    const selectRowFromDynamicDataTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromDynamicDataTable,
      selected: [this.state.selectedRowFromDynamicDataTable],
      disabled: [0]
    };
    return (
      <Page
        className="MockrepositoryPage"
        title="Mock repository"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}> 
        <NotificationSystem ref={this.notificationSystem} />
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Choose Api Scripts
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={5}>
                      Component
                    </Label>
                    <Col >
                      <Input type="select" invalid={this.state.isErrorOnComponentName} onChange={this.selectComponent.bind(this)} name="component" value={this.state.selectedComponent}>
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
                      <Input invalid={this.state.isErrorOnTestId} type="select" value={this.state.selectedTestId} onChange={this.selectTestId.bind(this)} >
                        <option></option>
                        <DropDownOptions options={this.state.allTestId} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>
                      Test Name
                    </Label>
                    <Col>
                      <Input type="input" name="testName" value={this.state.testName}>
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
                  Mock Response
                  <ButtonGroup size="sm">
                    <Button color='dark' onClick={this.saveMockData.bind(this)}>
                      <small>Save</small>
                    </Button>
                    <Button color='info' onClick={this.deleteMockData.bind(this)}>
                      <small>Delete</small>
                    </Button>
                  </ButtonGroup>
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card>
                      <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                          Response Header
                          <ButtonGroup size="sm">
                            <Button color='dark' onClick={this.addRowInResponseHeaderTable.bind(this)}>
                              <small>Add</small>
                            </Button>
                            <Button color='info' onClick={this.deleteRowFromResponseHeaderTable.bind(this)}>
                              <small>Delete</small>
                            </Button>
                          </ButtonGroup>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <Col>
                          <BootstrapTable
                            keyField='id'
                            data={this.state.responseHeaderData}
                            columns={ResponseHttpTableHeader}
                            wrapperClasses="table-responsive"
                            striped
                            hover
                            condensed
                            selectRow={selectRowFromResponseHeaderTable}
                            cellEdit={cellEditFactory({
                              mode: 'click',
                              blurToSave: true,
                              afterSaveCell: (oldValue, newValue, row, column) => {
                                this.setState({ responseHeaderData: MockData.ResponseHeaderData })
                              }
                            })}
                          />
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Card>
                      <CardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                          Response Body
                          <Button disabled={this.state.isDynamicDataButtonDisable} color='dark' size="sm" onClick={this.openDynamicTestDataModal.bind(this)}>
                            <small>Select Dynamic Data</small>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <Col>
                          <ReactJson name={false} collapseStringsAfterLength={30} displayDataTypes={false} indentWidth={0} enableClipboard={true} iconStyle="circle" src={this.state.responseBody} onEdit={this.editRequestBody.bind(this)} onSelect={this.selectKeyInRequestBody} />
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
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
                        columns={UtilityFunctionHeader}
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
export default MockRepoPage;
