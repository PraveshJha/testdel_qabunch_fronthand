import Page from 'components/Page';
import React from 'react';
import bg3Image from 'assets/img/bg/deleterow.JPG';
import bg1Image from 'assets/img/bg/addnewrow.JPG';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import {ExcelRenderer} from 'react-excel-renderer';
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
import genericHelper from '../funcLibraries/GenericHelper.js';
import executionHelper from '../funcLibraries/executionHelper.js';

var APIBasePath= window.ENV.APIURL;
var read = require('read-file');
function Options({ options }) {
    return (
        options.map(option => 
                    <option >{option.Environment}</option>)
                   );
}

class TestScripts extends React.Component{
	constructor(props){
		super(props);
		this.state={
		  allModuleName: [],
		  allTestID:[],
		  ModuleName:'',
		  TestScriptModuleName:'',
		  NewTestID:'',
		  Env:'',
		  DefaultEnvironment:'',
          CommonDataallItem:[],
		  CommonDataItemList:[],
		  CommonDataTotalSize:0,
		  CommonDataItem: [],
		  GetCommonItem:[],
		  TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}],
		  allActionNameList:[],
		  selectedCommonKey:'',
		  selectedTestStepNumber:0,
		  modal: false,
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
		  loaderTestScript:false,
		  loaderCustomFunction:false,
		  loaderAIScripts:false,
		  CheckCustomFunObjective:false,
		  customFunctionObjective:'',
		  CheckCustomFunParameter:false,
		  customFunctionParameter:'',
		  customFunctionList:[],
		  selectedFile: null,
		  pageloadingStatus :false,
		  featureFileText:'',

		}

		const GetLoaderData = async () => 
		{
		  this.setState({pageloadingStatus:true});
		  const homepage = await fetch(APIBasePath+'dashboard');
		  const homepageResponse = await homepage.json();
		  this.setState({CommonTestData:homepageResponse.CommonTestData});
		  this.setState({DefaultEnvironment:homepageResponse.Configuration.DefaultEnvironment});
		  
			const Req2 = async () => 
			{
				const Req2 = await fetch(APIBasePath+'testcase/0')
				const Response2 = await Req2.json();
				this.setState({allModuleName:Response2});
				const Req3 = async () => 
				{
					const Req3 = await fetch(APIBasePath+'testscript/0/0')
					const Response3 = await Req3.json();
					this.setState({allActionNameList:Response3});
					const Req4 = async () => 
					{
						const Req4 = await fetch(APIBasePath+'customfunction/0/0')
						const Response4 = await Req4.json();
						this.setState({UtilityItem:Response4});
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
						const Req5 = async () => 
						{
							const Req5 = await fetch(APIBasePath+'customfunction')
							const re5Response = await Req5.json();
							this.setState({customFunctionList:genericHelper.common_GetListvalueFromJsonResponce(re5Response)})
							this.setState({loader:false})
							this.setState({pageloadingStatus:false});
						}
						Req5();
					}
					Req4();
				}
				Req3();
			}
			Req2();
		}
		GetLoaderData();
		
	  }
	  selectionCommonData()
	  {
		var ItemforMod =[];
		var selectedItemRow = this.state.selectedTestStepNumber;
		if(selectedItemRow==="" || selectedItemRow===0)
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
			//@ check what is action
			var actionName= this.state.TestScriptTestData[this.state.selectedTestStepNumber-1].action;
			if(this.state.customFunctionList.includes(actionName))
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
		}
	
	  }

	  selectionTestData()
	  {
		var ItemforMod =[];
		var selectedItemRow = this.state.selectedTestStepNumber;
		if(selectedItemRow==="" || selectedItemRow===0)
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
		//@ check what is action
		var actionName= this.state.TestScriptTestData[this.state.selectedTestStepNumber-1].action;
		if(this.state.customFunctionList.includes(actionName))
		{
			var intialvalue= this.state.TestScriptTestData[this.state.selectedTestStepNumber-1].value;
			if(intialvalue.trim()==='')
			{
				ItemforMod = this.state.TestScriptTestData;
				ItemforMod[this.state.selectedTestStepNumber-1].value = 't.'+Item;
				this.setState({TestScriptTestData:ItemforMod})
			}
			else
			{
				ItemforMod = this.state.TestScriptTestData;
				ItemforMod[this.state.selectedTestStepNumber-1].value = intialvalue+',t.'+Item;
				this.setState({TestScriptTestData:ItemforMod})
			}
		}
		else
		{
			ItemforMod = this.state.TestScriptTestData;
			ItemforMod[this.state.selectedTestStepNumber-1].value = 't.'+Item;
			this.setState({TestScriptTestData:ItemforMod})
		}
		this.setState({ TestScriptTestData: [...this.state.TestScriptTestData]});
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
		this.setState({loaderTestScript:true})
		this.setState({utilityFunction:false})
		this.setState({UtilityFunctionExpression:''})
		this.setState({alertColor:''})
		//@ check what is action
		var actionName= this.state.TestScriptTestData[this.state.selectedTestStepNumber-1].action;
		if(this.state.customFunctionList.includes(actionName))
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
		this.setState({loaderTestScript:false})
	
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
	  UpdateHeaderNameonTestData()
	  {
		this.setState({headernameCheck:false})
		var headerName = this.state.newHeaderName.toUpperCase();
		if(headerName.trim()==="")
		{
		  return this.setState({headernameCheck:true})
		}
		var lastColumn = this.state.testDatacolumns.length;
		if(lastColumn===1)
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please add header column first'})
		}
		//console.log(this.state.selectedLastHeaderColumn);
		//console.log(this.state.testDatacolumns);
		var ItemforMod =[];
		ItemforMod = this.state.testDatacolumns;
		ItemforMod[this.state.selectedLastHeaderColumn-1].text = headerName;
		this.setState({ testDatacolumns: [...this.state.testDatacolumns] });
		this.setState({newHeaderName:''});
		
	  }
	  selectionUtilityData()
	  {
		var selectedItemRow = this.state.selectedTestStepNumber;
		if(selectedItemRow===0)
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please select test step number.'})
		}
		this.setState({loaderTestScript:true});
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
		this.setState({loaderTestScript:false});
		this.setState({UtilityFunctionList:TotalItem})
		this.setState({utilityFunction:true})
		
	
	  }
	  TypeHeaderName(event){
		
		this.setState({newHeaderName : event.target.value})
		this.setState({headernameCheck:false})
		}
	
	updateModule(event){
	var runTimeModule = event;
	this.setState({NewTestID : ''})
	this.setState({testscriptcheckModule : false})
	this.setState({ModuleName : runTimeModule})
	this.setState({loader:true})
		const Request1 = async () => 
		{
			this.setState({pageloadingStatus:true});
			const Req1 = await fetch(APIBasePath+'testcase/'+runTimeModule)
			const Response1 = await Req1.json();
			this.setState({allTestID:Response1})
			this.setState({loader:false})
			this.setState({pageloadingStatus:false});
		}
		Request1();
	}
	updateModuleChange(event){
		var runTimeModule = event;
		this.setState({NewTestID : ''})
		this.setState({testscriptcheckModule : false})
		this.setState({ModuleName : runTimeModule})
		}
	UpdatetestcaseName(event)
	{
		this.setState({testscriptchecktestName:false})
		this.setState({testCaseName : event.target.value})
	}
	SetCustomFunctionFromStep(event)
	{
		this.setState({customFunctionstepFromCheck:false})
		this.setState({customStepFrom : event.target.value})
	}
	SetCustomToStep(event)
	{
		this.setState({customFunctionstepToCheck:false})
		this.setState({customStepTo : event.target.value})
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
	verifyCustomFunction(event)
	{
		this.setState({customFunctionNameCheck:false})
		this.setState({customFunctionName : event.target.value})
		
	}
	saveCustomFunction(event)
	{
		var newCustomfunction = this.state.customFunctionName;
		var newCustomFrom = this.state.customStepFrom;
		var newCustomTo = this.state.customStepTo;
		var CusFuncObje = this.state.customFunctionObjective;
		var CusFuncParam = this.state.customFunctionParameter;
		var failMessage ='';
		if(newCustomfunction.trim()==="")
		{
			failMessage= "custom function name can not be blank."
			 this.setState({customFunctionNameCheck:true});
		}
		if(newCustomFrom.trim()==="")
		{
			failMessage= failMessage+'Step From can not be blank.';
			this.setState({customFunctionstepFromCheck:true});
		}
		if(newCustomTo.trim()==="")
		{
			failMessage= failMessage+'Step To can not be blank';
			this.setState({customFunctionstepToCheck:true});
		}
		if(CusFuncObje.trim()==='')
		{
			failMessage=failMessage+' Function Objective can not be blank.';
		  this.setState({CheckCustomFunObjective:true})
		}
		if(CusFuncParam.trim()==='')
		{
			failMessage=failMessage+' Function Parameter can not be blank.';
		  this.setState({CheckCustomFunParameter:true})
		}
		if(failMessage.trim() !=="")
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:failMessage})
		}
		if(isNaN(newCustomFrom))
		{
			failMessage= failMessage+'Please provide integer value in Step From* field.';
			this.setState({customFunctionstepFromCheck:true});
		}
		if(isNaN(newCustomTo))
		{
			failMessage= failMessage+'Please provide integer value in Step To* field.';
			this.setState({customFunctionstepToCheck:true});
		}
		if(failMessage.trim() !=="")
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:failMessage})
		}
		var check = genericHelper.common_CheckValueFromJson(this.state.allActionNameList,newCustomfunction)
		if(check)
		{
			  this.setState({customFunctionNameCheck:true});
			  this.setState({modal:true})
			  return this.setState({modalValidationText:'Function '+newCustomfunction+' is already exist.'})
		}
		if(Number(newCustomFrom)>Number(newCustomTo))
		{
			this.setState({customFunctionstepToCheck:true});
			  this.setState({modal:true})
			  return this.setState({modalValidationText:'Step From* should be less than or equal to Step To*'})
		}

		//-- Save Test Steps
		failMessage='';
		var tesStepRowCount =this.state.TestScriptTestData.length;
		
		if(Number(tesStepRowCount) <Number(newCustomFrom))
		{
			failMessage= 'Test Script does not have '+newCustomFrom+' steps.'
			this.setState({customFunctionstepFromCheck:true});
		}
		if(Number(tesStepRowCount) <Number(newCustomTo))
		{
			failMessage= 'Test Script does not have '+newCustomFrom+' steps.'
			this.setState({customFunctionstepToCheck:true});
		}
		if(failMessage.trim()!=="")
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:failMessage})
		}
		var jstestStepData={};
		var jstestStepDatacollection={};
		var ORTestStepData={};
		var ORItem={};
		var Item=0;
        var SuccessFunction = true;
		if(tesStepRowCount>0)
		{
			this.setState({loaderCustomFunction:true})
			var StepNo=0;
			for(let i=newCustomFrom-1;i<newCustomTo;i++)
			{
				StepNo= StepNo+1;
				jstestStepData={};
				ORTestStepData={};
				var locatorName= this.state.TestScriptTestData[i].locator;
				var locatorProperty= this.state.TestScriptTestData[i].locatorproperty;
				jstestStepData["teststepid"]=StepNo;
				jstestStepData["stepdescription"]=this.state.TestScriptTestData[i].stepdescription;
				jstestStepData["action"]=this.state.TestScriptTestData[i].action;
				jstestStepData["locator"]=locatorName;
				jstestStepData["locatorproperty"]=locatorProperty;
				jstestStepData["value"]=this.state.TestScriptTestData[i].value;
				jstestStepData["exitIfFail"]=this.state.TestScriptTestData[i].exitIfFail;
				jstestStepDatacollection[StepNo]=jstestStepData;
				if(locatorName.trim() !=='' && locatorProperty.trim() !=='' )
				{
					Item=Item+1;
					ORTestStepData["locator"]=locatorName;
					ORTestStepData["locatorproperty"]=locatorProperty;
					ORItem[Item]=ORTestStepData;
				}
				
			}
			let OrToTatalItem = Object.keys(ORItem).length;
			if(OrToTatalItem>0)
			{
				var ORjson = genericHelper.common_ChangeJsoncontentforServer(ORItem)
				var ORAPI =APIBasePath+'customfunction';
				var requestOptions = {
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
						SuccessFunction=false;
						this.setState({modal:true})
						return this.setState({modalValidationText:ORJson.servermessage})
					}

				}
				SaveORRequest();
			}
			if(!SuccessFunction)
			{
				this.setState({loaderCustomFunction:false})
				return;
			}

			const Req1 = async () => 
			{
				var FunctionItemContent={};
				FunctionItemContent['Objective']=CusFuncObje;
				FunctionItemContent['Parameter']=CusFuncParam;
				FunctionItemContent[newCustomfunction.trim()]=jstestStepDatacollection;
				var json = genericHelper.common_ChangeJsoncontentforServer(FunctionItemContent);
				requestOptions = 
				{
					method: 'POST',
					headers: {"Accept": "*/*",'Content-type': 'application/json'},
					body: JSON.stringify(json)
				};
				var API= APIBasePath+'customfunction/'+newCustomfunction
			  this.setState({pageloadingStatus:true});
			  const Request1 = await fetch(API,requestOptions)
			  const Response1 = await Request1.json();
			  this.setState({pageloadingStatus:false});
				if(!Response1)
				{
					this.setState({loaderCustomFunction:false})
					this.setState({modal:true})
					return this.setState({modalValidationText:'ISSUE: '+Response1.servermessage})
				}
				else
				{
					const Req3 = async () => 
					{
						this.setState({pageloadingStatus:true});
						const Req3 = await fetch(APIBasePath+'testscript/0/0')
						const Response3 = await Req3.json();
						this.setState({pageloadingStatus:false});
						this.setState({allActionNameList:Response3});
						this.setState({loaderCustomFunction:false})
						this.setState({customFunctionName:''})
						this.setState({customStepFrom:''})
						this.setState({customStepTo:''})
						this.setState({customFunctionObjective:''})
						this.setState({customFunctionParameter:''})
						this.setState({modal:true})
						return this.setState({modalValidationText:Response1.servermessage})
					}
					Req3()
					
				}
				
			  
			}
			Req1();
		}
		else
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Test Steps is missing in test scripts.'})
		}

	}
	updateENV(event){

		this.setState({testscriptcheckENV : ''})
		this.setState({CommonDataTotalSize : 0})
		this.setState({CommonDataItem : []})
		this.setState({Env : ''})
		var onchangeenvvalue = event.target.value;
		this.setState({Env : event.target.value})

		this.setState({loader:true})
		var URL =  APIBasePath+'testscript/'+onchangeenvvalue;
		const Request1 = async () => 
		{
		  this.setState({pageloadingStatus:true});
		  const Req1 = await fetch(URL)
		  const Response1 = await Req1.json();
		  this.setState({CommonDataItem:executionHelper.GetListOfListItemforCommonItem(Response1)})
		  this.setState({CommonDataTotalSize:this.state.CommonDataItem.length})
		  this.setState({loader:false})
		  this.setState({pageloadingStatus:false});
		}
		Request1();
	  }
	  updateTestID(event){
		this.setState({testscriptchecktestID : false})
		
		this.setState({NewTestID : ''})
		this.setState({NewTestID : event})

		}
		GenerateAIScripts()
		{
			if(this.state.selectedFile ===null)
			{
			  this.setState({modal:true})
			  return this.setState({modalValidationText:'Please select Manual test case Excel or Feature file before creating AI Scripts.'})
			}
			var fileName= this.state.selectedFile['name'];
			var fileExtension = fileName.split('.').pop();
			if(fileExtension.trim().toLowerCase() ==="xlsx" || fileExtension.trim().toLowerCase() ==="feature")
			{
				if(fileExtension==='xlsx')
				{
					this.setState({loaderAIScripts:true})
					ExcelRenderer(this.state.selectedFile, (err, resp) => 
					{
						if(err)
						{
							this.setState({loaderAIScripts:false})
							this.setState({modal:true})
							return this.setState({modalValidationText:'Unexpected Error '+err+' is displayed while parsing Excel file.'})          
						}
						else
						{
							var RowInfo= resp.rows;
							if(RowInfo.length===0)
							{
								this.setState({loaderAIScripts:false})
								this.setState({modal:true})
							    return this.setState({modalValidationText:'Uploaded Excel file does not have any data, Please upload correct Excel sheet.'}) 
							}
							//@ Set Basic Parameter
							this.setState({Env:this.state.DefaultEnvironment})
							this.setState({NewTestID:RowInfo[1][1]})
							this.setState({ModuleName:RowInfo[4][1]})
							this.setState({testCaseName:RowInfo[2][1]})
							//@ Enable Common Test Data
							const Request1 = async () => 
							{
								this.setState({pageloadingStatus:true});
								var URL =  APIBasePath+'testscript/'+this.state.DefaultEnvironment;
								const Req1 = await fetch(URL)
								const Response1 = await Req1.json();
								this.setState({pageloadingStatus:false});
								this.setState({CommonDataItem:executionHelper.GetListOfListItemforCommonItem(Response1)})
								this.setState({CommonDataTotalSize:this.state.CommonDataItem.length})
								//@ Send Test Data to Server
								var TestStepInfo={};
								var StepNumber=0
								for(let s=6;s<RowInfo.length;s++)
								{
									var onebyone={}
									onebyone['StepID']=RowInfo[s][0];
									onebyone['StepDesc']=RowInfo[s][1];
									onebyone['StepExpected']=RowInfo[s][2];
									try
									{
										onebyone['testdata']=RowInfo[s][3];
									}
									catch(err)
									{
										onebyone['testdata']='';
									}
									
									StepNumber= Number(Number(StepNumber)+1);
									TestStepInfo[StepNumber]=onebyone;
									var json = genericHelper.common_ChangeJsoncontentforServer(TestStepInfo);
								}
								//@ Post Request
								
								var requestOptions =
								{
									method: 'POST',
									headers: {"Accept": "*/*",'Content-type': 'application/json'},
									body: JSON.stringify(json)
								};
								const Request2 = async () => 
								{
									this.setState({pageloadingStatus:true});
									var AIAPI =APIBasePath+'aiscript';
									const AIReq = await fetch(AIAPI,requestOptions);
									const AIResponse = await AIReq.json();
									var allStepsItemAI= AIResponse['AllTestStep'];
									var TestDataItem= AIResponse['TestData']
									var columnHeaders= genericHelper.common_GetListKeyFromJsonResponce(TestDataItem);
									var RowItem = genericHelper.common_GetListvalueFromJsonResponce(TestDataItem);
									this.setState({pageloadingStatus:false});
									//@ Add Column Header
									if(columnHeaders.length>0)
									{
										var collist ={testdatacolid:1}
										for(let i=0;i<columnHeaders.length;i++)
										{
											
											var coldatafiledName='testdataColumn'+i;
											this.setState({selectedLastHeaderColumn:Number(i)+1});
											this.setState({ testDatacolumns: [...this.state.testDatacolumns, {
												dataField: coldatafiledName,
												text: columnHeaders[i],
												headerEvents: {
													onClick: (e) => 
													{
														this.setState({selectedHeaderColumn:columnHeaders[i]});
														this.setState({selectedHeaderColumnIndex:Number(i)+1});
													}
												  }
												  
											}] });
											collist[coldatafiledName] = RowItem[i];
											
											
										}
										this.setState({ testDataItemrowList: [...this.state.testDataItemrowList, collist] });
										
									}
									this.setState({TestScriptTestData:AIResponse['AllTestStep']})
									
									//# Check action Name is blank for notification
									var checkallActionName='';
									if(allStepsItemAI.length>0)
									{
										for(let i=0;i<allStepsItemAI.length;i++)
										{
                                            var stepbyStepActionName=allStepsItemAI[i]['action'];
											if(stepbyStepActionName.trim()==='')
											{
												checkallActionName=checkallActionName + " , " +Number(i+1);
											}
										}
										if(checkallActionName.trim() !=='')
										{
											this.setState({loaderAIScripts:false})
											this.setState({modal:true})
											return this.setState({modalValidationText:'Please Update Action* for Step Number '+checkallActionName}) 
										}
									}
									this.setState({loaderAIScripts:false})
									
									
								}
								Request2();
							}
							Request1();
						}
					});
				}
				if(fileExtension==='feature')
				{
					this.setState({loaderAIScripts:true});
					this.setState({pageloadingStatus:true});
					this.setState({Env:this.state.DefaultEnvironment})
					var URL =  APIBasePath+'testscript/'+this.state.DefaultEnvironment;
					const Request1 = async () => 
					{
					  this.setState({pageloadingStatus:true});
					  const Req1 = await fetch(URL)
					  const Response1 = await Req1.json();
					  this.setState({CommonDataItem:executionHelper.GetListOfListItemforCommonItem(Response1)})
					  this.setState({CommonDataTotalSize:this.state.CommonDataItem.length})
					}
					Request1();
                    var featureFileData ={};
					featureFileData['testcase']=this.state.featureFileText;
					var json = genericHelper.common_ChangeJsoncontentforServer(featureFileData);
					var requestOptions = 
					{
					method: 'POST',
					headers: {"Accept": "*/*",'Content-type': 'application/json'},
					body: JSON.stringify(json)
					};
					const Request2 = async () => 
					{
						var AIAPI =APIBasePath+'featurescript';
						const AIReq = await fetch(AIAPI,requestOptions);
						const AIResponse = await AIReq.json();
						this.setState({ NewTestID: AIResponse["testid"] });
						this.setState({ ModuleName: AIResponse["module"] });
						this.setState({ testCaseName: AIResponse["testcasename"] });
					
						
						this.setState({ TestScriptTestData: AIResponse["teststeps"] });

						// Update test Data Header
						var TestDataItem = AIResponse["testdataheader"];
						var columnHeaders= genericHelper.common_GetListKeyFromJsonResponce(TestDataItem);
						//@ Add Column Header
						if(columnHeaders.length>0)
						{
							var collist ={testdatacolid:1}
							for(let i=0;i<columnHeaders.length;i++)
							{
								
								var coldatafiledName='testdataColumn'+i;
								this.setState({selectedLastHeaderColumn:Number(i)+1});
								this.setState({ testDatacolumns: [...this.state.testDatacolumns, {
									dataField: coldatafiledName,
									text: columnHeaders[i],
									headerEvents: {
										onClick: (e) => 
										{
											this.setState({selectedHeaderColumn:columnHeaders[i]});
											this.setState({selectedHeaderColumnIndex:Number(i)+1});
										}
									  }
									  
								}] });
								collist[coldatafiledName] = '';
							}					
								
						}
						this.setState({ testDataItemrowList: AIResponse["testdata"] });
						this.setState({loaderAIScripts:false});
						this.setState({pageloadingStatus:false});
					}
					Request2();
					
				}
				     
			}
			else
			{
				this.setState({modal:true})
				return this.setState({modalValidationText:'Please select valid file,Supported file format is .xlsx or .feature'})
			}

		}
		onChangeHandler=event=>{
			event.preventDefault()
			const reader = new FileReader()
			reader.onload = async (event) => { 
			  const text = (event.target.result)
			  //console.log(text)
			  this.setState({featureFileText:text})
			};
			reader.readAsText(event.target.files[0])
			this.setState({
			  selectedFile: event.target.files[0],
			  loaded: 0,
			  
			})
		  }
		SaveTestScripts()
		{
			
		  var ExceptionMessage ='';
		  var testscriptENV= this.state.Env;
		  var testscriptModule= this.state.ModuleName;
		  var testscriptNewTestID= this.state.NewTestID
		  var testscripttestCaseName = this.state.testCaseName
		  if(testscriptENV.trim()==="")
		  {
			this.setState({testscriptcheckENV:true})
			ExceptionMessage= ExceptionMessage+ 'Environment* can not be left blank.'
		  }
		  if(testscriptModule.trim()==="")
		  {
			this.setState({testscriptcheckModule:true})
			ExceptionMessage= ExceptionMessage+ 'Module* can not be left blank.'
		  }
		  if(testscriptNewTestID.trim()==="")
		  {
			this.setState({testscriptchecktestID:true})
			ExceptionMessage= ExceptionMessage+ 'New TestID* can not be left blank.'
		  }
		  if(testscripttestCaseName.trim()==="")
		  {
			this.setState({testscriptchecktestName:true})
			ExceptionMessage= ExceptionMessage+ 'New Test Case Name* can not be left blank.'
		  }
		  if(ExceptionMessage.trim() !=="")
		  {
			this.setState({modal:true})
			return this.setState({modalValidationText:ExceptionMessage})
		  }
		  var duplicatecheck = genericHelper.common_CheckValueFromJson(this.state.allTestID,testscriptNewTestID)
		  if(duplicatecheck)
		  {
			this.setState({modal:true})
			this.setState({testscriptchecktestID:true})
			return this.setState({modalValidationText:'Test ID* is already exist, Please Type new TestID.'})
		  }
		 
		  //@ check action Name is not blank on step
		  var blankCheck= this.state.TestScriptTestData[0].action;
		  if(blankCheck.trim()==="")
		  {
			this.setState({modal:true})
			return this.setState({modalValidationText:'Action name can not be blank on test step.'})
		  }

		  // -- Add Loader 
		  //-- Saving Common test data
		  this.setState({loaderTestScript:true})
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
		var requestOptions ='';
		var scriptSuccess = true;
		const Request1 = async () => 
		{
			if(count>0)
			{
				this.setState({pageloadingStatus:true});
				requestOptions = 
				{
				method: 'POST',
				headers: {"Accept": "*/*",'Content-type': 'application/json'},
				body: JSON.stringify(json)
				};
				const Req1 = await fetch(APIBasePath+'testscript/'+testscriptENV,requestOptions)
				const Response1 = await Req1.json();
				this.setState({postResponceresult:Response1})
				this.setState({pageloadingStatus:false});
				if(!Response1.success)
				{
					scriptSuccess= false;
					this.setState({modal:true})
					return this.setState({modalValidationText:'ISSUE: '+this.state.postResponceresult.servermessage})
				}
			}
			if(!scriptSuccess)
			{
			   this.setState({loaderTestScript:false})
			   return;
			}
			const req2 = async () => 
			{
			  	 //-- Saving  test data
				var testdataRowCount =this.state.testDataItemrowList.length;
				var jsTestda={};
				var jstestdataItemList={};
				if(testdataRowCount>0)
				{
					var testdatacolumnCount=this.state.testDatacolumns.length;
					for(let i=0;i<testdataRowCount;i++)
					{
						jsTestda={};
						for(let j=1;j<testdatacolumnCount;j++)
						{
							var colName = this.state.testDatacolumns[j].text;
							var colKeyName = this.state.testDatacolumns[j].dataField.toString();
							var colValue = this.state.testDataItemrowList[i][colKeyName];
							jsTestda[colName]=colValue;
						}
						jstestdataItemList[i+1]=jsTestda;
						
					}
					json = genericHelper.common_ChangeJsoncontentforServer(jstestdataItemList);
					console.log(json);
					requestOptions = 
					{
						method: 'POST',
						headers: {"Accept": "*/*",'Content-type': 'application/json'},
						body: JSON.stringify(json)
					};
					this.setState({pageloadingStatus:true});
					const request2 = await fetch(APIBasePath+'testscript/'+testscriptENV+'/'+testscriptModule+'/'+testscriptNewTestID,requestOptions)
					const req2Response = await request2.json();
					this.setState({postResponceresult:req2Response})
					this.setState({pageloadingStatus:false});
					if(!req2Response.success)
					{
						scriptSuccess= false;
						this.setState({modal:true})
						return this.setState({modalValidationText:'ISSUE: '+this.state.postResponceresult.servermessage})
					}
				}
				if(!scriptSuccess)
				{
					this.setState({loaderTestScript:false})
					return;
				}
				const req3 = async () => 
                {
					var tesStepRowCount =this.state.TestScriptTestData.length;
					var jstestStepData={};
					var jstestStepDatacollection={};
					var ORTestStepData={};
					var ORItem={};
					var Item=0;
					if(tesStepRowCount===0)
					{
						this.setState({modal:true})
						this.setState({loaderTestScript:false})
			 			return this.setState({modalValidationText:'Test Steps is missing in test scripts.'})
					}
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
					let OrToTatalItem = Object.keys(ORItem).length;
					if(OrToTatalItem>0)
					{
						var ORjson = genericHelper.common_ChangeJsoncontentforServer(ORItem)
						var ORAPI =APIBasePath+'customfunction';
						requestOptions =
						{
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
								scriptSuccess= false;
								this.setState({modal:true})
								return this.setState({modalValidationText:ORJson.servermessage})
							}
						}
						SaveORRequest();
					}
					if(!scriptSuccess)
					{
						this.setState({loaderTestScript:false})
						return;
					}
					json = genericHelper.common_ChangeJsoncontentforServer(jstestStepDatacollection);
					requestOptions = 
					{
						method: 'POST',
						headers: {"Accept": "*/*",'Content-type': 'application/json'},
						body: JSON.stringify(json)
					};
					this.setState({pageloadingStatus:true});
                    const request3 = await fetch(APIBasePath+'testscript/'+testscriptModule+'/'+testscriptNewTestID+'/'+testscripttestCaseName+'/0',requestOptions)
					const req3Response = await request3.json();
					this.setState({pageloadingStatus:false});
					if(!req3Response.success)
					{
						scriptSuccess= false;
						this.setState({modal:true})
						return this.setState({modalValidationText:'ISSUE: '+this.state.postResponceresult.servermessage})
					}
					if(!scriptSuccess)
					{
						this.setState({loaderTestScript:false})
						return;
					}
					//@ Add Test Data Information in Test Suite
					var TestSuiteJsonData={};
					TestSuiteJsonData["Module"]= testscriptModule;
					TestSuiteJsonData["TestID"]= testscriptNewTestID;
					TestSuiteJsonData["TestCaseName"]= testscripttestCaseName;
					json = genericHelper.common_ChangeJsoncontentforServer(TestSuiteJsonData);
					requestOptions = 
					{
						method: 'POST',
						headers: {"Accept": "*/*",'Content-type': 'application/json'},
						body: JSON.stringify(json)
					};
					this.setState({pageloadingStatus:true});
                    const request4 = await fetch(APIBasePath+'cicd',requestOptions)
					const req4Response = await request4.json();
					this.setState({pageloadingStatus:false});
					if(!req4Response.success)
					{
						scriptSuccess= false;
						this.setState({modal:true})
						return this.setState({modalValidationText:'ISSUE: '+req4Response.servermessage})
					}
					if(!scriptSuccess)
					{
						this.setState({loaderTestScript:false})
						return;
					}
					//@ Reset Base State
					this.setState({Env:''})
					this.setState({ModuleName:''})
					this.setState({NewTestID:''})
					this.setState({testCaseName:''})
					this.setState({CommonDataItem:[]})
					this.setState({testDatacolumns:[{dataField: 'testdatacolid',text: '#',headerStyle: { width: '40px' }}]})
					this.setState({testDataItemrowList:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}]})
					this.setState({customFunctionName:''})
					this.setState({customStepFrom:''})
					this.setState({customStepTo:''})
					this.setState({customFunctionNameCheck:false})
					this.setState({customFunctionstepFromCheck:false})
					this.setState({customFunctionstepToCheck:false})
					const req4 = async () => 
                  	{
						this.setState({pageloadingStatus:true});
						const request4 = await fetch(APIBasePath+'testcase/0')
						const req4Response = await request4.json();
						this.setState({allModuleName:req4Response})
						const req5 = async () => 
						{
							const request5 = await fetch(APIBasePath+'testscript/0/0')
							const req5Response = await request5.json();
							this.setState({allActionNameList:req5Response})
							this.setState({loaderTestScript:false})
							this.setState({pageloadingStatus:false});
							this.setState({modal:true})
							return this.setState({modalValidationText:'Test scripts is successfully created.'})
						}
						req5();
                 	}
                    req4();
                }
                req3();
			}
			req2();
		}
		Request1();
		 
	}

	addNewCommonData = () => 
	{
		var ItemCount =this.state.CommonDataItem.length
		this.setState({loader:true})
		//console.log(ItemCount);
		if(ItemCount>0)
		{
			var valuecheck = this.state.CommonDataItem[ItemCount-1].commonKeyName
			//console.log(valuecheck);
			if(valuecheck.trim()==="")
			{
				this.setState({loader:false})
				this.setState({modal:true})
			    return this.setState({modalValidationText:'Before adding new Common key, add previous Common key.'})
			}
		}
		var lastOneId = this.state.CommonDataItem.length + 1;
		this.setState({ CommonDataItem: [...this.state.CommonDataItem, {
			id: `${lastOneId}`, commonKeyName: ``,commonKeyValue:``
		}] });
		this.setState({loader:false});
	}
	addNewColumnonTestData = () => 
	{
		this.setState({headernameCheck:false})
		var headerName = this.state.newHeaderName.toUpperCase();
		if(headerName.trim()==="")
		{
		  return this.setState({headernameCheck:true})
		}
		var lastColumn = this.state.testDatacolumns.length;
		for(let i=0;i<=lastColumn-1;i++)
		{
		  if(this.state.testDatacolumns[i].text===headerName.trim())
		  {
			return this.setState({headernameCheck:true})
		  }
		  
		}
		var addcolumn = lastColumn;
		var coldatafiledName='testdataColumn'+(lastColumn-1)
		this.setState({selectedLastHeaderColumn:addcolumn});
		this.setState({ testDatacolumns: [...this.state.testDatacolumns, {
			dataField: coldatafiledName,
			text: headerName,
			headerEvents: {
				onClick: (e) => 
				{
					this.setState({selectedHeaderColumn:e.target.innerHTML});
					this.setState({selectedHeaderColumnIndex:lastColumn});
				}
			  }
			  
		}] });
		//@ add Row Information
		var ItemList = this.state.testDataItemrowList.length;
		for(let i=0;i<ItemList;i++)
		{
			var ItemforMod =[];
			ItemforMod = this.state.testDataItemrowList;
			ItemforMod[i][coldatafiledName] = '';
			this.setState({testDataItemrowList:ItemforMod})
		}
	    this.setState({newHeaderName:''});
		
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
		this.setState({loaderTestScript:true})
		let selectedID = this.state.selectedTestStepNumber;
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
		this.setState({loaderTestScript:false})
		//# End of Implementation
	}
	addNewTestDataRow = () => 
	{
		this.setState({headernameCheck:false})
		var lastColumn = this.state.testDatacolumns.length;
		if(lastColumn>1)
		{
			var lastOneId = this.state.testDataItemrowList.length + 1;
			var collist ={testdatacolid:lastOneId}
			for(let i=1;i<lastColumn;i++)
			{
				var keyVal='';
				var colDatafield= 'testdataColumn'+(i-1);
				collist[colDatafield] = keyVal;
				
			}
			this.setState({ testDataItemrowList: [...this.state.testDataItemrowList, collist] });
			//this.setState({ testDataItemrowList: [...this.state.testDataItemrowList, {testdatacolid:`${lastOneId}`,testdataColumn1:'qa'+lastOneId}] });
	    }

	}
	deleteTestDataRow = () => {
		var lastOneId = this.state.testDataItemrowList.length;
		var testData = this.state.testDataItemrowList.filter(m => m.testdatacolid !== lastOneId);
		this.setState({ testDataItemrowList: testData });
	  };
	deleteCommonData = () => {
		this.setState({loader:true})
		var lastOneId = this.state.CommonDataItem.length;
		var updatedBooks = this.state.CommonDataItem.filter(m => m.id !== lastOneId.toString());
		this.setState({ CommonDataItem: updatedBooks });
		this.setState({loader:false})
	  };
	  deleteTestSteps = () => {
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
		this.setState({loaderTestScript:true})
		var testData = this.state.TestScriptTestData.filter(m => m.teststepid !== selectedID);
		for(let i=selectedID;i<=testData.length;i++)
		{
			testData[i-1]['teststepid']=i;
		}
		this.setState({ TestScriptTestData: testData });
		this.setState({selectedTestStepNumber:0})
		this.setState({selectedTestStepNumber:selectedID})
		this.setState({loaderTestScript:false})
	  };
	  deleteTestDataColumn = () => {

		var HeaderCol= this.state.selectedHeaderColumn;
		if(HeaderCol.trim()==="" || HeaderCol.trim()==="#")
		{
			return;
		}
		var testDataContent = this.state.TestScriptTestData;
		var StepNumber= '';
		for(let i=0;i<testDataContent.length;i++)
		{
			var StepNo= testDataContent[i].value;
			
			if(StepNo.trim()==='t.'+HeaderCol)
			{
				StepNumber= StepNumber+','+(i+1);
			}
		}
		if(testDataContent.length>0)
		{
			if(StepNumber.trim()!=='')
			{
				this.setState({modal:true})
				return this.setState({modalValidationText:'Before Deleting column '+HeaderCol+' please remove test column reference from test step number '+StepNumber})
			}
	    }
		//@ get Index
		var headerIndex=-1;
		for(let i=0;i<this.state.testDatacolumns.length;i++)
		{
			if(this.state.testDatacolumns[i].text===HeaderCol)
			{
				headerIndex=i;
				break;
			}
		}
		if(headerIndex>0)
		{
			var index =0;
			var keyName='';
			var testcol = this.state.testDatacolumns.filter(el => el.text !== HeaderCol);
			for(let i=headerIndex;i<testcol.length;i++)
			{
				index = i-1;
				 keyName='testdataColumn'+index;
				testcol[i].dataField=keyName;
			}
			this.setState({testDatacolumns:testcol});
			var RowInfo= this.state.testDataItemrowList;
			var RowCount = this.state.testDataItemrowList.length;
			for(let i=0;i<RowCount;i++)
			{
				for(let j=headerIndex;j<testcol.length;j++)
				{
					index = j-1;
					keyName='testdataColumn'+index;
					var OlderKey='testdataColumn'+(index+1);
					RowInfo[i][keyName]=this.state.testDataItemrowList[i][OlderKey];
				}
			}
			this.setState({testDataItemrowList:RowInfo});
			
		}
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
	  const testScriptoptions = {
		sizePerPage: 10,
		hideSizePerPage: true,
		hidePageListOnlyOnePage: true
	  };
	  const Utilityoptions = {
		sizePerPage: 5,
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
		  headerStyle: {backgroundColor: '#aa66cc'},
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
				backgroundColor: '#aa66cc',
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
				backgroundColor: '#aa66cc',
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
				backgroundColor: '#aa66cc'
			  }
		},
		{
			dataField: 'value',
			text: 'Value',
			headerStyle: {
				backgroundColor: '#aa66cc'
			  }
		},
		{
			dataField: 'exitIfFail',
			text: 'Exit',
			headerStyle: {
				backgroundColor: '#aa66cc',
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
    <Page title="Test Scripts" breadcrumbs={[{ name: 'Test Scripts', active: true }]}>
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
          <Card>
            <CardHeader>Intelligent Test Scrips
			</CardHeader>
			<Loader 
				type="ThreeDots"
				color="#00BFFF"
				height={50}
				width={100}
				timeout={120000} //3 secs
				visible = {this.state.loaderAIScripts}
			/>
                <Form inline>
				<FormGroup col>
				   <Label for="exampleSelect">
				   Upload Manual Test case or Feature file*
                  </Label>
                  <Col >
				  	<Input disabled={this.state.pageloadingStatus} type="file" name="file"  onChange={this.onChangeHandler.bind(this)} />
                  </Col>
                  <Col >
				  <Button disabled={this.state.pageloadingStatus} color="primary"  onClick={this.GenerateAIScripts.bind(this)} name ="AI">Generate Automated Script</Button>
                  </Col>
                </FormGroup>
              </Form>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Test Script Setup
			</CardHeader>
            <CardBody>
              <Form>
			  <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Environment*
                  </Label>
                  <Col>
					<Input disabled={this.state.pageloadingStatus} invalid={this.state.testscriptcheckENV} type="select" name="env"  value={this.state.Env} onChange={this.updateENV.bind(this)}>
					<option selected="selected">{this.state.Env}</option>
						<Options options={this.state.CommonTestData} />
					</Input>
                  </Col>
                </FormGroup>
                <FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Module*
                  </Label>
                  <Col >
				  <Combobox disabled={this.state.pageloadingStatus} invalid={this.state.testscriptcheckModule} name ="testscriptModule" 
				    value={this.state.ModuleName}
					data={genericHelper.common_GetListvalueFromJsonResponce(this.state.allModuleName)}
					caseSensitive={false}
					minLength={3}
					filter='contains'
					onSelect={this.updateModule.bind(this)}
					onChange={this.updateModuleChange.bind(this)}
					/>
                  </Col>
                </FormGroup>
				<FormGroup col>
                  <Label for="exampleSelect" sm={5}>
                    New TestID*
                  </Label>
                  <Col >
				  <Combobox disabled={this.state.pageloadingStatus} invalid={this.state.testscriptchecktestID} name ="testscriptTestID" 
					data={genericHelper.common_GetListvalueFromJsonResponce(this.state.allTestID)}
					value={this.state.NewTestID}
					caseSensitive={false}
					minLength={3}
					filter='contains'
					onSelect={this.updateTestID.bind(this)}
					onChange={this.updateTestID.bind(this)}
					/>
                  </Col>
                </FormGroup>
				<FormGroup col>
                  <Label for="exampleSelect" sm={6}>
                    Test Case Name*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.testscriptchecktestName} type="input" value={this.state.testCaseName} onChange={this.UpdatetestcaseName.bind(this)} name="testcasename" placeholder="enter new test case name">
					</Input>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
		<Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Common Test Data 
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
			</CardHeader>
            <CardBody>
			<BootstrapTable
				keyField="id"
				data={ this.state.CommonDataItem }
				columns={ columns }
				disabled={this.state.pageloadingStatus}
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
				wrapperClasses="table-responsive"
			/>
            </CardBody>
          </Card>
        </Col>
      </Row>
	  <Row>
		 <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Test Specific Data 
			<Form inline>
				<Col >
				<Input disabled={this.state.pageloadingStatus} invalid={this.state.headernameCheck} type="input" name="headername" placeholder="add header name" value={this.state.newHeaderName} onChange={this.TypeHeaderName.bind(this)}/>
				<CardImg
					className="card-img-right"
					src={bg1Image}
					style={{ width: 'auto', height: 30 }}
					onClick={ () => this.addNewColumnonTestData()}
					disabled={this.state.pageloadingStatus}
				/>
				<CardImg
					className="card-img-right"
					src={bg3Image}
					style={{ width: 'auto', height: 30 }}
					onClick={ () => this.deleteTestDataColumn() }
					disabled={this.state.pageloadingStatus}
				/>
				</Col>
				<CardImg
					
					className="card-img-right"
					src={bg1Image}
					style={{ width: 'auto', height: 30 }}
					onClick={ () => this.addNewTestDataRow() }
					disabled={this.state.pageloadingStatus}
				/>
				<CardImg
						className="card-img-right"
						src={bg3Image}
						style={{ width: 'auto', height: 30 }}
						onClick={ () => this.deleteTestDataRow() }
						disabled={this.state.pageloadingStatus}
				/>
				
			</Form>
			</CardHeader>
            <CardBody>
			<BootstrapTable
				keyField="testdatacolid"
				data={ this.state.testDataItemrowList }
				columns={ this.state.testDatacolumns}
				disabled={this.state.pageloadingStatus}
				striped
				hover
				condensed
				pagination={ paginationFactory(options) }
				cellEdit={ cellEditFactory({
					mode: 'click',
					blurToSave: true,
					})}
				wrapperClasses="table-responsive"
			/>
            </CardBody>

          </Card>
        </Col>
      </Row>
	  <Row>
		<Col lg={12} md={12} sm={12} xs={12}>
          <Card>
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
			<Button disabled={this.state.pageloadingStatus} color="primary"  onClick={this.selectionTestData.bind(this)} name ="selectTestData">Select Test Data</Button>
			<Button disabled={this.state.pageloadingStatus} color="primary" onClick={this.selectionCommonData.bind(this)} name ="selectCommonData">Select Common Data</Button>
			<Button disabled={this.state.pageloadingStatus} color="primary" onClick={this.selectionUtilityData.bind(this)} name ="selectUtilityFunction">Select Utility Data</Button>
			<Button disabled={this.state.pageloadingStatus} color="primary" onClick={this.SaveTestScripts.bind(this)} name ="saveTestScript">Save Test Script</Button>
			<Loader 
				type="ThreeDots"
				color="#00BFFF"
				height={50}
				width={100}
				timeout={120000} //3 secs
				visible = {this.state.loaderTestScript}
				disabled={this.state.pageloadingStatus}
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
									wrapperClasses="table-responsive"
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
				data={ this.state.TestScriptTestData }
				columns={ testScriptcolumns }
				disabled={this.state.pageloadingStatus}
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
					wrapperClasses="table-responsive"
	       />
            </CardBody>
          </Card>
        </Col>
      </Row>
		<Row>
		 <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Create New Custom Function
				<Button disabled={this.state.pageloadingStatus} onClick={this.saveCustomFunction.bind(this)} color="primary" name ="customfunc">Save Custom Function</Button>
			</CardHeader>
			<Loader 
				type="ThreeDots"
				color="#00BFFF"
				height={50}
				width={100}
				timeout={120000} //3 secs
				visible = {this.state.loaderCustomFunction}
			/>
            <CardBody>
              <Form inline>
                <FormGroup col>
				<Label for="exampleSelect">
                    Custom Function Name*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.customFunctionNameCheck} value={this.state.customFunctionName} onChange={this.verifyCustomFunction.bind(this)} type="input" name="custtomfunction" placeholder="new custom function"/>
                  </Col>
				  <Label for="exampleSelect">
                    Step From*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.customFunctionstepFromCheck} value={this.state.customStepFrom} onChange={this.SetCustomFunctionFromStep.bind(this)} size ="2" type="input" name="fromstep"/>
                  </Col>
				  <Label for="exampleSelect">
                    Step To*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.customFunctionstepToCheck} value={this.state.customStepTo} onChange={this.SetCustomToStep.bind(this)} size ="2" type="input" name="tostep"/>
                  </Col>
				</FormGroup>
				<FormGroup col>
				   <Label for="exampleSelect">
                    Objective*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.CheckCustomFunObjective} value={this.state.customFunctionObjective} onChange={this.UpdateCustomFunctionName.bind(this)}  type="input" name="customfunObjective" placeholder="Add function Objective"/>
                  </Col>
				  <Label for="exampleSelect">
                    Parameter*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.CheckCustomFunParameter} value={this.state.customFunctionParameter} onChange={this.UpdateCustomFunctionParameter.bind(this)}  type="input" name="customfunParameter" placeholder="Add function parameter"/>
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

export default TestScripts;
