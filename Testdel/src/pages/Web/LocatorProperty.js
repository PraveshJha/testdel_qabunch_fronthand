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

function GetAllLocatorProperty({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{options[key]}</option>)
  );
  
}

class LocatorProperty extends React.Component{
  constructor(props){
    super(props);
    this.state=
    {
        initialLocatorName:'',
        initialLocatorValue:'',
        finalLocatorName:'',
        finalLocatorValue:'',
        checkILocatorName:false,
        checkILocatorValue:false,
        checkFLocatorName:false,
        checkFLocatorValue:false,
        modalValidationText:'',
        listOfLocator:[],
        loader:false,
        pageloadingStatus :false,

    }

    
  }
  SelectILocatorName(event)
  {
    
    this.setState({listOfLocator:[]});
    this.setState({initialLocatorName: event.target.value})
    this.setState({initialLocatorValue: ''})
    this.setState({checkILocatorName:false})
    var ORAPI =APIBasePath+'or/'+event.target.value+'/0';
    const ORRequest = async () => 
    {
      this.setState({loader:true})
      this.setState({pageloadingStatus:true});
      const ORResponse = await fetch(ORAPI);
      const ORJson = await ORResponse.json();
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      if(ORJson.success)
      {
        this.setState({listOfLocator:ORJson.locatorlist});
      }
      
    }
    ORRequest();

  }

  SelectILocatorValue(event)
  {
    this.setState({initialLocatorValue: event.target.value})
    this.setState({checkILocatorValue:false})
  }

  SelectFLocatorName(event)
  {
    this.setState({finalLocatorName: event.target.value})
    this.setState({checkFLocatorName:false})
  }

  SelectFLocatorValue(event)
  {
    this.setState({finalLocatorValue: event.target.value})
    this.setState({checkFLocatorValue:false})
  }

  SaveLocatorProperty()
  {
    var ExceptionMessage ='';
    var ILName= this.state.initialLocatorName
    var ILValue= this.state.initialLocatorValue
    var FLName= this.state.finalLocatorName
    var FLValue= this.state.finalLocatorValue
    if(ILName.trim()==="")
    {
      this.setState({checkILocatorName:true})
      ExceptionMessage= ExceptionMessage+ 'Initial Locator Name* can not be left blank.'
    }
    if(ILValue.trim()==="")
    {
      this.setState({checkILocatorValue:true})
      ExceptionMessage= ExceptionMessage+ 'Initial Locator value* can not be left blank.'
    }
    if(FLName.trim()==="")
    {
      this.setState({checkFLocatorName:true})
      ExceptionMessage= ExceptionMessage+ 'Updated Locator Name* can not be left blank.'
    }
    if(FLValue.trim()==="")
    {
      this.setState({checkFLocatorValue:true})
      ExceptionMessage= ExceptionMessage+ 'Updated Locator value* can not be left blank.'
    }
    if(ExceptionMessage.trim() !=="")
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:ExceptionMessage})
    }
    if(ILName.trim()===FLName.trim() & ILValue.trim()===FLValue.trim())
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:'No Changes to Save'})
    }
    this.setState({loader:true})
    var ORTestStepData={};
    var ORItem={};
    ORTestStepData["oldName"]=ILName;
    ORTestStepData["oldValue"]=ILValue;
    ORTestStepData["newName"]=FLName;
		ORTestStepData["newValue"]=FLValue;
		ORItem[0]=ORTestStepData;
    var ORjson = genericHelper.common_ChangeJsoncontentforServer(ORItem)
    var ORAPI =APIBasePath+'or';
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(ORjson)
    };
    const ORRequest = async () => 
    {
      this.setState({pageloadingStatus:true});
      const ORResponse = await fetch(ORAPI,requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      if(ORJson.success)
      {
        this.state.initialLocatorName='';
        this.state.initialLocatorValue='';
        this.state.finalLocatorName='';
        this.state.finalLocatorValue='';
        this.setState({modal:true})
        this.setState({modalValidationText:ORJson.servermessage})
      }
      else
      {
        this.setState({modal:true})
        this.setState({modalValidationText:ORJson.servermessage})
      }
      
      
    }
    ORRequest();
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
  return (
    <Page title="Locator Property" breadcrumbs={[{ name: 'Locator Property', active: true }]}>
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
            <CardHeader>Initial Locator Property</CardHeader>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Locator*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkILocatorName} value={this.state.initialLocatorName} type="select" name="IlocatorName" onChange={this.SelectILocatorName.bind(this)}>
					            <option selected="selected">{this.state.initialLocatorName}</option>
					            <option>Id</option>
                      <option>Name</option>
                      <option>ClassName</option>
                      <option>XPath</option>
                      <option>LinkText</option>
					            <option>PartialLinkText</option>
					            <option>TagName</option>
					            <option>CssSelector</option>
					          </Input>
                  </Col>
                </FormGroup>
				      <FormGroup row>
                <Label for="exampleSelect" sm={4}>
                  Locator Property*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus}  invalid={this.state.checkILocatorValue}  value={this.state.initialLocatorValue} type="select" name="ILocatorValue" onChange={this.SelectILocatorValue.bind(this)}>
                    <option selected="selected">{this.state.initialLocatorValue}</option>
                    <GetAllLocatorProperty options={this.state.listOfLocator} />
                    </Input>
                  </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
		    <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Updated Locator Property
            <Button disabled={this.state.pageloadingStatus} onClick={this.SaveLocatorProperty.bind(this)} color="primary" name ="SaveLocatorProperty">Save</Button>
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle()}
                className={this.props.className}>
                <ModalHeader  toggle={this.toggle()}> Information</ModalHeader>
                <ModalBody >
                  {this.state.modalValidationText}
                </ModalBody>
                <ModalFooter>
                  <Button disabled={this.state.pageloadingStatus}  color="secondary" onClick={this.toggle()}>
                    OK
                  </Button>
                </ModalFooter>
              </Modal>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Locator*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkFLocatorName} value={this.state.finalLocatorName} type="select" name="Flocator" onChange={this.SelectFLocatorName.bind(this)}>
					            <option selected="selected">{this.state.finalLocatorName}</option>
				            	<option>Id</option>
                      <option>Name</option>
                      <option>ClassName</option>
                      <option>XPath</option>
                      <option>LinkText</option>
					            <option>PartialLinkText</option>
					            <option>TagName</option>
					            <option>CssSelector</option>
				      	    </Input>
                  </Col>
                </FormGroup>
			     	  <FormGroup row>
                <Label for="exampleSelect" sm={4}>
                  Locator Property*
                </Label>
                <Col>
                  <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkFLocatorValue} type="input" value={this.state.finalLocatorValue} name="updatedvalue" placeholder="Enter Updated Property" onChange={this.SelectFLocatorValue.bind(this)}/>
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

export default LocatorProperty;
