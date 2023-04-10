import Page from 'components/Page';
import React from 'react';
import genericHelper from '../funcLibraries/GenericHelper.js';
import funcAPIScripts from '../funcLibraries/funcAPIScripts.js';
import bg3Image from 'assets/img/bg/deleterow.JPG';
import bg1Image from 'assets/img/bg/addnewrow.JPG';
import JSONPretty from 'react-json-pretty';
import ReactJson from 'react-json-view'
import 'react-json-pretty/themes/monikai.css';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import { Accordion } from 'react-bootstrap-accordion'
import 'react-bootstrap-accordion/dist/index.css'
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
  Alert,
} from 'reactstrap';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory,{Type} from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'; 
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { TextArea } from 'semantic-ui-react';

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

function GetOptionKeys({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{key}</option>)
  );
}

class APIScripts extends React.Component{

  constructor(props){
    super(props);
    this.state=
    {
      newscriptLoader:false,
       DefaultEnvironment : '',
       DefaultPreGlobalScript:'',
       checknewAPIName:false,
       checkAPIBody:false,
       feedbackAPIBody:'',
       feedbacknewAPIName:'',
       newApiName:'',
       checkRelativeURI:false,
       checkAPIURI:false,
       feedbackAPIURI:'',
       APIURI:'',
       feedbackRelativeURI:'',
       relativeURI:'',
       ConfigurationFile:[],
       EnvURIList: [],
       PreScripsVaribalesList: [],
       PostScripsVaribalesList: [],
       postvarAPIResponse:[],
       AssertionList:[{id: 1, asstype: 'ResponseCode',assfunction:'EqualTo',assvalue:'200'}],
       HttpHeaderList:[],
       EnvName:[],
       allGlobalScriptName:[],
       checkHttpMethod:false,
       HttpMethodName:'',
       apiBody:'',
       constAPICall:'',
       loader:true,
       apiResponseModal:false,
       httpBodyModal:false,
       apiResCode:'',
       rescontent:'',
       apiresponseBody:'',
       apiresponseHeader:'',
       apiRequestBody:'',
       apiRequestHeader:'',
       defaultResContent:'Response',
       defaultHeaderBody:'Body',
       componentURI:'',
       allCoponentURIList:[],
       checkComponentURI:false,
       feedbackcomponentURL:'',
       feedbackNewScriptType:'',
       EditHttpBody:'',
       httpBodyKeyName:'',
       httpBodyKeyValue:'',
       selectedUtilityFunction:'',
       UtilityItem:[],
       UtilityFunctionList:[],
       utilityFunction:false,
       OriginalUtilityContent:[],
       UtilityFunctionExpression:'',
       selectedUtilityRow:0,
       JsonBodyhttpData:[],
       PreAPIScriptType:'',
       newAPIScriptType:'',
       checkNewScriptType:false,
       newAPIComponent:'',
       componentList:[],
       checkNewComponent:false,
       currentDataSet:1,
       allDataSet:[1],
       CollectionDataSet:[{1:''}],
       CollectionAssertion:[{1:''}],
       collectionPostVariable:[{1:''}],
       feedbackURIComponent:'',
       feedbackhttpMethod:'',
       allResponseDataSet:[1],
       defaultResponseDataset:1,
       allDataSetResponse:[],
       responseURL:'',
       allKnownAPIComponent:[],
       newApiId:'',
       checknewAPIID:false,
       feedbacknewAPIID:'',
       knownAPIName:'',
       pageloadingStatus :true,
       feedbackKnownAPIComponent:'',
       feedbackKnownAPIID:'',
       checkKnownAPIID:false,
       AuthcredenKey:'',
       allAuthCredentialData:[],
       selectedStepNumber:0,
       selectedvarTableRow:0,
       selectedassertiontableRow:0,
       checkMock:false,
       mockModal:false,
       checkMockResponseCode:false,
       feedbackMockResponseCode:'',
       mockResponseCode:200,
       mockResponseHeader :'{}',
      checkMockResponseHeader:false,
      feedbackMockResponseHeader:'',
      checkMockResponseBody :false,
      mockResponseBody:'{}',
      feedbackMockResponseBody:'',

    }
    const GetLoaderData = async () => 
    {
      const configPage = await fetch(APIBasePath+'apiconfig');
      const configPageResponse = await configPage.json();
      if(Object.keys(configPageResponse).length>0)
      {
          this.setState({ConfigurationFile:configPageResponse});
          this.setState({allAuthCredentialData : funcAPIScripts.createAuthCredData(configPageResponse['Authorization'])});
          var defenv = configPageResponse['EXECUTIONSETUP']['DefaultEnvironment'];
          this.setState({DefaultEnvironment : defenv});
          this.setState({EnvName:configPageResponse['ENVIRONMENTSETUP']})
          try
          {
            if(defenv.trim() !=='')
            {
              this.setState({allCoponentURIList:configPageResponse['ENVIRONMENTSETUP'][this.state.DefaultEnvironment]})
              this.setState({constAPICall:configPageResponse['ENVIRONMENTSETUP'][this.state.DefaultEnvironment]})
            }
          }
          catch(error)
          {}
          this.setState({HttpHeaderList:funcAPIScripts.SetHttpHeaderData(configPageResponse['HTTPHEADER'])})
          const Req3 = async () => 
          {
            const Request3 = await fetch(APIBasePath+'customfunction/0/0')
            const Response3 = await Request3.json();
            if(Object.keys(Response3).length>0)
            {
            this.setState({UtilityItem:Response3});
            var TotalFunction = Object.keys(this.state.UtilityItem).length;
            var TotalItem =[];
            for(let i=1;i<=TotalFunction;i++)
            {
              var utilityContent ={}
              utilityContent['id']=i;
              utilityContent['utilityfunction']=this.state.UtilityItem[i].toString();
              TotalItem.push(utilityContent);
            }
            this.setState({UtilityFunctionList:TotalItem})
            this.setState({OriginalUtilityContent:TotalItem})
            var Item =[];
            Item[1]= this.state.AssertionList;
            this.setState({CollectionAssertion:Item})
            var newItem =[];
            newItem[1]= this.state.PostScripsVaribalesList;
            this.setState({collectionPostVariable:newItem})
            }
            const Req4 = async () => 
            {
              const Request4 = await fetch(APIBasePath+'Updateapiscripts')
              const Response4 = await Request4.json();
              if(Object.keys(Response4).length>0)
              {
              this.setState({allKnownAPIComponent:Response4})
              
              }
              this.setState({loader:false});
              this.setState({pageloadingStatus:false})
            }
            Req4();
          }
          Req3();
      }
    }
    GetLoaderData();
    
  }
  UpdateEnv(event)
  {
    var env = event.target.value;
    if(env !== this.state.DefaultEnvironment)
    {
      this.setState({DefaultEnvironment: env})
      this.setState({allCoponentURIList:this.state.ConfigurationFile['ENVIRONMENTSETUP'][env]})
      this.setState({componentURI:''})
      this.setState({APIURI:''})
    }
    
    
  }
  UpdateComponentURI(event)
  {
    this.setState({checkComponentURI:false})
    var comURI = event.target.value;
    this.setState({componentURI: comURI})
    var env= this.state.DefaultEnvironment;
    var URI= this.state.ConfigurationFile['ENVIRONMENTSETUP'][env][comURI];
    var relative = this.state.relativeURI;
    this.setState({APIURI:URI+relative});
    
  }
  UpdateAuthKeyData(event)
  {
    var authKey = event.target.value;
    if(authKey !==this.state.AuthcredenKey)
    {
      this.setState({AuthcredenKey:authKey});
    }
    
  }
  UpdatePreGlobalScriptName(event)
  {
    var defaultName= event.target.value;
    if(defaultName!==this.state.DefaultPreGlobalScript)
    {
      if(defaultName==='')
      {
        this.setState({PreScripsVaribalesList:[]})
        this.setState({DefaultPreGlobalScript: defaultName})
        this.setState({knownAPIName: ''})
        return;
      }
      this.setState({checkKnownAPIID:false})
      this.setState({DefaultPreGlobalScript: defaultName})
      var envName= this.state.DefaultEnvironment;
      const RequestCall = async () => 
      {
        this.setState({loader:true});
        this.setState({pageloadingStatus:true});
        const reqcall = await fetch(APIBasePath+'apipregbscripts/'+defaultName+'/'+envName);
        const resobt = await reqcall.json();
        this.setState({PreScripsVaribalesList:funcAPIScripts.PreResponseVariableSave(resobt)})
        this.setState({knownAPIName:this.state.allGlobalScriptName[defaultName]})
        this.setState({loader:false});
        this.setState({pageloadingStatus:false});
      }
      RequestCall();
    }
  }
  addnewComponent(event)
  {
    try{
        var updatedComponent= event;
        if(updatedComponent.trim() !==this.state.newAPIComponent)
        {
          this.setState({newAPIComponent: updatedComponent})
          var format = /[ `!@#$%^&*()_+\-=[]{};':"\\|,.<>\/?~]/;
          if(format.test(updatedComponent))
          {
             this.setState({checkNewComponent:true});
          }
          else{
            this.setState({checkNewComponent:false});
          }
        }
      }
    catch(error)
    {
    }
    
  }
  UpdatePreScriptType(event)
  {
    var scriptType= event.target.value;
    this.setState({checkKnownAPIScriptType:false})
    if(scriptType.trim()==='')
    {
      this.setState({allGlobalScriptName:[]});
      this.setState({DefaultPreGlobalScript:''});
      this.setState({PreAPIScriptType:''});
      this.setState({knownAPIName:''});
      this.setState({PreScripsVaribalesList:[]});
      return;
    }
    if(scriptType!==this.state.PreAPIScriptType)
    {
      this.setState({knownAPIName:''});
      this.setState({allGlobalScriptName:[]});
      this.setState({PreScripsVaribalesList:[]});
      this.setState({DefaultPreGlobalScript:''});
      this.setState({PreAPIScriptType:scriptType.trim()});
      this.setState({loader:true})
      this.setState({pageloadingStatus:true})
      const Req2 = async () => 
      {
        const request2 = await fetch(APIBasePath+'Updateapiscripts/'+scriptType.trim());
        const Response2 = await request2.json();
        this.setState({allGlobalScriptName:Response2});
        this.setState({loader:false})
        this.setState({pageloadingStatus:false})
      }
      Req2();
    }
  }
  UpdateNewScriptType(event)
  {
    this.setState({checkNewScriptType:false});
    var scriptType= event.target.value;
    if(scriptType.trim()==='')
    {
      this.setState({newAPIComponent:''});
      this.setState({componentList:''});
      return;
    }
    if(scriptType!==this.state.newAPIScriptType)
    {
      this.setState({newAPIScriptType:scriptType});
      if(scriptType.trim()==='API')
      {
        this.setState({newscriptLoader:true});
        this.setState({pageloadingStatus:true});
        const Req4 = async () => 
        {
          const Request4 = await fetch(APIBasePath+'apiscripts')
          const Response4 = await Request4.json();
          this.setState({componentList:Response4});
          this.setState({newscriptLoader:false});
          this.setState({pageloadingStatus:false});

        }
        Req4();
      }
      else
      {
        this.setState({componentList:[]});
        this.setState({newAPIComponent:''});
      }
    }
  }

  changeRequestResponseContent(event)
  {
    var ResItem = event.target.value;
    if(ResItem!==this.state.defaultResContent)
    {
      this.setState({defaultResContent: ResItem})
      var bodyorHeader= this.state.defaultHeaderBody;
      if(ResItem==='Response')
      {
        if(bodyorHeader==="Body")
        {
          this.setState({rescontent: this.state.apiresponseBody})
        }
        if(bodyorHeader==="Header")
        {
          this.setState({rescontent: this.state.apiresponseHeader})
        }
      }
      if(ResItem==='Request')
      {
        if(bodyorHeader==="Body")
        {
          this.setState({rescontent: this.state.apiRequestBody})
        }
        if(bodyorHeader==="Header")
        {
          this.setState({rescontent: this.state.apiRequestHeader})
        }
      }
    }

  }

  selectUtilityFunctionfromList()
  {
  var rowId= this.state.selectedUtilityRow;
  if(rowId ===0)
  {
    this.setState({alertColor:'danger'})
    this.setState({UtilityFunctionExpression:'please select utility function.'})
    return;
  }
  var functionName = this.state.OriginalUtilityContent[rowId-1].utilityfunction;
  var updatedFunctionName = this.state.UtilityFunctionList[rowId-1].utilityfunction;
  if(updatedFunctionName.trim() ==='')
  {
    this.setState({alertColor:'danger'})
    this.setState({UtilityFunctionExpression:'Utility function can not be blank.'})
    return;
  }
  if(!updatedFunctionName.includes('(') || !updatedFunctionName.includes(')'))
  {
    this.setState({alertColor:'danger'})
    this.setState({UtilityFunctionExpression:'syntax is incorrect for utility function'})
    return;
  }
  if(!functionName.includes('()'))
  {
    if(functionName.trim()===updatedFunctionName.trim())
    {
      this.setState({alertColor:'danger'})
        this.setState({UtilityFunctionExpression:'Please pass the argument in Utility function.'})
        return;
    }
  }
  this.setState({utilityFunction:false})
  this.setState({UtilityFunctionExpression:''})
  this.setState({alertColor:''})
  //@ check what is action
  var keyValue= 'utility.'+updatedFunctionName.trim();
  this.setState({httpBodyKeyValue:keyValue});
  /*
  var UpdatedBody = this.state.JsonBodyhttpData;
  var totalsubkey = UpdatedBody['namespace'].length;
  if(totalsubkey==0)
  {
    var Item = this.state.EditHttpBody;
    Item['email']="Pravesh";
    UpdatedBody[keyName]=keyValue;
    console.log(Item);
    this.setState({EditHttpBody:Item});
  }
  else
  {
    var Keyvalueone ='';
    var totalsubkey = UpdatedBody['namespace'];
    var onebyone = UpdatedBody['updated_src'];
    for(let i=0;i<totalsubkey.length;i++)
    {
       var Item = totalsubkey[i];
       Keyvalueone= onebyone[Item];
       onebyone= Keyvalueone;
    }
    onebyone[keyName]=keyValue;
    UpdatedBody['updated_src'][onebyone]= onebyone;
    var bodyItem = UpdatedBody['updated_src'];
    this.setState({EditHttpBody:bodyItem});
  }

  */
  }

  changeHttpHeaderandBody(event)
  {
    var ResItem = event.target.value;
    if(ResItem!==this.state.defaultHeaderBody)
    {
      this.setState({defaultHeaderBody: ResItem})
      var requestorResponse= this.state.defaultResContent;
      if(requestorResponse==='Response')
      {
        if(ResItem==="Body")
        {
          this.setState({rescontent: this.state.apiresponseBody})
        }
        if(ResItem==="Header")
        {
          this.setState({rescontent: this.state.apiresponseHeader})
        }
      }
      if(requestorResponse==='Request')
      {
        if(ResItem==="Body")
        {
          this.setState({rescontent: this.state.apiRequestBody})
        }
        if(ResItem==="Header")
        {
          this.setState({rescontent: this.state.apiRequestHeader})
        }
      }
    }

  }
  UpdateAPIBody(event)
  {
    this.setState({checkAPIBody:false})
    var bodyContent= event.target.value;
    this.setState({apiBody: bodyContent})
    var currentRowNumber = this.state.currentDataSet;
    try{
    var TotoalItem= this.state.CollectionDataSet;
    console.log(TotoalItem)
    TotoalItem[currentRowNumber]=bodyContent;
    this.setState({CollectionDataSet:TotoalItem});
    }
    catch(error)
    {
      console.log(error)
    }

  }
  updateDataset(event)
  {
    var currentrowNumber=event.target.value;
    if(currentrowNumber!==this.state.currentDataSet)
    {
      this.setState({currentDataSet: currentrowNumber})
      var bodycontent= this.state.CollectionDataSet[currentrowNumber];
      this.setState({apiBody: bodycontent})
      var assertioncontent = this.state.CollectionAssertion[currentrowNumber];
      this.setState({AssertionList: assertioncontent})
      var varList = this.state.collectionPostVariable[currentrowNumber];
      this.setState({PostScripsVaribalesList: varList})
      try
      {
        JSON.parse(bodycontent);
        this.setState({checkAPIBody:false})
      }
      catch(Exception)
      {
        this.setState({checkAPIBody:true})
        this.setState({feedbackAPIBody:'Incorrect Json Body'})
      }
    }
    
  }
  UpdateNewAPIID(event)
  {
    this.setState({checknewAPIID:false});
    var Item= event.target.value;
    this.setState({newApiId: Item.trim()})
    var format = /[^A-Za-z0-9-]/ig;
    if(format.test(Item))
    {
        this.setState({checknewAPIID:true});
        return this.setState({feedbacknewAPIID:'Id* should not have special characters.'});
    }
    else
    {
      this.setState({checknewAPIID:false});
    }
  }
  UpdateNewAPIName(event)
  {
    this.setState({checknewAPIName:false});
    var Item= event.target.value;
    this.setState({checknewAPIName: false})
    this.setState({newApiName: Item})
    var format = /[^A-Za-z -]/ig;
    if(format.test(Item))
    {
        this.setState({checknewAPIName:true});
        return this.setState({feedbacknewAPIName:'Name should not have special characters.'});
    }
    
  }
  UpdateHttpMethod(event)
  {
    this.setState({HttpMethodName: event.target.value})
    this.setState({checkHttpMethod:false})
  }
  updateMockResponseCode(event)
  {
    var Item = event.target.value;
    this.setState({checkMockResponseCode:false});
    this.setState({mockResponseCode:Item});
    var format = /[^0-9]/ig;
    if(format.test(Item))
    {
        this.setState({checkMockResponseCode:true});
        return this.setState({feedbackMockResponseCode:'Response Code is not valid.'});
    }
    else
    {
      this.setState({checkMockResponseCode:false});
    }

  }
  updateMockResponseHeader(event)
  {
    var Item = event.target.value;
    this.setState({checkMockResponseHeader:false});
    this.setState({mockResponseHeader:Item});
      try{
        JSON.parse(Item);
        this.setState({checkMockResponseHeader:false});
      }
      catch(error)
      {
        this.setState({checkMockResponseHeader:true});
        return this.setState({feedbackMockResponseHeader:'Response header is not in Json format.'});
      }

  }
  updateMockResponseBody(event)
  {
    var Item = event.target.value;
    this.setState({checkMockResponseBody:false});
    this.setState({mockResponseBody:Item});
      try{
        JSON.parse(Item);
        this.setState({checkMockResponseBody:false});
      }
      catch(error)
      {
        this.setState({checkMockResponseBody:true});
        return this.setState({feedbackMockResponseBody:'Response Body is not in Json format.'});
      }

  }
  updateMockData()
  {
    var Message ='';
    var MCode = this.state.mockResponseCode;
    var MHeader = this.state.mockResponseHeader;
    var MBody = this.state.mockResponseBody;
    if(MCode ==='')
    {
      this.setState({checkMockResponseCode:true});
      this.setState({feedbackMockResponseCode:'Mock Response code can not be blank.'});
      Message= 'Mock Response code can not be blank.';
    }
    if(MHeader.trim() ==='')
    {
      this.setState({checkMockResponseHeader:true});
      this.setState({feedbackMockResponseHeader:'Mock Response header can not be blank.'});
      Message= Message+'Mock Response header can not be blank.';
    }
    if(MBody.trim() ==='')
    {
      this.setState({checkMockResponseBody:true});
      this.setState({feedbackMockResponseBody:'Mock Response body can not be blank.'});
      Message= Message+'Mock Response body can not be blank.';
    }
    if(Message !=='')
    {
      return;
    }
    if(this.state.checkMockResponseCode || this.state.checkMockResponseHeader || this.state.checkMockResponseBody )
    {
      return ;
    }
    this.setState({mockModal:false});
    this.setState({checkMock:true});
   
  }
  UpdateRelativeURI(event)
  {
    
    this.setState({checkRelativeURI: false})
    var relativeAPI= event.target.value
    this.setState({relativeURI: event.target.value})
    if(relativeAPI.toLowerCase().includes('http:') || relativeAPI.toLowerCase().includes('www.') )
    {
      this.setState({APIURI: relativeAPI})
    }
    else
    {
      var env = this.state.DefaultEnvironment;
      var comURI = this.state.componentURI;
      var URI= this.state.ConfigurationFile['ENVIRONMENTSETUP'][env][comURI];
      this.setState({APIURI: URI+relativeAPI})
    }
    
  }
  UpdateRecieverEmailAddress(event)
  {
    
    this.setState({checkReceiverEmail: false})
    this.setState({feedbackReceiverEmail: ''})
    this.setState({ReceiverEmail: event.target.value})
  }
  SendPreScriptsAPIRequest()
  {
    var Message ='';
    var apiComponent = this.state.PreAPIScriptType;
    if(apiComponent.trim() ==='')
    {
     Message= "API Component can not be blank."
     this.setState({checkKnownAPIScriptType:true})
     this.setState({feedbackKnownAPIComponent:'API Component can not be blank'})
    }
     var preScriptsName = this.state.DefaultPreGlobalScript;
     if(preScriptsName.trim() ==='')
     {
      Message= Message+ "API Id can not be blank."
      this.setState({checkKnownAPIID:true})
      this.setState({feedbackKnownAPIID:'API Id can not be blank'})
     }
     if(Message !=='')
     {
       return;
     }
     const RequestCall = async () => 
     {
       this.setState({defaultResContent:'Response'});
       this.setState({defaultHeaderBody:'Body'});
      //var baseApi= this.state.ConfigurationFile['ENVIRONMENTSETUP'][this.state.DefaultEnvironment]
       var envr= this.state.DefaultEnvironment;
       this.setState({loader:true})
       this.setState({pageloadingStatus:true})
       const reqcall = await fetch(APIBasePath+'apipregbscripts/'+preScriptsName+'/'+envr+'/true');
       const resobt = await reqcall.json();
       this.setState({allDataSetResponse:resobt});
       var responseBody = JSON.parse(JSON.stringify(resobt['1'].ResponseBody))
       this.setState({apiResCode:resobt['1'].ResponseCode})
       this.setState({apiresponseBody:responseBody})
       this.setState({apiresponseHeader:JSON.stringify(resobt['1'].ResponseHeader)})
       this.setState({rescontent:responseBody})
       //@ save request
       var reqBody=''
       try{
       reqBody= JSON.parse(JSON.stringify(resobt['1'].RequestBody))
       }
       catch(error)
       {}
       this.setState({apiRequestBody:reqBody})
       this.setState({apiRequestHeader:JSON.stringify(resobt['1'].RequestHeader)})
        //@ Update dataset
        var newdataList=[];
        for(let i=1;i<Object.keys(resobt).length;i++)
        {
          newdataList.push(i)
        }
        this.setState({allResponseDataSet:newdataList});
        var URIURL=resobt['1']['URI'];
        this.setState({responseURL:URIURL})
       if(resobt.success)
       {
          const RequestCall = async () => 
          {
            const reqcall = await fetch(APIBasePath+'apipregbscripts/'+preScriptsName+'/'+envr);
            const resobt = await reqcall.json();
            this.setState({PreScripsVaribalesList:funcAPIScripts.PreResponseVariableSave(resobt)})
            this.setState({loader:false});
            this.setState({apiResponseModal:true})
            this.setState({pageloadingStatus:false})
          }
          RequestCall();
       }
       else{
        this.setState({loader:false});
        this.setState({modal:true})
        return this.setState({modalValidationText:resobt.servermessage})
       }
       
       

     }
     RequestCall();
    
  }
  updateHttpBody(updated_src)
  {
    var defaultvalue= updated_src['new_value'];
    var keyName= this.state.httpBodyKeyName;
    var functionselection=this.state.httpBodyKeyValue;
    var valueToUpdate = '';
    if(functionselection==='')
    {
      valueToUpdate=defaultvalue;
    }
    else
    {
      valueToUpdate="${{"+functionselection+"}}";
    }
    var totalsubkey = updated_src['namespace'].length;
    if(totalsubkey===0)
    {
      updated_src['updated_src'][keyName]=valueToUpdate;
    }
    else
    {
      var Keyvalue ='';
       totalsubkey = updated_src['namespace'];
      var onebyone = updated_src['updated_src'];
      for(let i=0;i<totalsubkey.length;i++)
      {
         var Item = totalsubkey[i];
         Keyvalue= onebyone[Item];
         onebyone= Keyvalue;
      }
      onebyone[keyName]=valueToUpdate;
      updated_src['updated_src'][onebyone]= onebyone;
    }
     var bodyItem = updated_src['updated_src'];
     this.setState({httpBodyKeyName:''});
     this.setState({httpBodyKeyValue:''});
     this.setState({EditHttpBody:bodyItem})
    
     
  }
  

  selectKeyfromHttpBody(updated_src)
  {
    var keyName= updated_src['name'];
    this.setState({httpBodyKeyName:keyName})
    this.setState({JsonBodyhttpData:updated_src})
  }
  EvaluateCustomFunction()
  {
  
  var rowId= this.state.selectedUtilityRow;
  if(rowId ===0)
  {
    this.setState({alertColor:'danger'})
    this.setState({UtilityFunctionExpression:'please select utility function.'})
    return;
  }
  var functionName = this.state.OriginalUtilityContent[rowId-1].utilityfunction;
  var updatedFunctionName = this.state.UtilityFunctionList[rowId-1].utilityfunction;
  if(updatedFunctionName.trim() ==='')
  {
    this.setState({alertColor:'danger'})
    this.setState({UtilityFunctionExpression:'Utility function can not be blank.'})
    return;
  }
  if(!updatedFunctionName.includes('(') || !updatedFunctionName.includes(')'))
  {
    this.setState({alertColor:'danger'})
    this.setState({UtilityFunctionExpression:'syntax is incorrect for utility function'})
    return;
  }
  if(!functionName.includes('()'))
  {
    if(functionName.trim()===updatedFunctionName.trim())
    {
      this.setState({alertColor:'danger'})
        this.setState({UtilityFunctionExpression:'Please pass the argument in Utility function.'})
        return;
    }
  }
  
  //@ call API for evaluate

  var API =APIBasePath+'evaluator/utility.'+updatedFunctionName;
  const APICheckRequest = async () => 
  {
    const ORResponse = await fetch(API);
    const ORJson = await ORResponse.json();
    var Status ="Fail"
    try
    {
        Status = ORJson.status.toLowerCase();
     }
      catch(error)
      {}
    var Message = ORJson.message;
    if(Status==='pass')
    {
    this.setState({alertColor:'success'})
    this.setState({UtilityFunctionExpression:Message})
    
    }
    else
    {
    this.setState({alertColor:'danger'})
    this.setState({UtilityFunctionExpression:Message})
    }
    
    
  }
  APICheckRequest();

  }
  selectUtilityFunction()
  {
     var keyName= this.state.httpBodyKeyName;
     if(keyName.trim()==='')
     {
       this.setState({modal:true})
       return this.setState({modalValidationText:'Please select Json key (edit) and focus on value.'})
     }
     this.setState({loader:true});
     this.setState({selectedUtilityFunction:''});
     var Item = this.state.UtilityItem;
     var TotalFunction = Object.keys(Item).length;
     var TotalItem =[];
     for(let i=1;i<=TotalFunction;i++)
     {
        var utilityContent ={}
        utilityContent['id']=i;
        utilityContent['utilityfunction']=Item[i].toString();
        TotalItem.push(utilityContent);
     }
     this.setState({loader:false});
     this.setState({UtilityFunctionList:TotalItem})
     this.setState({utilityFunction:true})
  }
  updateBodyDatainEdit()
  {
    this.setState({httpBodyModal:false});
    var editableBody= JSON.stringify(this.state.EditHttpBody);
    this.setState({apiBody:editableBody})
    var currentRowNumber = this.state.currentDataSet;
    var TotoalItem= this.state.CollectionDataSet;
    TotoalItem[currentRowNumber]=editableBody;
    this.setState({CollectionDataSet:TotoalItem});

  }
  EditPostData()
  {
    var gbAPIBody= this.state.apiBody;
    if(gbAPIBody.trim()==='')
    {
      this.setState({checkAPIBody:true})
      return this.setState({feedbackAPIBody:'Http Body can not be blank.'})
    }
    else
    {
      this.setState({checkAPIBody:false})
    }
    var checkValid = genericHelper.checkJsonFormat(gbAPIBody);
    if(!checkValid)
    {
      this.setState({checkAPIBody:true})
      return this.setState({feedbackAPIBody:'Body has incorrect Json format'})
    }
    else
    {
      this.setState({checkAPIBody:false})
    }
    var bodyItem = funcAPIScripts.setAPIBody(gbAPIBody);
    this.setState({EditHttpBody:bodyItem});
    this.setState({httpBodyModal:true})
  }

  SendglobalAPIRequest()
  {
    var Message='';
    var gbHttpMethod= this.state.HttpMethodName;
    var gbRelativeAPI= this.state.relativeURI;
    var gbAPIURI= this.state.APIURI;
    var gbAPIBody= this.state.apiBody;
    var componentURL= this.state.componentURI;
    var environment= this.state.DefaultEnvironment;
    if(componentURL.trim() ==='')
    {
      Message= 'Component URI* can not be blank ';
      this.setState({checkComponentURI:true})
      this.setState({feedbackcomponentURL:'Component URI* can not be blank'})
    }
    else
    {
      this.setState({checkComponentURI:false})
    }
    
    if(gbHttpMethod.trim() ==='')
    {
      Message= Message+'Http Method* can not be blank';
      this.setState({checkHttpMethod:true})
    }
    else
    {
      this.setState({checkHttpMethod:false})
      if(gbHttpMethod==="POST" || gbHttpMethod==="PUT" || gbHttpMethod==="PATCH" )
      {
         if(gbAPIBody.trim()==='')
         {
          this.setState({checkAPIBody:true})
          this.setState({feedbackAPIBody:'Http Body can not be blank.'})
         }
         else{
          this.setState({checkAPIBody:false})
         }
      }
    }
    if(gbRelativeAPI.trim() ==='')
    {
      Message= Message+'Relative URI* can not be blank';
      this.setState({checkRelativeURI:true})
      this.setState({feedbackRelativeURI:'Relative URI* can not be blank'})
    }
    else
    {
      this.setState({checkRelativeURI:false})
    }
    if(Message.trim() !=='')
    {
      this.setState({checknewAPIName:false})
      return;
    }
    this.setState({checknewAPIName:false})
    //@ check http body in correct json format.
    var checkValid = genericHelper.checkJsonFormat(gbAPIBody);
    if(!checkValid)
    {
      this.setState({checkAPIBody:true})
      return this.setState({feedbackAPIBody:'Body has incorrect Json format'})
    }
    else{
      this.setState({checkAPIBody:false})
    }

    this.setState({defaultResContent:'Response'});
    this.setState({defaultHeaderBody:'Body'});
    var GlobalAPIRequestBody={};
    var HttpHeader={};
    GlobalAPIRequestBody['API']=gbAPIURI;
    GlobalAPIRequestBody['HttpMethod']=gbHttpMethod;
    var allRequest= this.state.HttpHeaderList;
    for(let i=0;i<allRequest.length;i++)
    {
      var ItemName = allRequest[i]['headername'];
      var ItemValue = allRequest[i]['headervalue'];
      HttpHeader[ItemName]=ItemValue;
    }
    GlobalAPIRequestBody['HttpHeader']=HttpHeader;
    let httpBody=''
    try{
       httpBody = JSON.parse(gbAPIBody);
    }
    catch(Exception)
    {

    }
    GlobalAPIRequestBody['Body']=httpBody;
    //@ qa
    var mockDataforSend ={};
    mockDataforSend['isMock'] = this.state.checkMock;
    mockDataforSend['ResponseCode'] = this.state.mockResponseCode;
    mockDataforSend['ResponseHeader'] = this.state.mockResponseHeader;
    mockDataforSend['ResponseBody'] = this.state.mockResponseBody;
    GlobalAPIRequestBody['MockData']=mockDataforSend;

      //@ Set The Post Variable List
      var sendPostVarItem = this.state.PostScripsVaribalesList;
      GlobalAPIRequestBody['PostVariable']=sendPostVarItem;

    //@ send Request to server
    var configjson = genericHelper.common_ChangeJsoncontentforServer(GlobalAPIRequestBody);
    var configAPI =APIBasePath+'apigbscripts/'+environment+'/0';
    var requestOptions = {
      method: 'POST',
      headers: {"Accept": "*/*",'Content-type': 'application/json'},
      body: JSON.stringify(configjson)
    };
    const GBREQ = async () => 
    {
      this.setState({loader:true})
      this.setState({pageloadingStatus:true});
      const Request = await fetch(configAPI,requestOptions);
      const Response = await Request.json();
      var URIURL=Response['URI'];
      this.setState({responseURL:URIURL})
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      var responseBody = JSON.parse(JSON.stringify(Response.ResponseBody))
      this.setState({apiResCode:Response.ResponseCode})
      this.setState({apiresponseBody:responseBody})
      this.setState({apiresponseHeader:JSON.stringify(Response.ResponseHeader)})
      this.setState({rescontent:responseBody})
      this.setState({postvarAPIResponse:Response["varItem"]})
      //@ save request
      var reqBody=''
      try{
      reqBody= JSON.parse(JSON.stringify(Response.RequestBody))
      }
      catch(error)
      {}
      this.setState({allResponseDataSet:[1]})
      this.setState({apiRequestBody:reqBody})
      this.setState({apiRequestHeader:JSON.stringify(Response.RequestHeader)})
      this.setState({apiResponseModal:true})

    }
    GBREQ();
    
  }
  
  addnewDataSet()
  {
      var gbAPIBody= this.state.apiBody;
      if(gbAPIBody.trim()==='')
      {
       this.setState({checkAPIBody:true})
       this.setState({feedbackAPIBody:'Http Body can not be blank.'})
       this.setState({modal:true})
       return this.setState({modalValidationText:'Http Body can not be blank for current Data Set.'})
      }
      else{
       this.setState({checkAPIBody:false})
      }
      var checkValid = genericHelper.checkJsonFormat(gbAPIBody);
      if(!checkValid)
      {
        this.setState({checkAPIBody:true})
        this.setState({feedbackAPIBody:'Body has incorrect Json format'})
        this.setState({modal:true})
        return this.setState({modalValidationText:'Error : Body has incorrect Json format for current Data Set.'})
      }
      else{

        this.setState({checkAPIBody:false})
        this.setState({newscriptLoader:true})
        var TotalItem=Number(this.state.allDataSet.length)+1;
        var dataset=[];
        for(let i=1;i<=TotalItem;i++)
        {
          dataset.push(i);
        }
        this.setState({allDataSet:dataset})
        this.setState({apiBody:''})
        var itemDataSet= this.state.CollectionDataSet;
        itemDataSet[TotalItem]='';
        this.setState({CollectionDataSet:itemDataSet});
        this.setState({currentDataSet:TotalItem});
        var assItem = this.state.CollectionAssertion;
        assItem[Number(TotalItem)-1]=this.state.AssertionList;
        var defaultassertion=[{id: 1, asstype: 'ResponseCode',assfunction:'EqualTo',assvalue:'200'}];
        assItem[TotalItem]=defaultassertion;
        this.setState({CollectionAssertion:assItem})
        this.setState({AssertionList:defaultassertion})
        var varList = this.state.collectionPostVariable;
        varList[Number(TotalItem)-1]=this.state.PostScripsVaribalesList;
        varList[TotalItem]='';
        this.setState({collectionPostVariable:varList});
        this.setState({PostScripsVaribalesList:''});
        this.setState({newscriptLoader:false})
    }
  }
  updateResponseDataSet(event)
  {
     var current = event.target.value;
     if(current !==this.state.defaultResponseDataset)
     {
      this.setState({defaultResponseDataset:current})
      var resobt = this.state.allDataSetResponse;
      var responseBody = JSON.parse(JSON.stringify(resobt[current].ResponseBody))
      this.setState({apiResCode:resobt[current].ResponseCode})
      this.setState({apiresponseBody:responseBody})
      this.setState({apiresponseHeader:JSON.stringify(resobt[current].ResponseHeader)})
      this.setState({rescontent:responseBody})
      //@ save request
      var reqBody=''
      try{
      reqBody= JSON.parse(JSON.stringify(resobt[current].RequestBody))
      }
      catch(error)
      {}
      this.setState({apiRequestBody:reqBody})
      this.setState({apiRequestHeader:JSON.stringify(resobt[current].RequestHeader)})
      this.setState({defaultResContent:'Response'})
      this.setState({defaultHeaderBody:'Body'})
     }
  }
  deleteselectedDataSet()
  {
     var currentRow = this.state.currentDataSet;
     if(currentRow===1)
     {
      this.setState({modal:true})
      return this.setState({modalValidationText:'Data Set 1 can not delete.'})
     }
     var TotalItem= this.state.CollectionDataSet;
     delete TotalItem[currentRow];
     var ItemAfterDelete=[];
     var counter=1;
     for(let i=1;i<=TotalItem.length;i++)
     {
       try
       {
        var Itemcheck = TotalItem[i];
        if(Itemcheck !=='undefined' || Itemcheck.length===0)
        {
         var check = genericHelper.checkJsonFormat(TotalItem[i])
         if(check)
         {
           ItemAfterDelete[counter]= TotalItem[i];
           counter=Number(counter)+1;
         }
        }
      }
       catch(error)
       {}
     }
     this.setState({CollectionDataSet:ItemAfterDelete})
     this.setState({currentDataSet:1})
     this.setState({apiBody:ItemAfterDelete[1]})
     TotalItem=ItemAfterDelete.length;
     var dataset=[];
     for(let i=1;i<TotalItem;i++)
     {
       dataset.push(i);
     }
     this.setState({allDataSet:dataset})

  }
  checkMockCheckbox(event)
  {
    if(event.target.checked)
    {
      this.setState({mockModal:true});
    }
    else{
      this.setState({checkMock:false});
    }
  }
  SaveGlobalRequest()
  {
    var Message='';
    var newscriptId = this.state.newApiId.trim();
    var gbScriptName = this.state.newApiName.trim();
    var gbHttpMethod= this.state.HttpMethodName.trim();
    var gbRelativeAPI= this.state.relativeURI.trim();
    var replaceItm= this.state.relativeURI.trim();
    var gbAPIBody= this.state.apiBody.trim();
    var componentURL= this.state.componentURI.trim();
    var gbAPIURI= this.state.componentURI.trim();
    var currentRow =this.state.currentDataSet;
    var APIComponent = this.state.newAPIComponent.trim();
    var AuthCredData = this.state.AuthcredenKey;

    if(componentURL.trim() ==='')
    {
      Message= 'Component URI* can not be blank ';
      this.setState({checkComponentURI:true})
      this.setState({feedbackURIComponent:'Component URI* can not be blank'})
    }
    else
    {
      this.setState({checkComponentURI:false})
    }
    if(newscriptId.trim() ==='')
    {
      Message= 'API Script Id* can not be blank.';
      this.setState({checknewAPIID:true})
      this.setState({feedbacknewAPIID:'API Script Id* can not be blank.'})
    }
    else
    {
      this.setState({checknewAPIID:false})
    }
    if(gbScriptName.trim() ==='')
    {
      Message= 'Name* can not be blank ';
      this.setState({checknewAPIName:true})
      this.setState({feedbacknewAPIName:'Name* can not be blank'})
    }
    
    if(gbHttpMethod.trim() ==='')
    {
      Message= Message+'Http Method* can not be blank';
      this.setState({feedbackhttpMethod:'Http Method* can not be blank'})
      this.setState({checkHttpMethod:true})
    }
    else
    {
      this.setState({checkHttpMethod:false})
      if(gbHttpMethod==="POST" || gbHttpMethod==="PUT" || gbHttpMethod==="PATCH" )
      {
         if(gbAPIBody.trim()==='')
         {
          this.setState({checkAPIBody:true})
          return this.setState({feedbackAPIBody:'Http Body can not be blank.'})
         }
         else{
          this.setState({checkAPIBody:false})
         }
      }
    }
    if(gbRelativeAPI.trim() ==='')
    {
      Message= Message+'Relative URI* can not be blank';
      this.setState({checkRelativeURI:true})
      this.setState({feedbackRelativeURI:'Relative URI* can not be blank'})
    }
    else
    {
      this.setState({checkRelativeURI:false})
    }
    if(Message.trim() !=='')
    {
      return;
    }
    if(this.state.checknewAPIID)
    {
      this.setState({checknewAPIID:true});
      this.setState({feedbacknewAPIID:this.state.feedbacknewAPIID});
      Message= Message+'API ID* is already exist.';
      return;
    }
    if(this.state.checknewAPIName)
    {
      Message= Message+'API Name* should not have special character';
    }
    if(Message.trim() !=='')
    {
      return;
    }
    if(APIComponent ==='')
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:'API Component* can not be blank.'})
    }
    if(this.state.checkNewComponent)
    {
      this.setState({modal:true})
      return this.setState({modalValidationText:'API Component* should not have special character.'})
    }
    //check APi Name
    this.setState({newscriptLoader:true});
    this.setState({pageloadingStatus:true});
    const Req4 = async () => 
      {
        const Request4 = await fetch(APIBasePath+'apiscripts/'+newscriptId.trim())
        const Response4 = await Request4.json();
        this.setState({newscriptLoader:false});
        this.setState({pageloadingStatus:false});
        if(Response4.success)
        {
          this.setState({checknewAPIID:true});
          return this.setState({feedbacknewAPIID:Response4.servermessage});
        }
        else{
          this.setState({checknewAPIID:false});
          var checkValid = genericHelper.checkJsonFormat(gbAPIBody);
          if(!checkValid)
          {
            this.setState({checkAPIBody:true})
            return this.setState({feedbackAPIBody:'Body has incorrect Json format'})
          }
          else{
            this.setState({checkAPIBody:false})
          }
          var bodyPostItem = this.state.CollectionDataSet;
          bodyPostItem[currentRow]=this.state.apiBody;
          //this.setState({CollectionDataSet:bodyPostItem});
          var verificationItem = this.state.CollectionAssertion;
          verificationItem[currentRow]=this.state.AssertionList;
         // this.setState({CollectionAssertion:verificationItem});
          var postvarItem = this.state.collectionPostVariable;
          postvarItem[currentRow]=this.state.PostScripsVaribalesList;
          var allItemBody = bodyPostItem;
          var datasetLength= Object.keys(allItemBody).length;
          var allFormatedBody={};
          for(let i=1;i<datasetLength;i++)
          {
            var checkforBodynew ='';
            var bodyonebyOne = allItemBody[i];
            if(bodyonebyOne.trim () !=='')
            {
              try
              {
                checkforBodynew = JSON.parse(bodyonebyOne);
              }
              catch(Exception)
              {
                this.setState({currentDataSet:i});
                this.setState({apiBody:allItemBody[i]})
                this.setState({checkAPIBody:true})
                this.setState({feedbackAPIBody:'Incorrect Json Body'})
                this.setState({modal:true})
                return this.setState({modalValidationText:'Json Body is incorrect for Data Set -: '+i+"."})
              }
            }
            allFormatedBody[i]=checkforBodynew;
          }
          var allItemAssertion = verificationItem;
          datasetLength= Object.keys(allItemAssertion).length;
          var allFormatedAssertion={};
          for(let i=1;i<= datasetLength;i++)
          {
            allFormatedAssertion[i]=allItemAssertion[i];
          }
          var allItemPostVar = postvarItem;
          datasetLength= Object.keys(allItemPostVar).length;
          var allFormatedPostVar={};
          for(let i=1;i<=datasetLength;i++)
          {
      
            allFormatedPostVar[i]=allItemPostVar[i];
          }
          //@
      
          this.setState({newscriptLoader:true})
          var GlobalAPIRequestBody={};
          var HttpHeader={};
          GlobalAPIRequestBody['API']=gbAPIURI;
          GlobalAPIRequestBody['relativeURL']=gbRelativeAPI;
          GlobalAPIRequestBody['HttpMethod']=gbHttpMethod;
          var allRequest= this.state.HttpHeaderList;
          for(let i=0;i<allRequest.length;i++)
          {
            var ItemName = allRequest[i]['headername'];
            var ItemValue = allRequest[i]['headervalue'];
            HttpHeader[ItemName]=ItemValue;
          }
          GlobalAPIRequestBody['HttpHeader']=HttpHeader;
          GlobalAPIRequestBody['Body']=allFormatedBody;
          
          //@ Set The Post Variable List
      
          var sendPostVarItem= allFormatedPostVar;
          var countForJSONLenth= Object.keys(sendPostVarItem).length;
          var sendItemforPostVarItem={};
          for(let i=1;i<=countForJSONLenth;i++)
          {
            var PostVaribale={};
            var PostResp= sendPostVarItem[i];
            for(let j=0;j<PostResp.length;j++)
            {
              ItemName = PostResp[j]['varname'];
               ItemValue = PostResp[j]['resvalue'];
              PostVaribale[ItemName]=ItemValue;
            }
            sendItemforPostVarItem[i]=PostVaribale;
          }
          GlobalAPIRequestBody['PostVariable']=sendItemforPostVarItem;
      
          var sendAssertionItem= allFormatedAssertion;
          var sendItemforAssertion={};
          for(let i=1;i<=Object.keys(sendAssertionItem).length;i++)
          {
            var Assertion={};
            var assertionList= sendAssertionItem[i];
            for(let j=0;j<assertionList.length;j++)
            {
               ItemName = assertionList[j]['asstype'];
              var expression = assertionList[j]['assfunction'];
               ItemValue = assertionList[j]['assvalue'];
              Assertion[ItemName]=expression+'||'+ItemValue;
            }
            sendItemforAssertion[i]=Assertion;
          }
      
          GlobalAPIRequestBody['Assertion']=sendItemforAssertion;
          GlobalAPIRequestBody['APIComponent']=APIComponent;
          GlobalAPIRequestBody['AuthorizationKey']=AuthCredData;
          var mockDataforSend ={};
          mockDataforSend['isMock'] = this.state.checkMock;
          mockDataforSend['ResponseCode'] = this.state.mockResponseCode;
          mockDataforSend['ResponseHeader'] = this.state.mockResponseHeader;
          mockDataforSend['ResponseBody'] = this.state.mockResponseBody;
          GlobalAPIRequestBody['MockData']=mockDataforSend;
          //@ send Request to server
          var configjson = genericHelper.common_ChangeJsoncontentforServer(GlobalAPIRequestBody);
          this.setState({pageloadingStatus:true});
          var configAPI =APIBasePath+'apiscripts/'+newscriptId.trim()+'@'+gbScriptName+'/true';
          var requestOptions = {
            method: 'POST',
            headers: {"Accept": "*/*",'Content-type': 'application/json'},
            body: JSON.stringify(configjson)
          };
          const GBREQ = async () => 
          {
            const Request = await fetch(configAPI,requestOptions);
            const Response = await Request.json();
            if(Response.success)
            {
              const Req2 = async () => 
              {
                const request2 = await fetch(APIBasePath+'apiscripts');
                const Response2 = await request2.json();
                this.setState({newApiName:''});
                this.setState({relativeURI:''});
                this.setState({apiBody:''});
                this.setState({APIURI:this.state.APIURI.replace(replaceItm,'')});
                this.setState({PostScripsVaribalesList:[]});
                this.setState({AssertionList:[]});
                this.setState({AssertionList:[{id: 1, asstype: 'ResponseCode',assfunction:'EqualTo',assvalue:'200'}]});
                this.setState({newscriptLoader:false});
                this.setState({newAPIScriptType:''});
                this.setState({HttpMethodName:''});
                this.setState({allGlobalScriptName:Response2});
                this.setState({CollectionDataSet:[{1:''}]})
                this.setState({CollectionAssertion:[{1:''}]})
                this.setState({collectionPostVariable:[{1:''}]})
                this.setState({modal:true})
                this.setState({modalValidationText:'New API script is successfully created.'})
                this.setState({PreAPIScriptType:''});
                this.setState({DefaultPreGlobalScript:''});
                this.setState({allGlobalScriptName:[]});
                this.setState({newAPIComponent:''});
                this.setState({newApiId:''});
                this.setState({AuthcredenKey:''});
                this.setState({PreScripsVaribalesList:[]});
                this.setState({knownAPIName:''});
                this.setState({pageloadingStatus:false});
                this.setState({checkMock:false});
                this.setState({mockResponseCode:200});
                this.setState({mockResponseHeader:'{}'});
                this.setState({mockResponseBody:'{}'});
              }
              Req2();
            }
            else{
              this.setState({newscriptLoader:false});
              this.setState({modal:true})
              this.setState({modalValidationText:Response.output})
            }
          }
          GBREQ();
      
        }

      }
    Req4();
  


  }
  addNewPreScriptVaribale = () => 
	{
		var ItemCount =this.state.PreScripsVaribalesList.length
		this.setState({loader:true})
		if(ItemCount>0)
		{
			var valuecheck = this.state.PreScripsVaribalesList[ItemCount-1].varname
			//console.log(valuecheck);
			if(valuecheck.trim()==="")
			{
				this.setState({loader:false})
				this.setState({modal:true})
			    return this.setState({modalValidationText:'Please add information on blank row, before adding new row'})
			}
		}
		var lastOneId = this.state.PreScripsVaribalesList.length + 1;
		this.setState({ PreScripsVaribalesList: [...this.state.PreScripsVaribalesList, {
			id: `${lastOneId}`, varname: ``,resvalue:``
		}] });
		this.setState({loader:false});
	}
  addNewPostScriptVaribale = () => 
	{
    var headerItem= this.state.PostScripsVaribalesList;
    var rowid= this.state.selectedvarTableRow;
    if(Number(rowid)===0)
    {
      rowid=headerItem.length;
    }
    this.setState({loader:true})
    this.setState({pageloadingStatus:true});
    var checkblankInfo= genericHelper.common_checkblankvalueinJarray(headerItem,'varname');
    if(checkblankInfo)
    {
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please add information on blank row, before adding new row'})
    }
    var allItemAfterInsertion=genericHelper.common_AddIteminJarrayBasedonIndex(headerItem,Number(rowid),['id','varname','resvalue'],'id');
    this.setState({PostScripsVaribalesList:allItemAfterInsertion})
    this.setState({selectedvarTableRow:Number(rowid)+1})
	  this.setState({loader:false});
    this.setState({pageloadingStatus:false});
	}

  addNewAssertion = () => 
	{
    var headerItem= this.state.AssertionList;
    var rowid= this.state.selectedassertiontableRow;
    if(Number(rowid)===0)
    {
      rowid=headerItem.length;
    }
    this.setState({loader:true})
    this.setState({pageloadingStatus:true});
    var checkblankInfo= genericHelper.common_checkblankvalueinJarray(headerItem,'asstype');
    if(checkblankInfo)
    {
      this.setState({loader:false})
      this.setState({pageloadingStatus:false});
      this.setState({modal:true})
      return this.setState({modalValidationText:'Please add information on blank row, before adding new row'})
    }
    var allItemAfterInsertion=genericHelper.common_AddIteminJarrayBasedonIndex(headerItem,Number(rowid),['id','asstype','assfunction','assvalue'],'id');
    this.setState({AssertionList:allItemAfterInsertion})
    this.setState({selectedassertiontableRow:Number(rowid)+1})
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
  deletePrescriptVariable = () => {
		this.setState({loader:true})
		var lastOneId = this.state.PreScripsVaribalesList.length;
    if(lastOneId===0)
    {
      this.setState({loader:false})
      return ;
    }
    var NewUpdatedItem = this.state.PreScripsVaribalesList.splice(0,Number(lastOneId)-1)
		this.setState({ PreScripsVaribalesList: NewUpdatedItem });
		this.setState({loader:false})
	  };

    deletePostscriptVariable = () => {
      this.setState({loader:true})
      var allItem = this.state.PostScripsVaribalesList;
      var rowid= this.state.selectedvarTableRow;
      if(Number(rowid)>0)
      {
        this.setState({loader:true})
        this.setState({pageloadingStatus:true})
        var updatedItem= genericHelper.common_deleteIteminJarrayBasedonIndex(allItem,rowid,'id');
        this.setState({ PostScripsVaribalesList: updatedItem });
        if(Number(rowid)>updatedItem.length)
        {
          this.setState({ selectedvarTableRow: 0 });
        }
        else{
          this.setState({ selectedvarTableRow: Number(rowid) });
        }
        this.setState({loader:false})
        this.setState({pageloadingStatus:false})
      }
      };

      deleteAssertionType = () => {
        var allItem = this.state.AssertionList;
        var rowid= this.state.selectedassertiontableRow;
        if(Number(rowid)>0)
        {
          this.setState({loader:true})
          this.setState({pageloadingStatus:true})
          var updatedItem= genericHelper.common_deleteIteminJarrayBasedonIndex(allItem,rowid,'id');
          this.setState({ AssertionList: updatedItem });
          if(Number(rowid)>updatedItem.length)
          {
            this.setState({ selectedassertiontableRow: 0 });
          }
          else{
            this.setState({ selectedassertiontableRow: Number(rowid) });
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

  toggleapiResponseModal = modalType => () => {
		if (!modalType) {
		  return this.setState({
			apiResponseModal: !this.state.apiResponseModal,
		  });
		}
	
		this.setState({
		  [`apiResponseModal${modalType}`]: !this.state[`apiResponseModal${modalType}`],
		});
	  };

    togglehttpBodyModal = modalType => () => {
      if (!modalType) {
        return this.setState({
          httpBodyModal: !this.state.httpBodyModal,
        });
      }
    
      this.setState({
        [`httpBodyModal${modalType}`]: !this.state[`httpBodyModal${modalType}`],
      });
      };
      togglemockModal = modalType => () => {
        if (!modalType) {
          return this.setState({
            mockModal: !this.state.mockModal,
          });
        }
      
        this.setState({
          [`mockModal${modalType}`]: !this.state[`mockModal${modalType}`],
        });
        };

      toggleUtilityFunction = modalType => () => {
        if (!modalType) {
          return this.setState({
          utilityFunction: !this.state.utilityFunction,
          });
        }
      
        this.setState({
          [`utilityFunction_${modalType}`]: !this.state[`utilityFunction_${modalType}`],
        });
        };

        handleOnUtilitySelect = (row, isSelect) => {
          if (isSelect) 
          {
            var selectedUtilityRowId= row.id;
            this.setState({selectedUtilityRow:selectedUtilityRowId});
          }
      
        }
    handleOnTestStepSelect = (row, isSelect) => {
      if (isSelect) 
      {
        var selectedrow= row.id;
        this.setState({ selectedStepNumber: selectedrow });
      }
  
    }
    handleOnVarTableSelect = (row, isSelect) => {
      if (isSelect) 
      {
        var selectedrow= row.id;
        this.setState({ selectedvarTableRow: selectedrow });
      }
  
    }
    handleOnAssertionTableSelect = (row, isSelect) => {
      if (isSelect) 
      {
        var selectedrow= row.id;
        this.setState({ selectedassertiontableRow: selectedrow });
      }
  
    }

  render() {
    const selecthttpHeaderRow = {
      mode: 'radio',
      onSelect: this.handleOnTestStepSelect,
      selected:[this.state.selectedStepNumber]
    };
    const selectVarTableRow = {
      mode: 'radio',
      onSelect: this.handleOnVarTableSelect,
      selected:[this.state.selectedvarTableRow]
    };
    const selectAssertionTableRow = {
      mode: 'radio',
      onSelect: this.handleOnAssertionTableSelect,
      selected:[this.state.selectedassertiontableRow]
    };
    const selectRowforUtilityFunction = {
      mode: 'radio',
      onSelect: this.handleOnUtilitySelect
      };
      const textareaBase = {
        minHeight:'300px'};
        const textareaModal = {
          minHeight:'100px'};
    const options = {
      sizePerPage: 5,
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true
      };
      const Utilityoptions = {
        sizePerPage: 5,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true
        };
      var varAsserColumns = [
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
          dataField: 'asstype',
          text: 'Expression*',
          validator: (newValue, row, column) => {
          if (newValue.trim()==='') {
            return {
            valid: false,
            message: 'ASSERTION Type* can not be blank.'
            };
          }
          return true;
          }
        },
        {
          dataField: 'assfunction',
          text: 'Function*',
          editor: {
            type: Type.SELECT,
            options: [{
              value: 'EqualTo',
              label: 'EqualTo'
            }, {
              value: 'Contains',
              label: 'Contains'
            },
            {
              value: 'Length',
              label: 'Length'
            },
            {
              value: 'KeyNotExist',
              label: 'KeyNotExist'
            },
            {
              value: 'LengthGreaterThanZero',
              label: 'LengthGreaterThanZero'
            },
            {
              value: 'KeyExist',
              label: 'KeyExist'
            },
            {
              value: 'ValueNotNull',
              label: 'ValueNotNull'
            },
          ]
            },
          validator: (newValue, row, column) => {
          if (newValue.trim()==='') {
            return {
            valid: false,
            message: 'Function* can not be blank.'
            };
          }
          return true;
          }
        },
        {
          dataField: 'assvalue',
          text: 'Expected value',
          }
        ];
        var UtilityFunctioncolumns = [
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
            dataField: 'utilityfunction',
            text: 'Utility Function*',
            filter: textFilter()
          }
          ];
          var varAPIVarColumns = [
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
              dataField: 'varname',
              text: 'Variable Name*',
            },
            {
              dataField: 'resvalue',
              text: 'Value',
            }
            ];
            var varexistingReqColumns = [
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
                dataField: 'varname',
                text: 'Name*',
              },
              {
                dataField: 'resvalue',
                text: 'Response value',
                }
              ];
      var varColumns = [
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
          dataField: 'varname',
          text: 'Variable Name*',
          validator: (newValue, row, column) => {
          if (newValue.trim()==='') {
            return {
            valid: false,
            message: 'Varibale Name* can not be blank.'
            };
          }
          var totalCount = this.state.PreScripsVaribalesList.length;
          for(let i=0;i<totalCount;i++)
          {
            var ItemName = this.state.PreScripsVaribalesList[i].varname;
            if(ItemName.trim().toLowerCase()===newValue.trim().toLowerCase())
            {
              return {
                valid: false,
                message: 'Varibale Name* can not be duplicate.'
                };
            }
          }
          return true;
          }
        },
        {
          dataField: 'resvalue',
          text: 'Request/Response Key',
          validator: (newValue, row, column) => {
            var chek1= newValue.trim().toString().toLowerCase().includes('requestbody');
            var chek2= newValue.trim().toString().toLowerCase().includes('requestheader');
            var chek3= newValue.trim().toString().toLowerCase().includes('responsebody');
            var chek4= newValue.trim().toString().toLowerCase().includes('responseheader');
            if (chek1 || chek2 || chek3 || chek4 ) {
            
            }
            else{
              return {
                valid: false,
                message: 'Key* must be started with ResponseBody or ResponseHeader or RequestBody or RequestHeader'
                };
            }
          }
          }
        ];
        var varexistingReqColumns = [
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
            dataField: 'varname',
            text: 'Name*',
          },
          {
            dataField: 'resvalue',
            text: 'Response value',
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

  return (
    <Page title="API Scripts" breadcrumbs={[{ name: 'APIscripts', active: true }]}>
      
      <Loader 
        type="ThreeDots"
        color="#00BFFF"
        height={50}
        width={100}
        timeout={120000} //3 secs
        visible = {this.state.loader}
      />
      <Accordion  title="Select pre-existing scripts as input">
	    <Row>
        <Col lg={6} md={6} sm={6} xs={6}>
          <Card>
            <CardHeader>Select existing API scripts
            <Button disabled={this.state.pageloadingStatus} onClick={this.SendPreScriptsAPIRequest.bind(this)} color="secondary" name ="SendpreApiReq">Send</Button>
            </CardHeader>
            <CardBody>
              <Form>
              <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                   Component*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkKnownAPIScriptType} type="select" name="apiscriptType" value ={this.state.PreAPIScriptType} onChange={this.UpdatePreScriptType.bind(this)}>
                      <option></option>
                      <GetAllGlobalScriptName options={this.state.allKnownAPIComponent} />
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackKnownAPIComponent}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                   Test Id*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkKnownAPIID} type="select" name="globalScriptName" value ={this.state.DefaultPreGlobalScript} onChange={this.UpdatePreGlobalScriptName.bind(this)}>
                      <option></option>
                      <GetOptionKeys options={this.state.allGlobalScriptName} />
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackKnownAPIID}
                   </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                   Test Name*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="input" name="knownAPIName" value ={this.state.knownAPIName}>
					          </Input>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Response variable Value
              {/*
              <CardImg
                  className="card-img-right"
                    src={bg1Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.addNewPreScriptVaribale() }
                    />
                  <CardImg
                    className="card-img-right"
                    src={bg3Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.deletePrescriptVariable() }
                  />
                */}
              </CardHeader>
            <CardBody>
            <BootstrapTable
                keyField="id"
                data={ this.state.PreScripsVaribalesList }
                columns={ varexistingReqColumns }
                striped
                hover
                condensed
                pagination={ paginationFactory(options) }
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      </Accordion >
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Loader 
          type="ThreeDots"
          color="#00BFFF"
          height={50}
          width={100}
          timeout={120000} //3 secs
          visible = {this.state.newscriptLoader}
          />
          <Card>
            <CardHeader>New API Scripts
            <Button disabled={this.state.pageloadingStatus} onClick={this.SendglobalAPIRequest.bind(this)} color="secondary" name ="SendgbApiReq">Send</Button>
            <Button disabled={this.state.pageloadingStatus} onClick={this.SaveGlobalRequest.bind(this)} color="secondary" name ="savegbapireq">Save API Scripts</Button>
            <FormControlLabel
              control={<Checkbox  />}
              label="Is Mock"
              checked={this.state.checkMock}
              onChange={this.checkMockCheckbox.bind(this)}
            />
            </CardHeader>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={4} md={4} sm={4} xs={4}>
          <Card>
            <CardHeader>Basic Information *
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
                  URL key*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkComponentURI} type="select" name="comurl" value ={this.state.componentURI} onChange={this.UpdateComponentURI.bind(this)}>
                     <option></option>
                      <GetAllEnvName options={this.state.allCoponentURIList} />
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackURIComponent}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                  Component*
                  </Label>
                  <Col>
                    <Combobox disabled={this.state.pageloadingStatus} invalid={this.state.checkNewComponent} name ="comenvlist" 
                      value={this.state.newAPIComponent}
                      data={genericHelper.common_GetListKeyFromJsonResponce(this.state.allKnownAPIComponent)}
                      caseSensitive={false}
                      minLength={3}
                      onSelect={this.addnewComponent.bind(this)}
                      onChange={this.addnewComponent.bind(this)}
                    />
                  </Col>
                 </FormGroup>
                 <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Test ID*
                  </Label>
                  <Col >
                  <Input disabled={this.state.pageloadingStatus} invalid={this.state.checknewAPIID} type="input" name="newAPIId"  value ={this.state.newApiId} onChange={this.UpdateNewAPIID.bind(this)}/>
                    <FormFeedback>
                      {this.state.feedbacknewAPIID}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Test Name*
                  </Label>
                  <Col >
                  <Input disabled={this.state.pageloadingStatus} invalid={this.state.checknewAPIName} type="input" name="newAPIName"  value ={this.state.newApiName} onChange={this.UpdateNewAPIName.bind(this)}/>
                    <FormFeedback>
                      {this.state.feedbacknewAPIName}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Http Method*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkHttpMethod} value={this.state.HttpMethodName} type="select" name="httpMethod" onChange={this.UpdateHttpMethod.bind(this)}>
					            <option selected="selected">{this.state.HttpMethodName}</option>
					            <option>GET</option>
                      <option>POST</option>
                      <option>PUT</option>
                      <option>PATCH</option>
                      <option>DELETE</option>
					          </Input>
                    <FormFeedback>
                    {this.state.feedbackhttpMethod}
                    </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Relative url*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkRelativeURI} type="input" name="relaiveURI"  value ={this.state.relativeURI} onChange={this.UpdateRelativeURI.bind(this)}/>
                    <FormFeedback>
                      {this.state.feedbackRelativeURI}
                   </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                    Authorization credential key
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="comurl" value ={this.state.AuthcredenKey} onChange={this.UpdateAuthKeyData.bind(this)}>
                     <option></option>
                      <GetAllEnvName options={this.state.allAuthCredentialData} />
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" >
                    API url*
                  </Label>
                  <Col disabled ="disabled" >
                    <Input disabled={this.state.pageloadingStatus} readOnly invalid={this.state.checkAPIURI} type="input" name="APIURI"  value ={this.state.APIURI} />
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
              <Modal
				        isOpen={this.state.apiResponseModal}
				        toggle={this.toggleapiResponseModal()}
				        backdrop="static"
					      className={this.props.className}>
                <ModalHeader  toggle={this.toggleapiResponseModal()} >API Response
                </ModalHeader>
                <ModalBody >
               <Form>
                  <FormGroup>
                    <Label for="exampleSelect">
                    <b>Url</b>: {this.state.responseURL}
                    </Label >
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleSelect">
                    <b>Response code</b>: {this.state.apiResCode}
                    </Label >
                  </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                  <Input disabled={this.state.pageloadingStatus} type="select" name="resmessage" value ={this.state.defaultResContent} onChange={this.changeRequestResponseContent.bind(this)}>
                    <option>Response</option>
                    <option>Request</option>
                  </Input>
                  </Col>
                  <Col sm={6}>
                  <Input disabled={this.state.pageloadingStatus} type="select" name="resmessage1" value ={this.state.defaultHeaderBody} onChange={this.changeHttpHeaderandBody.bind(this)}>
                    <option>Body</option>
                    <option>Header</option>
                  </Input>
                  </Col>
							</FormGroup>
							<FormGroup row>
							  <Col>
                <JSONPretty disabled={this.state.pageloadingStatus} data={this.state.rescontent} ></JSONPretty>       
							  </Col>
							</FormGroup>
              <FormGroup>
                  <Col>
                    <Card>
                      <CardHeader>Variable value</CardHeader>
                      <CardBody>
                      <BootstrapTable
                          keyField="id"
                          data={ this.state.postvarAPIResponse }
                          columns={ varAPIVarColumns }
                          striped
                          hover
                          condensed
                        />
                      </CardBody>
                    </Card>
                  </Col>
                  </FormGroup>
						 </Form>
					  </ModalBody>
            </Modal>
            <Modal
				isOpen={this.state.utilityFunction}
				toggle={this.toggleUtilityFunction()}
				backdrop="static"
					className={this.props.className}>
					<ModalHeader  toggle={this.toggleUtilityFunction()} >Utility Function</ModalHeader>
						<CardHeader  >
							<Alert color= { this.state.alertColor }>
								{this.state.UtilityFunctionExpression}
							</Alert>
						</CardHeader>
					<ModalBody >
						<BootstrapTable 
								keyField="id"
								data={ this.state.UtilityFunctionList }
								columns={ UtilityFunctioncolumns }
								striped
								hover
								condensed
								pagination={ paginationFactory(Utilityoptions) }
								selectRow={ selectRowforUtilityFunction }
								filter={ filterFactory() }
								cellEdit={ cellEditFactory({
									mode: 'click',
									blurToSave: true,
									})}
							/>
					</ModalBody>
					<ModalFooter>
					    <Button disabled={this.state.pageloadingStatus} onClick={this.EvaluateCustomFunction.bind(this)} color="secondary">
						  Evaluate
					   </Button>
						<Button disabled={this.state.pageloadingStatus} color="secondary" onClick={this.selectUtilityFunctionfromList.bind(this)}>
						 Select Utility Data
					   </Button>
					</ModalFooter>
            </Modal>
            <Modal
				        isOpen={this.state.httpBodyModal}
				        toggle={this.togglehttpBodyModal()}
				        backdrop="static"
					      className={this.props.className}>
                <ModalHeader  toggle={this.togglehttpBodyModal()} >HTTP Body
                 <Button  onClick={this.selectUtilityFunction.bind(this)} color="secondary" name ="callUtility">Select Utility Function</Button>
                 <Button onClick={this.updateBodyDatainEdit.bind(this)} color="secondary" name ="updateBody">Update</Button>
                </ModalHeader>
                <ModalBody>
              <Form>
							<FormGroup row>
							  <Col>
                <ReactJson disabled={this.state.pageloadingStatus} style ={textareaBase} src={this.state.EditHttpBody} theme="monokai" onEdit={this.updateHttpBody.bind(this)} onSelect={this.selectKeyfromHttpBody.bind(this)}/>   
							  </Col>
							</FormGroup>
						 </Form>
					  </ModalBody>
            </Modal>
            <Modal
				        isOpen={this.state.mockModal}
				        toggle={this.togglemockModal()}
				        backdrop="static"
					      className={this.props.className}>
                <ModalHeader  toggle={this.togglemockModal()} >API Mock’s Response
                 <Button  color="secondary" name ="updateMockResponse" onClick={this.updateMockData.bind(this)}>Update</Button>
                </ModalHeader>
                <ModalBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                   Response Code*
                  </Label>
                  <Col>
                    <Input invalid={this.state.checkMockResponseCode} type="input" name="mockCode" value ={this.state.mockResponseCode} onChange={this.updateMockResponseCode.bind(this)} >
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackMockResponseCode}
                   </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                   Response Header*
                  </Label>
                  <Col>
                    <Input invalid={this.state.checkMockResponseHeader} style ={textareaModal} type="textarea" name="mocResponseHeader" value ={this.state.mockResponseHeader} onChange={this.updateMockResponseHeader.bind(this)}>
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackMockResponseHeader}
                   </FormFeedback>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={6}>
                   Response Body*
                  </Label>
                  <Col>
                    <Input invalid={this.state.checkMockResponseBody} style ={textareaModal} type="textarea" name="mockBody" value ={this.state.mockResponseBody} onChange={this.updateMockResponseBody.bind(this)}>
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackMockResponseBody}
                   </FormFeedback>
                  </Col>
                </FormGroup>
						 </Form>
					  </ModalBody>
            </Modal>
          </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={3} md={3} sm={3} xs={3}>
          <Card>
            <CardHeader>HTTP BODY
            <Button disabled={this.state.pageloadingStatus} onClick={this.EditPostData.bind(this)} color="secondary" name ="editPostData">Edit Data</Button>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" >
                    Data Set*
                  </Label >
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="newdataset" value ={this.state.currentDataSet} onChange={this.updateDataset.bind(this)}>
                    <GetAllGlobalScriptName options={this.state.allDataSet} />
					          </Input>
                  </Col>
                  <CardImg
                    className="card-img-right"
                      src={bg1Image}
                      style={{ width: 'auto', height: 30 }}
                      onClick={ () => this.addnewDataSet() }
                      />
                    <CardImg
                      className="card-img-right"
                      src={bg3Image}
                      style={{ width: 'auto', height: 30 }}
                      onClick={ () => this.deleteselectedDataSet() }
                    />
                </FormGroup>
                <FormGroup row>
                  <Col>
                  <Input disabled={this.state.pageloadingStatus} style ={textareaBase} invalid={this.state.checkAPIBody} type="textarea" name="apiBody" value ={this.state.apiBody} onChange={this.UpdateAPIBody.bind(this)}>
					          </Input>
                    <FormFeedback>
                      {this.state.feedbackAPIBody}
                    </FormFeedback>
                  </Col>
                  
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      <Col lg={5} md={5} sm={5} xs={5}>
          <Card>
            <CardHeader>HTTP Header*
              <CardImg
                  className="card-img-right"
                    src={bg1Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.addNewhttpHeader() }
                    />
                  <CardImg
                    className="card-img-right"
                    src={bg3Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.deleteHttpHeaderList() }
                  />
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
              />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={6}>
          <Card>
            <CardHeader>Save Pre/Post Request and Response
              <CardImg
                  className="card-img-right"
                    src={bg1Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.addNewPostScriptVaribale() }
                    />
                  <CardImg
                    className="card-img-right"
                    src={bg3Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.deletePostscriptVariable() }
                  />
              </CardHeader>
            <CardBody>
            <BootstrapTable
                keyField="id"
                data={ this.state.PostScripsVaribalesList }
                columns={ varColumns }
                striped
                hover
                condensed
                pagination={ paginationFactory(options) }
                selectRow={ selectVarTableRow }
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  })}
              />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={6}>
          <Card>
            <CardHeader>Assertion
              <CardImg
                  className="card-img-right"
                    src={bg1Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.addNewAssertion() }
                    />
                  <CardImg
                    className="card-img-right"
                    src={bg3Image}
                    style={{ width: 'auto', height: 30 }}
                    onClick={ () => this.deleteAssertionType() }
                  />
              </CardHeader>
            <CardBody>
            <BootstrapTable
                keyField="id"
                data={ this.state.AssertionList }
                columns={ varAsserColumns }
                striped
                hover
                condensed
                pagination={ paginationFactory(options) }
                selectRow={ selectAssertionTableRow }
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  })}
              />
            </CardBody>
          </Card>
        </Col>
     </Row>
    </Page>
  );
  }
};

export default APIScripts;
