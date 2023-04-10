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
} from 'reactstrap';
import { TestData } from './TestData'
import ConfigGetter from '../Configuration/ConfigGetter';
import CommonTestDataGetter from './CommonTestDataGetter';
import { Config } from '../../../QAautoMATER/Config';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import NotificationSystem from 'react-notification-system';
import "react-widgets/styles.css";
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-widgets/styles.css";
import { CommonTestDataHeaderTable } from '../WebPageTableHeader'


class TestDataPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //**** Common Test Data*********************************************************
      allCommonTestData: TestData.AllCommonTestData,
      selectedRowFromCommonTestDataTable: TestData.SelectedRowFromCommonTestDataTable,
      isDataValidInCommonTestDataTable: TestData.IsDataValidInCommonTestDataTable,

    };

  }
  componentWillMount = async () => {
    window.scrollTo(0, 0);
    await CommonTestDataGetter.testDataPageLoad();

    //**** Common Test Data*********************************************************
    this.setState({ allCommonTestData: TestData.AllCommonTestData });
    this.setState({ selectedRowFromCommonTestDataTable: TestData.SelectedRowFromCommonTestDataTable });
    this.setState({ isDataValidInCommonTestDataTable: TestData.IsDataValidInCommonTestDataTable });

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

  //************************* Common Test Data Table ***************************************************************

  selectRadioButtonFromCommonTestDataTable = (row, isSelect) => {
    if (isSelect) {
      TestData.SelectedRowFromCommonTestDataTable = row.id;
      this.setState({ selectedRowFromCommonTestDataTable: row.id });
    }

  }

  addNewData = async (event) => {
    await event.preventDefault();
    var dataDetails = this.state.allCommonTestData;
    if (dataDetails.length > 0) {
      var dataKey = dataDetails[dataDetails.length - 1]['key'];
      var dataValue = dataDetails[dataDetails.length - 1]['value'];
      if (dataKey.toString().trim() === "" || dataValue.toString().trim() === '') {
        this.setState({ isDataValidInCommonTestDataTable: false });
        return await this.getNotification('error', "Please add correct details in 'Common Test data' table section");
      }
    }
    this.setState({ isDataValidInCommonTestDataTable: true });
    var lastId = dataDetails.length + 1;
    var newRow = { id: lastId, key: '', value: '' };
    this.setState({ allCommonTestData: [...this.state.allCommonTestData, newRow] });
    TestData.AllCommonTestData.push(newRow);
  }

  deleteTestData = async (event) => {
    await event.preventDefault();
    var dataDetails = this.state.allCommonTestData;
    if (dataDetails.length === 0) {
      return await this.getNotification('error', "No information is found under 'Common Test Data' table section");
    }
    if (Number(this.state.selectedRowFromCommonTestDataTable) > 0 && Number(this.state.selectedRowFromCommonTestDataTable) <= dataDetails.length) {
      var keyNameToDelete = await this.state.allCommonTestData[Number(this.state.selectedRowFromCommonTestDataTable)-1]['key'];
      if(keyNameToDelete.toString().trim() !=='')
      {
        if(!await TestData.DeletedKey.includes(await keyNameToDelete))
        {
          await TestData.DeletedKey.push(await keyNameToDelete);
        }
      }
      var dataInfoAfterDelete = await ConfigGetter.updateRowIdAfterDelete(dataDetails, this.state.selectedRowFromCommonTestDataTable)
      this.setState({ allCommonTestData: [] }, () => { this.setState({ allCommonTestData: dataInfoAfterDelete }); });
      TestData.AllCommonTestData = dataInfoAfterDelete;
    }
    else {
      this.setState({ isDataValidInCommonTestDataTable: false });
      return await this.getNotification('error', "No Row is selected in 'Common Test Data' table section");
    }
  }

  saveCommonTestData = async (event) => {
    await event.preventDefault();
    var dataDetails = this.state.allCommonTestData;
    if (this.state.isDataValidInCommonTestDataTable) {
      if (dataDetails.length > 0) {
        var dataKey = dataDetails[dataDetails.length - 1]['key'];
        var dataValue = dataDetails[dataDetails.length - 1]['value'];
        if (dataKey.toString().trim() === "" || dataValue.toString().trim() === '') {
          return await this.getNotification('error', "Please add correct details in 'Common Test data' table section");
        }
      }
      if(await Object.keys(await TestData.TestDataToAdd).length ===0 && await TestData.DeletedKey.length ===0)
      {
        return await this.getNotification('error', "There is no any test data added or updated.");
      }
      TestData.AllCommonTestData = dataDetails;
      this.setState({ isPageLoading: true });
      var isSaved = await CommonTestDataGetter.saveCommonTestData();
      this.setState({ isPageLoading: false });
      if (isSaved) {
        return await this.getNotification('success', 'Common test data information is successfully saved.');
      }
      else {
        return await this.getNotification('error', 'Unable to save common test data because of ' + Config.ErrorMessage);
      }

    }
    else {
      this.setState({ isPageLoading: false });
      return await this.getNotification('error', "Please add the correct information in 'Common Test Data' table");
    }
  }


  //****************** End */********************************** */

  render() {
    const selectRowCommonTestDataTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromCommonTestDataTable,
      selected: [this.state.selectedRowFromCommonTestDataTable]
    };
    return (
      <Page
        className="testDataPage"
        title="Common Test Data"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}> 
        <NotificationSystem ref={this.notificationSystem} />
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Add or Update Common Test Data
                  <ButtonGroup size="sm">
                    <Button color='dark' onClick={this.addNewData.bind(this)}>
                      <small>Add</small>
                    </Button>
                    <Button color='info' onClick={this.saveCommonTestData.bind(this)}>
                      <small>Save</small>
                    </Button>
                    <Button color='dark' onClick={this.deleteTestData.bind(this)}>
                      <small>Delete</small>
                    </Button>
                  </ButtonGroup>
                </div>
              </CardHeader>
              <CardBody>
                <CardBody>
                  <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.allCommonTestData}
                      columns={CommonTestDataHeaderTable}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      selectRow={selectRowCommonTestDataTable}
                      cellEdit={cellEditFactory({
                        mode: 'click',
                        blurToSave: true,
                        afterSaveCell: (oldValue, newValue, row, column) => {
                          row.key = row.key.toString().trim().toUpperCase();
                          var keyName = row.key.toString().trim().toUpperCase();
                          var keyValue = row.value.toString().trim();
                          if(keyName !=='' && keyValue !=='')
                          {
                            TestData.TestDataToAdd[keyName]= keyValue;
                          }
                        },
                      })}
                      
                      pagination={paginationFactory()}
                      filter={filterFactory()}
                    />
                  </Col>
                </CardBody>
              </CardBody>
            </Card>
          </Col>
        </Row>
        </Fade>
      </Page>

    );
  }
}
export default TestDataPage;
