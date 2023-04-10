import Page from 'components/Page';
import React from 'react';
import bg3Image from 'assets/img/bg/deleterow.JPG';
import bg1Image from 'assets/img/bg/addnewrow.JPG';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import genericHelper from '../funcLibraries/GenericHelper.js';
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
  CardImg,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Alert,
} from 'reactstrap';

import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory,{Type} from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
var APIBasePath= window.ENV.APIURL;

function Options({ options }) {
    return (
        options.map(option => 
                    <option >{option.Environment}</option>)
                   );
}

class CustomFunction extends React.Component{
	constructor(props){
		super(props);
		this.state={
		  allModuleName: [],
		  allTestID:[],
		  ModuleName:'',
		  TestScriptModuleName:'',
		  NewTestID:'',
		  Env:'',
          CommonDataallItem:[],
		  CommonDataItemList:[],
		  CommonDataTotalSize:0,
		  CommonDataItem: [],
		  GetCommonItem:[],
		  TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}],
		// TestScriptTestData:[],
		  allActionNameList:[],
		  selectedCommonKey:'',
		  selectedTestStepNumber:0,
		  modal: false,
		  utilityFunction:false,
		  modalValidationText:'',
		  testDatacolumns :[{dataField: 'testdatacolid',text: '#',headerStyle: { width: '40px' }}],
		  testDataItemrowList:[],
		  selectedLastHeaderColumn:'',
		  selectedHeaderColumn:'',
		  headernameCheck:false,
		  newHeaderName:'',
		  testscriptcheckENV:false,
		  testscriptcheckModule:false,
		  testscriptchecktestID:false,
		  testscriptchecktestName:false,
		  testCaseName:'',
		  customFunctionName:'',
		  customStepFrom:'',
		  customStepTo:'',
		  customFunctionNameCheck:false,
		  customFunctionstepFromCheck:false,
		  customFunctionstepToCheck:false,
		  checkNewColName:false,
		  NewColName:'',
		  checkmodEnv:false,
		  checkCustomFunction:false,
		  customFunction:'',
		  customFunctionList:[],
		  modEnv:'',
		  UtilityFunctionExpression:'',
		  selectedUtilityRow:0,
		  UtilityFunctionList:[],
		  UtilityItem:[],
		  UtilityFunction:[],
		  selectedUtilityFunction:'',
		  OriginalUtilityContent:[],
		  showalert:false,
		  alerttext:'',
		  showModal:false,
		  alertColor:'',
		  CommonTestData:[],
		  loader:true,
		  loaderTestSteps:false,
		  CheckCustomFunObjective:false,
		  customFunctionObjective:'',
		  CheckCustomFunParameter:false,
		  customFunctionParameter:'',
		  customFunctionCheck:[],
		  pageloadingStatus :false,
		}

		const GetLoaderData = async () => 
		{
		  this.setState({pageloadingStatus:true});
		  const homepage = await fetch(APIBasePath+'dashboard');
		  const homepageResponse = await homepage.json();
		  this.setState({CommonTestData:homepageResponse.CommonTestData});
		  	const req2 = async () => 
			{
				const request2 = await fetch(APIBasePath+'testscript/0/0')
				const req2Response = await request2.json();
				this.setState({allActionNameList:req2Response})
				const req3 = async () => 
				{
					const request3 = await fetch(APIBasePath+'customfunction')
					const re3Response = await request3.json();
					this.setState({customFunctionList:re3Response})
					this.setState({customFunctionCheck:genericHelper.common_GetListvalueFromJsonResponce(re3Response)})
					const req4 = async () => 
					{
						const request4 = await fetch(APIBasePath+'customfunction/0/0')
						const re4Response = await request4.json();
						this.setState({UtilityItem:re4Response})
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
						this.setState({loader:false})
						this.setState({pageloadingStatus:false});
					}
					req4();
				}
				req3();
			}
			req2();
		}
		GetLoaderData();

		
	  }

	  SelectmodEnv(event){
		this.setState({CommonDataItem : []})
		this.setState({modEnv : ''})
		this.setState({CommonDataTotalSize : 0})
		this.setState({checkmodEnv:false})
		var onchangeenvvalue = event.target.value;
		this.setState({modEnv : event.target.value})
		this.setState({loader:true})
		var URL =  APIBasePath+'testscript/'+onchangeenvvalue;
		const req1 = async () => 
		{
			this.setState({pageloadingStatus:true});
			const request1 = await fetch(URL)
			const Response1 = await request1.json();
			this.setState({CommonDataItem:executionHelper.GetListOfListItemforCommonItem(Response1)})
			this.setState({CommonDataTotalSize:this.state.CommonDataItem.length})
			this.setState({loader:false})
			this.setState({pageloadingStatus:false});
		}
		req1();

	  }
	  SaveCommonTestData()
	  {
		 var ExceptionMessage ='';
		 var envName= this.state.modEnv
		 if(envName.trim()==="")
		 {
		   this.setState({checkmodEnv:true})
		   ExceptionMessage= ExceptionMessage+ 'Environment* can not be left blank.'
		 }
		 if(ExceptionMessage.trim() !=="")
		 {
		  // this.setState({modal:true})
		   return this.setState({modalValidationText:ExceptionMessage})
		 }
		 if(!this.state.CommonTestDataChange)
		 {
			 this.setState({modal:true})
			 return this.setState({modalValidationText:'No Changes to Save'})
		 }
 
		 //@ Get all value from Common test data
		 var commonTestDataItem = this.state.CommonDataItem;
		 var CommonJObject ={};
		 for(let i=0;i<commonTestDataItem.length;i++)
		 {
			 CommonJObject[commonTestDataItem[i].commonKeyName.toString()]=commonTestDataItem[i].commonKeyValue.toString();
		 }
		 
		 var ORjson = genericHelper.common_ChangeJsoncontentforServer(CommonJObject)
		 var ORAPI =APIBasePath+'testdata/'+envName;
		 var requestOptions = {
		   method: 'POST',
		   headers: {"Accept": "*/*",'Content-type': 'application/json'},
		   body: JSON.stringify(ORjson)
		 };
		 const commonDataRequest = async () => 
		 {
			this.setState({pageloadingStatus:true});
		   const ORResponse = await fetch(ORAPI,requestOptions);
		   const ORJson = await ORResponse.json();
		   this.setState({pageloadingStatus:false});
		   if(ORJson.success.toLowerCase()==='true')
		   {
			 this.setState({modal:true})
			 this.setState({modalValidationText:ORJson.servermessage})
		   }
		   else
		   {
			 this.setState({modal:true})
			 this.setState({modalValidationText:ORJson.servermessage})
		   }
		   
		   
		 }
		 commonDataRequest();
 
	  }
	  selectionCommonData()
	  {
		var ItemforMod =[];
		var selectedItemRow = this.state.selectedTestStepNumber;
		if(selectedItemRow===0)
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please select test step number.'})
		}
		var Item = this.state.selectedCommonKey;
		if(Item.trim()==="")
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please select valid Key Name* from Common test data.'})
		}
		else
		{
			this.setState({loaderTestSteps:true})
			var actionName= this.state.TestScriptTestData[this.state.selectedTestStepNumber-1].action;
			if(this.state.customFunctionCheck.includes(actionName))
			{
				var intialvalue= this.state.TestScriptTestData[this.state.selectedTestStepNumber-1].value;
				if(intialvalue.trim()==='')
				{
					ItemforMod = this.state.TestScriptTestData;
					ItemforMod[this.state.selectedTestStepNumber-1].value = 'c.'+Item;
					this.setState({TestScriptTestData:ItemforMod})
				}
				else
				{
					ItemforMod = this.state.TestScriptTestData;
					ItemforMod[this.state.selectedTestStepNumber-1].value = intialvalue+',c.'+Item;
					this.setState({TestScriptTestData:ItemforMod})
				}
			}
			else
			{
				ItemforMod = this.state.TestScriptTestData;
				ItemforMod[this.state.selectedTestStepNumber-1].value = 'c.'+Item;
				this.setState({TestScriptTestData:ItemforMod})
			}
			this.setState({ TestScriptTestData: [...this.state.TestScriptTestData]});
			this.setState({loaderTestSteps:false})
		}
	
	  }
	  selectUtilityFunctionfromList()
	  {
		var ItemforMod =[];
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
		this.setState({loaderTestSteps:true})
		this.setState({utilityFunction:false})
		this.setState({UtilityFunctionExpression:''})
		this.setState({alertColor:''})
		var actionName= this.state.TestScriptTestData[this.state.selectedTestStepNumber-1].action;
		if(this.state.customFunctionCheck.includes(actionName))
		{
			var intialvalue= this.state.TestScriptTestData[this.state.selectedTestStepNumber-1].value;
			if(intialvalue.trim()==='')
			{
				ItemforMod = this.state.TestScriptTestData;
				ItemforMod[this.state.selectedTestStepNumber-1].value = 'utility.'+updatedFunctionName.trim();
				this.setState({TestScriptTestData:ItemforMod})
			}
			else
			{
				ItemforMod = this.state.TestScriptTestData;
				ItemforMod[this.state.selectedTestStepNumber-1].value = intialvalue+',utility.'+updatedFunctionName.trim();
				this.setState({TestScriptTestData:ItemforMod})
			}
		}
		else
		{
			ItemforMod = this.state.TestScriptTestData;
			ItemforMod[this.state.selectedTestStepNumber-1].value = 'utility.'+updatedFunctionName.trim();
			this.setState({TestScriptTestData:ItemforMod})
		}
		this.setState({ TestScriptTestData: [...this.state.TestScriptTestData]});
		this.setState({loaderTestSteps:false})
	
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
		  this.setState({pageloadingStatus:true});
		  const ORResponse = await fetch(API);
		  const ORJson = await ORResponse.json();
		  this.setState({pageloadingStatus:false});
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
	  updateCustomFunction(event)
	  {
		  var runTimeModule = event;
		  if(runTimeModule.trim().includes(' '))
		  {
			this.setState({modal:true})
			this.setState({modalValidationText:'Custom function name should not have any space'})
			return;
		  }
		  if(runTimeModule.trim()==="")
		  {
			  return;
		  }
		  var isCheck= genericHelper.common_CheckValueFromJson(this.state.allActionNameList,runTimeModule);
		  if(isCheck)
		  {
			var isCheck1= genericHelper.common_CheckValueFromJson(this.state.customFunctionList,runTimeModule);
			if(!isCheck1)
			{
				this.setState({modal:true})
				this.setState({modalValidationText:'Function name '+runTimeModule+' is reserved, Please choose different name.'})
				return;
			}
		  }
		  this.setState({customFunction:runTimeModule})
		  try {
			  this.setState({loader:true})
			  //console.log(APIBasePath+'customfunction/'+runTimeModule.trim()+'/1/0');
			  var testscriptAPI =APIBasePath+'customfunction/'+runTimeModule.trim()+'/1/0';
		  const TestScriptContentCheck = async () => 
		  {
			  this.setState({pageloadingStatus:true});
			  const ORResponse = await fetch(testscriptAPI);
			  this.setState({pageloadingStatus:false});
			  const testscriptcontentItem = await ORResponse.json();
			  try
			   {
				    var ResponseCheck= testscriptcontentItem[runTimeModule.trim()];
					var countCheck = Object.keys(ResponseCheck).length;
					if(countCheck.length===0)
					{
						this.setState({loader:false})
						this.setState({TestScriptTestData:[]})
						this.setState({TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}]})
						return;
					}
					var funcObjective= testscriptcontentItem['Objective'];
					var funcParameter= testscriptcontentItem['Parameter'];
					this.setState({customFunctionObjective:funcObjective})
					this.setState({customFunctionParameter:funcParameter})
				  }
				  catch(error)
				  {
					this.setState({pageloadingStatus:false});
					this.setState({customFunctionObjective:''})
					this.setState({customFunctionParameter:''})
					this.setState({TestScriptTestData:[]})
					this.setState({TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}]})
				  }
			try
			{
			  var cusFunSteps= testscriptcontentItem[runTimeModule.trim()];
			  var count = Object.keys(cusFunSteps).length;
			  
			  if(count>0)
			  {
				var JsonItem = cusFunSteps;
				var jstestStepData={};
				var jstestStepDatacollection=[];
				for(let i=1;i<=count;i++)
				{
					jstestStepData={};
					jstestStepData["teststepid"]=JsonItem[i].teststepid;
					jstestStepData["stepdescription"]=JsonItem[i].stepdescription;
					jstestStepData["action"]=JsonItem[i].action;
					jstestStepData["locator"]=JsonItem[i].locator;
					jstestStepData["locatorproperty"]=JsonItem[i].locatorproperty;
					jstestStepData["value"]=JsonItem[i].value;;
					jstestStepData["exitIfFail"]=JsonItem[i].exitIfFail;
					//jstestStepDatacollection[i]=jstestStepData;
					jstestStepDatacollection.push(jstestStepData);
				}
			  this.setState({TestScriptTestData:jstestStepDatacollection})
			  this.setState({loader:false})
			  this.setState({pageloadingStatus:false});
			}
		}
		catch(error)
		{
			this.setState({pageloadingStatus:false});
			this.setState({TestScriptTestData:[]})
			this.setState({TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}]})
		}
			this.setState({loader:false})
		}
			 
		TestScriptContentCheck();
		}
		catch (e) 
		{
			this.setState({loader:false})
			this.setState({pageloadingStatus:false});
		}
		  
	  }

	  UpdateCustomFunctionName(event)
	  {
		  this.setState({CheckCustomFunObjective:false})
		  this.setState({customFunctionObjective : event.target.value})
	  }
	  UpdateCustomFunctionParameter(event)
	  {
		  this.setState({CheckCustomFunParameter:false})
		  this.setState({customFunctionParameter : event.target.value})
	  }

	  selectionTestData()
	  {
		var selectedItemRow = this.state.selectedTestStepNumber;
		if(selectedItemRow==="")
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please select test step number.'})
		}
		var testdataColLength = this.state.testDatacolumns.length;
		if(testdataColLength===1)
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please add column header in test data.'})
		}
		var Item = this.state.selectedHeaderColumn;
		if(Item.trim()==="")
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please click on test data column header.'})
		}
		var ItemforMod =[];
		ItemforMod = this.state.TestScriptTestData;
		ItemforMod[this.state.selectedTestStepNumber-1].value = 't.'+Item;
		this.setState({TestScriptTestData:ItemforMod})
		this.setState({ TestScriptTestData: [...this.state.TestScriptTestData]});
	  }
	  selectionUtilityData()
	  {
		var selectedItemRow = this.state.selectedTestStepNumber;
		if(selectedItemRow===0)
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please select test step number.'})
		}
		this.setState({loaderTestSteps:true});
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
		this.setState({loaderTestSteps:false});
		this.setState({UtilityFunctionList:TotalItem})
		this.setState({utilityFunction:true})

	  }

	  DeleteCustomFunction()
	  {
		  var CustomFunction = this.state.customFunction;
		  if(CustomFunction.trim()==='')
		  {
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please Select Custom Function Name* before Delete.'})
		  }
		  this.setState({loader:true})
		  var DeletetAPI =APIBasePath+'customfunction/'+CustomFunction.trim()+'/2/0';
		  const DeleteAPICall = async () => 
		  {
			this.setState({pageloadingStatus:true});
			  const APIRequest = await fetch(DeletetAPI);
			  const APIResponse = await APIRequest.json();
			  this.setState({loader:false})
			  this.setState({pageloadingStatus:false});
			  if(APIResponse.success)
			  {
				var newCusFunct=genericHelper.common_RemoveItesmfromListinJobject(this.state.customFunctionList,CustomFunction)
				this.setState({customFunctionList:newCusFunct})
				this.setState({customFunctionObjective:''});
				this.setState({customFunctionParameter:''});
				this.setState({customFunction:''})
 				this.setState({testDatacolumns:[{dataField: 'testdatacolid',text: '#',headerStyle: { width: '40px' }}]})
				 this.setState({TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}]})
				this.setState({modal:true})
				return this.setState({modalValidationText:APIResponse.servermessage})
			  }
			  else
			  {
				this.setState({modal:true})
				return this.setState({modalValidationText:APIResponse.servermessage})
			  }
		}	 
		DeleteAPICall();
	  }
		SaveTestScripts()
		{
			
		  var testscriptENV= this.state.modEnv;
		  var cusFun = this.state.customFunction;
		  if(cusFun.trim()==="")
		  {
			this.setState({modal:true})
			return this.setState({modalValidationText:'Custom Function name can not be blank.'})
		  }
		  
		  //@ check action Name is not blank on step
		  var blankCheck= this.state.TestScriptTestData[0].action;
		  if(blankCheck.trim()==="")
		  {
			this.setState({modal:true})
			return this.setState({modalValidationText:'Action name can not be blank on test step.'})
		  }
		  var Message ='';
		  var CusFuncObje='';
		  var CusFuncParam='';
		  CusFuncObje = this.state.customFunctionObjective;
		  CusFuncParam = this.state.customFunctionParameter;
		  if(CusFuncObje.trim()==="")
		  {
			Message='Function Objective can not be blank';
			this.setState({CheckCustomFunObjective:true})
		  }
		  if(CusFuncParam.trim()==="")
		  {
			Message=Message+'Function Parameter can not be blank';
			this.setState({CheckCustomFunParameter:true})
		  }
		  if(Message.trim() !=='')
		  {
			  return;
		  }


		  //-- Saving Common test data
		  this.setState({loaderTestSteps:true})
		  var successSteps = true;
		  if(testscriptENV.trim() !=="")
		  {
			var lastindex = this.state.CommonDataTotalSize;
			var commondataCount = this.state.CommonDataItem.length
			var jsObj={};
			for(let i=lastindex;i<commondataCount;i++)
			{
				var ItemName = this.state.CommonDataItem[i].commonKeyName;
				if(ItemName.trim()!=='')
				{
					var ItemValue = this.state.CommonDataItem[i].commonKeyValue;
					jsObj[ItemName]=ItemValue;
				}
			}
			var json = genericHelper.common_ChangeJsoncontentforServer(jsObj);
			let count = Object.keys(jsObj).length;
			if(count>0)
			{
				var requestOptions = 
				{
					method: 'POST',
					headers: {"Accept": "*/*",'Content-type': 'application/json'},
					body: JSON.stringify(json)
				};
				const req1 = async () => 
                {
					this.setState({pageloadingStatus:true});
                    const request1 = await fetch(APIBasePath+'testscript/'+testscriptENV,requestOptions)
                    const req1Response = await request1.json();
					this.setState({pageloadingStatus:false});
					if(!req1Response.success)
					{
						successSteps= false;
						this.setState({modal:true})
						return this.setState({modalValidationText:'ISSUE: '+req1Response.servermessage})
					}
                }
                  req1();
			}
		}
		if(!successSteps)
		{
			return;
		}
		  //-- Save Test Steps
		  var tesStepRowCount =this.state.TestScriptTestData.length;
		  var jstestStepData={};
		  var jstestStepDatacollection={};
		  var ORTestStepData={};
		  var ORItem={};
		  var Item=0;
		  if(tesStepRowCount>0)
		  {
			  for(let i=0;i<tesStepRowCount;i++)
			  {
				  jstestStepData={};
				  ORTestStepData={};
				  var locatorName= this.state.TestScriptTestData[i].locator;
				  var locatorProperty= this.state.TestScriptTestData[i].locatorproperty;
				  jstestStepData["teststepid"]=this.state.TestScriptTestData[i].teststepid;
				  jstestStepData["stepdescription"]=this.state.TestScriptTestData[i].stepdescription;
				  jstestStepData["action"]=this.state.TestScriptTestData[i].action;
				  jstestStepData["locator"]=locatorName;
				  jstestStepData["locatorproperty"]=locatorProperty;
				  jstestStepData["value"]=this.state.TestScriptTestData[i].value;
				  jstestStepData["exitIfFail"]=this.state.TestScriptTestData[i].exitIfFail;
				  jstestStepDatacollection[i+1]=jstestStepData;
				  if(locatorName.trim() !=='' && locatorProperty.trim() !=='' )
				  {
					Item=Item+1;
					ORTestStepData["locator"]=locatorName;
					ORTestStepData["locatorproperty"]=locatorProperty;
					ORItem[Item]=ORTestStepData;
				  }
			  }
				//var ORjson = '['+JSON.stringify(ORItem)+']'
				let OrToTatalItem = Object.keys(ORItem).length;
				if(OrToTatalItem>0)
				{
					var ORjson = genericHelper.common_ChangeJsoncontentforServer(ORItem)
					var ORAPI =APIBasePath+'customfunction';
					 requestOptions = {
						method: 'POST',
						headers: {"Accept": "*/*",'Content-type': 'application/json'},
       					body: JSON.stringify(ORjson)
					};
					const SaveORRequest = async () => 
					{
						this.setState({pageloadingStatus:true});
						const ORResponse = await fetch(ORAPI,requestOptions);
						const ORJson = await ORResponse.json();
						this.setState({pageloadingStatus:false});
						if(!ORJson.success)
						{
							this.setState({loaderTestSteps:false})
							successSteps= false;
							this.setState({modal:true})
							return this.setState({modalValidationText:ORJson.servermessage})
						}

					}
					SaveORRequest();
				}
			  if(!successSteps)
			  {
				 this.setState({loaderTestSteps:false})
				  return;
			  }
			  var FunctionItemContent={};
			  FunctionItemContent['Objective']=CusFuncObje;
			  FunctionItemContent['Parameter']=CusFuncParam;
			  FunctionItemContent[cusFun.trim()]=jstestStepDatacollection;
			   json = genericHelper.common_ChangeJsoncontentforServer(FunctionItemContent);
			   console.log(json);
			   requestOptions = 
			  {
				method: 'POST',
				headers: {"Accept": "*/*",'Content-type': 'application/json'},
				body: JSON.stringify(json)
			  };
			  
			var API= APIBasePath+'customfunction/'+cusFun
			const req2 = async () => 
			{
				this.setState({pageloadingStatus:true});
				const request2 = await fetch(API,requestOptions)
				const req2Response = await request2.json();
				this.setState({pageloadingStatus:false});
				if(!req2Response.success)
				{
					this.setState({loaderTestSteps:false})
					this.setState({modal:true})
					return this.setState({modalValidationText:'ISSUE: '+req2Response.servermessage})
				}
				 //@ Reset Base State
				 this.setState({NewColName:''})
				 this.setState({selectedHeaderColumn:''})
				 this.setState({TestScriptTestData:[]})
				 this.setState({Env:''})
				 this.setState({ModuleName:''})
				 this.setState({NewTestID:''})
				 this.setState({testCaseName:''})
				 this.setState({CommonDataItem:[]})
				 this.setState({testDatacolumns:[{dataField: 'testdatacolid',text: '#',headerStyle: { width: '40px' }}]})
				 this.setState({TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}]})
				 this.setState({customFunctionName:''})
				 this.setState({customStepFrom:''})
				 this.setState({customStepTo:''})
				 this.setState({customFunctionNameCheck:false})
				 this.setState({customFunctionstepFromCheck:false})
				 this.setState({customFunctionstepToCheck:false})
				 this.setState({customFunction:''})
				 this.setState({customFunctionObjective:''})
				 this.setState({customFunctionParameter:''})
				 const req3 = async () => 
                  {
					this.setState({pageloadingStatus:true});
                    const request3 = await fetch(APIBasePath+'customfunction')
                    const req3Response = await request3.json();
					this.setState({pageloadingStatus:false});
					this.setState({customFunctionList:req3Response})
					this.setState({loaderTestSteps:false})
					this.setState({modal:true})
					return this.setState({modalValidationText:'Custom function is successfully created/updated.'})
                  }
                req3();
			}
			req2();
  
		  }
		  else
		  {
			  this.setState({loaderTestSteps:false})
			  this.setState({modal:true})
			  this.setState({pageloadingStatus:false});
			  return this.setState({modalValidationText:'Test Steps is missing in test scripts.'})
		  }
		 
	}

	addNewCommonData = () => 
	{
		var ItemCount =this.state.CommonDataItem.length
		if(ItemCount>0)
		{
			var valuecheck = this.state.CommonDataItem[ItemCount-1].commonKeyName
			if(valuecheck.trim()==="")
			{
				this.setState({modal:true})
			    return this.setState({modalValidationText:'Before adding new Common key, add previous Common key.'})
			}
		}
		this.setState({loader:true})
		var lastOneId = this.state.CommonDataItem.length + 1;
		this.setState({ CommonDataItem: [...this.state.CommonDataItem, {
			id: `${lastOneId}`, commonKeyName: ``,commonKeyValue:``
		}] });
		this.setState({loader:false})
	}

	addNewTestSteps = () => 
	{
		//# New Implementation
		var ItemList = this.state.TestScriptTestData;

		if(ItemList.length>0)
		{
			for(let i=0;i<ItemList.length;i++)
			{
				var actionName= ItemList[i]['action'];
				if(actionName.trim() ==="")
				{
					this.setState({modal:true})
			        return this.setState({modalValidationText:'Please add the test step information for record number '+(i+1)+', before adding new record.'});
				}
			}
		}
        this.setState({loaderTestSteps:true})
		var selectedID = this.state.selectedTestStepNumber;
		if(selectedID>ItemList.length)
		{
			selectedID=0;
		}
		if(selectedID ===0)
		{
			selectedID= ItemList.length;
		}
		var UpdatedRow=[]
		for(let i=0;i<selectedID;i++)
		{
			UpdatedRow[i]= this.state.TestScriptTestData[i];
		}
		//@ add New Row
		var NewItemContent ={};
		try
		{
		selectedID= parseInt(selectedID.trim())
		}
		catch(error)
		{}
		var StepNo= selectedID+1;
		NewItemContent['teststepid']=StepNo;
		NewItemContent['stepdescription']='Add Test Step '+StepNo+' description'
		NewItemContent['action']='';
		NewItemContent['locator']='';
		NewItemContent['locatorproperty']='';
		NewItemContent['value']='';
		NewItemContent['exitIfFail']='Y';
		UpdatedRow.push(NewItemContent)

		for(let i=selectedID;i<ItemList.length;i++)
		{
			ItemList[i]['teststepid']=i+2;
			UpdatedRow.push(ItemList[i]);
		}
		this.setState({ TestScriptTestData: UpdatedRow});
		this.setState({loaderTestSteps:false})
		//# End of Implementation

	}
	deleteCommonData = () => {
		this.setState({loader:true})
		var lastOneId = this.state.CommonDataItem.length;
		var updatedBooks = this.state.CommonDataItem.filter(m => m.id !== lastOneId.toString());
		this.setState({ CommonDataItem: updatedBooks });
		this.setState({loader:false})
	  };
	  deleteTestSteps = () => 
	  {
		var ItemList = this.state.TestScriptTestData;
		if(ItemList.length===0)
		{
			return;
		}
		var selectedID = this.state.selectedTestStepNumber;
		if(selectedID===0)
		{
			return;
		}
		this.setState({loaderTestSteps:true})
		var testData = this.state.TestScriptTestData.filter(m => m.teststepid !== selectedID);
		for(let i=selectedID;i<=testData.length;i++)
		{
			testData[i-1]['teststepid']=i;
		}
		this.setState({ TestScriptTestData: testData });
		this.setState({selectedTestStepNumber:selectedID})
		this.setState({loaderTestSteps:false})
	  };
	  handleDataChange = ({ dataSize }) => {
		this.setState({ rowCount: dataSize });
	  }
	  handleOnSelect = (row, isSelect) => {
		if (isSelect) 
		{
			var selectedrow= row.id;
			var GetItem = this.state.CommonDataItem[selectedrow-1].commonKeyName;
			this.setState({ selectedCommonKey: GetItem });

		}

	}
	handleOnTestStepSelect = (row, isSelect) => {
		if (isSelect) 
		{
			var selectedrow= row.teststepid;
			this.setState({ selectedTestStepNumber: selectedrow });
		}

	}
	handleOnUtilitySelect = (row, isSelect) => {
		if (isSelect) 
		{
			//var selectedrow= row.utilityfunction;
			var selectedUtilityRowId= row.id;
			this.setState({selectedUtilityRow:selectedUtilityRowId});
		}

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

	  toggleModal = () => {
		this.setState({
		  show: !this.state.showModal,
		});
	  };

    render() {

	  const selectRow = {
		mode: 'radio',
		onSelect: this.handleOnSelect
		};
		const selectRowforUtilityFunction = {
			mode: 'radio',
			onSelect: this.handleOnUtilitySelect
			};
		const selectTestScriptRow = {
		mode: 'radio',
		onSelect: this.handleOnTestStepSelect
		};
		const rowEvents = {
			onClick: (e, row, rowIndex) => {
				//console.log(`clicked on row with index: ${rowIndex}`);
		}};
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
	  const testScriptoptions = {
		sizePerPage: 10,
		hideSizePerPage: true,
		hidePageListOnlyOnePage: true
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
		  dataField: 'commonKeyName',
		  text: 'Key Name*',
		  filter: textFilter(),
		  validator: (newValue, row, column) => {
			if (newValue.trim()==='') {
			  return {
				valid: false,
				message: 'Key Name* can not be blank.'
			  };
			}
			var totalCount = this.state.CommonDataItem.length;
			for(let i=0;i<totalCount;i++)
			{
				var ItemName = this.state.CommonDataItem[i].commonKeyName;
				if(ItemName.trim().toLowerCase()===newValue.trim().toLowerCase())
				{
					return {
						valid: false,
						message: 'Key Name* can not be duplicate.'
						};
				}
			}
			return true;
		  }
		},
		{
			dataField: 'commonKeyValue',
			text: 'Key Value',
			filter: textFilter()
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
	  var testScriptcolumns = [
		{
		  dataField: 'teststepid',
		  text: '#',
		  headerStyle: { width: '40px' }
		},
		{
		  dataField: 'stepdescription',
		  text: 'Step description*',
		  headerStyle: {
		  backgroundColor: '#c8e6c9'
		  },
		  validator: (newValue, row, column) => {
		  if (newValue.trim()==='') {
			return {
			  valid: false,
			  message: 'Step description* can not be blank.'
			};
		  }
		  return true;
		}
		},
		{
			dataField: 'action',
			text: 'Action*',
			headerStyle: {
				backgroundColor: '#c8e6c9',
				width: '110px'
			  },
			  editor: {
				type: Type.SELECT,
				options: executionHelper.GetListOfListforActionName(this.state.allActionNameList)
			  },
			  validator: (newValue, row, column) => {
			  if (newValue.trim()==='') {
				return {
				  valid: false,
				  message: 'Action* can not be blank.'
				};
			  }
			  return true;
			}
			  
			  
		},
		{
			dataField: 'locator',
			text: 'Locator',
			headerStyle: {
				backgroundColor: '#c8e6c9',
				width: '100px'
				
			  },
			  editor: {
				type: Type.SELECT,
				options: [{
				  value: 'id',
				  label: 'Id'
				}, {
				  value: 'name',
				  label: 'Name'
				}, {
					value: 'classname',
					label: 'ClassName'
				  },
				  {
					value: 'xpath',
					label: 'XPath'
				  },
				  {
					value: 'linktext',
					label: 'LinkText'
				  },
				  {
					value: 'partiallinktext',
					label: 'PartialLinkText'
				  },
				  {
					value: 'tagname',
					label: 'TagName'
				  },
				  {
					value: 'cssselector',
					label: 'CssSelector'
				  }
			   ]
			  }
		},
		{
			dataField: 'locatorproperty',
			text: 'Locator Property',
			headerStyle: {
				backgroundColor: '#c8e6c9'
			  }
		},
		{
			dataField: 'value',
			text: 'Value',
			headerStyle: {
				backgroundColor: '#c8e6c9'
			  }
		},
		{
			dataField: 'exitIfFail',
			text: 'Exit',
			headerStyle: {
				backgroundColor: '#c8e6c9',
				width: '60px'
			  },
			  editor: {
				type: Type.SELECT,
				options: [{
				  value: 'Y',
				  label: 'Y'
				}, {
				  value: 'N',
				  label: 'N'
				}]
			  }
		}
		
	  ];
		  
  return (
    <Page title="Custom Function" breadcrumbs={[{ name: 'Custom Function', active: true }]}>
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
            <CardHeader>Common Test Data 
				<Row>
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
				</Row>
			</CardHeader>
			<CardHeader>Environment*
				<FormGroup row>
                	<Col >
                    	<Input disabled={this.state.pageloadingStatus} invalid={this.state.checkmodEnv} type="select" name="modEnv" value={this.state.modEnv} onChange={this.SelectmodEnv.bind(this)}>
						<option selected="selected">{this.state.modEnv}</option>
						<Options options={this.state.CommonTestData} />
						</Input>
                  	</Col>
				  	<CardImg
					 className="card-img-right"
					  src={bg1Image}
					  style={{ width: 'auto', height: 30 }}
					  onClick={ () => this.addNewCommonData() }
					  disabled={this.state.pageloadingStatus}
					/>
					<CardImg
					  className="card-img-right"
					  src={bg3Image}
					  style={{ width: 'auto', height: 30 }}
					  onClick={ () => this.deleteCommonData() } 
					  disabled={this.state.pageloadingStatus}
					/>
             	</FormGroup>
			</CardHeader>
            <CardBody>
			<BootstrapTable
				keyField="id"
				disabled={this.state.pageloadingStatus}
				data={ this.state.CommonDataItem }
				columns={ columns }
				striped
				hover
				condensed
				pagination={ paginationFactory(options) }
				rowEvents={ rowEvents }
				onDataSizeChange={ this.handleDataChange }
				filter={ filterFactory() }
				selectRow={ selectRow }
				cellEdit={ cellEditFactory({
					mode: 'click',
					blurToSave: true,
					})}
			/>
            </CardBody>
          </Card>
        </Col>
		<Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Create/Update Custom Function</CardHeader>
            <CardBody>
              <Form>
                <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Custom Function Name*
                  </Label>
                  <Col>
				  	<Combobox invalid={this.state.checkCustomFunction} name ="customFunction" 
				    value={this.state.customFunction}
					disabled={this.state.pageloadingStatus}
					data={genericHelper.common_GetListvalueFromJsonResponce(this.state.customFunctionList)}
					caseSensitive={false}
					minLength={3}
					filter='contains'
					onSelect={this.updateCustomFunction.bind(this)}
					onChange={this.updateCustomFunction.bind(this)}
					/>
                  </Col>
                </FormGroup>
				<FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Objective*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.CheckCustomFunObjective} type="input" value={this.state.customFunctionObjective} onChange={this.UpdateCustomFunctionName.bind(this)} name="customfunObjective" placeholder="Enter Custom function Objective">
					</Input>
                  </Col>
                </FormGroup>
				<FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Parameter*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.CheckCustomFunParameter} type="input" value={this.state.customFunctionParameter} onChange={this.UpdateCustomFunctionParameter.bind(this)} name="customfunParameter" placeholder="Enter Custom function parameter">
					</Input>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
	  <Row>
		<Col lg={12} md={12} sm={12} xs={12}>
          <Card>
				<Loader 
				type="ThreeDots"
				color="#00BFFF"
				height={50}
				width={100}
				timeout={120000} //3 secs
				visible = {this.state.loaderTestSteps}
			/>
            <CardHeader>Test Steps 
			<CardImg
					 className="card-img-right"
					  src={bg1Image}
					  style={{ width: 'auto', height: 30 }}
					  onClick={ () => this.addNewTestSteps() }
					  disabled={this.state.pageloadingStatus}
				    />
			<CardImg
					  className="card-img-right"
					  src={bg3Image}
					  style={{ width: 'auto', height: 30 }}
					  onClick={ () => this.deleteTestSteps() }
					  disabled={this.state.pageloadingStatus}
			/>
			<Button disabled={this.state.pageloadingStatus} color="primary" onClick={this.selectionCommonData.bind(this)} name ="selectCommonData">Select Common Data</Button>
			<Button disabled={this.state.pageloadingStatus} color="primary"  onClick={this.selectionUtilityData.bind(this)} name ="selectUtilityFunction">Select Utility Data</Button>
			<Button disabled={this.state.pageloadingStatus} color="primary" onClick={this.SaveTestScripts.bind(this)} name ="saveTestScript">Save Custom Function</Button>
			<Button disabled={this.state.pageloadingStatus} color="primary" onClick={this.DeleteCustomFunction.bind(this)} name ="deleteCustomFunction">Delete Function</Button>
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
								disabled={this.state.pageloadingStatus}
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
			</CardHeader>
            <CardBody>
			<BootstrapTable
				keyField="teststepid"
				disabled={this.state.pageloadingStatus}
				data={ this.state.TestScriptTestData }
				columns={ testScriptcolumns }
				striped
				hover
				condensed
				pagination={ paginationFactory(testScriptoptions) }
				rowEvents={ rowEvents }
				onDataSizeChange={ this.handleDataChange }
				selectRow={ selectTestScriptRow }
				cellEdit={ cellEditFactory({
					mode: 'click',
					blurToSave: true,
					//onStartEdit: (row, column, rowIndex, columnIndex) => { console.log('start to edit!!!'); },
					//beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
					// afterSaveCell: (oldValue, newValue, row, column) => { console.log('After Saving Cell!!'); console.log(row); console.log(column); }
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

export default CustomFunction;
