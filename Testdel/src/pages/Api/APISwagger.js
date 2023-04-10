import Page from 'components/Page';
import React from 'react';
import graph from '../funcLibraries/graph.js';
import genericHelper from '../funcLibraries/GenericHelper.js';
import {NumberWidget } from 'components/Widget';
import 'react-widgets/dist/css/react-widgets.css';
import { Bar, Line ,Doughnut} from 'react-chartjs-2';
import funcAPIScripts from '../funcLibraries/funcAPIScripts.js';
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
  FormFeedback,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import 'react-widgets/dist/css/react-widgets.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import validator from 'validator'
var APIBasePath= window.ENV.APIURL;

function GetOptionKeys({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{key}</option>)
  );
}
class CICDSupport extends React.Component{

  constructor(props){
    super(props);
    this.state=
    {
        pageloadingStatus:false,
        loader:false,
        loaderLoadTestScripts:false,
        checkswaggerURL:false,
        swaggerURL:'',
        feedbackswaggerURL:'',
        swaggerJsonBody:'',
        checkswaggerJsonBody:false,
        feedbackswaggerJsonBody:'',
        disableswaggerJson:true,
        swaggerSelection:'Url',
        disableswaggerUrl:false,
        disableSaveApi:true,
        swaggerJsonResponse:'',
        totalController:0,
        totalEndPoint:0,
        totalHttpMethodDetails:[],
        totalAPICount:0,
        totaltestScriptDevStatus:[],
        allComponentName:[],
        allmodulehttpmethod:[],
        allmoduletestscriptcreated:[],
        totalAPIScriptCount:0,
        DefaultEnvironment:'',
        EnvName:[],
        componentURI:'',
        allCoponentURIList:[],
        AuthcredenKey:'',
        allAuthCredentialData:[],
        constAPICall:'',
        checkComponentURI:false,
        feedbackURIComponent:'',

    }
    const GetLoaderData = async () => 
    {
      this.setState({loader:true});
      this.setState({pageloadingStatus:true});
      const configPage = await fetch(APIBasePath+'apiconfig');
      const configPageResponse = await configPage.json();
      if(Object.keys(configPageResponse).length>0)
      {
          this.setState({ConfigurationFile:configPageResponse});
          this.setState({allAuthCredentialData : funcAPIScripts.createAuthCredData(configPageResponse['Authorization'])});
          this.setState({EnvName:configPageResponse['ENVIRONMENTSETUP']})
          var defenv = configPageResponse['EXECUTIONSETUP']['DefaultEnvironment'];
          this.setState({DefaultEnvironment : defenv});
          if(defenv.trim() !=='')
          {
            this.setState({allCoponentURIList:configPageResponse['ENVIRONMENTSETUP'][this.state.DefaultEnvironment]})
          }
          this.setState({loader:false});
          this.setState({pageloadingStatus:false});
      }
    }
    GetLoaderData()
    
  }

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
 
  selectSwaggerselection(event)
  {
    var item= event.target.value;
    if(item !== this.state.swaggerSelection)
    {
      this.setState({disableSaveApi:true})
      this.setState({swaggerSelection:item});
      if(item === 'Url')
      {
        this.setState({disableswaggerJson:true})
        this.setState({disableswaggerUrl:false})
        this.setState({swaggerJsonBody:''});
        this.setState({checkswaggerJsonBody:false});
      }
      else{
        this.setState({disableswaggerUrl:true})
        this.setState({disableswaggerJson:false})
        this.setState({swaggerURL:''});
        this.setState({checkswaggerURL:false});
        
      }
    }
  }
  UpdateComponentURI(event)
  {
    this.setState({checkComponentURI:false})
    var comURI = event.target.value;
    if(comURI !== this.state.componentURI)
    {
      this.setState({componentURI: comURI})
      var env= this.state.DefaultEnvironment;
      if(comURI !=='')
      {
        var URI= this.state.ConfigurationFile['ENVIRONMENTSETUP'][env][comURI];
        this.setState({constAPICall:URI});
      }
      else{
        this.setState({constAPICall:''});
      }
    }
    
  }
  UpdateEnv(event)
  {
    var env = event.target.value;
    if(env !== this.state.DefaultEnvironment)
    {
      this.setState({DefaultEnvironment: env})
      this.setState({allCoponentURIList:this.state.ConfigurationFile['ENVIRONMENTSETUP'][env]})
      this.setState({componentURI:''})
      this.setState({APIURI:this.state.relativeURI})
      this.setState({constAPICall:''});
    }
  }
  UpdateSwaggerURL(event)
  {
    this.setState({checkswaggerURL:false});
    this.setState({disableSaveApi:true})
    var Item= event.target.value;
    this.setState({swaggerURL: Item.trim()})
    if(!validator.isURL(Item))
    {
        this.setState({checkswaggerURL:true});
        return this.setState({feedbackswaggerURL:'Url is not valid'});
    }
    else
    {
      this.setState({checkswaggerURL:false});
    }
  }
  validateSwaggerURL()
  {
      var selectedItem = this.state.swaggerSelection;
      var id = 0;
      var requestBody ;
      if(selectedItem ==='Url')
      {
        requestBody = this.state.swaggerURL;
        if(requestBody.trim() ==='')
        {
          this.setState({checkswaggerURL:true});
          this.setState({feedbackswaggerURL:'Url can not be null'});
          return ;
        }
        if(this.state.checkswaggerURL)
        {
          return;
        }
      }
      else if(selectedItem ==='Json')
      {
        id=1;
        requestBody = this.state.swaggerJsonBody;
        if(requestBody.trim() ==='')
        {
          this.setState({checkswaggerJsonBody:true});
          this.setState({feedbackswaggerJsonBody:'Json body can not be null'});
          return ;
        }
        if(this.state.checkswaggerJsonBody)
        {
          return;
        }
      }
    //@ send Request to server
    var httpBody={};
    httpBody['Body']=requestBody;
    var httpBodyContent = genericHelper.common_ChangeJsoncontentforServer(httpBody);
    var requestAPI =APIBasePath+'apiswagger/'+id;
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(httpBodyContent)
    };
    const REQ = async () => 
    {
      this.setState({swaggerJsonResponse:''});
      this.setState({disableSaveApi:true});
      this.setState({loader:true})
      this.setState({pageloadingStatus:true});
      const Request = await fetch(requestAPI,requestOptions);
      const Response = await Request.json();
      if(Response.success)
      {
        this.setState({swaggerJsonResponse:Response['Json']})
        this.setState({disableSaveApi:false});
      }
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      this.setState({modal:true})
      return this.setState({modalValidationText:Response['Message']});
    }
    REQ();
  }
  saveApiScripts()
  {
    var baseURL = this.state.componentURI;
    var AuthKey = this.state.AuthcredenKey;
    if(baseURL ==='')
    {
      this.setState({checkComponentURI:true});
      this.setState({feedbackURIComponent:'URL Key can not be blank'})
      return;
    }
      var JsonBody = this.state.swaggerJsonResponse;
      console.log(JsonBody);
      if(JsonBody.length ==0)
      {
        this.setState({modal:true});
        return this.setState({modalValidationText:'Unable to create API scripts becuase Swagger Json is not correct format.'});
      }
          //@ send Request to server
    var httpBody={};
    httpBody['Body']=JsonBody;
    httpBody['baseURL']=baseURL;
    httpBody['authKey']=AuthKey;
    var httpBodyContent = genericHelper.common_ChangeJsoncontentforServer(httpBody);
    var requestAPI =APIBasePath+'apiswagger';
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(httpBodyContent)
    };
      const REQ = async () => 
      {
        this.setState({swaggerJsonResponse:''});
        this.setState({disableSaveApi:true});
        this.setState({loader:true})
        this.setState({pageloadingStatus:true});
        const Request = await fetch(requestAPI,requestOptions);
        const Response = await Request.json();
        console.log(Response);
        if(Response.success)
        {
          this.setState({totalEndPoint:Response['allendpoint']})
          this.setState({totalController:Response['totalcontroller']})
          this.setState({totalAPICount:Response['httpmethodcount']})
          this.setState({totalHttpMethodDetails:Response['httpmethoddata']})
          this.setState({totaltestScriptDevStatus:Response['scriptdevstatus']})
          this.setState({totalAPIScriptCount:Response['totalscriptcount']})
         this.setState({allComponentName:genericHelper.common_GetListKeyFromJsonResponce(Response['componentdata'])})
         this.setState({allmodulehttpmethod:genericHelper.common_GetListvalueFromJsonResponce(Response['componentdata'])})
         this.setState({allmoduletestscriptcreated:genericHelper.common_GetListvalueFromJsonResponce(Response['testscriptcreated'])})
          this.setState({disableSaveApi:true});
        }
        this.setState({loader:false})
        this.setState({pageloadingStatus:false});
        this.setState({modal:true})
        return this.setState({modalValidationText:Response['Message']});
      }
      REQ();
  }
  UpdateAuthKeyData(event)
  {
    var authKey = event.target.value;
    if(authKey !==this.state.AuthcredenKey)
    {
      this.setState({AuthcredenKey:authKey});
    }
  }
  UpdateSwaggerJson(event)
  {
    this.setState({checkswaggerJsonBody:false});
    this.setState({disableSaveApi:true})
    var Item= event.target.value;
    this.setState({swaggerJsonBody: Item.trim()})
    if(!validator.isJSON(Item))
    {
        this.setState({checkswaggerJsonBody:true});
        return this.setState({feedbackswaggerJsonBody:'Json content is not valid'});
    }
    else
    {
      this.setState({checkswaggerJsonBody:false});
    }
  }
  render() {
    const textareaModal = {
      minHeight:'458px'};
  return (
    <Page title="API script using Swagger" breadcrumbs={[{ name: 'API script Development using Swagger', active: true }]}>
      <Loader 
        type="ThreeDots"
        color="#00BFFF"
        height={50}
        width={100}
        timeout={120000} //3 secs
        visible = {this.state.loader}
      />
      <Row>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Import Scripts</CardHeader>
              <CardBody>
              <Form >
              <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Environment*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="envlist" value ={this.state.DefaultEnvironment} onChange={this.UpdateEnv.bind(this)}>
                      <GetOptionKeys options={this.state.EnvName} />
					          </Input>
                  </Col>
              </FormGroup>
              <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                  URL key*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkComponentURI} type="select" name="comurl" value ={this.state.componentURI} onChange={this.UpdateComponentURI.bind(this)}>
                     <option></option>
                      <GetOptionKeys options={this.state.allCoponentURIList} />
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackURIComponent}
                    </FormFeedback>
                  </Col>
               </FormGroup>
               <FormGroup row>
			          	<Label for="exampleSelect" sm={4}>
                     URL*
                  </Label>
                  <Col >
                    <Input disabled={this.state.disableswaggerUrl}  value={this.state.constAPICall}  type="input" name="fromemail"  placeholder="base URL"/>
                  </Col>
                </FormGroup>{' '}
                <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                  Authorization key
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="comurl" value ={this.state.AuthcredenKey} onChange={this.UpdateAuthKeyData.bind(this)}>
                     <option></option>
                      <GetOptionKeys options={this.state.allAuthCredentialData} />
                    </Input>
                  </Col>
                </FormGroup>
              <FormGroup row>
			          	<Label for="exampleSelect" sm={4}>
                   Select Swagger*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus}  value={this.state.swaggerSelection}  type="select" name="swaggerselection" onChange={this.selectSwaggerselection.bind(this)}>
                    <option>Url</option>
                    <option>Json</option>
                    </Input>
                  </Col>
                </FormGroup>{' '}
				       <FormGroup row>
			          	<Label for="exampleSelect" sm={4}>
                    Swagger Json URL*
                  </Label>
                  <Col >
                    <Input disabled={this.state.disableswaggerUrl} invalid={this.state.checkswaggerURL}  value={this.state.swaggerURL}  type="input" name="fromemail" onChange={this.UpdateSwaggerURL.bind(this)} placeholder="https://example/swagger/v1/swagger.json"/>
                    <FormFeedback>
                      {this.state.feedbackswaggerURL}
                    </FormFeedback>
                  </Col>
                </FormGroup>{' '}
                <FormGroup row>
                  <Col>
                  <Button disabled={this.state.pageloadingStatus} onClick={this.validateSwaggerURL.bind(this)} color="secondary" name ="validate">Validate</Button>
                  <Button disabled={this.state.disableSaveApi} onClick={this.saveApiScripts.bind(this)} color="secondary" name ="save">Create API Scripts</Button>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Paste Swagger JSON content</CardHeader>
              <CardBody>
              <Form >
              <FormGroup row>
                  <Col>
                    <Input disabled={this.state.disableswaggerJson} invalid={this.state.checkswaggerJsonBody} onChange={this.UpdateSwaggerJson.bind(this)} style ={textareaModal} type="textarea" name="swaggerJsonvalue" value ={this.state.swaggerJsonBody} >
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackswaggerJsonBody}
                   </FormFeedback>
                  </Col>
                </FormGroup>
              </Form>
              <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggle()}
                  className={this.props.className}>
                  <ModalHeader  toggle={this.toggle()}> Information</ModalHeader>
                  <ModalBody >
                    {this.state.modalValidationText}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggle()}>
                      OK
                    </Button>
                  </ModalFooter>
                </Modal>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
      <Col lg={6} md={6} sm={6} xs={6}>
        <NumberWidget disabled={this.state.pageloadingStatus}
          title="Total Component/Controller"
          number= {this.state.totalController}
          color="primary"
        />
      </Col>
      <Col lg={6} md={6} sm={6} xs={6}>
        <NumberWidget disabled={this.state.pageloadingStatus}
          title="Total EndPoint"
          number= {this.state.totalEndPoint}
          color="primary"
        />
      </Col>
      <Col xl={6} >
          <Card>
            <CardHeader>Total Http Method Count : {this.state.totalAPICount}</CardHeader>
            <CardBody>
			        <Col >
               <Doughnut  data={graph.GetDoughnutChart_Dynamic(this.state.totalHttpMethodDetails)} />
			        </Col>
            </CardBody>
          </Card>
        </Col>
        <Col xl={6} >
          <Card>
            <CardHeader>Test script developmant count : {this.state.totalAPIScriptCount}</CardHeader>
            <CardBody>
			        <Col >
               <Doughnut  data={graph.GetDoughnutChart_Dynamic(this.state.totaltestScriptDevStatus)} />
			        </Col>
            </CardBody>
          </Card>
        </Col>
        <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Test Script Development Component/Controller wise
            </CardHeader>
            <CardBody>
            <Bar disabled={this.state.pageloadingStatus} data={graph.GetBarChartCustomLabelandColor(this.state.allComponentName,this.state.allmodulehttpmethod,this.state.allmoduletestscriptcreated,'Total Http method','Total Script created','#45B39D','#DC7633')} 
              options={{
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                },
              }}
            />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
    );
  }
};

export default CICDSupport;
