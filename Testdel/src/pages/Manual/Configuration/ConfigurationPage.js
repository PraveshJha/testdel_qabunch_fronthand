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
  Fade,
} from 'reactstrap';
import { ConfigData } from './ConfigData'
import ConfigGetter from './ConfigGetter'
import { EnvironmentURLTableHeader} from '../WebPageTableHeader'
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import NotificationSystem from 'react-notification-system';
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import { Config } from '../../../QAautoMATER/Config';
import  Matcher  from '../../../QAautoMATER/funcLib/matcher';

class ConfigurationPage extends React.Component {
  notificationSystem = React.createRef();
  state = {

    //****** Page Loader ***********************************************************
    isPageLoading: false,

    //****** Test Configuration  ***********************************************************
    listOfTestCycle: ConfigData.ListOfTestCycle,
    currentTestCycle: ConfigData.CurrentTestCycle,
    isErrorOnCurrentTestCycle: ConfigData.IsErrorOnCurrentTestCycle,
    isErrorOnNewTestCycle: ConfigData.IsErrorOnNewTestCycle,
    newTestCycle: ConfigData.NewTestCycle,

    //****** Environment Configuration  ***********************************************************
    envUrlList: ConfigData.EnvUrlList,
    selectedRowFromUrlTable:ConfigData.SelectedRowFromUrlTable,
    isNameValidforUrlTable:ConfigData.IsNameValidforUrlTable,


  };
  async componentDidMount() {
    window.scrollTo(0, 0);
    await ConfigGetter.manualConfigPageLoad();

    //****** Test Configuration  ***********************************************************
    this.setState({ listOfTestCycle: ConfigData.ListOfTestCycle })
    this.setState({ currentTestCycle: ConfigData.CurrentTestCycle })
    this.setState({ isErrorOnCurrentTestCycle: ConfigData.IsErrorOnCurrentTestCycle })
    this.setState({ isErrorOnNewTestCycle: ConfigData.IsErrorOnNewTestCycle })
    this.setState({ newTestCycle: ConfigData.NewTestCycle })

    //****** Env Configuration  ***********************************************************
    this.setState({ envUrlList: ConfigData.EnvUrlList })
    this.setState({selectedRowFromUrlTable:ConfigData.SelectedRowFromUrlTable})
    this.setState({isNameValidforUrlTable:ConfigData.IsNameValidforUrlTable});

  }

  //************************* Notification ***************************************************************
  async getNotification(level, message) {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: message,
      level: level
    });
  }

  //****** Test Configuration ***************************************************

  selectTestCycle = async (event) => {
    this.setState({ isErrorOnCurrentTestCycle: false })
    var dataChoice = await event.target.value;
    if (await this.state.currentTestCycle !== await dataChoice) {
      ConfigData.CurrentTestCycle = await dataChoice;
      this.setState({ currentTestCycle: await dataChoice });
    }
  };

  addNewTestCycle = async (event) => {
    this.setState({ isErrorOnNewTestCycle: false })
    var dataChoice = await event.target.value;
    if (await this.state.newTestCycle !== await dataChoice) {
      ConfigData.NewTestCycle = await dataChoice;
      this.setState({ newTestCycle: await dataChoice });
      var format = /[^A-Za-z0-9-. ]/ig;
      if (await format.test(await dataChoice)) {
        ConfigData.IsErrorOnNewTestCycle = true;
        this.setState({ isErrorOnNewTestCycle: true });
      }
    }
  };

  saveNewCycle = async (event) => {

    await event.preventDefault();
    var testCycleName = this.state.newTestCycle;
    if (await testCycleName.toString().trim() === '') {
      this.setState({ isErrorOnNewTestCycle: true });
      return await this.getNotification('error', "New Test Cycle Name can not be blank.");
    }
    if (await this.state.isErrorOnNewTestCycle) {
      this.setState({ isErrorOnNewTestCycle: true });
      return await this.getNotification('error', "Please add the correct test cycle name.");
    }
    if (await Matcher.isValuePresentInArray(await ConfigData.ListOfTestCycle,await testCycleName.toString().trim())) {
      this.setState({ isErrorOnNewTestCycle: true });
      return await this.getNotification('error', "Test Cycle is already exist on server.");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await ConfigGetter.saveNewTestCycle();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      return await this.getNotification('success', 'New Test Cycle is successfully added.');
    }
    else {
      return await this.getNotification('error', 'Unable to save new Test Cycle because of ' + Config.ErrorMessage);
    }
  
}

saveCurrentCycle = async (event) => {

  await event.preventDefault();
  var currentCycleName = this.state.currentTestCycle;
  if (await currentCycleName.toString().trim() === '') {
    this.setState({ isErrorOnNewTestCycle: true });
    return await this.getNotification('error', "Current Test Cycle Name can not be blank.");
  }
  this.setState({ isPageLoading: true });
  var isSaved = await ConfigGetter.saveCurrentTestCycle();
  this.setState({ isPageLoading: false });
  if (isSaved) {
    return await this.getNotification('success', 'Current Test Cycle is successfully added.');
  }
  else {
    return await this.getNotification('error', 'Unable to save Current Test Cycle because of ' + Config.ErrorMessage);
  }

}

 //****** Env Configuration ***************************************************

addNewUrlForEnvironment = async (event) => {
  await event.preventDefault();
  var allUrlList = this.state.envUrlList;
  if (allUrlList.length > 0) {
    var prevComponentName = allUrlList[allUrlList.length - 1]['name'];
    var prevComponentUrl = allUrlList[allUrlList.length - 1]['url'];
    if (prevComponentName.toString().trim() === "" || prevComponentUrl.toString().trim() === '') {
      this.setState({ isNameValidforUrlTable: false });
      return await this.getNotification('error', "Please add the correct Env name and Url from 'ADD NEW ENVIRONMENT' section");
    }
  }
  this.setState({ isNameValidforUrlTable: true });
  var lastId = allUrlList.length + 1;
  var newRow = { id: lastId, name: '', url: '' };
  this.setState({ envUrlList: [...this.state.envUrlList, newRow] });
  ConfigData.EnvUrlList.push(newRow);

}

deleteUrlFromUrlTable = async (event) => {
  await event.preventDefault();
  var allUrlList = this.state.envUrlList;
  if (allUrlList.length === 0) {
    return await this.getNotification('error', "No Environment is found under 'ADD NEW ENVIRONMENT' section");
  }
  if (Number(this.state.selectedRowFromUrlTable) > 0 && Number(this.state.selectedRowFromUrlTable) <= allUrlList.length) {
    var urlListAfterDelete = await ConfigGetter.updateRowIdAfterDelete(allUrlList, this.state.selectedRowFromUrlTable)
    this.setState({ envUrlList: [] }, () => { this.setState({ envUrlList: urlListAfterDelete }); });
    ConfigData.EnvUrlList = urlListAfterDelete;
  }
  else {
    this.setState({ isNameValidforUrlTable: false });
    return await this.getNotification('error', 'No Environment is selected for delete.');
  }
}

saveUrlTableData = async (event) => {
  await event.preventDefault();
  var allUrlList = this.state.envUrlList;
  if (this.state.isNameValidforUrlTable) {
    if (allUrlList.length > 0) {
      var componentName = allUrlList[allUrlList.length - 1]['name'];
      var componentUrl = allUrlList[allUrlList.length - 1]['url'];
      if (componentName.trim() === '' || componentUrl.trim() === '') {
        return await this.getNotification('error', "Please add the correct environment and URL in 'ADD NEW ENVIRONMENTs' table");
      }
    }
    ConfigData.EnvUrlList = allUrlList;
    this.setState({ isPageLoading: true });
   var isSaved = await ConfigGetter.saveURLDetails();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      return await this.getNotification('success', 'Environment and Url information is successfully saved.');
    }
    else {
      return await this.getNotification('error', 'Unable to save Environment and Url information because of ' + Config.ErrorMessage);
    }

  }
  else {
    return await this.getNotification('error', "Please add the correct value in Environment and URL column");
  }
}

selectRadioButtonFromURlTable = (row, isSelect) => {
  if (isSelect) {
    ConfigData.SelectedRowFromUrlTable = row.id;
    this.setState({ selectedRowFromUrlTable: row.id });
  }

}


//****************** End */********************************** */

render() {
  const selectRowFromUrlTable = {
    mode: 'radio',
    onSelect: this.selectRadioButtonFromURlTable,
    selected: [this.state.selectedRowFromUrlTable]
  };

  return (
    <Page
      className="ConfigurationPage"
      title="Test Configuration"
    >
      {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
      <Fade in={!this.state.isPageLoading}>
        {/* <PageLoader sentences ={LoaderMessage} height ='100%' color ="black" /> */}
        <NotificationSystem ref={this.notificationSystem} />
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Test Configuration
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup col>
                    <FormGroup row >
                      <Label sm={4}>
                        Current Test Cycle
                      </Label>
                      <Col sm={6}>
                        <Input type="select" invalid={this.state.isErrorOnCurrentTestCycle} onChange={this.selectTestCycle.bind(this)} name="testCycle" value={this.state.currentTestCycle}>
                          <DropDownOptions options={this.state.listOfTestCycle} />
                        </Input>
                      </Col>
                      <Col >
                        <Button size="sm" color='dark' onClick={this.saveCurrentCycle.bind(this)}>
                          <small>Save</small>
                        </Button>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4}>
                        Add New Test Cycle
                      </Label>
                      <Col sm={6}>
                        <Input type="input" invalid={this.state.isErrorOnNewTestCycle} onChange={this.addNewTestCycle.bind(this)} name="newCycle" value={this.state.newTestCycle}>
                        </Input>
                      </Col>
                      <Col>
                        <Button color='dark' size="sm" onClick={this.saveNewCycle.bind(this)}>
                          <small>Save</small>
                        </Button>
                      </Col>
                    </FormGroup>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Add new environment
                    <ButtonGroup size="sm">
                      <Button color='dark' onClick={this.addNewUrlForEnvironment.bind(this)}>
                        <small>Add</small>
                      </Button>
                      <Button color='info' onClick={this.saveUrlTableData.bind(this)}>
                        <small>Save</small>
                      </Button>
                      <Button color='dark' onClick={this.deleteUrlFromUrlTable.bind(this)}>
                        <small>Delete</small>
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.envUrlList}
                      columns={EnvironmentURLTableHeader}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                      selectRow={selectRowFromUrlTable}
                      cellEdit={cellEditFactory({
                        mode: 'click',
                        blurToSave: true,
                      })}
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
export default ConfigurationPage;
