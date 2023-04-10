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
import { AutoScriptData } from './AutoScriptData'
import AutoScriptGetter from './AutoScriptGetter';
import { Config } from '../../../QAautoMATER/Config';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import DropDownOptions from '../../../uiLayout/components/DropDownOptions'
import NotificationSystem from 'react-notification-system';
import "react-widgets/styles.css";
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../../LoaderMessage';
import "react-widgets/styles.css";
import { TextWidget,NumberWidget } from '../../../uiLayout/components/widget';


class AutoScriptPage extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //****** Basic Details ***********************************************************

      isErrorOnEnvironment: AutoScriptData.IsErrorOnEnvironment,
      selectedEnvironmentName: AutoScriptData.SelectedEnvironmentName,
      allEnvironmentList: AutoScriptData.AllEnvironmentList,
      isErrorOnComponentUrl: AutoScriptData.IsErrorOnComponentUrl,
      selectedComponentUrl: AutoScriptData.SelectedComponentUrl,
      allComponentUrlLIst: AutoScriptData.AllComponentUrlLIst,
      documentationToolList: AutoScriptData.DocumentationToolList,
      selectedDocumentationTool: AutoScriptData.SelectedDocumentationTool,
      isErrorOnUrl: AutoScriptData.IsErrorOnUrl,
      url: AutoScriptData.Url,

      //****** Documentation Details ***********************************************************

      totalController: AutoScriptData.TotalController,
      totalEndPoint: AutoScriptData.TotalEndPoint,
      existingEndPoint: AutoScriptData.ExistingEndPoint,
      newApiScripts: AutoScriptData.NewApiScripts,
      totalCompeletedTestScript: AutoScriptData.TotalCompeletedTestScript,
      totalTBDTestScripts: AutoScriptData.TotalTBDTestScripts,

      //****** Test Script Table ***********************************************************
      listOfTestScripts: AutoScriptData.ListOfTestScripts,

      //****** Page Loader ***********************************************************


    };

  }
  componentWillMount = async () => {
    window.scrollTo(0, 0);

    //****** Page Loader ***********************************************************

    this.setState({ isPageLoading: true });

    await AutoScriptGetter.apiAutoScriptPageLoad();

    //****** Basic Details ***********************************************************

    this.setState({ isErrorOnEnvironment: AutoScriptData.IsErrorOnEnvironment });
    this.setState({ selectedEnvironmentName: AutoScriptData.SelectedEnvironmentName });
    this.setState({ allEnvironmentList: AutoScriptData.AllEnvironmentList });
    this.setState({ isErrorOnComponentUrl: AutoScriptData.IsErrorOnComponentUrl });
    this.setState({ selectedComponentUrl: AutoScriptData.SelectedComponentUrl });
    this.setState({ allComponentUrlLIst: AutoScriptData.AllComponentUrlLIst });
    this.setState({ documentationToolList: AutoScriptData.DocumentationToolList });
    this.setState({ selectedDocumentationTool: AutoScriptData.SelectedDocumentationTool });
    this.setState({ isErrorOnUrl: AutoScriptData.IsErrorOnUrl });
    this.setState({ url: AutoScriptData.Url });

    //****** Documentation Details ***********************************************************

    this.setState({ totalController: AutoScriptData.TotalController });
    this.setState({ totalEndPoint: AutoScriptData.TotalEndPoint });
    this.setState({ existingEndPoint: AutoScriptData.ExistingEndPoint });
    this.setState({ newApiScripts: AutoScriptData.NewApiScripts });
    this.setState({ totalCompeletedTestScript: AutoScriptData.TotalCompeletedTestScript });
    this.setState({ totalTBDTestScripts: AutoScriptData.TotalTBDTestScripts });

    //****** Test Script Table ***********************************************************
    this.setState({ listOfTestScripts: AutoScriptData.ListOfTestScripts });

    //****** Page Loader ***********************************************************

    this.setState({ isPageLoading: false });

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

  //****** Basic Details ***********************************************************

  selectEnvironment = async (event) => {
    this.setState({ isErrorOnEnvironment: false });
    var dataChoice = await event.target.value;
    if (this.state.selectedEnvironmentName !== await dataChoice) {
      this.setState({ selectedEnvironmentName: await dataChoice });
      AutoScriptData.SelectedEnvironmentName = await dataChoice;
      await AutoScriptGetter.updateEnvironment(await dataChoice);
      this.setState({ allComponentUrlLIst: AutoScriptData.AllComponentUrlLIst })
      this.setState({ selectedComponentUrl: AutoScriptData.SelectedComponentUrl })
    }

  };

  selectComponentUrl = async (event) => {
    this.setState({ isErrorOnComponentUrl: false });
    var dataChoice = await event.target.value;
    if (this.state.selectedComponentUrl !== await dataChoice) {
      this.setState({ selectedComponentUrl: await dataChoice });
      AutoScriptData.SelectedComponentUrl = await dataChoice;
    }

  };

  selectDocumentationTool = async (event) => {
    var dataChoice = await event.target.value;
    if (this.state.selectedDocumentationTool !== await dataChoice) {
      this.setState({ selectedDocumentationTool: await dataChoice });
      AutoScriptData.SelectedDocumentationTool = await dataChoice;
    }

  };

  addUrl = async (event) => {
    this.setState({ isErrorOnUrl: false })
    AutoScriptData.IsErrorOnUrl = false;
    var dataChoice = await event.target.value;
    if (this.state.url !== await dataChoice) {
      this.setState({ url: await dataChoice });
      AutoScriptData.Url = await dataChoice;
      if (await dataChoice.trim() === '') {
        AutoScriptData.IsErrorOnUrl = true;
        return this.setState({ isErrorOnUrl: true })
      }
      var lowerCaseData = await dataChoice.toLowerCase().toString();
      if (await lowerCaseData.includes('://') && await lowerCaseData.includes('http') && await lowerCaseData.includes('.json')) {
        AutoScriptData.IsErrorOnUrl = false;
        return this.setState({ isErrorOnUrl: false })
      }
      else {
        AutoScriptData.IsErrorOnUrl = true;
        return this.setState({ isErrorOnUrl: true })
      }

    }

  };

  showTestScripts(row) {

  }

  saveTestScript = async (event) => {
    await event.preventDefault();
    var envName = await this.state.selectedEnvironmentName.toString().trim();;
    var urlKey = this.state.selectedComponentUrl.toString().trim();
    var selectedTool = this.state.selectedDocumentationTool.toString().trim();
    var selectedUrl = this.state.url.toString().trim();
    if (await envName === '') {
      this.setState({ isErrorOnEnvironment: true });
    }
    if (await urlKey === '') {
      this.setState({ isErrorOnComponentUrl: true });
    }
    if (await selectedUrl === '') {
      this.setState({ isErrorOnUrl: true });
    }
    if (envName === '' || urlKey === '' || selectedTool === '' || selectedUrl === '') {
      return await this.getNotification('error', "Environment, Component Url, Documentation Tool and Url can not be blank.Please add the correct input");
    }
    if (AutoScriptData.IsErrorOnUrl) {
      this.setState({ isErrorOnUrl: true });
      return await this.getNotification('error', "Please add correct Url.");
    }
    this.setState({ isPageLoading: true });
    var isSaved = await AutoScriptGetter.createNewTestScript();
    this.setState({ isPageLoading: false });
    if (isSaved) {
      this.setState({totalController:AutoScriptData.TotalController});
      this.setState({totalEndPoint:AutoScriptData.TotalEndPoint});
      this.setState({existingEndPoint:AutoScriptData.ExistingEndPoint});
      this.setState({newApiScripts:AutoScriptData.NewApiScripts});
      this.setState({totalCompeletedTestScript:AutoScriptData.TotalCompeletedTestScript});
      if(AutoScriptData.TotalEndPoint ===  AutoScriptData.ExistingEndPoint)
      {
        await this.getNotification('success', 'Api script is already created for all end point.If any specific test script needed please create from Api script page');
      }
      else{
        await this.getNotification('success', 'API Script is successfully created.');
      }
    }
    else {
      return await this.getNotification('error', 'Unable to create new API test script because of ' + Config.ErrorMessage);
    }
  }

  //****************** End */********************************** */

  render() {
    return (
      <Page
        className="AutoScriptPage"
        title="Autoscript development using documentation"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <NotificationSystem ref={this.notificationSystem} />
          <h6>This feature allow you to create all test scripts in a single click using API documentation tool like swagger</h6>
        </Fade>
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Basic Details
                  <ButtonGroup size="sm">
                    <Button color='dark' onClick={this.saveTestScript.bind(this)}>
                      <small>Create New API Scripts</small>
                    </Button>
                  </ButtonGroup>
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={5}>
                      Environment
                    </Label>
                    <Col>
                      <Input type="select" invalid={this.state.isErrorOnEnvironment} name="httpMethod" value={this.state.selectedEnvironmentName} onChange={this.selectEnvironment.bind(this)}>
                        <DropDownOptions options={this.state.allEnvironmentList} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>
                      Component Url
                    </Label>
                    <Col>
                      <Input type="select" invalid={this.state.isErrorOnComponentUrl} name="httpMethod" value={this.state.selectedComponentUrl} onChange={this.selectComponentUrl.bind(this)}>
                        <DropDownOptions options={this.state.allComponentUrlLIst} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>
                      Documentation Tool
                    </Label>
                    <Col>
                      <Input type="select" name="httpMethod" value={this.state.selectedDocumentationTool} onChange={this.selectDocumentationTool.bind(this)}>
                        <DropDownOptions options={this.state.documentationToolList} />
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={5}>
                      Url
                    </Label>
                    <Col>
                      <Input placeholder='https://example/swagger/v1/swagger.json' type="input" invalid={this.state.isErrorOnUrl} name="url" value={this.state.url} onChange={this.addUrl.bind(this)}>
                      </Input>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Documentation Details
                </div>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <TextWidget
                      title="Total Controller"
                      number={this.state.totalController}
                      color="black"
                    />
                  </FormGroup>
                  <FormGroup row>
                    <TextWidget
                      title="Total endpoint"
                      number={this.state.totalEndPoint}
                      color="black"
                    />
                  </FormGroup>
                  <FormGroup row>
                    <TextWidget
                      title="Existing endpoint"
                      number={this.state.existingEndPoint}
                      color="black"
                    />
                  </FormGroup>
                  <FormGroup row>
                    <TextWidget
                      title="New Api Script Created"
                      number={this.state.newApiScripts}
                      color="black"
                    />
                  </FormGroup>
                  <FormGroup row>
                    <NumberWidget
                      title="New Script Status"
                      number={this.state.newApiScripts}
                      color="#FFA500"
                      progress={
                        {
                        value: this.state.totalCompeletedTestScript,
                        label: 'Completed',
                      }
                    }
                    />
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  New API Test Scripts
                  <ButtonGroup size="sm">
                    <Button color='dark' name="savetestScript">
                      <small>Save</small>
                    </Button>
                  </ButtonGroup>
                </div>
              </CardHeader>
              <CardBody>
                <Col>
                  <BootstrapTable
                    keyField='id'
                    data={this.state.listOfTestScripts}
                    columns={NewAPITableHeader}
                    wrapperClasses="table-responsive"
                    striped
                    hover
                    condensed
                    filter={filterFactory()}
                    pagination={paginationFactory()}
                    expandRow={expandRow}
                  />
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
      </Page>

    );
  }
}
export default AutoScriptPage;
