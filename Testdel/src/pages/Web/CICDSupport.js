import Page from 'components/Page';
import React from 'react';
import CICDImage from 'assets/img/bg/CICDTool.JPG';
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
import genericHelper from '../funcLibraries/GenericHelper.js';
var APIBasePath= window.ENV.APIURL;

function Options({ options }) {
  return (
      options.map(option => 
                  <option key={option.Environment}>                                   
                  {option.Environment}
                  </option>)
                 );
}
function GetAllCDCDSuite({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{options[key]}</option>)
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
          this.setState({RegressionENV:this.state.ConfigurationFile.DefaultEnvironment});
          this.setState({RegressionBrowser:this.state.ConfigurationFile.DefaultBrowser});
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
          const Req3 = async () => 
          {
            const Req3 = await fetch(APIBasePath+'testcase/0')
            const Response3 = await Req3.json();
            this.setState({allModuleName:Response3});
            const Req2 = async () => 
            {
              const Req2 = await fetch(APIBasePath+'execution')
              const Response2 = await Req2.json();
              this.setState({testSuiteResponce:Response2});
              const Req4 = async () => 
              {
                const Req4 = await fetch(APIBasePath+'cicd')
                const Response4 = await Req4.json();
                this.setState({allCICDSuite:Response4});
                this.setState({loader:false})
                this.setState({pageloadingStatus:false});
              }
              Req4();
            }
            Req2();
          }
          Req3();
          
      }
    }
    GetLoaderData();
    
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

    var apiURL= APIBasePath+'cicd/'+env+'/'+browser+'/'+CICDSuite+'/'+APIBasePath;
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
    var apiURL= APIBasePath+'cicd/'+env+'/'+browser+'/'+CICDSuite+'/'+APIBasePath;
    this.setState({cicdAPI:apiURL})
  }
  updateAPITestSuite(event)
  {
    var CICDSuite = event.target.value;
    this.setState({apiTestSuiteName : CICDSuite})
    if(CICDSuite.trim()==="")
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
    var browser = this.state.RegressionBrowser;
    if(browser.trim()==="")
    {
      this.setState({cicdAPI:''})
      return;
    }
    var emulation = this.state.defaultEmulator;
    var screen = this.state.defaltScreenName;
    var width = this.state.screenwidth;
    var hight = this.state.screenhight;
    var apiURL= APIBasePath+'cicd/'+env+'/'+browser+'/'+CICDSuite+'/'+emulation+'/'+screen+'/'+width+'/'+hight;
    this.setState({cicdAPI:apiURL})

  }
  
  LoadallTestscripts()
  {
    this.setState({loaderLoadTestScripts:true});
    console.log(this.state.allModuleName)
    var ModuleName = genericHelper.common_GetListvalueFromJsonResponce(this.state.allModuleName)
    this.setState({allModule:ModuleName});
    var jstestStepData={};
    let allitem = []
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
        allList.push({id:stepid,moduleName:allitem[i-1],testid:modulewise[j-1].TestID,testcasename:modulewise[j-1].TestName})
      }
    }
    this.setState({testSuiteData:allList});
    this.setState({selected:[]});
    this.setState({loaderLoadTestScripts:false});
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
        }
        else
        {
          this.setState({checkFromEmai:false})
        }
        if(FEmailPassword.trim()==="")
        {
          Message=Message+"Password";
          this.setState({checkPassword:true})
        }
        else
        {
          this.setState({checkPassword:false})
        }
        if(REmailAddress.trim()==="")
        {
          Message= Message+"Reciever Email Address";
          this.setState({checkRecemail:true})
        }
        else
        {
          this.setState({checkRecemail:false})
        }
        if(Message.trim()!=='')
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
     var TestSuiteAPI =APIBasePath+'cicd/'+testSuiteName;
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
  updateRegressionSuite(event)
  {
    var runTimeModule = event;
    var prevValue = this.state.NewTestSuite;
    if(runTimeModule===prevValue)
    {
      return;
    }
    this.setState({NewTestSuite : runTimeModule})
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
        const Reqest1 = await fetch(APIBasePath+'cicd/'+runTimeModule)
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
        //var jstestStepData={};
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
      this.setState({checkFromEmai:false})
      this.setState({checkPassword:false})
      this.setState({checkRecemail:false})
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
            <CardHeader>Regression Suite</CardHeader>
              <CardBody>
                <Form >
                <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Environment*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="envlist" value={this.state.RegressionENV} onChange={this.updateRegressionENV.bind(this)}>
					            <Options options={this.state.CommonTestData} />
					          </Input>
                  </Col>
                </FormGroup>
                <FormGroup col>
                    <Label for="exampleSelect" sm={6}>
                      Browser*
                    </Label>
                    <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="browser" value={this.state.RegressionBrowser} onChange={this.updateRegressionBrowser.bind(this)}>
					              <option>CHROME</option>
                        <option>FIREFOX</option>
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
                           <GetAllCDCDSuite options={this.state.allDefaultScreen} />
					                  </Input>
                        </Col>
                      </FormGroup>
                  <FormGroup col>
				            <Label for="exampleSelect" sm={6}>
                      Execution Suite Name*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} type="select" name="testsuitename" value={this.state.apiTestSuiteName} onChange={this.updateAPITestSuite.bind(this)}>
                      <option></option>
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
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkFromEmai} type="input" value={this.state.FromEmail} onChange={this.UpdateFromEmail.bind(this)}  name="fromemail" placeholder="enter your Email Address"/>
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
