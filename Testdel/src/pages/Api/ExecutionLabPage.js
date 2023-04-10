import Page from 'components/Page';
import React from 'react';
import { Pie, Bar} from 'react-chartjs-2';
import genericHelper from '../funcLibraries/GenericHelper.js';
import graph from '../funcLibraries/graph.js';
import executionHelper from '../funcLibraries/executionHelper.js';
import {
  Button,
  FormFeedback,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
//import all the components we are going to use.
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

var APIBasePath= window.ENV.APIURL;

function GetAllEnvName({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{key}</option>)
  );
  
}
function GetAllGlobalScriptName({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{options[key]}</option>)
  );
  
}

class executionlabpage extends React.Component{
  constructor(props)
  {
		super(props);
    this.state=
    {
      tabIndex:0,
      ENV:'',
      Browser:'',
      screenshot :'FOR EACH STEP',
      runAt :'SELENIUM GRID',
      EmailTrigger:'NO',
      FromEmail:'',
      FromPassword:'',
      ReceiverEmail:'',
      checkFromEmai:false,
      checkPassword:false,
      checkRecemail:false,
      testSuiteResponce:[],
      testSuiteData: [],
      modal: false,
      modalValidationText:'',
      selected:[],
      showProgressBar:false,
      showProgressText:false,
      totalexecutedTestcasen:0,
      scriptResponce :'Not Started',
      wait:false,
      summaryPass:0,
      summaryFail:0,
      //allModule :['PLP','PIP'],
      allModuleName:[],
      allModule :[],
      allPassModuleWise:[],
      allFailModuleWise:[],
      allHTMLHyperlink:[],
      ExecutionSuitePath:'',
      ConfigurationFile:[],
      CommonTestData:[],
      loader:true,
      loaderLoadTestScripts:false,
      ScriptParallelCheck:false,
      seGridResponse:false,
      ExecutionNature:'',
      checkExecutionNature:false,
      feedbackExecutionNature:'Debugging:Reports will not included in dashboard.',
      DeviceIP:'',
      pageloadingStatus :true,
      DefaultEnvironment : '',
      EnvName:[],
      DefaultComponent:'All',
      allKnownAPIComponent:[],
      executionNature:'Debugging',
      feedbackFromEmail:'',
      feedbackFromPassword:'',
      feedbackRecieverEmail:'',

    }

    const GetLoaderData = async () => 
    {
      this.setState({loader:true})
      this.setState({pageloadingStatus:true})
      const configPage = await fetch(APIBasePath+'apiconfig');
      const configPageResponse = await configPage.json();
      if(Object.keys(configPageResponse).length>0)
      {
          this.setState({ConfigurationFile:configPageResponse});
          this.setState({DefaultEnvironment : configPageResponse['EXECUTIONSETUP']['DefaultEnvironment']});
          this.setState({EnvName:configPageResponse['ENVIRONMENTSETUP']})
          const Req4 = async () => 
          {
            const Request4 = await fetch(APIBasePath+'Updateapiscripts')
            const Response4 = await Request4.json();
            if(Object.keys(Response4).length>0)
            {
            this.setState({allKnownAPIComponent:Response4})
            this.setState({allModule:genericHelper.common_GetListKeyFromJsonResponce(Response4)})
            this.setState({DeviceIP:uuidv4()});
            }
            this.setState({loader:false});
            this.setState({pageloadingStatus:false});
          }
          Req4();
      }
    }
    GetLoaderData()

  }

  OpenTestSummaryFile()
  {
    var ReportsPath = this.state.ExecutionSuitePath;
    if(ReportsPath.trim()==="")
    {
      return;
    }
    window.open(ReportsPath);
    
  }
  LoadAllAPIScripts()
  {
    var Module = this.state.DefaultComponent.trim();
    const GetApiScripts = async () => 
    {
      this.setState({loaderLoadTestScripts:true});
      this.setState({loader:true});
      const configPage = await fetch(APIBasePath+'apiexecution/'+Module);
      const configPageResponse = await configPage.json();
      this.setState({testSuiteData:configPageResponse});
      this.setState({selected:[]});
      this.setState({loaderLoadTestScripts:false});
      this.setState({loader:false});
    }
    GetApiScripts()
  }

  ExecuteAPIScripts()
  {
    this.setState({DeviceIP:uuidv4()});
    this.setState({modal:true})
    var env = this.state.DefaultEnvironment;
    var testscriptCount = this.state.testSuiteData;
    if(testscriptCount.length===0)
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please Load test scripts before execution.'})
    }
    else{
      this.setState({modal:false})
    }
    var message='';
    var emailOption = this.state.EmailTrigger;
    var fromEmail = this.state.FromEmail;
    var fromPassword = this.state.FromPassword;
    var recieverEmail = this.state.ReceiverEmail;
    if(emailOption.trim()==='YES')
    {
      if (!validator.isEmail(fromEmail)) 
      {
         message ='Email Address is not valid.';
         this.setState({checkFromEmai:true})
         this.setState({feedbackFromEmail:'Email Address is not valid.'})
      }
      if(fromPassword.trim()==='')
      {
        message =message+'Password can not be blank.';
        this.setState({checkPassword:true})
        this.setState({feedbackFromPassword:'Password can not be blank.'})
      }
      if (!validator.isEmail(recieverEmail)) 
      {
         message ='Receiver Email Address is not valid.';
         this.setState({checkRecemail:true})
         this.setState({feedbackRecieverEmail:'Receiver Email Address is not valid.'})
      }
      if(message !=='')
      {
        return;
      }
    }
    var totalselectedTestScript = this.state.selected;
    if(totalselectedTestScript.length===0)
    {
     this.setState({modal:true})
     return this.setState({modalValidationText:'Please select test script for execution.'})
    }
    else{
      this.setState({modal:false})
    }
    var debugId = this.state.DeviceIP;
    var executionType = this.state.executionNature;
    var allPostDataItem={};
    var allScriptsItem={};
    var emailInfo={};
    for(let i=0;i<totalselectedTestScript.length;i++)
    {
      var index = Number(totalselectedTestScript[i])-1;
      var TestID= testscriptCount[index].testid;
      var TestName = testscriptCount[index].testcasename;
      var Module = testscriptCount[index].moduleName;
      allScriptsItem[i]=Module+'@'+TestID+'@'+TestName;
    }
    allPostDataItem['TestCaseInformation']=allScriptsItem;
    emailInfo['EmailTrigger']=emailOption;
    emailInfo['FromEmail']=fromEmail;
    emailInfo['FromEmailPassword']=fromPassword;
    emailInfo['RecieverEmailAddress']=recieverEmail;
    allPostDataItem['EmailInformation']=emailInfo;
    var configjson = genericHelper.common_ChangeJsoncontentforServer(allPostDataItem);
    var configAPI =APIBasePath+'apiexecution/'+env+'/'+executionType+'/'+debugId;
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(configjson)
    };
    const Execution = async () => 
    {
      //this.setState({loaderLoadTestScripts:true})
      this.setState({showProgressBar:true})
      this.setState({pageloadingStatus:true})
      const Request = await fetch(configAPI,requestOptions);
      const Response = await Request.json();
      //this.setState({loaderLoadTestScripts:false})
      this.setState({ExecutionSuitePath:Response['TestSummaryLocation']})
      var allTestSuiteData= this.state.testSuiteData;
      var allHyperlink={}
      for(let i=0;i<totalselectedTestScript.length;i++)
      {
        var index = Number(totalselectedTestScript[i])-1;
        var TestId = allTestSuiteData[index].testid;
        var Status = Response[TestId]["Status"];
        var hyperlink = Response[TestId]["HtmlLocation"];
        allTestSuiteData[index].status=Status;
        allHyperlink[TestId]=hyperlink;
        
      }
      this.setState({allHTMLHyperlink:allHyperlink})
      this.setState({testSuiteData:allTestSuiteData})
      var getTotalPass=0;
      var getTotalFail=0;
      for(let i=0;i<allTestSuiteData.length;i++)
      {
        var statusforEachRow = allTestSuiteData[i].status;
        if(statusforEachRow==='PASS')
        {
          getTotalPass=getTotalPass+1;
        }
        if(statusforEachRow==='FAIL')
        {
          getTotalFail=getTotalFail+1;
        }
      }
      this.setState({summaryPass:getTotalPass});
      this.setState({summaryFail:getTotalFail});
      var runTimeModulePASS = executionHelper.getExecutionStatusListValue(this.state.allModule,allTestSuiteData,"PASS");
      var runTimeModuleFail = executionHelper.getExecutionStatusListValue(this.state.allModule,allTestSuiteData,"FAIL");
      this.setState({allPassModuleWise:runTimeModulePASS});
      this.setState({allFailModuleWise:runTimeModuleFail});
      this.setState({pageloadingStatus:false})
      this.setState({showProgressBar:false})

    }
    Execution()
  }
  UpdateEnv(event)
  {
    var env = event.target.value;
    if(env !== this.state.DefaultEnvironment)
    {
      this.setState({DefaultEnvironment: env})
    } 
  }
  UpdateModule(event)
  {
    var module = event.target.value;
    if(module !== this.state.DefaultComponent)
    {
      this.setState({DefaultComponent: module})
    } 
  }
  
  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id)
      }));
    }
  }

  handleOnSelectAll = (isSelect, rows) => {
    const ids = this.state.testSuiteData.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  }

  updateENV(event){
		this.setState({ENV : event.target.value})
    }
    updateBrowser(event){
      this.setState({Browser : event.target.value})
      }
    updateScreenshot(event){
      this.setState({screenshot : event.target.value})
      }
      updateEmailOption(event)
      {

        var emailoption = event.target.value;
        if(emailoption !==this.state.EmailTrigger)
        {
          this.setState({checkFromEmai:false});
          this.setState({checkPassword:false});
          this.setState({checkRecemail:false});
        this.setState({EmailTrigger : event.target.value})
        if(emailoption==="YES")
        {
          
          this.setState({FromEmail:this.state.ConfigurationFile['EMAILSETUP']['SenderEmail']});
          this.setState({FromPassword:this.state.ConfigurationFile['EMAILSETUP']['SenderPassword']});
          this.setState({ReceiverEmail:this.state.ConfigurationFile['EMAILSETUP']['ReceiverEmail']});

        }
        else
        {
          this.setState({FromEmail:''});
          this.setState({FromPassword:''});
          this.setState({ReceiverEmail:''});
        }
      }
      }
      UpdateFromEmail(event)
      {
        this.setState({checkFromEmai:false})
        var email = event.target.value;
        if(email.trim() !==this.state.FromEmail)
        {
          this.setState({FromEmail : email.trim()})
          if (!validator.isEmail(email))
          {
            this.setState({checkFromEmai:true})
            this.setState({feedbackFromEmail:"Email address is not valid"})
          }
          else{
            this.setState({checkFromEmai:false})
          }
        }
      }
      UpdatePassword(event)
      {
        this.setState({checkPassword:false})
        var pwd = event.target.value;
        if(pwd.trim() !==this.state.FromPassword)
        {
          this.setState({FromPassword : pwd.trim()})
          if(pwd.trim()==='')
          {
            this.setState({checkPassword:true})
            this.setState({feedbackFromPassword:'Password can not be blank.'})
          }
          else{
            this.setState({checkPassword:false})
          }
        }
      }
      UpdateRecieverEmail(event)
      {
        this.setState({checkRecemail:false})
        var email = event.target.value;
        if(email.trim() !== this.state.ReceiverEmail)
        {
          this.setState({ReceiverEmail : email.trim()})
          if (!validator.isEmail(email))
          {
            this.setState({checkRecemail:true})
            this.setState({feedbackRecieverEmail:"Email address is not valid"})
          }
          else{
            this.setState({checkRecemail:false})
          }
        }
      }
      UpdateExecutionNature(event){
        this.setState({executionNature : event.target.value})
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
        

  render() {


	  const selectRow = {
      mode: 'checkbox',
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
      };
    const options = {
      sizePerPage: 10,
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true
      };
    const testSuitecolumns = [
      {
        dataField: 'id',
        text: '#',
        headerStyle: { width: '50px' },
      },
      {
        dataField: 'moduleName',
        text: 'Module Name',
        headerStyle: { width: '200px' },
        filter: textFilter()
      },
      {
        dataField: 'testid',
        text: 'Test ID',
        headerStyle: { width: '200px' },
        filter: textFilter()
      },
      {
        dataField: 'testcasename',
        text: 'Test Case Name',
        filter: textFilter()
      },
      {
        dataField: 'status',
        text: 'Status',
        events: {
          onClick: (e, column, columnIndex, row, rowIndex)=> {
            var testscriptStatus = row.status;
            if(testscriptStatus==="PASS" || testscriptStatus==="FAIL")
            {
              var gettestId = row.testid
              var ReportsPath= this.state.allHTMLHyperlink[gettestId];
              window.open(ReportsPath);
            }
          }
        },
        headerStyle: { width: '120px' },
        filter: textFilter(),
        style: (newValue) => {
          if (newValue=== 'FAIL') {
            return {
              backgroundColor: '#dc3545'
            };
          };
          if (newValue=== 'PASS') {
            return {
              backgroundColor: '#28a745'
            };
          };
        },
        
      }
    ];

  return (
    <Page title="Execution Lab" breadcrumbs={[{ name: 'Execution Lab', active: true }]}>
      <Loader 
        type="ThreeDots"
        color="#00BFFF"
        height={50}
        width={100}
        timeout={120000} //3 secs
        visible = {this.state.loader}
      /> 
	  <Row>
    <Col lg={6} md={6} sm={6} xs={6}>
          <Card>
            <CardHeader>Environment*
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Environment*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="envlist" value ={this.state.DefaultEnvironment} onChange={this.UpdateEnv.bind(this)}>
                    <GetAllEnvName options={this.state.EnvName} />
					          </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Component*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="envlist" value ={this.state.DefaultComponent} onChange={this.UpdateModule.bind(this)}>
                      <option>All</option>
                      <GetAllGlobalScriptName options={this.state.allKnownAPIComponent} />
					          </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Execution Nature*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="executionNature" value ={this.state.executionNature} onChange={this.UpdateExecutionNature.bind(this)}>
                    <option>Debugging</option>
                    <option>Functional</option>
					          </Input>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={6}>
          <Card>
            <CardHeader>Email Configuration</CardHeader>
            <CardBody>
              <Form>
                <FormGroup col>
                  <Label for="exampleSelect" sm={5}>
                    Email Trigger*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="email"  value={this.state.EmailTrigger} onChange={this.updateEmailOption.bind(this)}>
					            <option>YES</option>
                      <option>NO</option>
					          </Input>
                  </Col>
                </FormGroup>
				       <FormGroup col>
			          	<Label for="exampleSelect" sm={5}>
                    From Email
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkFromEmai} type="input" value={this.state.FromEmail} onChange={this.UpdateFromEmail.bind(this)} name="fromemail" placeholder="enter your Email Address"/>
                    <FormFeedback>
                      {this.state.feedbackFromEmail}
                    </FormFeedback>
                  </Col>
                </FormGroup>{' '}
				      <FormGroup col>
			        	<Label for="exampleSelect" sm={5}>
                    Password
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkPassword} type="password" value={this.state.FromPassword} onChange={this.UpdatePassword.bind(this)} name="fromPassword" placeholder="enter your Password"/>
                    <FormFeedback>
                      {this.state.feedbackFromPassword}
                    </FormFeedback>
                  </Col>
                </FormGroup>{' '}
				      <FormGroup col>
				        <Label for="exampleSelect" sm={5}>
                    Receiver Email
                  </Label>
                 <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkRecemail} type="input" value={this.state.ReceiverEmail} onChange={this.UpdateRecieverEmail.bind(this)} name="receiveremail" placeholder="enter your Receiver email"/>
                    <FormFeedback>
                      {this.state.feedbackRecieverEmail}
                    </FormFeedback>
                  </Col>
                </FormGroup>{' '}
              </Form>
            </CardBody>
          </Card>
        </Col>
	  	<Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Executable Test Scripts
            <Button disabled={this.state.pageloadingStatus} onClick={this.LoadAllAPIScripts.bind(this)} name ="loadTestSuite" color="primary">Load Test Scripts</Button>
            <Button disabled={this.state.pageloadingStatus} onClick={this.ExecuteAPIScripts.bind(this)} name ="executeTC" color="primary">Execute Test Scripts</Button>
             <div  style={{visibility: this.state.showProgressText ? 'visible' : 'hidden' }} className="text-center"></div>
              <Loader 
                type="ThreeDots"
                color="#00BFFF"
                height={30}
                width={100}
                timeout={120000} //3 secs
                visible = {this.state.loaderLoadTestScripts}
              />
              <Progress animated color="info" value="100" style={{visibility: this.state.showProgressBar ? 'visible' : 'hidden' }}  />
               <Modal
                      isOpen={this.state.modal}
                      toggle={this.toggle()}
                      className={this.props.className}>
                      <ModalHeader  toggle={this.toggle()}> Information</ModalHeader>
                      <ModalBody >
                        {this.state.modalValidationText}
                      </ModalBody>
                      <ModalFooter>
                        <Button disabled={this.state.pageloadingStatus} color="secondary" onClick={this.toggle()}>
                          OK
                        </Button>
                      </ModalFooter>
            </Modal>
              
            </CardHeader>
            <CardBody>
            <BootstrapTable
              keyField="id"
              data={ this.state.testSuiteData }
              columns={ testSuitecolumns }
              striped
              hover
              condensed
              pagination={ paginationFactory(options) }
              selectRow={ selectRow }
              filter={ filterFactory() }
              disabled={this.state.pageloadingStatus}
            />
            </CardBody>
          </Card>
        </Col>			
    </Row>
		<Row>
        <Col lg={4} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Total Pass Fail Count</CardHeader>
			        <CardBody onClick={this.OpenTestSummaryFile.bind(this)}>
              <Pie disabled={this.state.pageloadingStatus} data={graph.GetPieChart(this.state.summaryPass,this.state.summaryFail)} />
            </CardBody>
          </Card>
        </Col>
		<Col lg={8} md={6} sm={6} xs={12}>
		<Card>
            <CardHeader>Pass Fail Count Module wise</CardHeader>
			      <CardBody>
            <Bar disabled={this.state.pageloadingStatus}
                data={graph.GetLineChart(this.state.allModule,this.state.allPassModuleWise,this.state.allFailModuleWise)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      </Page>
   );
}
};


export default executionlabpage;