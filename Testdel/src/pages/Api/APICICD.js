import Page from 'components/Page';
import React from 'react';
import CICDImage from 'assets/img/bg/CICDTool.JPG';
import genericHelper from '../funcLibraries/GenericHelper.js';
import {
  Button,
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardImg,
} from 'reactstrap';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import validator from 'validator';
var APIBasePath= window.ENV.APIURL;

function GetAllCDCDSuite({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{options[key]}</option>)
  );
}
function GetAllEnvName({ options }) {

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
        Browser:'',
        ENV:'',
        RegressionENV:'',
        RegressionBrowser:'',
        CommonTestData:[],
        ConfigurationFile:[],
        loader:true,
        loaderLoadTestScripts:false,
        testSuiteData: [],
        selected:[],
        allModuleName:[],
        allModule :[],
        testSuiteResponce:[],
        NewTestSuite:'',
        allCICDSuite:'',
        apiTestSuiteName:'',
        cicdAPI:'',
        LoadScriptButtonenabled:false,
        modalValidationText:'',
        PreSelectedTestScripts:[],
        EmailTrigger:'NO',
        FromEmail:'',
        FromPassword:'',
        ReceiverEmail:'',
        checkFromEmai:false,
        checkPassword:false,
        checkRecemail:false,
        pageloadingStatus :false,
        EnvName:[],
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
          this.setState({RegressionENV : configPageResponse['EXECUTIONSETUP']['DefaultEnvironment']});
          this.setState({EnvName:configPageResponse['ENVIRONMENTSETUP']})
          const Req4 = async () => 
          {
            const Request4 = await fetch(APIBasePath+'apicicd')
            const Response4 = await Request4.json();
            if(Object.keys(Response4).length>0)
            {
            this.setState({allCICDSuite:Response4});
            this.setState({apiTestSuiteName:'RegressionSuite'})
            var apiURL= APIBasePath+'apicicd/'+this.state.RegressionENV+'/RegressionSuite';
            this.setState({cicdAPI:apiURL})
            }
            this.setState({loader:false});
            this.setState({pageloadingStatus:false});
          }
          Req4();
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
  updateENV(event)
  {
		this.setState({ENV : event.target.value})
  }
  updateBrowser(event)
  {
    this.setState({Browser : event.target.value})
  }
  updateRegressionENV(event)
  {
    var env = event.target.value;
    this.setState({RegressionENV : env})
    if(env.trim()==="")
    {
      this.setState({cicdAPI:''})
      return;
    }
    var browser = this.state.RegressionBrowser;
    if(browser.trim()==="")
    {
      this.setState({cicdAPI:''})
      return;
    }
    var CICDSuite= this.state.apiTestSuiteName;
    if(CICDSuite.trim()==="")
    {
      this.setState({cicdAPI:''})
      return;
    }

    var apiURL= APIBasePath+'cicd/'+env+'/'+CICDSuite;
    this.setState({cicdAPI:apiURL})
  }
  updateRegressionBrowser(event)
  {
    var  browser = event.target.value;
    this.setState({RegressionBrowser : browser})
    if(browser.trim()==="")
    {
      this.setState({cicdAPI:''})
      return;
    }
    var env = this.state.RegressionENV;
    if(env.trim()==="")
    {
      this.setState({cicdAPI:''})
      return;
    }
    var CICDSuite= this.state.apiTestSuiteName;
    if(CICDSuite.trim()==="")
    {
      this.setState({cicdAPI:''})
      return;
    }
    var apiURL= APIBasePath+'cicd/'+env+'/'+CICDSuite;
    this.setState({cicdAPI:apiURL})
  }
  updateAPITestSuite(event)
  {
      var CICDSuite = event.target.value;
      if(CICDSuite !==this.state.apiTestSuiteName)
      {
       this.setState({apiTestSuiteName : CICDSuite})
       var env = this.state.RegressionENV;
       var apiURL= APIBasePath+'apicicd/'+env+'/'+CICDSuite;
       this.setState({cicdAPI:apiURL})
   }

  }
  
  LoadallTestscripts()
  {
    const GetApiScripts = async () => 
    {
      this.setState({loaderLoadTestScripts:true});
      this.setState({loader:true});
      const configPage = await fetch(APIBasePath+'apiexecution/All');
      const configPageResponse = await configPage.json();
      this.setState({testSuiteData:configPageResponse});
      this.setState({selected:[]});
      this.setState({loaderLoadTestScripts:false});
      this.setState({loader:false});
    }
    GetApiScripts()
  }

  SaveTestSuite()
  {
     var TotalTestScripts= this.state.testSuiteData;
     if(TotalTestScripts.length===0)
     {
      this.setState({modal:true})
			return this.setState({modalValidationText:'Please upload test scripts first.'})
     }
     var selectedTestScripts = this.state.selected;
     if(selectedTestScripts.length===0)
     {
      this.setState({modal:true})
			return this.setState({modalValidationText:'Please select test scripts before saving new test suite.'})
     }

     var testSuiteName = this.state.NewTestSuite;
     if(testSuiteName.trim()==="")
     {
      this.setState({modal:true})
			return this.setState({modalValidationText:'Execution Suite Name* can not be empty.'})
     }
     //@ Check Email Option
     var emailTriggerOption = this.state.EmailTrigger;
     var FEmailAddress='';
     var FEmailPassword='';
     var REmailAddress='';

     if(emailTriggerOption==="YES")
     {
        var Message= '';
        FEmailAddress=this.state.FromEmail;
        FEmailPassword= this.state.FromPassword;
        REmailAddress= this.state.ReceiverEmail;
        if(FEmailAddress.trim()==="")
        {
          Message="From Email Address";
          this.setState({checkFromEmai:true})
          this.setState({feedbackFromEmail:'Email Address can not be blank.'})
        }
        if(FEmailPassword.trim()==="")
        {
          Message=Message+"Password";
          this.setState({checkPassword:true})
          this.setState({feedbackFromPassword:'Password can not be blank.'})
        }
        if(REmailAddress.trim()==="")
        {
          Message= Message+"Reciever Email Address";
          this.setState({checkRecemail:true})
          this.setState({feedbackRecieverEmail:'Email Address can not be blank.'})
        }
        if(Message.trim()!=='')
        {
          return;
        }
        if(this.state.checkRecemail || this.state.checkFromEmai || this.state.checkPassword)
        {
          return;
        }

     }
 
     /*
     var prevselected = this.state.PreSelectedTestScripts;
     if(prevselected===selectedTestScripts)
     {
      this.setState({modal:true})
			return this.setState({modalValidationText:'No Changes To Save.'})
     }
     */
     var TestSuiteDataforPost=[];
     var EmailItem={};
     EmailItem["EmailOption"]=emailTriggerOption;
     EmailItem["FormEmailAddress"]=FEmailAddress;
     EmailItem["FEmailPassword"]=FEmailPassword;
     EmailItem["ReceiverEmailAddress"]=REmailAddress;
     this.setState({loaderLoadTestScripts:true})
     TestSuiteDataforPost.push(EmailItem);
     for(let i=0;i<selectedTestScripts.length;i++)
     {
      var Testinformation={};
      Testinformation["Module"]=this.state.testSuiteData[selectedTestScripts[i]-1].moduleName;
      Testinformation["TestID"]=this.state.testSuiteData[selectedTestScripts[i]-1].testid;
      Testinformation["TestCaseName"]=this.state.testSuiteData[selectedTestScripts[i]-1].testcasename;
      TestSuiteDataforPost.push(Testinformation);
     }

     var TestSuiteJson = genericHelper.common_ChangeJsoncontentforServer(TestSuiteDataforPost);
     var TestSuiteAPI =APIBasePath+'apicicd/'+testSuiteName;
     var requestOptions = {
       method: 'POST',
       headers: {"Accept": "*/*",'Content-type': 'application/json'},
       body: JSON.stringify(TestSuiteJson)
     };
     const TestSuiteSaveRequest = async () => 
     {
      this.setState({pageloadingStatus:true});
       const APIReq = await fetch(TestSuiteAPI,requestOptions);
       const APIRes = await APIReq.json();
       this.setState({loaderLoadTestScripts:false})
       this.setState({pageloadingStatus:false});
       if(APIRes.success)
       {
         this.setState({testSuiteData:[]});
         this.setState({NewTestSuite:''});
         this.setState({PreSelectedTestScripts:[]});
         this.setState({EmailTrigger:'NO'});
         this.setState({FromEmail:''});
         this.setState({FromPassword:''});
         this.setState({ReceiverEmail:''});
       }
       this.setState({modal:true})
       this.setState({modalValidationText:APIRes.servermessage})
     }
     TestSuiteSaveRequest();

  }

  updateRegressionSuite(event)
  {
    var runTimeModule = event;
    var prevValue = this.state.NewTestSuite;
    if(runTimeModule===prevValue)
    {
      return;
    }
    this.setState({NewTestSuite : runTimeModule.trim()})
    if(runTimeModule.trim()==="")
    {
      this.setState({LoadScriptButtonenabled:false})
      return;
    }
    this.setState({testSuiteData:''})
    var existingSuite= this.state.allCICDSuite;
    existingSuite= genericHelper.common_CheckValueFromJson(existingSuite,runTimeModule);
     var EmailShooting="NO";
     var FEmail="";
     var FPWD="";
     var REmail="";
    if(existingSuite)
    {
      this.setState({LoadScriptButtonenabled:true})
      this.setState({loaderLoadTestScripts:true})
      const Req1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Reqest1 = await fetch(APIBasePath+'apicicd/'+runTimeModule)
        const Response1 = await Reqest1.json();
        this.setState({pageloadingStatus:false});
        EmailShooting=Response1["EmailOption"];
        FEmail = Response1["FormEmailAddress"];
        FPWD = Response1["FEmailPassword"];
        REmail = Response1["ReceiverEmailAddress"];
        this.setState({EmailTrigger:EmailShooting});
        this.setState({FromEmail:FEmail});
        this.setState({FromPassword:FPWD});
        this.setState({ReceiverEmail:REmail});
        var testCaseList= Response1["TestSuite"];
        console.log(testCaseList);
       // Response1=Response1["TestSuite"];
        var stepid =0;
        var allList =[];
        var checkboxList=[];
       // var jstestStepData={};
        for(let i=0;i<testCaseList.length;i++)
        {
          checkboxList.push(i+1);
          stepid =stepid+1;
          var Mod=testCaseList[i].Module;
          var testid=testCaseList[i].TestID;
          var testName=testCaseList[i].TestCaseName;
          allList.push({id:stepid,moduleName:Mod,testid:testid,testcasename:testName})
        }
        //console.log(checkboxList)
        //this.state.selected
        this.setState({selected:checkboxList})
        this.setState({testSuiteData:allList})
        this.setState({loaderLoadTestScripts:false})
        this.setState({PreSelectedTestScripts:checkboxList})
        
      }
      Req1();
    }
    else
    {
        this.setState({LoadScriptButtonenabled:true})
        this.setState({PreSelectedTestScripts:[]});
        this.setState({EmailTrigger:'NO'});
        this.setState({FromEmail:''});
        this.setState({FromPassword:''});
        this.setState({ReceiverEmail:''})
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
    const ids = rows.map(r => r.id);
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

  render() {
    const selectRow = {
      mode: 'checkbox',
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
      };
    const options = {
      sizePerPage: 20,
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
        filter: textFilter()
      },
      {
        dataField: 'testid',
        text: 'Test ID',
        filter: textFilter()
      },
      {
        dataField: 'testcasename',
        text: 'Test Case Name',
        filter: textFilter()
      }
    ];

  return (
    <Page title="CI/CD Support" breadcrumbs={[{ name: 'CI/CD Support', active: true }]}>
      <Loader 
        type="ThreeDots"
        color="#00BFFF"
        height={50}
        width={100}
        timeout={120000} //3 secs
        visible = {this.state.loader}
      />
      <Row>
        <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>
              <CardImg
            className="card-img-right"
              src={CICDImage}
              style={{ width: 'auto', height: 100 }}
              />
            </CardHeader>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>API Regression Suite</CardHeader>
              <CardBody>
                <Form >
                <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Environment*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="envlist" value={this.state.RegressionENV} onChange={this.updateRegressionENV.bind(this)}>
                      <GetAllEnvName options={this.state.EnvName} />
					          </Input>
                  </Col>
                </FormGroup>
                  <FormGroup col>
				            <Label for="exampleSelect" sm={6}>
                      Execution Suite Name*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} type="select" name="testsuitename" value={this.state.apiTestSuiteName} onChange={this.updateAPITestSuite.bind(this)}>
                      <option>RegressionSuite</option>
                      <GetAllCDCDSuite options={this.state.allCICDSuite} />
                      </Input>
                    </Col>
                   </FormGroup>
                   <FormGroup col>
				            <Label for="exampleSelect" sm={6}>
                      Execution API
                    </Label>
                    <Col disabled ="disabled"> 
                    <Input disabled={this.state.pageloadingStatus} readOnly  value ={this.state.cicdAPI}></Input>
                    </Col>
                  </FormGroup>
                </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Create Your Custom Test Suite</CardHeader>
              <CardBody>
                <Form >
                  <FormGroup col>
				            <Label for="exampleSelect" sm={6}>
                      Execution Suite Name*
                    </Label>
                    <Col >
                    <Combobox disabled={this.state.pageloadingStatus} name ="newTestSuite" 
                      value={this.state.NewTestSuite}
                      data={genericHelper.common_GetListvalueFromJsonResponce(this.state.allCICDSuite)}
                      caseSensitive={false}
                      minLength={3}
                      filter='contains'
                     // onSelect={this.updateRegressionSuite.bind(this)}
                      onChange={this.updateRegressionSuite.bind(this)}
                    />
                    </Col>
                   </FormGroup>
                </Form>
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
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkFromEmai}  value={this.state.FromEmail} onChange={this.UpdateFromEmail.bind(this)} type="input" name="fromemail" placeholder="enter your Email Address"/>
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
      </Row>
      <Row>
	  	<Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Test Suite*
            <Button disabled={this.state.pageloadingStatus} color="primary" onClick={this.SaveTestSuite.bind(this)} name ="saveTestScript">Save Test Suite</Button>
            <Button disabled = {!this.state.LoadScriptButtonenabled} onClick={this.LoadallTestscripts.bind(this)} name ="loadTestSuite" color="primary">Load Test Scripts</Button>
              <Loader 
                type="ThreeDots"
                color="#00BFFF"
                height={30}
                width={100}
                timeout={120000} //3 secs
                visible = {this.state.loaderLoadTestScripts}
              />
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
