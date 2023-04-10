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
import { ORData } from './ORData'
import ConfigGetter from '../Configuration/ConfigGetter';
import ORGetter from './ORGetter';
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
import { ORTableHeader } from '../WebPageTableHeader'


class ObjectRepositoryPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //**** Common Test Data*********************************************************
      allORTableData: ORData.AllORTableData,
      selectedRowFromORTable: ORData.SelectedRowFromORTable,
      isDataValidInORTable: ORData.IsDataValidInORTable,

    };

  }
  componentWillMount = async () => {
    window.scrollTo(0, 0);
    await ORGetter.orPageLoad();

    //**** Common Test Data*********************************************************
    this.setState({ allORTableData: ORData.AllORTableData });
    this.setState({ selectedRowFromORTable: ORData.SelectedRowFromORTable });
    this.setState({ isDataValidInORTable: ORData.IsDataValidInORTable });

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

  selectRadioButtonFromORTable = (row, isSelect) => {
    if (isSelect) {
      ORData.SelectedRowFromORTable = row.id;
      this.setState({ selectedRowFromORTable: row.id });
    }

  }

  addNewData = async (event) => {
    await event.preventDefault();
    var dataDetails = this.state.allORTableData;
    if (dataDetails.length > 0) {
      var name = dataDetails[dataDetails.length - 1]['name'];
      var locator = dataDetails[dataDetails.length - 1]['locator'];
      var locatorproperty = dataDetails[dataDetails.length - 1]['locatorproperty'];
      if (name.toString().trim() === "" || locator.toString().trim() === '' || locatorproperty.toString().trim() === '') {
        this.setState({ isDataValidInORTable: false });
        return await this.getNotification('error', "Please add correct details in 'Object Repository' table section");
      }
    }
    this.setState({ isDataValidInORTable: true });
    var lastId = dataDetails.length + 1;
    var newRow = { id: lastId, name: '', locator: '', locatorproperty: '', alternatexpath: '' };
    this.setState({ allORTableData: [...this.state.allORTableData, newRow] });
    ORData.AllORTableData.push(newRow);
  }

  deleteTestData = async (event) => {
    await event.preventDefault();
    var dataDetails = this.state.allORTableData;
    if (dataDetails.length === 0) {
      return await this.getNotification('error', "No information is found under 'Object Repository' table section");
    }
    if (Number(this.state.selectedRowFromORTable) > 0 && Number(this.state.selectedRowFromORTable) <= dataDetails.length) {
      var keyNameToDelete = await this.state.allORTableData[Number(this.state.selectedRowFromORTable)-1]['name'];
      if(keyNameToDelete.toString().trim() !=='')
      {
        if(!await ORData.DeletedKey.includes(await keyNameToDelete))
        {
          await ORData.DeletedKey.push(await keyNameToDelete);
        }
      }
      var dataInfoAfterDelete = await ConfigGetter.updateRowIdAfterDelete(dataDetails, this.state.selectedRowFromORTable)
      this.setState({ allORTableData: [] }, () => { this.setState({ allORTableData: dataInfoAfterDelete }); });
      ORData.AllORTableData = dataInfoAfterDelete;
    }
    else {
      this.setState({ isDataValidInCommonTestDataTable: false });
      return await this.getNotification('error', "No Row is selected in 'Object Repository' table section");
    }
  }

  saveCommonTestData = async (event) => {
    await event.preventDefault();
    var dataDetails = this.state.allORTableData;
    if (this.state.isDataValidInORTable) {
      if (dataDetails.length > 0) {
        var name = dataDetails[dataDetails.length - 1]['name'];
        var locator = dataDetails[dataDetails.length - 1]['locator'];
        var locatorproperty = dataDetails[dataDetails.length - 1]['locatorproperty'];
        if (name.toString().trim() === "" || locator.toString().trim() === '' || locatorproperty.toString().trim() === '') {
          return await this.getNotification('error', "Please add correct details in 'Object Repository' table section");
        }
      }
      if(await Object.keys(await ORData.NewAndUpdatedElement).length ===0 && await ORData.DeletedKey.length===0)
      {
        return await this.getNotification('error', "There is no any locator added or updated.");
      }
      ORData.AllORTableData = dataDetails;
      this.setState({ isPageLoading: true });
      var isSaved = await ORGetter.saveORData();
      this.setState({ isPageLoading: false });
      if (isSaved) {
        return await this.getNotification('success', 'Object Repository information is successfully saved.');
      }
      else {
        return await this.getNotification('error', 'Unable to save Object Repository information because of ' + Config.ErrorMessage);
      }

    }
    else {
      this.setState({ isPageLoading: false });
      return await this.getNotification('error', "Please add the correct information in 'Object Repository' table");
    }
  }


  //****************** End */********************************** */

  render() {
    const selectRowFromORTable = {
      mode: 'radio',
      onSelect: this.selectRadioButtonFromORTable,
      selected: [this.state.selectedRowFromORTable]
    };

    return (
      <Page
        className="objectRepPage"
        title="Object Repository"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}> 
        <NotificationSystem ref={this.notificationSystem} />
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  UI Element Attribute
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
                      data={this.state.allORTableData}
                      columns={ORTableHeader}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      selectRow={selectRowFromORTable}
                      cellEdit={cellEditFactory({
                        mode: 'click',
                        blurToSave: true,
                        afterSaveCell: (oldValue, newValue, row, column) => {
                          if(column.dataField ==='name')
                          {
                            row.name = row.name.toString().trim().toUpperCase();
                          }
                          var rowNo = Number(row.id) - 1;
                          var elementName = this.state.allORTableData[rowNo]['name'];
                          if (elementName !== undefined) {
                            var elementProperty = {}
                            elementProperty['locator'] = this.state.allORTableData[rowNo]['locator'];
                            elementProperty['locatorproperty'] = this.state.allORTableData[rowNo]['locatorproperty'];
                            elementProperty['alternatexpath'] = this.state.allORTableData[rowNo]['alternatexpath'];
                            ORData.NewAndUpdatedElement[elementName.toString().toUpperCase()]=elementProperty;
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
export default ObjectRepositoryPage;
