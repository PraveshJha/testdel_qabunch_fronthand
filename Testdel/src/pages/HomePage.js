import Page from 'components/Page';
import React from 'react';
import testscriptdev from 'assets/img/bg/testscriptdev.JPG';
import testexecution from 'assets/img/bg/testexecution.JPG';
import testmain from 'assets/img/bg/testmain.JPG';
import integration from 'assets/img/bg/integration.JPG';
import {
  Col,
  Row,
  CardImg,
} from 'reactstrap';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
var APIBasePath= window.ENV.APIURL;

class Configuration extends React.Component{

  constructor(props){
    super(props);
    this.state=
    {
       DefaultEnvironment : '',
       defaultBrowser : '',
       checkDashboardHistoryCount:false,
       feedbackDashboardHistoryCount:'',
       DashBoardHistoryCount:'',
       checkDashboardDays:false,
       feedbackDashboardDays:'',
       DashboardDays:'',
       HubMachineName:'',
       checkHubMachineName:false,
       feedbackHubMachineName:'',
       HubPortNumber:'',
       checkHubPort:false,
       feedbackHubPort:'',
       ConfigurationFile:[],
       CommonTestData:[],
       loader:true,
       RepotingHeaderName:'',
       ReportingHeaderColCode:'',
       ReportingSubHeaderColCode:'',
       feedbackReportingHeader:'',
       checkReportingHeader:false,
       checkHeaderColCode :false,
       feedbackHeaderColCode:'',
       checkSubHeaderColCode:false,
       feedbackSubHeaderColCode:'',
       checkSenderEmail:false,
       feedbackSenderEmailAddress:'',
       SenderEmailAddress:'',
       checkSenderPassword:false,
       feedbackSenderPassword:'',
       SenderPassword:'',
       checkReceiverEmail:false,
       ReceiverEmail:'',
       feedbackReceiverEmail:'',

    }
    const GetLoaderData = async () => 
    {
      const homepage = await fetch(APIBasePath+'dashboard');
      const homepageResponse = await homepage.json();
      if(homepageResponse.success)
      {
          this.setState({ConfigurationFile:homepageResponse.Configuration});
          this.setState({CommonTestData:homepageResponse.CommonTestData});
          this.setState({DefaultEnvironment : this.state.ConfigurationFile.DefaultEnvironment});
          this.setState({defaultBrowser : this.state.ConfigurationFile.DefaultBrowser});
          this.setState({DashBoardHistoryCount:this.state.ConfigurationFile.DashboardHistoryCount});
          this.setState({DashboardDays:this.state.ConfigurationFile.DashboardTotalDayCount});
          this.setState({HubMachineName:this.state.ConfigurationFile.HUBMachineName});
          this.setState({HubPortNumber:this.state.ConfigurationFile.HUBPort});
          this.setState({RepotingHeaderName:this.state.ConfigurationFile.ReportingHeaderName});
          this.setState({ReportingHeaderColCode:this.state.ConfigurationFile.HeaderColorCode});
          this.setState({ReportingSubHeaderColCode:this.state.ConfigurationFile.SubHeaderColorCode});
          this.setState({SenderEmailAddress:this.state.ConfigurationFile.SenderEmail});
          this.setState({SenderPassword:this.state.ConfigurationFile.SenderPassword});
          this.setState({ReceiverEmail:this.state.ConfigurationFile.ReceiverEmail});
          this.setState({loader:false});
      }
    }
    GetLoaderData();
    
  }
  UpdateEnv(event)
  {
    
    this.setState({DefaultEnvironment: event.target.value})
    
  }
  UpdateBrowser(event)
  {
    
    this.setState({defaultBrowser: event.target.value})
    
  }

  UpdateDashBoardHistoryCount(event)
  {
    
    this.setState({checkDashboardHistoryCount: false})
    this.setState({DashBoardHistoryCount: event.target.value})
    
  }

  UpdateHubMachineName(event)
  {
    
    this.setState({checkHubMachineName: false})
    this.setState({HubMachineName: event.target.value})
    
  }
  
  UpdateHubPort(event)
  {
    
    this.setState({checkHubPort: false})
    this.setState({HubPortNumber: event.target.value})
    
  }
  UpdateDashBoardDays(event)
  {
    
    this.setState({checkDashboardDays: false})
    this.setState({DashboardDays: event.target.value})
    
  }
  UpdateReportingHeaderName(event)
  {
    
    this.setState({checkReportingHeader: false})
    this.setState({feedbackReportingHeader: ''})
    this.setState({RepotingHeaderName: event.target.value})
  }

  UpdateHeaderColorCode(event)
  {
    
    this.setState({checkHeaderColCode: false})
    this.setState({feedbackHeaderColCode: ''})
    this.setState({ReportingHeaderColCode: event.target.value})
  }
  UpdateSubHeaderColorCode(event)
  {
    
    this.setState({checkSubHeaderColCode: false})
    this.setState({feedbackSubHeaderColCode: ''})
    this.setState({ReportingSubHeaderColCode: event.target.value})
  }

  UpdateSenderEmailAddress(event)
  {
    
    this.setState({checkSenderEmail: false})
    this.setState({feedbackSenderEmailAddress: ''})
    this.setState({SenderEmailAddress: event.target.value})
  }
  UpdateSenderPassword(event)
  {
    
    this.setState({checkSenderPassword: false})
    this.setState({feedbackSenderPassword: ''})
    this.setState({SenderPassword: event.target.value})
  }
  UpdateRecieverEmailAddress(event)
  {
    
    this.setState({checkReceiverEmail: false})
    this.setState({feedbackReceiverEmail: ''})
    this.setState({ReceiverEmail: event.target.value})
  }
  SaveConfig()
  {
     var env = this.state.DefaultEnvironment;
     var Browser = this.state.defaultBrowser;
     var HistoryCount = this.state.DashBoardHistoryCount;
     var DashboardDaycount = this.state.DashboardDays;
     var ExceptionMessage ='';
     if(isNaN(HistoryCount) || HistoryCount.trim()==="")
     {
      this.setState({checkDashboardHistoryCount:true})
      this.setState({feedbackDashboardHistoryCount:'Dashboard History Count* takes only numeric value.'})
      ExceptionMessage= ExceptionMessage+ 'Dashboard History Count* takes only numeric value..'
     }
     if(isNaN(DashboardDaycount) || DashboardDaycount.trim()==='')
     {
      this.setState({checkDashboardDays:true})
      this.setState({feedbackDashboardDays:'Dashboard Total Day Count* takes only numeric value.'})
      ExceptionMessage= ExceptionMessage+ 'Dashboard Total Day Count* takes only numeric value..'
     }
     if(ExceptionMessage.trim() !=="")
     {
      // this.setState({modal:true})
       return ;
     }
     this.setState({loader:true})
     var CommonJObject ={};
     CommonJObject["DefaultEnvironment"]=env;
     CommonJObject["DefaultBrowser"]=Browser;
     CommonJObject["DashboardHistoryCount"]=HistoryCount;
     CommonJObject["DashboardTotalDayCount"]=DashboardDaycount;

     var configjson = JSON.stringify(CommonJObject)
     var configAPI =APIBasePath+'configuration';
     var requestOptions = {
       method: 'POST',
      headers: {"Accept": "application/json; odata=verbose",'Content-type': 'application/x-www-form-urlencoded'},
       body: configjson
     };
     const configurationRequest = async () => 
     {
       const ORResponse = await fetch(configAPI,requestOptions);
       const ORJson = await ORResponse.json();
       this.setState({loader:false})
       this.setState({modal:true})
       this.setState({modalValidationText:ORJson.servermessage})
     }
     configurationRequest();

  }

  SaveHUBconfig()
  {
    var ExceptionMessage='';
    var hub = this.state.HubMachineName;
    var port = this.state.HubPortNumber;
    if(hub.trim()==="")
    {
     this.setState({checkHubMachineName:true})
     this.setState({feedbackHubMachineName:'Hub Machine Name* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Hub Machine Name* can not be blank'
    }
    if(isNaN(port))
    {
     this.setState({checkHubPort:true})
     this.setState({feedbackHubPort:'Port Number* takes only numeric value.'})
     ExceptionMessage= ExceptionMessage+ 'Port Number* takes only numeric value..'
    }
    if(port.trim()==="")
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
    var CommonJObject ={};
    CommonJObject["HUBMachineName"]=hub;
    CommonJObject["HUBPort"]=port;
    var configjson = JSON.stringify(CommonJObject)
    var configAPI =APIBasePath+'configuration?id=1';
    var requestOptions = {
      method: 'POST',
     headers: {"Accept": "application/json; odata=verbose",'Content-type': 'application/x-www-form-urlencoded'},
      body: configjson
    };
    const configurationRequest = async () => 
    {
      const ORResponse = await fetch(configAPI,requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({loader:false})
      this.setState({modal:true})
      this.setState({modalValidationText:ORJson.servermessage})
      
      
    }
    configurationRequest();
  }

  SaveReportSettingconfig()
  {
    var ExceptionMessage='';
    var headerName = this.state.RepotingHeaderName;
    var headerColCode = this.state.ReportingHeaderColCode;
    var SubheaderColCode = this.state.ReportingSubHeaderColCode;
    if(headerName.trim()==="")
    {
     this.setState({checkReportingHeader:true})
     this.setState({feedbackReportingHeader:'Reporting Header Name* can not be blank'})
     ExceptionMessage= 'Reporting Header Name* can not be blank';
    }
    if(headerColCode.trim()==="")
    {
     this.setState({checkHeaderColCode:true})
     this.setState({feedbackHeaderColCode:'Header Color Code* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Header Color Code* can not be blank';
    }
    if(SubheaderColCode.trim()==="")
    {
     this.setState({checkSubHeaderColCode:true})
     this.setState({feedbackSubHeaderColCode:'SubHeader Color Code* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'SubHeader Color Code* can not be blank';
    }
    if(ExceptionMessage.trim() !=="")
    {
      return ;
    }
    this.setState({loader:true})
    var CommonJObject ={};
    CommonJObject["ReportingHeaderName"]=headerName;
    CommonJObject["HeaderColorCode"]=headerColCode;
    CommonJObject["SubHeaderColorCode"]=SubheaderColCode;
    var configjson = JSON.stringify(CommonJObject)
    var configAPI =APIBasePath+'configuration?id=2';
    var requestOptions = {
      method: 'POST',
     headers: {"Accept": "application/json; odata=verbose",'Content-type': 'application/x-www-form-urlencoded'},
      body: configjson
    };
    const configurationRequest = async () => 
    {
      const ORResponse = await fetch(configAPI,requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({loader:false})
      this.setState({modal:true})
      this.setState({modalValidationText:ORJson.servermessage})

    }
    configurationRequest();
  }

  SaveEmailSetUp()
  {
    var ExceptionMessage='';
    var senderEmail = this.state.SenderEmailAddress;
    var Password = this.state.SenderPassword;
    var RecEmailAddress = this.state.ReceiverEmail;
    if(senderEmail.trim()==="")
    {
     this.setState({checkSenderEmail:true})
     this.setState({feedbackSenderEmailAddress:'Sender Email Address* can not be blank'})
     ExceptionMessage= 'Sender Email Address* can not be blank';
    }
    if(Password.trim()==="")
    {
     this.setState({checkSenderPassword:true})
     this.setState({feedbackSenderPassword:'Password* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Password* can not be blank';
    }
    if(RecEmailAddress.trim()==="")
    {
     this.setState({checkReceiverEmail:true})
     this.setState({feedbackReceiverEmail:'Receiver Email Address* can not be blank'})
     ExceptionMessage= ExceptionMessage+ 'Receiver Email Address* can not be blank';
    }
    if(ExceptionMessage.trim() !=="")
    {
      return ;
    }
    this.setState({loader:true})
    var CommonJObject ={};
    CommonJObject["SenderEmail"]=senderEmail;
    CommonJObject["SenderPassword"]=Password;
    CommonJObject["ReceiverEmail"]=RecEmailAddress;
    var configjson = JSON.stringify(CommonJObject)
    var configAPI =APIBasePath+'configuration?id=3';
    var requestOptions = {
      method: 'POST',
     headers: {"Accept": "application/json; odata=verbose",'Content-type': 'application/x-www-form-urlencoded'},
      body: configjson
    };
    const configurationRequest = async () => 
    {
      const ORResponse = await fetch(configAPI,requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({loader:false})
      this.setState({modal:true})
      this.setState({modalValidationText:ORJson.servermessage})

    }
    configurationRequest();
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
    <Page title="QA Automator" >
      <Loader 
        type="ThreeDots"
        color="#00BFFF"
        height={50}
        width={100}
        timeout={120000} //3 secs
        visible = {this.state.loader}
      />
	 <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <div>
          QA Automator is complete testing solution for Web and API testing.
          It is codeless automation framework on cloud platform with artificial intelligence 
          Support which reduce 90% business cost.

          </div>
        </Col>
        <Col lg={6} md={6} sm={6} xs={6}>
        <CardImg
         className="card-img-right"
         src={testscriptdev}
        />
        <CardImg
        />
      </Col>
      <Col lg={6} md={6} sm={6} xs={6}>
        <CardImg
         className="card-img-right"
         src={testexecution}
        />
        <CardImg
        />
      </Col>
      <Col lg={6} md={6} sm={6} xs={6}>
        <CardImg
         className="card-img-right"
         src={testmain}
        />
        <CardImg
        />
      </Col>
      <Col lg={6} md={6} sm={6} xs={6}>
        <CardImg
         className="card-img-right"
         src={integration}
        />
        <CardImg
        />
      </Col>
      </Row>
    </Page>
  );
  }
};

export default Configuration;
