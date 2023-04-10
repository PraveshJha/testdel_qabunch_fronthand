import Page from 'components/Page';
import React from 'react';
import bg3Image from 'assets/img/bg/deleterow.JPG';
import bg1Image from 'assets/img/bg/addnewrow.JPG';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
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
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

var APIBasePath= window.ENV.APIURL;

function GetAllEnvName({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{key}</option>)
  );
  
}

function SetEnvironmentandAPIData(JsonItems) 
{
  let count = Object.keys(JsonItems).length;
  let APIData=[];
  for(let i=1;i<=count;i++)
  {
    var keyName =Object.keys(JsonItems)[i-1];
    var keyVal =JsonItems[keyName];
    var  testdata={id:i,EnvName:keyName,URIValue:keyVal};
    APIData.push(testdata);
  }
  return APIData;
}
function SetHttpHeaderData(JsonItems) 
{
  let count = Object.keys(JsonItems).length;
  let APIData=[];
  for(let i=1;i<=count;i++)
  {
    var keyName =Object.keys(JsonItems)[i-1];
    var keyVal =JsonItems[keyName];
    var  testdata={id:i,headername:keyName,headervalue:keyVal};
    APIData.push(testdata);
  }
  return APIData;
}

class Configuration extends React.Component{

  constructor(props){
    super(props);
    this.state=
    {
       DefaultEnvironment : '',
       checkDashboardHistoryCount:false,
       feedbackDashboardHistoryCount:'',
       DashBoardHistoryCount:'',
       checkDashboardDays:false,
       feedbackDashboardDays:'',
       DashboardDays:'',
       ConfigurationFile:[],
       EnvURIList: [],
       HttpHeaderList:[],
       GetCommonItem:[],
       CommonTestData:[],
       EnvName:[],
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
       EnvComponent:'',
       executionTimeGraphIn:'',
       pageloadingStatus:true,
       AuthorizationData:[],
       selectedStepNumber:0,
       selectedRowforAuthTable:0,
       selectedRowForURLTable:0,
       checkdefaultenv:false,
       feedbackdefaultenv:'',

    }
    const GetLoaderData = async () => 
    {
      const configPage = await fetch(APIBasePath+'apiconfig');
      const configPageResponse = await configPage.json();
      if(Object.keys(configPageResponse).length>0)
      {
        
          this.setState({ConfigurationFile:configPageResponse});
          var defenv = configPageResponse['EXECUTIONSETUP']['DefaultEnvironment'];
          this.setState({DefaultEnvironment : defenv});
          this.setState({executionTimeGraphIn : configPageResponse['EXECUTIONSETUP']['ExecutionTimeGrpahIn']});
          this.setState({EnvComponent : configPageResponse['EXECUTIONSETUP']['DefaultEnvironment']});
          this.setState({DashBoardHistoryCount:configPageResponse['EXECUTIONSETUP']['DashboardHistoryCount']});
          this.setState({DashboardDays:configPageResponse['EXECUTIONSETUP']['DashboardTotalDayCount']});
          this.setState({RepotingHeaderName:configPageResponse['REPORTINGSETUP']['ReportingHeaderName']});
          this.setState({ReportingHeaderColCode:configPageResponse['REPORTINGSETUP']['HeaderColorCode']});
          this.setState({ReportingSubHeaderColCode:configPageResponse['REPORTINGSETUP']['SubHeaderColorCode']});
          this.setState({SenderEmailAddress:configPageResponse['EMAILSETUP']['SenderEmail']});
          this.setState({SenderPassword:configPageResponse['EMAILSETUP']['SenderPassword']});
          this.setState({ReceiverEmail:configPageResponse['EMAILSETUP']['ReceiverEmail']});
          if(defenv.trim() !=='')
          {
            this.setState({EnvURIList:SetEnvironmentandAPIData(configPageResponse['ENVIRONMENTSETUP'][this.state.EnvComponent])})
          }
          this.setState({HttpHeaderList:SetHttpHeaderData(configPageResponse['HTTPHEADER'])})
          this.setState({EnvName:configPageResponse['ENVIRONMENTSETUP']})
          this.setState({AuthorizationData:configPageResponse['Authorization']})
          this.setState({loader:false});
          this.setState({pageloadingStatus:false})
      }
    }
    GetLoaderData();
    
  }
  UpdateEnv(event)
  {
    var env = event.target.value;
    if(env !==this.state.DefaultEnvironment)
    {
      this.setState({DefaultEnvironment: env})
      this.setState({checkdefaultenv: false})
    }
    
  }
  UpdateExecutionParam(event)
  {
    
    this.setState({executionTimeGraphIn: event.target.value})
    
  }
  UpdateComponentEnv(event)
  {
    try{
        var updatedComponentenv= event;
        if(updatedComponentenv.toLowerCase() !==this.state.EnvComponent.toLowerCase())
        {
          this.setState({EnvComponent: updatedComponentenv})
          this.setState({EnvURIList: SetEnvironmentandAPIData(this.state.ConfigurationFile['ENVIRONMENTSETUP'][updatedComponentenv])})
          this.setState({selectedRowForURLTable:0});
        }
      }
    catch(error)
    {
      this.setState({EnvURIList:[]})
      this.setState({selectedRowForURLTable:0});
    }
    
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
  DeleteEnv()
  {
    var environment = this.state.EnvComponent;
    if(environment.trim() ==='')
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:'Environment* Name can not be blank'})
    }
    if(environment.toLowerCase()===this.state.DefaultEnvironment.toLowerCase())
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:'Default Environment* can not delete'})
    }
    this.setState({loader:true});
    const calldeleteEnv = async () => 
    {
      const deleteEnvReq = await fetch(APIBasePath+'apiconfig/'+environment);
      const deleteEnvRsp = await deleteEnvReq.json();
      if(deleteEnvRsp.success)
      {
          this.setState({EnvComponent:''})
          this.setState({EnvURIList:''})
          const refreshAgain = async () => 
          {
            const configPage = await fetch(APIBasePath+'apiconfig');
            const configPageResponse = await configPage.json();
            if(Object.keys(configPageResponse).length>0)
            {
               this.setState({modal:true})
                this.setState({EnvName:configPageResponse['ENVIRONMENTSETUP']})
                this.setState({loader:false});
                return this.setState({modalValidationText:deleteEnvRsp.servermessage})
            }
          }
          refreshAgain();
          
      }
	    else
      {
        this.setState({loader:false});
        this.setState({modal:true})
        return this.setState({modalValidationText:deleteEnvRsp.servermessage})
      }
    }
    calldeleteEnv();

  }
  SaveEnvironmentSetUP()
  {
    var environment = this.state.EnvComponent;
    if(environment.trim() ==='')
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:'Environment* Name can not be blank'})
    }
     var allItem = this.state.EnvURIList;
     if(allItem.length===0)
     {
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please add Component name and URI.'})
     }
     var allEnvName={};
     for(let i=0;i<allItem.length;i++)
     {
       var keyName= allItem[i]['EnvName'];
       var keyValue= allItem[i]['URIValue'];
       allEnvName[keyName]= keyValue;
     }
    var configjson = genericHelper.common_ChangeJsoncontentforServer(allEnvName);
    var configAPI =APIBasePath+'apiconfig/'+environment+'/0';
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(configjson)
    };
    const configurationRequest = async () => 
    {
      this.setState({loader:true})
      const ORResponse = await fetch(configAPI,requestOptions);
      const ORJson = await ORResponse.json();
      this.setState({loader:false})
      this.setState({modal:true})
      this.setState({modalValidationText:ORJson.servermessage})

    }
    configurationRequest();


  }
  SaveHttpHeaderSetUp()
  {
    var allItem = this.state.HttpHeaderList;
    if(allItem.length===0)
    {
     this.setState({modal:true})
     return this.setState({modalValidationText:'Please add Http header name and value.'})
    }
    var allEnvName={};
    for(let i=0;i<allItem.length;i++)
    {
      var keyName= allItem[i]['headername'];
      var keyValue= allItem[i]['headervalue'];
      allEnvName[keyName]= keyValue;
    }
   var configjson = genericHelper.common_ChangeJsoncontentforServer(allEnvName);
   var configAPI =APIBasePath+'apiconfig/2';
   var requestOptions = {
     method: 'POST',
     headers: {"Accept": "*/*",'Content-type': 'application/json'},
     body: JSON.stringify(configjson)
   };
   const configurationRequest = async () => 
   {
     this.setState({loader:true})
     const ORResponse = await fetch(configAPI,requestOptions);
     const ORJson = await ORResponse.json();
     this.setState({loader:false})
     this.setState({modal:true})
     this.setState({modalValidationText:ORJson.servermessage})

   }
   configurationRequest();


  }

  SaveAuthorizationData()
  {
    var allItem = this.state.AuthorizationData;
    if(allItem.length===0)
    {
     this.setState({modal:true})
     return this.setState({modalValidationText:'Please provide Authorization details.'})
    }
    var allITem=[]
    for(let i=0;i<allItem.length;i++)
    {
      var onebyOne={};
      onebyOne['id']=Number(i)+1;
      onebyOne['key']=allItem[i]['key'];
      onebyOne['username']=allItem[i]['username'];
      onebyOne['password']=allItem[i]['password'];
      allITem.push(onebyOne);
    }
   var postData = {}
   postData['AuthorizationData']=allITem;
   var configjson = genericHelper.common_ChangeJsoncontentforServer(postData);
   var configAPI =APIBasePath+'apiconfig/5';
   var requestOptions = {
     method: 'POST',
     headers: {"Accept": "*/*",'Content-type': 'application/json'},
    body: JSON.stringify(configjson)
   };
   const configurationRequest = async () => 
   {
     this.setState({loader:true})
     const ORResponse = await fetch(configAPI,requestOptions);
     const ORJson = await ORResponse.json();
     this.setState({loader:false})
     this.setState({modal:true})
     this.setState({modalValidationText:ORJson.servermessage})

   }
   configurationRequest();
  }
  SaveExecutionSetup()
  {
     var env = this.state.DefaultEnvironment;
     var HistoryCount = this.state.DashBoardHistoryCount;
     var DashboardDaycount = this.state.DashboardDays;
     var ExceptionMessage ='';
     if(env==='')
     {
       this.setState({checkdefaultenv:true});
       this.setState({feedbackdefaultenv:"Default environment can not be blank"});
       ExceptionMessage= ExceptionMessage+ 'Default environment can not be blank.'
     }
     if(isNaN(HistoryCount) || HistoryCount.trim()==="")
     {
      this.setState({checkDashboardHistoryCount:true})
      this.setState({feedbackDashboardHistoryCount:'Dashboard History Count* takes only numeric value.'})
      ExceptionMessage= ExceptionMessage+ 'Dashboard History Count* takes only numeric value.'
     }
     if(isNaN(DashboardDaycount) || DashboardDaycount.trim()==='')
     {
      this.setState({checkDashboardDays:true})
      this.setState({feedbackDashboardDays:'Dashboard Total Day Count* takes only numeric value.'})
      ExceptionMessage= ExceptionMessage+ 'Dashboard Total Day Count* takes only numeric value..'
     }
     if(ExceptionMessage.trim() !=="")
     {
       return ;
     }
     this.setState({loader:true})
     var CommonJObject ={};
     CommonJObject["DefaultEnvironment"]=env;
     CommonJObject["DashboardHistoryCount"]=HistoryCount;
     CommonJObject["DashboardTotalDayCount"]=DashboardDaycount;
     CommonJObject["ExecutionTimeGrpahIn"]=this.state.executionTimeGraphIn;
    //console.log(CommonJObject);
     var configjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject)
     var configAPI =APIBasePath+'apiconfig/0';
     var requestOptions = {
       method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
       body: JSON.stringify(configjson)
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
    var configjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject)
    var configAPI =APIBasePath+'configuration/1';
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(configjson)
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
    var configjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject)
    var configAPI =APIBasePath+'apiconfig/3';
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(configjson)
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
    var configjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject)
    var configAPI =APIBasePath+'apiconfig/4';
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(configjson)
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
  addNewEnvList = () => 
	{
    var env = this.state.EnvComponent;
    if(env.trim()==='')
    {
      this.setState({selectedRowForURLTable:0});
      return;
    }
    var headerItem= this.state.EnvURIList;
    var rowid= this.state.selectedRowForURLTable;
    if(Number(rowid)===0)
    {
      rowid=headerItem.length;
    }
    this.setState({loader:true})
    this.setState({pageloadingStatus:true});
    var checkblankInfo= genericHelper.common_checkblankvalueinJarray(headerItem,'EnvName');
    if(checkblankInfo)
    {
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please add information on blank row, before adding new row'})
    }
    var allItemAfterInsertion=genericHelper.common_AddIteminJarrayBasedonIndex(headerItem,Number(rowid),['id','EnvName','URIValue'],'id');
    this.setState({EnvURIList:allItemAfterInsertion})
    this.setState({selectedRowForURLTable:Number(rowid)+1})
	  this.setState({loader:false});
    this.setState({pageloadingStatus:false});
	}
  addNewhttpHeader = () => 
	{
    var headerItem= this.state.HttpHeaderList;
    var rowid= this.state.selectedStepNumber;
    if(Number(rowid)===0)
    {
      rowid=headerItem.length;
    }
    this.setState({loader:true})
    this.setState({pageloadingStatus:true});
    var checkblankInfo= genericHelper.common_checkblankvalueinJarray(headerItem,'headername');
    if(checkblankInfo)
    {
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please add information on blank row, before adding new row'})
    }
    var allItemAfterInsertion=genericHelper.common_AddIteminJarrayBasedonIndex(this.state.HttpHeaderList,Number(rowid),['id','headername','headervalue'],'id');
    this.setState({HttpHeaderList:allItemAfterInsertion})
    this.setState({selectedStepNumber:Number(rowid)+1})
		this.setState({loader:false});
    this.setState({pageloadingStatus:false});
	}

  addNewAuthorizationKey = () => 
	{
    var authDataITem= this.state.AuthorizationData;
    var rowid= this.state.selectedRowforAuthTable;
    if(Number(rowid)===0)
    {
      rowid=authDataITem.length;
    }
    this.setState({loader:true})
    this.setState({pageloadingStatus:true});
    var checkblankInfo= genericHelper.common_checkblankvalueinJarray(authDataITem,'key');
    if(checkblankInfo)
    {
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please add information on blank row, before adding new row'})
    }
    var allItemAfterInsertion=genericHelper.common_AddIteminJarrayBasedonIndex(authDataITem,Number(rowid),['id','key','username','password'],'id');
    this.setState({AuthorizationData:allItemAfterInsertion})
    this.setState({selectedRowforAuthTable:Number(rowid)+1})
	  this.setState({loader:false});
    this.setState({pageloadingStatus:false});
	}
  deleteEnvList = () => {
    var env = this.state.EnvComponent;
    if(env.trim()==='')
    {
      this.setState({selectedRowForURLTable:0});
      return;
    }
		var allItem = this.state.EnvURIList;
    if(allItem.length===0)
    {
      this.setState({loader:false})
      this.setState({pageloadingStatus:false})
      return;
    }
    var rowid= this.state.selectedRowForURLTable;
    if(Number(rowid)>0)
    {
      this.setState({loader:true})
      this.setState({pageloadingStatus:true})
      var updatedItem= genericHelper.common_deleteIteminJarrayBasedonIndex(allItem,rowid,'id');
      this.setState({ EnvURIList: updatedItem });
      if(Number(rowid)>updatedItem.length)
      {
        this.setState({ selectedRowForURLTable: 0 });
      }
      else{
        this.setState({ selectedRowForURLTable: Number(rowid) });
      }
      this.setState({loader:false})
      this.setState({pageloadingStatus:false})
    }
	  };

    deleteHttpHeaderList = () => {
      var rowid= this.state.selectedStepNumber;
      if(Number(rowid)>0)
      {
        this.setState({loader:true})
        this.setState({pageloadingStatus:true})
        var updatedItem= genericHelper.common_deleteIteminJarrayBasedonIndex(this.state.HttpHeaderList,rowid,'id');
        this.setState({ HttpHeaderList: updatedItem });
        if(Number(rowid)>updatedItem.length)
        {
          this.setState({ selectedStepNumber: 0 });
        }
        else{
          this.setState({ selectedStepNumber: Number(rowid) });
        }
        this.setState({loader:false})
        this.setState({pageloadingStatus:false})
      }
    };
    deleteAuthorizationKey = () => {
      var rowid= this.state.selectedRowforAuthTable;
      if(Number(rowid)>0)
      {
        this.setState({loader:true})
        this.setState({pageloadingStatus:true})
        var updatedItem= genericHelper.common_deleteIteminJarrayBasedonIndex(this.state.AuthorizationData,rowid,'id');
        this.setState({ AuthorizationData: updatedItem });
        if(Number(rowid)>updatedItem.length)
        {
          this.setState({ selectedRowforAuthTable: 0 });
        }
        else{
          this.setState({ selectedRowforAuthTable: Number(rowid) });
        }
        this.setState({loader:false})
        this.setState({pageloadingStatus:false})
      }
    };

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
  handleOnTestStepSelect = (row, isSelect) => {
		if (isSelect) 
		{
			var selectedrow= row.id;
			this.setState({ selectedStepNumber: selectedrow });
		}

	}
  handleOnURLTableSelect = (row, isSelect) => {
		if (isSelect) 
		{
			var selectedrow= row.id;
			this.setState({ selectedRowForURLTable: selectedrow });
		}

	}
  handleOnAuthTableSelect = (row, isSelect) => {
		if (isSelect) 
		{
			var selectedrow= row.id;
			this.setState({ selectedRowforAuthTable: selectedrow });
		}

	}

  render() {

    const options = {
      sizePerPage: 5,
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true
      };
      const selecthttpHeaderRow = {
        mode: 'radio',
        onSelect: this.handleOnTestStepSelect,
        selected:[this.state.selectedStepNumber]
      };
      const selectURLTableRow = {
        mode: 'radio',
        onSelect: this.handleOnURLTableSelect,
        selected:[this.state.selectedRowForURLTable]
      };
      const selectAuthTableRow = {
        mode: 'radio',
        onSelect: this.handleOnAuthTableSelect,
        selected:[this.state.selectedRowforAuthTable]
        };
    var columns = [
      {
        dataField: 'id',
        text: '#',
        headerStyle: { width: '40px' },
        Cell: row => (
        <div>
          <span title={ row.value }>{ row.value }</span>
        </div>
        )
      },
      {
        dataField: 'EnvName',
        text: 'Component*',
        validator: (newValue, row, column) => {
        if (newValue.trim()==='') {
          return {
          valid: false,
          message: 'Component Name* can not be blank.'
          };
        }
        var totalCount = this.state.EnvURIList.length;
        for(let i=0;i<totalCount;i++)
        {
          var ItemName = this.state.EnvURIList[i].EnvName;
          if(ItemName.trim().toLowerCase()===newValue.trim().toLowerCase())
          {
            return {
              valid: false,
              message: 'Component Name* can not be duplicate.'
              };
          }
        }
        return true;
        }
      },
      {
        dataField: 'URIValue',
        text: 'URI',
        }
      ];
      var httpheadercolumns = [
        {
          dataField: 'id',
          text: '#',
          headerStyle: { width: '40px' },
          Cell: row => (
          <div>
            <span title={ row.value }>{ row.value }</span>
          </div>
          )
        },
        {
          dataField: 'headername',
          text: 'Name*',
          validator: (newValue, row, column) => {
          if (newValue.trim()==='') {
            return {
            valid: false,
            message: 'HTTP header Name* can not be blank.'
            };
          }
          var totalCount = this.state.HttpHeaderList.length;
          for(let i=0;i<totalCount;i++)
          {
            var ItemName = this.state.HttpHeaderList[i].headername;
            if(ItemName.trim().toLowerCase()===newValue.trim().toLowerCase())
            {
              return {
                valid: false,
                message: 'HTTP Header Name* can not be duplicate.'
                };
            }
          }
          return true;
          }
        },
        {
          dataField: 'headervalue',
          text: 'Value',
          }
        ];
        var Authorizationheadercolumns = [
          {
            dataField: 'id',
            text: '#',
            headerStyle: { width: '40px' },
            Cell: row => (
            <div>
              <span title={ row.value }>{ row.value }</span>
            </div>
            )
          },
          {
            dataField: 'key',
            text: 'Key*',
            validator: (newValue, row, column) => {
            if (newValue.trim()==='') {
              return {
              valid: false,
              message: 'Key* can not be blank.'
              };
            }
            var totalCount = this.state.AuthorizationData.length;
            for(let i=0;i<totalCount;i++)
            {
              var ItemName = this.state.AuthorizationData[i].key;
              if(ItemName.trim().toLowerCase()===newValue.trim().toLowerCase())
              {
                return {
                  valid: false,
                  message: 'Key* can not be duplicate.'
                  };
              }
            }
            return true;
            }
          },
          {
            dataField: 'username',
            text: 'UserName',
          },
          {
            dataField: 'password',
            text: 'Password',
          }
          ];

  return (
    <Page title="Configuration Setup" breadcrumbs={[{ name: 'Configuration', active: true }]}>
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
            <CardHeader>Execution Setup
            <Button disabled={this.state.pageloadingStatus} onClick={this.SaveExecutionSetup.bind(this)} color="secondary" name ="SaveExecutionSetup">Save</Button>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Default Environment*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkdefaultenv} type="select" name="envlist" value ={this.state.DefaultEnvironment} onChange={this.UpdateEnv.bind(this)}>
                      <option></option>
                      <GetAllEnvName options={this.state.EnvName} />
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackdefaultenv}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                  Execution count for Graph*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkDashboardHistoryCount} type="input" name="DashboardHistory"  value ={this.state.DashBoardHistoryCount} onChange={this.UpdateDashBoardHistoryCount.bind(this)}/>
                    <FormFeedback>
                      {this.state.feedbackDashboardHistoryCount}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Execution history Day*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkDashboardDays} type="input" name="DashboardDay"  value ={this.state.DashboardDays} onChange={this.UpdateDashBoardDays.bind(this)}/>
                    <FormFeedback>
                      {this.state.feedbackDashboardDays}
                   </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Execution Time Graph In*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="executiontimegraphParam" value ={this.state.executionTimeGraphIn} onChange={this.UpdateExecutionParam.bind(this)}>
                    <option>Seconds</option>
                    <option>Minutes</option>
					          </Input>
                  </Col>
                </FormGroup>
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
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Add Env. & Component URL
              <CardImg
                  className="card-img-right"
                    src={bg1Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.addNewEnvList() }
                    disable={this.state.pageloadingStatus}
                    />
                  <CardImg
                    className="card-img-right"
                    src={bg3Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.deleteEnvList() }
                    disable={this.state.pageloadingStatus}
                  />
                  <Button disabled={this.state.pageloadingStatus} onClick={this.SaveEnvironmentSetUP.bind(this)} color="secondary" name ="SaveEnvironmentSetUp">Save</Button>
                  <Button disabled={this.state.pageloadingStatus} onClick={this.DeleteEnv.bind(this)} color="secondary" name ="deleteenv">Delete Env.</Button>
              </CardHeader>
            <CardBody>
            <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                  Environment*
                  </Label>
                  <Col>
                    <Combobox  name ="comenvlist" 
                      value={this.state.EnvComponent}
                      data={genericHelper.common_GetListKeyFromJsonResponce(this.state.EnvName)}
                      caseSensitive={false}
                      minLength={3}
                      onSelect={this.UpdateComponentEnv.bind(this)}
                      onChange={this.UpdateComponentEnv.bind(this)}
                      disable={this.state.pageloadingStatus}
                    />
                  </Col>
            </FormGroup>
            <BootstrapTable
                keyField="id"
                data={ this.state.EnvURIList }
                columns={ columns }
                striped
                hover
                condensed
                pagination={ paginationFactory(options) }
                selectRow={ selectURLTableRow }
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  })}
                disable={this.state.pageloadingStatus}
              />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>HTTP Header*
              <CardImg
                  className="card-img-right"
                    src={bg1Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.addNewhttpHeader() }
                    disable={this.state.pageloadingStatus}
                    />
                  <CardImg
                    className="card-img-right"
                    src={bg3Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.deleteHttpHeaderList() }
                    disable={this.state.pageloadingStatus}
                  />
                  <Button disabled={this.state.pageloadingStatus} onClick={this.SaveHttpHeaderSetUp.bind(this)} color="secondary" name ="SaveHttpHeaderSetUp">Save</Button>
              </CardHeader>
            <CardBody>
            <BootstrapTable
                keyField="id"
                data={ this.state.HttpHeaderList }
                columns={ httpheadercolumns }
                striped
                hover
                condensed
                pagination={ paginationFactory(options) }
                selectRow={ selecthttpHeaderRow }
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  })}
                  disable={this.state.pageloadingStatus}
              />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Authorization
              <CardImg
                  className="card-img-right"
                    src={bg1Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.addNewAuthorizationKey() }
                    disable={this.state.pageloadingStatus}
                    />
                  <CardImg
                    className="card-img-right"
                    src={bg3Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.deleteAuthorizationKey() }
                    disable={this.state.pageloadingStatus}
                  />
                  <Button disabled={this.state.pageloadingStatus} onClick={this.SaveAuthorizationData.bind(this)} color="secondary" name ="SaveHttpHeaderSetUp">Save</Button>
              </CardHeader>
            <CardBody>
            <BootstrapTable
                keyField="id"
                data={ this.state.AuthorizationData }
                columns={ Authorizationheadercolumns }
                striped
                hover
                condensed
                pagination={ paginationFactory(options) }
                selectRow={ selectAuthTableRow }
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  })}
                  disable={this.state.pageloadingStatus}
              />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Reporting Setup
            <Button disabled={this.state.pageloadingStatus} onClick={this.SaveReportSettingconfig.bind(this)} color="secondary" name ="SaveReportingSetting">Save</Button>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Reporting Header Name*
                  </Label>
                  <Col>
                  <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkReportingHeader} type="input" name="ReportingHeaderName"  value ={this.state.RepotingHeaderName} onChange={this.UpdateReportingHeaderName.bind(this)}/>
                    <FormFeedback>
                      {this.state.feedbackReportingHeader}
                    </FormFeedback>
                  </Col>
                </FormGroup>
				        <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Header Color Code*
                  </Label>
                  <Col >
                     <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkHeaderColCode} type="input" name="ReportingHeaderColCode"  value ={this.state.ReportingHeaderColCode} onChange={this.UpdateHeaderColorCode.bind(this)}/>
                      <FormFeedback>
                      {this.state.feedbackHeaderColCode}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    SubHeader Color Code*
                  </Label>
                  <Col >
                     <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkSubHeaderColCode} type="input" name="ReportingSubHeaderColCode"  value ={this.state.ReportingSubHeaderColCode} onChange={this.UpdateSubHeaderColorCode.bind(this)}/>
                      <FormFeedback>
                      {this.state.feedbackSubHeaderColCode}
                    </FormFeedback>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Email Configuration
            <Button disabled={this.state.pageloadingStatus} onClick={this.SaveEmailSetUp.bind(this)} color="secondary" name ="SaveEmailSetUp">Save</Button>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Sender Email Address*
                  </Label>
                  <Col>
                  <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkSenderEmail} type="input" name="senderEmailAddress"  value ={this.state.SenderEmailAddress} onChange={this.UpdateSenderEmailAddress.bind(this)}/>
                    <FormFeedback>
                      {this.state.feedbackSenderEmailAddress}
                    </FormFeedback>
                  </Col>
                </FormGroup>
				        <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Password*
                  </Label>
                  <Col >
                     <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkSenderPassword} type="password" name="SenderPassword"  value ={this.state.SenderPassword} onChange={this.UpdateSenderPassword.bind(this)}/>
                      <FormFeedback>
                      {this.state.feedbackSenderPassword}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                  Receiver Email Address*
                  </Label>
                  <Col >
                     <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkReceiverEmail} type="input" name="ReceiverEmail"  value ={this.state.ReceiverEmail} onChange={this.UpdateRecieverEmailAddress.bind(this)}/>
                      <FormFeedback>
                      {this.state.feedbackReceiverEmail}
                    </FormFeedback>
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

export default Configuration;
