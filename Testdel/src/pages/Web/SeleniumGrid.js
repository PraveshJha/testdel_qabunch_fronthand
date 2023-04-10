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
  FormFeedback,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
var APIBasePath= window.ENV.APIURL;


class SeleniumGrid extends React.Component{

  constructor(props){
    super(props);
    this.state=
    {
        hubHubName:'',
        checkHubName:false,
        feedbackHubName:'',
        hubPort:'',
        checkHubPort:false,
        feedbackHubPort:'',
        NodeHubName:'',
        checkNodeHubName:false,
        feedbackNodeHubName:'',
        NodehubPort:'',
        checkNodeHubPort:false,
        feedbackNodeHubPort:'',
        NodeNodeMachine:'',
        checkNodeNodeName:false,
        feedbackNodeNodeName:'',
        NodeNodePort:'5555',
        checkNodeNodePort:false,
        feedbackNodeNodePort:'',
        maxsession:5,
        Chromemaxsession:5,
        Firefoxmaxsession:5,
        ConfigurationFile:[],
        loader:true,
        pageloadingStatus :false,
    }
    const GetLoaderData = async () => 
    {
      this.setState({pageloadingStatus:true});
      const homepage = await fetch(APIBasePath+'dashboard');
      const homepageResponse = await homepage.json();
      this.setState({pageloadingStatus:false});
      if(homepageResponse.success)
      {
          this.setState({ConfigurationFile:homepageResponse.Configuration});
          this.setState({hubHubName:this.state.ConfigurationFile.HUBMachineName});
          this.setState({hubPort:this.state.ConfigurationFile.HUBPort});
          this.setState({NodeHubName:this.state.ConfigurationFile.HUBMachineName});
          this.setState({NodeHubName:this.state.ConfigurationFile.HUBMachineName});
          this.setState({NodehubPort:this.state.ConfigurationFile.HUBPort});
          this.setState({NodeNodeMachine:this.state.ConfigurationFile.HUBMachineName});
          this.setState({loader:false})
      }
    }
    GetLoaderData();
    
  }

  CheckHubStatus()
  {
      var ExceptionMessage='';
      var hubName = this.state.hubHubName;
      var hubPort = this.state.hubPort;
      if(hubName.trim()==="")
      {
       this.setState({checkHubName:true})
       this.setState({feedbackHubName:'Hub Machine IP* can not be blank'})
       ExceptionMessage= ExceptionMessage+ 'Hub Machine IP* can not be blank'
      }
      if(isNaN(hubPort))
      {
       this.setState({checkHubPort:true})
       this.setState({feedbackHubPort:'Port Number* takes only numeric value.'})
       ExceptionMessage= ExceptionMessage+ 'Port Number* takes only numeric value..'
      }
      if(hubPort.trim()==="")
      {
       this.setState({checkHubPort:true})
       this.setState({feedbackHubPort:'Port Number* can not be blank'})
       ExceptionMessage= ExceptionMessage+ 'Port Number* can not be blank'
      }
      if(ExceptionMessage.trim() !=="")
      {
        return ;
      }
      this.setState({loader:true})
      var hubAPI =APIBasePath+'segrid/'+hubName+'/'+hubPort;
      const HubCheckRequest = async () => 
      {
        this.setState({pageloadingStatus:true});
        const ORResponse = await fetch(hubAPI);
        const ORJson = await ORResponse.json();
        this.setState({pageloadingStatus:false});
        this.setState({loader:false})
        this.setState({modal:true})
        this.setState({modalValidationText:ORJson.servermessage})
        
        
      }
      HubCheckRequest();
  }
  HubRegitration()
  {
    var ExceptionMessage='';
    var hubName = this.state.hubHubName;
    var hubPort = this.state.hubPort;
    if(hubName.trim()==="")
    {
     this.setState({checkHubName:true})
     this.setState({feedbackHubName:'Hub Machine IP* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Hub Machine IP* can not be blank'
    }
    if(isNaN(hubPort))
    {
     this.setState({checkHubPort:true})
     this.setState({feedbackHubPort:'Port Number* takes only numeric value.'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* takes only numeric value..'
    }
    if(hubPort.trim()==="")
    {
     this.setState({checkHubPort:true})
     this.setState({feedbackHubPort:'Port Number* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* can not be blank'
    }
    if(ExceptionMessage.trim() !=="")
    {
      return ;
    }
    this.setState({loader:true})
    var ORjson = genericHelper.common_ChangeJsoncontentforServer({HubName:hubName,HubPort:hubPort})
		var ORAPI =APIBasePath+'segrid';
		var requestOptions = {
		  method: 'POST',
		  headers: {"Accept": "*/*",'Content-type': 'application/json'},
		  body: JSON.stringify(ORjson)
		};
		const HubRegistrationRequest = async () => 
		{
      this.setState({pageloadingStatus:true});
		  const ORResponse = await fetch(ORAPI,requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({pageloadingStatus:false});
      this.setState({loader:false})
		  this.setState({modal:true})
			this.setState({modalValidationText:ORJson.servermessage})
		  
		}
		HubRegistrationRequest();
  }
  CheckNodeStatus()
  {
    var ExceptionMessage='';
    var hubName = this.state.NodeHubName;
    var hubPort = this.state.NodehubPort;
    var NodeName = this.state.NodeNodeMachine;
    var NodePort = this.state.NodeNodePort;
    if(hubName.trim()==="")
    {
     this.setState({checkNodeHubName:true})
     this.setState({feedbackNodeHubName:'Hub Machine IP* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Hub Machine IP* can not be blank'
    }
    if(isNaN(hubPort))
    {
     this.setState({checkNodeHubPort:true})
     this.setState({feedbackNodeHubPort:'Port Number* takes only numeric value.'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* takes only numeric value..'
    }
    if(hubPort.trim()==="")
    {
     this.setState({checkNodeHubPort:true})
     this.setState({feedbackNodeHubPort:'Port Number* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* can not be blank'
    }
    if(NodeName.trim()==="")
    {
     this.setState({checkNodeNodeName:true})
     this.setState({feedbackNodeNodeName:'Node Machine IP* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Node Machine IP* can not be blank'
    }
    if(isNaN(NodePort))
    {
     this.setState({checkNodeNodePort:true})
     this.setState({feedbackNodeNodePort:'Port Number* takes only numeric value.'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* takes only numeric value..'
    }
    if(NodePort.trim()==="")
    {
     this.setState({checkNodeNodePort:true})
     this.setState({feedbackNodeNodePort:'Port Number* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* can not be blank'
    }
    if(ExceptionMessage.trim() !=="")
    {
      return ;
    }
    this.setState({loader:true})
    var hubAPI =APIBasePath+'segrid/'+hubName+'/'+hubPort+'/'+NodeName+'/'+NodePort;
    const NodeCheckRequest = async () => 
    {
      this.setState({pageloadingStatus:true});
      const ORResponse = await fetch(hubAPI);
      const ORJson = await ORResponse.json();
      this.setState({pageloadingStatus:false});
      if(ORJson)
      {
        this.setState({loader:false})
        this.setState({modal:true})
        this.setState({modalValidationText:ORJson.servermessage})
        window.open('http://'+hubName+':'+hubPort+'/grid/console');
        
      }
      else
      {
        this.setState({loader:false})
        this.setState({modal:true})
        this.setState({modalValidationText:ORJson.servermessage})
      }
      
      
    }
    NodeCheckRequest();
  }
  NodeRegitration()
  {
    var ExceptionMessage='';
    var hubName = this.state.NodeHubName;
    var hubPort = this.state.NodehubPort;
    var NodeName = this.state.NodeNodeMachine;
    var NodePort = this.state.NodeNodePort;
    var MaxInstance = this.state.maxsession;
    var BwChrome = this.state.Chromemaxsession;
    var BwFirefox = this.state.Firefoxmaxsession;
    if(hubName.trim()==="")
    {
     this.setState({checkNodeHubName:true})
     this.setState({feedbackNodeHubName:'Hub Machine IP* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Hub Machine IP* can not be blank'
    }
    if(isNaN(hubPort))
    {
     this.setState({checkNodeHubPort:true})
     this.setState({feedbackNodeHubPort:'Port Number* takes only numeric value.'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* takes only numeric value..'
    }
    if(hubPort.trim()==="")
    {
     this.setState({checkNodeHubPort:true})
     this.setState({feedbackNodeHubPort:'Port Number* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* can not be blank'
    }
    if(NodeName.trim()==="")
    {
     this.setState({checkNodeNodeName:true})
     this.setState({feedbackNodeNodeName:'Node Machine IP* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Node Machine IP* can not be blank'
    }
    if(isNaN(NodePort))
    {
     this.setState({checkNodeNodePort:true})
     this.setState({feedbackNodeNodePort:'Port Number* takes only numeric value.'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* takes only numeric value..'
    }
    if(NodePort.trim()==="")
    {
     this.setState({checkNodeNodePort:true})
     this.setState({feedbackNodeNodePort:'Port Number* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* can not be blank'
    }
    if(ExceptionMessage.trim() !=="")
    {
      return ;
    }
    this.setState({loader:true})
    var hubAPI =APIBasePath+'segrid/'+hubName+'/'+hubPort+'/'+NodeName+'/'+NodePort;
    const NodeCheckRequest = async () => 
    {
      this.setState({pageloadingStatus:true});
      const ORResponse = await fetch(hubAPI);
      const ORJson = await ORResponse.json();
      this.setState({pageloadingStatus:false});
      if(ORJson.success.toLowerCase()==='true')
      {
        this.setState({loader:false})
        this.setState({modal:true})
        this.setState({modalValidationText:ORJson.servermessage})
        window.open('http://'+hubName+':'+hubPort+'/grid/console');
        
      }
      else
      {
        //@ code for Post
        var hubaddress= 'http://'+hubName+':'+hubPort
        var ORjson = genericHelper.common_ChangeJsoncontentforServer({maxSession:MaxInstance,port:NodePort,hub:hubaddress,chromemaxInstances:BwChrome,firefoxmaxInstances:BwFirefox})
        var ORAPI =APIBasePath+'segrid/'+hubName+'/'+hubPort+'/'+NodeName+'/'+NodePort;
        var requestOptions = {
          method: 'POST',
          headers: {"Accept": "*/*",'Content-type': 'application/json'},
          body: JSON.stringify(ORjson)
        };
        const NodeRegistrationRequest = async () => 
        {
          this.setState({pageloadingStatus:true});
          const ORResponse = await fetch(ORAPI,requestOptions);
          const ORJson = await ORResponse.json();
          this.setState({pageloadingStatus:false});
          if(ORJson.success.toLowerCase()==='true')
          {
            this.setState({loader:false})
            window.open('http://'+hubName+':'+hubPort+'/grid/console');
            this.setState({modal:true})
            this.setState({modalValidationText:ORJson.servermessage})
           
          }
          else
          {
            this.setState({loader:false})
            this.setState({modal:true})
            this.setState({modalValidationText:ORJson.servermessage})
          }
          
          
        }
        NodeRegistrationRequest();
      }
      
      
    }
    NodeCheckRequest();
  }
  UpdateNodeMachine(event)
  {
    
    this.setState({checkNodeNodeName: false})
    this.setState({NodeNodeMachine: event.target.value})
    
  }

  updateChromeNodeMaxSession(event)
  {
    
    this.setState({Chromemaxsession: event.target.value})
    
  }
  updateFirefoxNodeMaxSession(event)
  {
    
    this.setState({Firefoxmaxsession: event.target.value})
    
  }
  updateNodeMaxSession(event)
  {
    
    this.setState({maxsession: event.target.value})
    
  }
  UpdateNodePort(event)
  {
    
    this.setState({checkNodeNodePort: false})
    this.setState({NodeNodePort: event.target.value})
    
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
    <Page title="Selenium Grid" breadcrumbs={[{ name: 'Selenium Grid', active: true }]}>
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
            <CardHeader>Hub Configuration</CardHeader>
              <CardBody>
                <Form >
                  <FormGroup row>
				            <Label for="exampleSelect">
                      Hub Machine IP*
                    </Label>
                    <Col >
                      <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkHubName}  value ={this.state.hubHubName} type="input" name="hubmachineName"  placeholder="Enter Hub Machine Name"/>
                      <FormFeedback>
                        {this.state.feedbackHubName}
                      </FormFeedback>
                    </Col>
                   </FormGroup>
                   <FormGroup row>
				            <Label for="exampleSelect">
                      Port Number*
                    </Label>
                    <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkHubPort} type="input" value ={this.state.hubPort} name="hubhubport" placeholder="Enter Port Number"/>
                      <FormFeedback>
                        {this.state.feedbackHubPort}
                      </FormFeedback>
                    </Col>
                  </FormGroup>
                <FormGroup row>
                  <Col>
                    <Button disabled={this.state.pageloadingStatus} onClick={this.CheckHubStatus.bind(this)} color="primary">Check Hub Status</Button>
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
                  <Col>
					          <Button disabled={this.state.pageloadingStatus} onClick={this.HubRegitration.bind(this)} color="primary">Hub Registration</Button>
                   </Col>
                  </FormGroup>
                </Form>
            </CardBody>
          </Card>
        </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <Card>
              <CardHeader>Node Configuration</CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
				              <Label for="exampleSelect">
                         Hub Machine IP*
                      </Label>
                      <Col >
                       <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkNodeHubName} value ={this.state.NodeHubName} type="input" name="nodeHubName" placeholder="Enter Hub Machine Name"/>
                       <FormFeedback>
                        {this.state.feedbackNodeHubName}
                       </FormFeedback>
                      </Col>
                    </FormGroup>
				            <FormGroup row>
				              <Label for="exampleSelect">
                        Port Number*
                       </Label>
                      <Col >
                        <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkNodeHubPort} value ={this.state.NodehubPort} type="input" name="nodeHubPort" placeholder="Enter Port Number"/>
                        <FormFeedback>
                        {this.state.feedbackNodeHubPort}
                        </FormFeedback>
                      </Col>
                    </FormGroup>
				            <FormGroup row>
				              <Label for="exampleSelect">
                        Node Machine IP*
                      </Label>
                      <Col >
                        <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkNodeNodeName} value ={this.state.NodeNodeMachine} type="input" name="nodename" placeholder="Enter Node Machine Name" />
                        <FormFeedback>
                         {this.state.feedbackNodeNodeName}
                        </FormFeedback>
                      </Col>
                    </FormGroup>
				            <FormGroup row>
				              <Label for="exampleSelect">
                        Port Number*
                      </Label>
                      <Col >
                        <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkNodeNodePort} value ={this.state.NodeNodePort} type="input" name="nodeport" placeholder="Enter Port Number" onChange={this.UpdateNodePort.bind(this)}/>
                        <FormFeedback>
                         {this.state.feedbackNodeNodePort}
                        </FormFeedback>
                      </Col>
                   </FormGroup>
                     <FormGroup row>
                        <Label for="exampleSelect">
                          Node Machine maxSession*
                         </Label>
                         <Col >
                           <Input disabled={this.state.pageloadingStatus} type="select" name="maxsession" value={this.state.maxsession} onChange={this.updateNodeMaxSession.bind(this)}>
				                  	<option>1</option>
                            <option>2</option>
				                  	<option>3</option>
                           <option>4</option>
					                 <option>5</option>
                           <option>6</option>
                           <option>7</option>
                           <option>8</option>
                           <option>9</option>
                           <option>10</option>
					                </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="exampleSelect">
                          Chrome maxInstances*
                         </Label>
                         <Col >
                           <Input disabled={this.state.pageloadingStatus} type="select" name="Chromemaxsession" value={this.state.Chromemaxsession} onChange={this.updateChromeNodeMaxSession.bind(this)}>
				                  	<option>1</option>
                            <option>2</option>
				                  	<option>3</option>
                           <option>4</option>
					                 <option>5</option>
                           <option>6</option>
                           <option>7</option>
                           <option>8</option>
                           <option>9</option>
                           <option>10</option>
					                </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="exampleSelect">
                          Firefox maxInstances*
                         </Label>
                         <Col >
                           <Input disabled={this.state.pageloadingStatus} type="select" name="Firefoxmaxsession" value={this.state.Firefoxmaxsession} onChange={this.updateFirefoxNodeMaxSession.bind(this)}>
				                  	<option>1</option>
                            <option>2</option>
				                  	<option>3</option>
                           <option>4</option>
					                 <option>5</option>
                           <option>6</option>
                           <option>7</option>
                           <option>8</option>
                           <option>9</option>
                           <option>10</option>
					                </Input>
                        </Col>
                      </FormGroup>
				          <FormGroup row>
				            <Col>
					            <Button disabled={this.state.pageloadingStatus} onClick={this.CheckNodeStatus.bind(this)} color="primary">Check Node Status</Button>
                    </Col>
                    <Col>
					            <Button disabled={this.state.pageloadingStatus} onClick={this.NodeRegitration.bind(this)} color="primary">Node Registration</Button>
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

export default SeleniumGrid;
