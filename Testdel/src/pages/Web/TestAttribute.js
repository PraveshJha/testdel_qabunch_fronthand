import Page from 'components/Page';
import React from 'react';
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
var APIBasePath= window.ENV.APIURL;


function GetAllModule({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{options[key]}</option>)
  );
  
}
class TestAttribute extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      ModuleModuleName:'',
      NewModuleName:'',
      allModuleName: [],
      ModuleName:'',
      TestID: [],
      TestCaseID:'',
      testCaseName:'',
      NewTestID:'',
      modal: false,
      modalValidationText:'',
      newmoduleNameCheck: false,
      existingModuleName:false,
      testAttributeModuleNameCheck:false,
      testAttributeTestIDcheck:false,
      testAttributeNewTestIDcheck:false,
      testAttributeNewTestCaseName:false,
      postResponceresult:[],
      loader:true,
      pageloadingStatus :false,

    }
    const Req1 = async () => 
    {
      this.setState({pageloadingStatus:true});
      const Request1 = await fetch(APIBasePath+'testcase/0')
      const Response1 = await Request1.json();
      this.setState({allModuleName:Response1})
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
    }
    Req1();


    
  }

  SelectModule(event){
    
    this.setState({ModuleModuleName : event.target.value})
    this.setState({existingModuleName:false})
    

    }
    UpdateModuleName(event){
      
      this.setState({NewModuleName : event.target.value})
      this.setState({newmoduleNameCheck:false})
      
      }

      UpdateNewTestCaseID(event){
        
        this.setState({NewTestID : event.target.value})
        this.setState({testAttributeNewTestIDcheck:false})
        
        }
        UpdateNewTestCaseName(event){
          
          this.setState({testCaseName : event.target.value})
          this.setState({testAttributeNewTestCaseName:false})
          
          }

  updateModule(event){
    
    this.setState({TestID : ''})
    this.setState({TestCaseID : ''})
    this.setState({NewTestID : ''})
    this.setState({testCaseName : ''})
    this.setState({ModuleName : event.target.value})
    this.setState({loader : true})

    const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'testcase/'+event.target.value)
        const Response1 = await Req1.json();
        this.setState({TestID:Response1})
        this.setState({testAttributeModuleNameCheck:false})
        this.setState({loader:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();
    }
    updateTestID(event){
      
      this.setState({TestCaseName : ''})
      this.setState({NewTestID : event.target.value})
      this.setState({TestCaseID : event.target.value})
      this.setState({loader : true})

      const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'testcase/'+this.state.ModuleName+'/'+event.target.value)
        const Response1 = await Req1.json();
        this.setState({testCaseName:Response1.TestCaseName})
        this.setState({testAttributeTestIDcheck:false})
        this.setState({testAttributeNewTestIDcheck:false})
        this.setState({testAttributeNewTestCaseName:false})
        this.setState({loader:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();
    }
  SaveModuleName()
  {
    this.setState({existingModuleName:false})
    this.setState({newmoduleNameCheck:false})
    this.setState({postResponceresult:''})
    var oldName = this.state.ModuleModuleName;
    var NewName = this.state.NewModuleName;
    var ExceptionMessage ='';
    if(oldName.trim()==="")
    {
      this.setState({existingModuleName:true})
      ExceptionMessage= ExceptionMessage+ 'Module name can not be left blank.'
    }
    if(NewName.trim()==="")
    {
      this.setState({newmoduleNameCheck:true})
      ExceptionMessage= ExceptionMessage+ 'New Module name can not be left blank.'
    }
    if(ExceptionMessage.trim() !=="")
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:ExceptionMessage})
    }
    var duplicatecheck = genericHelper.common_CheckValueFromJson(this.state.allModuleName,NewName)
    if(duplicatecheck)
    {
      this.setState({modal:true})
      this.setState({newmoduleNameCheck:true})
      return this.setState({modalValidationText:'New Module name is already exist.'})
    }
    else
    {
      this.setState({loader:true})
      this.setState({pageloadingStatus:true});
      var  testdata=genericHelper.common_ChangeJsoncontentforServer({newModuleName:NewName});
      var requestOptions = 
      {
        method: 'POST',
        headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(testdata)
      };
      const Req1 = async () => 
      {
        console.log(APIBasePath+'testcase/'+oldName);
        const Request1 = await fetch(APIBasePath+'testcase/'+oldName,requestOptions)
        const Response1 = await Request1.json();
        this.setState({postResponceresult:Response1})
        if(Response1.success)
        {
          const Req2 = async () => 
          {
            const Request2 = await fetch(APIBasePath+'testcase/0')
            const Response2 = await Request2.json();
            this.setState({allModuleName:Response2})
            this.setState({ModuleModuleName:''})
            this.setState({NewModuleName:''})
            const Req3 = async () => 
            {
              		//@ Add Test Data Information in Test Suite
                var TestSuiteJsonData={};
                TestSuiteJsonData["oldModuleName"]= oldName;
                TestSuiteJsonData["NewModuleName"]= NewName;
                var json = genericHelper.common_ChangeJsoncontentforServer(TestSuiteJsonData);
                requestOptions = 
                {
                  method: 'POST',
                  headers: {"Accept": "*/*",'Content-type': 'application/json'},
                  body: JSON.stringify(json)
                };
              const Request3 = await fetch(APIBasePath+'cicd/'+oldName+'/'+NewName,requestOptions)
              const Response3 = await Request3.json();
              this.setState({loader:false})
              this.setState({pageloadingStatus:false});
              this.setState({modal:true})
              if(Response3.success)
              {
                return this.setState({modalValidationText:this.state.postResponceresult.servermessage})
              }
              else
              {
                return this.setState({modalValidationText:Response3.servermessage})
              }
              
            }
            Req3();
            
          }
          Req2();
        }
        else
        {
          this.setState({pageloadingStatus:false});
          this.setState({loader:false});
          this.setState({modal:true})
          return this.setState({modalValidationText:'ISSUE:'+this.state.postResponceresult.servermessage})
        }
      }
      Req1();


  }
   
  }
  SaveTestAttribute()
  {
    var ExceptionMessage ='';
    var testAttributeModule= this.state.ModuleName
    var testAttributeTestID= this.state.TestCaseID
    var testAttributeNewTestID= this.state.NewTestID
    var testAttributeName = this.state.testCaseName
    if(testAttributeModule.trim()==="")
    {
      this.setState({testAttributeModuleNameCheck:true})
      ExceptionMessage= ExceptionMessage+ 'Module* can not be left blank.'
    }
    if(testAttributeTestID.trim()==="")
    {
      this.setState({testAttributeTestIDcheck:true})
      ExceptionMessage= ExceptionMessage+ 'TestID* can not be left blank.'
    }
    if(testAttributeNewTestID.trim()==="")
    {
      this.setState({testAttributeNewTestIDcheck:true})
      ExceptionMessage= ExceptionMessage+ 'New TestID* can not be left blank.'
    }
    if(testAttributeName.trim()==="")
    {
      this.setState({testAttributeNewTestCaseName:true})
      ExceptionMessage= ExceptionMessage+ 'New Test Case Name* can not be left blank.'
    }
    if(ExceptionMessage.trim() !=="")
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:ExceptionMessage})
    }
    if(testAttributeTestID !==testAttributeNewTestID)
    {
      var duplicatecheck = genericHelper.common_CheckValueFromJson(this.state.TestID,testAttributeNewTestID)
      if(duplicatecheck)
      {
        this.setState({modal:true})
        this.setState({testAttributeNewTestIDcheck:true})
        return this.setState({modalValidationText:'New TestID* is already exist.'})
      }
    }
    this.setState({loader:true})
      var  testdata=genericHelper.common_ChangeJsoncontentforServer({newTestID:testAttributeNewTestID,newTestCaseName:testAttributeName});
      var requestOptions = {
        method: 'POST',
        headers: {"Accept": "*/*",'Content-type': 'application/json'},
       body: JSON.stringify(testdata)
    };

    const Request1 = async () => 
    {
      this.setState({pageloadingStatus:true});
      const Req1 = await fetch(APIBasePath+'testcase/'+testAttributeModule+'/'+testAttributeTestID,requestOptions)
      const Response1 = await Req1.json();
      if(Response1.success)
      {
          this.setState({ModuleName:''})
          this.setState({TestCaseID:''})
          this.setState({NewTestID:''})
          this.setState({testCaseName:''})
          const Request2 = async () => 
          {
             		//@ Add Test Data Information in Test Suite
            var TestSuiteJsonData={};
            TestSuiteJsonData["modulename"]= testAttributeModule;
            TestSuiteJsonData["testid"]= testAttributeTestID;
            TestSuiteJsonData["newtestid"]= testAttributeNewTestID;
            TestSuiteJsonData["newtestcaseName"]= testAttributeName;
            var json = genericHelper.common_ChangeJsoncontentforServer(TestSuiteJsonData);
            requestOptions = 
            {
              method: 'POST',
              headers: {"Accept": "*/*",'Content-type': 'application/json'},
              body: JSON.stringify(json)
            };
            const Req2 = await fetch(APIBasePath+'cicd/'+testAttributeModule+'/'+testAttributeTestID+'/'+testAttributeNewTestID+'/'+testAttributeName,requestOptions)
            const Response2 = await Req2.json();
            this.setState({loader:false})
            this.setState({pageloadingStatus:false});
            if(Response2.success)
            {
                this.setState({modal:true})
                return this.setState({modalValidationText:Response1.servermessage})
            }
            else
            {
              this.setState({modal:true})
              return this.setState({modalValidationText:'ISSUE: '+Response2.servermessage})
            }
          }
          Request2();
      }
      else
      {
        this.setState({loader:false})
        this.setState({pageloadingStatus:false});
        this.setState({modal:true})
        return this.setState({modalValidationText:'ISSUE: '+Response1.servermessage})
      }
    }
    Request1();

   
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

  var {allModuleName,TestID} = this.state;

  return (
    <Page title="Test Attribute" breadcrumbs={[{ name: 'Test Attribute', active: true }]}>
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
            <CardHeader>Update Module Name</CardHeader>
            <CardBody>
              <Form>
                <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Module*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.existingModuleName} type="select" name="module"  value={this.state.ModuleModuleName} onChange={this.SelectModule.bind(this)}>
                    <option selected="selected">{this.state.ModuleModuleName}</option>
                     <GetAllModule options={allModuleName} />
					          </Input>
                  </Col>
                </FormGroup>
				          <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    New Module Name*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.newmoduleNameCheck} type="input" name="newmoduleName" placeholder="enter new module name" value={this.state.NewModuleName} onChange={this.UpdateModuleName.bind(this)}>
					          </Input>
                  </Col>
                </FormGroup>
				         <FormGroup col>
                  <Col >
					          <Button disabled={this.state.pageloadingStatus} onClick={this.SaveModuleName.bind(this)} color="primary">Update Module Name
                    </Button>
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
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
		 <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Update TestID/Test Case Name</CardHeader>
            <CardBody>
              <Form>
                <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Module*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.testAttributeModuleNameCheck} type="select" name="moduleforTestUpdate" value={this.state.ModuleName} onChange={this.updateModule.bind(this)}>
                    <option selected="selected">{this.state.ModuleName}</option>
                    <GetAllModule options={allModuleName} />
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    TestID*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.testAttributeTestIDcheck} type="select" name="testID" value={this.state.TestCaseID} onChange={this.updateTestID.bind(this)}>
				            	<option selected="selected">{this.state.TestCaseID}</option>
                      <GetAllModule options={TestID} />
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    New TestID*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="input" invalid={this.state.testAttributeNewTestIDcheck} name="newtestcaseid" placeholder="enter new test case ID"  value={this.state.NewTestID} onChange={this.UpdateNewTestCaseID.bind(this)}>
					           </Input>
                  </Col>
                </FormGroup>
				        <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    New Test Case Name*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="input" invalid={this.state.testAttributeNewTestCaseName} name="testcasename" placeholder="enter new test case name"  value={this.state.testCaseName} onChange={this.UpdateNewTestCaseName.bind(this)}>
					         </Input>
                  </Col>
                </FormGroup>
			          	<FormGroup col>
                  <Col >
					         <Button disabled={this.state.pageloadingStatus} onClick={this.SaveTestAttribute.bind(this)} color="primary">Update Test Attribute</Button>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  );
  }
};

export default TestAttribute;
