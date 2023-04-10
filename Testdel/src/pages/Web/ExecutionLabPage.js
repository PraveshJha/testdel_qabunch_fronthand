import Page from 'components/Page';
import React from 'react';
import { getColor } from 'utils/colors';
import { Pie, Bar} from 'react-chartjs-2';
import genericHelper from '../funcLibraries/GenericHelper.js';
import graph from '../funcLibraries/graph.js';
import executionHelper from '../funcLibraries/executionHelper.js';
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  FormFeedback,
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

var APIBasePath= window.ENV.APIURL;

function Options({ options }) {
    return (
        options.map(option => 
                    <option key={option.Environment}>                                   
                    {option.Environment}
                    </option>)
                   );
}
function GetKeys({ options }) {

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
      pageloadingStatus :false,
      defaultExecutionScreen:'',
      defaultEmulator:'',
      allDefaultScreen:[],
      defaltScreenName:'',
      screenwidth:'',
      screenhight:'',

    }
    const GetLoaderData = async () => 
    {
      this.setState({pageloadingStatus:true});
      const homepage = await fetch(APIBasePath+'dashboard');
      const homepageResponse = await homepage.json();
      this.setState({pageloadingStatus:false});
      if(homepageResponse.success)
      {
          this.setState({pageloadingStatus:true});
          this.setState({ConfigurationFile:homepageResponse.Configuration});
          this.setState({CommonTestData:homepageResponse.CommonTestData});
          this.setState({ENV:this.state.ConfigurationFile.DefaultEnvironment});
          this.setState({Browser:this.state.ConfigurationFile.DefaultBrowser});
          var defaultEmulation= this.state.ConfigurationFile.defaultemulation;
          var defaultExecutionScreen= this.state.ConfigurationFile.defaultscreenName;
          this.setState({defaultEmulator:defaultEmulation});
          this.setState({defaltScreenName:defaultExecutionScreen});
          var allItem = this.state.ConfigurationFile['Emulation'][defaultEmulation];
          var totalItem = genericHelper.common_GetListKeyFromJsonResponce(allItem);
          this.setState({allDefaultScreen:totalItem});
          var width = this.state.ConfigurationFile['Emulation'][defaultEmulation][defaultExecutionScreen]['WIDTH'];
          var hight = this.state.ConfigurationFile['Emulation'][defaultEmulation][defaultExecutionScreen]['HIGHT'];
          this.setState({screenwidth:width});
          this.setState({screenhight:hight});
          const Req2 = async () => 
          {
            const Req2 = await fetch(APIBasePath+'execution')
            const Response2 = await Req2.json();
            this.setState({testSuiteResponce:Response2});
            const Req3 = async () => 
            {
              const Req3 = await fetch(APIBasePath+'testcase/0')
              const Response3 = await Req3.json();
              this.setState({allModuleName:Response3});
              this.setState({DeviceIP:uuidv4()});
              this.setState({loader:false})
              this.setState({pageloadingStatus:false});
            }
            Req3();
          }
          Req2();
      }
    }
    GetLoaderData();
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
  LoadallTestscripts()
  {
    this.setState({loaderLoadTestScripts:true});
    var ModuleName = genericHelper.common_GetListvalueFromJsonResponce(this.state.allModuleName)
    this.setState({allModule:ModuleName});
    this.setState({showProgressBar:false});
     this.setState({showProgressText:false});
    var jstestStepData={};
    var allitem = []
    var Item = this.state.testSuiteResponce;
    Object.keys(Item).map((key) => 
    (
      allitem.push(key)
      
    ))
    var stepid =0;
    var allList =[]
    for(let i=1;i<=allitem.length;i++)
    {
      var modulewise = Item[allitem[i-1]];
      
      for(let j=1;j<=modulewise.length;j++)
      {
        stepid =stepid+1;
        jstestStepData["id"]=stepid;
        jstestStepData["moduleName"]=allitem[i-1];
        jstestStepData["testid"]=modulewise[j-1].TestID;
        jstestStepData["testcasename"]=modulewise[j-1].TestName;
        jstestStepData["status"]='Not Started';
        allList.push({id:stepid,moduleName:allitem[i-1],testid:modulewise[j-1].TestID,testcasename:modulewise[j-1].TestName,status:'Not Started'})
      }
    }
    this.setState({testSuiteData:allList});
    this.setState({selected:[]});
    this.setState({loaderLoadTestScripts:false});
  }

  ExecuteTestScripts()
  {
    // Show a pop up if it works
    this.setState({showProgressBar:false});
    this.setState({showProgressText:false});
    this.setState({totalexecutedTestcasen:0});
     var testscriptCount = this.state.testSuiteData.length;
    
     if(testscriptCount===0)
     {
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please Load test scripts before execution.'})
     }
     var email= this.state.EmailTrigger;
     var From = this.state.FromEmail;
     var PasswordUI = this.state.FromPassword;
     var Receiver = this.state.ReceiverEmail;
     var validationMessage='';
     var DashboardReportingCheck = this.state.ExecutionNature;
     var clientMachineId= this.state.DeviceIP;
     var emulation = this.state.defaultEmulator;
     var screen = this.state.defaltScreenName;
     var width = this.state.screenwidth;
     var hieght = this.state.screenhight;
     if(DashboardReportingCheck.trim()==="")
     {
      this.setState({checkExecutionNature:true})
      return;
     }
     else
     {
      this.setState({checkExecutionNature:false})
     }
     if(email==="YES")
     {
        if(From.trim()==="")
        {
          this.setState({checkFromEmai:true});
          validationMessage= "From Email can not be blank."
        }
        if(PasswordUI.trim()==="")
        {
          this.setState({checkPassword:true});
          validationMessage= validationMessage+"Password can not be blank."
        }
        if(Receiver.trim()==="")
        {
          this.setState({checkRecemail:true});
          validationMessage= validationMessage+"Receiver Email can not be blank."
        }
        if(validationMessage.trim() !=="")
        {
          this.setState({modal:true})
          return this.setState({modalValidationText:validationMessage})
        }
     }
     var totalselectedTestScript = this.state.selected.length;
     if(totalselectedTestScript===0)
     {
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please select test script for execution.'})
     }
     var StartTime = new Date().toLocaleString();
     //@ 
     const executableTestscript = this.state.selected;
     this.setState({summaryPass:0})
     this.setState({summaryFail:0})
     var TotalPass=0;
     var TotalFail =0;
    
      //@ set total Pass and Fail
      var GraphItem = this.state.testSuiteData;
      for(let i=0;i<GraphItem.length;i++)
      {
        var StatusGraph = GraphItem[i].status
        if(StatusGraph==="PASS")
        {
          TotalPass=TotalPass+1;
          this.setState({summaryPass:TotalPass})
        }
        if(StatusGraph==="FAIL")
        {
          TotalFail=TotalFail+1;
          this.setState({summaryFail:TotalFail})
        }
      }
     var scriptcounter=0;
     var jstestStepDatacollection={};
     totalselectedTestScript = this.state.selected.length
     var En = this.state.ENV 
     var Br = this.state.Browser;
     var Sc= this.state.screenshot;
     var Ru= this.state.runAt;
     var HubName= this.state.ConfigurationFile.HUBMachineName;
     var portNumber= this.state.ConfigurationFile.HUBPort;
     var delayAPI =APIBasePath+'execution/1000';

     //############ NEW Code for Execution#################################

     // Check Selenium Grid
     
     const TestSuiteStructure = this.state.testSuiteData;
     const Itemmodule = this.state.allModule;
     const seGridRequest = async () => 
     {
      this.setState({pageloadingStatus:true});
       const APIReq = await fetch(APIBasePath+'segrid/'+HubName+'/'+portNumber+'/'+Br)
       const APIResponse = await APIReq.json();
       this.setState({pageloadingStatus:false});
       if(!APIResponse.success)
       {
        this.setState({seGridResponse:false})
        this.setState({modal:true})
        return this.setState({modalValidationText:APIResponse.servermessage})
       }
       else
       {
          this.setState({seGridResponse:true})
       }
     }
    seGridRequest();

    setTimeout(() => 
    {
      if(this.state.seGridResponse)
      {
      this.setState({showProgressBar:true});
      this.setState({showProgressText:true});
      for (let counter=0; counter<Number(totalselectedTestScript); counter++) 
      {
         task(counter);
         const Delayrequest = async () => 
         {
           const Delayresponse = await fetch(delayAPI);
           const Delayjson = await Delayresponse.json();
           var DelaycheckStatus= Delayjson.success 
           if(DelaycheckStatus==="PASS")
           {
             task(counter);
              /********** Get Test case Information*************** */
              var Mo= executionHelper.GetModule(TestSuiteStructure,counter,executableTestscript);
              var testID =executionHelper.GetTestID(TestSuiteStructure,counter,executableTestscript);
              var testName= executionHelper.GetTestName(TestSuiteStructure,counter,executableTestscript);
              var Status='';
              var HtmlPath='';
              var TestRunDuration='';
             //******  Update Test Status before execution in Grid ***************************
             TestSuiteStructure[executableTestscript[counter]-1].status= 'In-Progress';
             this.setState({testSuiteData:TestSuiteStructure});
             //******  Test Script execution API*************************************************
              var API = APIBasePath+'execution/'+Mo+'/'+testID+'/'+testName+'/'+En+'/'+Br+'/'+Ru+'/'+Sc+'/'+HubName+'/'+portNumber+'/'+DashboardReportingCheck+'/'+clientMachineId+'/'+emulation+'/'+screen+'/'+width+'/'+hieght;
             const request = async () => 
             {
              this.setState({pageloadingStatus:true});
               const response = await fetch(API);
               const json = await response.json();
               this.setState({pageloadingStatus:false});
               Status=json.status;
               HtmlPath=json.htmlPath;
               TestRunDuration=json.testRunDuration;
               //******  Update Test Status and Hyperlink after execution in Grid ********************************
               TestSuiteStructure[executableTestscript[counter]-1].status= Status;
               this.setState({testSuiteData:TestSuiteStructure});
                var testhtml = this.state.allHTMLHyperlink;
                testhtml['RowId'+executableTestscript[counter]]=HtmlPath;
                this.setState({ allHTMLHyperlink: testhtml});
               //******  Save Total Pass Fail Count for Summary Report********************************************
               if(Status==="PASS")
               {
                 TotalPass=TotalPass+1;
               }
               if(Status==="FAIL")
               {
                 TotalFail=TotalFail+1;
               }
               //******  Test Information for Summary Report ****************************************************
               jstestStepDatacollection[counter+1]=executionHelper.TestInformationForTestSummaryReports(Mo,testID,testName,Status,HtmlPath,TestRunDuration);
               
               /*****************************************Module Pass Fail *********************************** */
               var pushPass =[]
               var pushFail=[]
               var modulefound =0;
               for(let i=0;i<Itemmodule.length;i++)
               {
                 var modulePass=0
                 var moduleFail=0
                 for(let j=modulefound;j<TestSuiteStructure.length;j++)
                 {
                     var RunTimeModuleName = TestSuiteStructure[j].moduleName;
                     if(RunTimeModuleName===Itemmodule[i])
                     {
                     var checkstatus = TestSuiteStructure[j].status
                     if(checkstatus==="PASS")
                     {
                       modulePass=modulePass+1;
                     }
                     if(checkstatus==="FAIL")
                     {
                       moduleFail=moduleFail+1;
                     }
                     }
                     else
                     {
                       modulefound =j;
                       break;
                     }
                 }
                 pushPass.push(modulePass);
                 pushFail.push(moduleFail)
               }
               /****************** Check all script is executed ************************************************/
               scriptcounter= Number(scriptcounter)+1;
               this.setState({ScriptParallelCheck:true})
               if(scriptcounter===totalselectedTestScript)
               {
                 this.setState({summaryPass:TotalPass})
                 this.setState({summaryFail:TotalFail})
                 this.setState({allPassModuleWise:pushPass});
                 this.setState({allFailModuleWise:pushFail});
                 this.setState({showProgressBar:false});
                 this.setState({showProgressText:false});
                 this.setState({totalexecutedTestcasen:0});
                 //@ set email option
                 jstestStepDatacollection["EmailOption"]=email;
                 jstestStepDatacollection["FormEmailAddress"]=From;
                 jstestStepDatacollection["FEmailPassword"]=PasswordUI;
                 jstestStepDatacollection["ReceiverEmailAddress"]=Receiver;
                 jstestStepDatacollection["Browser"]=Br;
                 //var EndTime = new Date().toLocaleString();
                 jstestStepDatacollection["StartTime"]=StartTime;
                 jstestStepDatacollection["EndTime"]=new Date().toLocaleString();
                 var postjson = genericHelper.common_ChangeJsoncontentforServer(jstestStepDatacollection);
                 var requestOptions = 
                 {
                   method: 'POST',
                   headers: {"Accept": "*/*",'Content-type': 'application/json'},
                   body: JSON.stringify(postjson)
                 };
                 const TestSuiteandSummary = async () => 
                 {
                  this.setState({pageloadingStatus:true});
                   const APIRequest = await fetch(APIBasePath+'execution/'+En+'/'+DashboardReportingCheck+'/'+clientMachineId,requestOptions);
                   const APIResponse = await APIRequest.json();
                   this.setState({pageloadingStatus:false});
                   if(APIResponse.success.toLowerCase()==='pass')
                   {
                     var HtmlPath=APIResponse.testSuitePath;
                     this.setState({ExecutionSuitePath:HtmlPath})
                   }
                 }
                 TestSuiteandSummary();
               }
             }
             request();
           }
         }
         Delayrequest()
        } 
        function task(p) 
        { 
          setTimeout(function() 
          {
          }, 4000 * p); 
        }
      }
    }, 10000);
    

  }
  UpdateDefaultEmulation(event)
  {
    var Item = event.target.value;
    if(Item !== this.state.defaultEmulator)
    {
      this.setState({defaltScreenName:''});
      this.setState({defaultEmulator: Item});
      var allItem = this.state.ConfigurationFile['Emulation'][Item];
      var totalItem = genericHelper.common_GetListKeyFromJsonResponce(allItem);
      this.setState({allDefaultScreen:totalItem});
      this.setState({defaltScreenName:totalItem[0]});
      var width = this.state.ConfigurationFile['Emulation'][Item][totalItem[0]]['WIDTH'];
      var hight = this.state.ConfigurationFile['Emulation'][Item][totalItem[0]]['HIGHT'];
      this.setState({screenwidth:width});
      this.setState({screenhight:hight});
    }
  }
  selectdefaultScreen(event)
  {
    var Item = event.target.value;
    if(Item !== this.state.defaltScreenName)
    {
      this.setState({defaltScreenName: Item})
      var defaultItem = this.state.defaultEmulator;
      var width = this.state.ConfigurationFile['Emulation'][defaultItem][Item]['WIDTH'];
      var hight = this.state.ConfigurationFile['Emulation'][defaultItem][Item]['HIGHT'];
      this.setState({screenwidth:width});
      this.setState({screenhight:hight});
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
        this.setState({EmailTrigger : event.target.value})
        if(emailoption==="YES")
        {
          this.setState({FromEmail:this.state.ConfigurationFile.SenderEmail});
          this.setState({FromPassword:this.state.ConfigurationFile.SenderPassword});
          this.setState({ReceiverEmail:this.state.ConfigurationFile.ReceiverEmail});

        }
        else
        {
          this.setState({FromEmail:''});
          this.setState({FromPassword:''});
          this.setState({ReceiverEmail:''});
        }
      }
      UpdateFromEmail(event)
      {
        this.setState({checkFromEmai:false})
        this.setState({FromEmail : event.target.value})
      }
      UpdatePassword(event)
      {
        this.setState({checkPassword:false})
        this.setState({FromPassword : event.target.value})
      }
      UpdateRecieverEmail(event)
      {
        this.setState({checkRecemail:false})
        this.setState({ReceiverEmail : event.target.value})
      }
      UpdateExecutionNature(event){
        this.setState({ExecutionNature : event.target.value})
        this.setState({checkExecutionNature:false})
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
        headerStyle: { width: '120px' },
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
          onClick: (e, column, columnIndex, row, rowIndex) => {
            var testscriptStatus = row.status;
            if(testscriptStatus==="PASS" || testscriptStatus==="FAIL")
            {
              var getRowId = 'RowId'+(rowIndex+1);
              var ReportsPath= this.state.allHTMLHyperlink[getRowId];
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
        }
        
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
        <Col lg={4} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Execution Configuration</CardHeader>
            <CardBody>
              <Form>
                <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Environment*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="envlist" value={this.state.ENV} onChange={this.updateENV.bind(this)}>
					            <Options options={this.state.CommonTestData} />
					          </Input>
                  </Col>
                </FormGroup>
				          <FormGroup col>
                    <Label for="exampleSelect" sm={5}>
                      Browser*
                    </Label>
                    <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="browser" value={this.state.Browser} onChange={this.updateBrowser.bind(this)}>
					              <option>CHROME</option>
                        <option>FIREFOX</option>
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    ScreenShot*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="screenshot" value={this.state.screenshot} onChange={this.updateScreenshot.bind(this)}>
				          	<option>FOR EACH STEP</option>
                    <option>FOR STEP FAILURE</option>
					          </Input>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
		        <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Execution Setup</CardHeader>
                  <CardBody>
                     <Form>
                        <FormGroup col>
                          <Label for="exampleSelect" sm={6}>
                             Run at*
                           </Label>
                           <Col>
                            <Input disabled={this.state.pageloadingStatus} type="select" name="runat" value={this.state.runAt}>
                            <option>SELENIUM GRID</option>
				                  	</Input>
                          </Col>
                        </FormGroup>
                      <FormGroup col>
                        <Label >
                          Screen Emulation*
                         </Label>
                         <Col >
                           <Input disabled={this.state.pageloadingStatus}  type="select" name="screenEmulation" value={this.state.defaultEmulator} onChange={this.UpdateDefaultEmulation.bind(this)}>
				                  	<option>Web</option>
                            <option>Mobile</option>
					                  </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup col>
                        <Label >
                          Screen Name*
                         </Label>
                         <Col >
                           <Input disabled={this.state.pageloadingStatus}  type="select" name="screenName" value={this.state.defaltScreenName} onChange={this.selectdefaultScreen.bind(this)}>
                           <GetKeys options={this.state.allDefaultScreen} />
					                  </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup col>
                        <Label >
                          Execution Nature*
                         </Label>
                         <Col >
                           <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkExecutionNature} type="select" name="executionNature" value={this.state.ExecutionNature} onChange={this.UpdateExecutionNature.bind(this)}>
                           <option></option>
				                  	<option>Debugging</option>
                            <option>Functional</option>
					                  </Input>
                            <FormFeedback>
                              {this.state.feedbackExecutionNature}
                            </FormFeedback>
                        </Col>
                      </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
		<Col lg={5} md={6} sm={6} xs={12}>
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
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkFromEmai}  value={this.state.FromEmail} onChange={this.UpdateFromEmail.bind(this)} type="input" name="fromemail" placeholder="enter your Email Address"/>
                  </Col>
                </FormGroup>{' '}
				      <FormGroup col>
			        	<Label for="exampleSelect" sm={5}>
                    Password
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkPassword} type="password" value={this.state.FromPassword} onChange={this.UpdatePassword.bind(this)} name="fromPassword" placeholder="enter your Password"/>
                  </Col>
                </FormGroup>{' '}
				      <FormGroup col>
				        <Label for="exampleSelect" sm={5}>
                    Receiver Email
                  </Label>
                 <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkRecemail} type="input" value={this.state.ReceiverEmail} onChange={this.UpdateRecieverEmail.bind(this)} name="receiveremail" placeholder="enter your Receiver email"/>
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
            <CardHeader>Executable Test Scripts
            <Button disabled={this.state.pageloadingStatus} onClick={this.LoadallTestscripts.bind(this)} name ="loadTestSuite" color="primary">Load Test Scripts</Button>
            <Button disabled={this.state.pageloadingStatus} onClick={this.ExecuteTestScripts.bind(this)} name ="executeTC" color="primary">Execute Test Scripts</Button>
             <div  style={{visibility: this.state.showProgressText ? 'visible' : 'hidden' }} className="text-center">{this.state.totalexecutedTestcasen} of {this.state.selected.length}</div>
              <Loader 
                type="ThreeDots"
                color="#00BFFF"
                height={30}
                width={100}
                timeout={120000} //3 secs
                visible = {this.state.loaderLoadTestScripts}
              />
              <Progress style={{visibility: this.state.showProgressBar ? 'visible' : 'hidden' }} value= {this.state.totalexecutedTestcasen} max={this.state.selected.length} />
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