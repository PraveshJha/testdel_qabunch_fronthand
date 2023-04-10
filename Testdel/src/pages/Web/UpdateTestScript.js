import Page from 'components/Page';
import React from 'react';
import bg3Image from 'assets/img/bg/deleterow.JPG';
import bg1Image from 'assets/img/bg/addnewrow.JPG';
import 'react-widgets/dist/css/react-widgets.css';
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
function OptionsValue({ options }) {

	return (
		Object.keys(options).map(key => 
		<option >{options[key]}</option>)
		);
}
class UpdateTestScript extends React.Component{
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
		 // TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}],
		 TestScriptTestData:[],
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
		  checkNewColName:false,
		  NewColName:'',
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
				const request2 = await fetch(APIBasePath+'testcase/0')
				const req2Response = await request2.json();
				this.setState({allModuleName:req2Response})
				const req3 = async () => 
				{
					const request3 = await fetch(APIBasePath+'testscript/0/0')
					const req3Response = await request3.json();
					this.setState({allActionNameList:req3Response})
					const req4 = async () => 
					{
						const request4 = await fetch(APIBasePath+'customfunction')
						const req4Response = await request4.json();
						this.setState({customFunctionList:genericHelper.common_GetListvalueFromJsonResponce(req4Response)})
						const req5 = async () => 
						{
							const request5 = await fetch(APIBasePath+'customfunction/0/0')
							const req5Response = await request5.json();
							this.setState({UtilityItem:req5Response})
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
						req5();
					}
					req4();
				}
				req3();
			}
			req2();
		}
		GetLoaderData();
		
	  }
	  selectionCommonData()
	  {
		var ItemforMod=[];
		var selectedItemRow = this.state.selectedTestStepNumber;
		if(selectedItemRow==="")
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
			this.setState({loaderTestSteps:false})
		}
	
	  }

	  selectionTestData()
	  {
		var ItemforMod =[];
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
		this.setState({loaderTestSteps:true})
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
		this.setState({loaderTestSteps:false})
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
		var ItemforMod =[];
		ItemforMod = this.state.testDatacolumns;
		ItemforMod[this.state.selectedLastHeaderColumn-1].text = headerName;
		this.setState({testDatacolumns:ItemforMod})
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
		this.setState({loaderTestSteps:true})
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
		this.setState({UtilityFunctionList:TotalItem})
		this.setState({utilityFunction:true})
		this.setState({loaderTestSteps:false})
	
	  }
	  TypeHeaderName(event){
		
		this.setState({newHeaderName : event.target.value})
		this.setState({headernameCheck:false})
		}
		TypeNewColName(event){
			
			this.setState({checkNewColName:false})
			this.setState({NewColName : event.target.value})
			
			}
	
	updateModule(event)
	{
	var runTimeModule = event.target.value;
	var previousModule = this.state.ModuleName;
	if(runTimeModule===previousModule)
	{
		return;
	}
	this.setState({loader:true})
	this.setState({NewTestID : ''})
	var testDataHeaderCol= [{dataField: 'testdatacolid',text: '#',headerStyle: { width: '40px' }}];
	this.setState({ testDatacolumns:testDataHeaderCol});
	this.setState({ testDataItemrowList:[]});
	this.setState({testscriptcheckModule : false})
	this.setState({ModuleName : runTimeModule})
	const req1 = async () => 
	{
		this.setState({pageloadingStatus:true});
	  const request1 = await fetch(APIBasePath+'testcase/'+runTimeModule)
	  const req1Response = await request1.json();
	  this.setState({allTestID:req1Response})
	  this.setState({loader:false})
	  this.setState({pageloadingStatus:false});
	}
	req1();

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
	RenameColumn(event)
	{
		var OlderheaderCol = this.state.selectedHeaderColumn;
		var NewName= this.state.NewColName;
		if(OlderheaderCol.trim()==="")
		{
			return;
		}
		if(NewName.trim()==="")
		{
			this.setState({checkNewColName:true})
			return;
		}
		//@ 
		var allColumn =this.state.testDatacolumns;
		var IndexFound=0;
		for(let i=1;i<allColumn.length;i++)
		{
			var existingCol= allColumn[i].text;
			if(existingCol.trim().toUpperCase()===NewName.trim().toUpperCase())
			{
				this.setState({checkNewColName:true})
			    return;
			}
			if(existingCol.trim().toUpperCase()===OlderheaderCol.trim().toUpperCase())
			{
				 IndexFound=i;
			}
		}
		
		// Update Column Text
		var ItemforMod =[];
		ItemforMod = this.state.testDatacolumns;
		ItemforMod[IndexFound].text = NewName.trim().toUpperCase();;
		this.setState({testDatacolumns:ItemforMod})
		this.setState({ testDatacolumns: [...this.state.testDatacolumns]});
		this.setState({selectedHeaderColumn:''})
		this.setState({NewColName:''})

		//@ Update Test Step Reference
		
		var TestScriptContent = this.state.TestScriptTestData;
		
		for(let i=0;i<TestScriptContent.length;i++)
		{
			var checkReference = TestScriptContent[i].value.toString();
			var OlderNameToUpdate = 't.'+OlderheaderCol.trim().toUpperCase();
			if(checkReference===OlderNameToUpdate)
			{
				ItemforMod = this.state.TestScriptTestData;
				ItemforMod[i].value = 't.'+NewName.trim().toUpperCase();
				this.setState({TestScriptTestData:ItemforMod})
			}
		}
		this.setState({ TestScriptTestData: [...this.state.TestScriptTestData]});

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
			failMessage= failMessage+'Step To can not be blank.';
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
		this.setState({loaderTestSteps:true})
		var succesStep = true;
		if(tesStepRowCount>0)
		{
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
						succesStep= false;
						this.setState({modal:true})
						return this.setState({modalValidationText:ORJson.servermessage})
					}

				}
				SaveORRequest();
			}
			if(!succesStep)
			{
				this.setState({loaderTestSteps:false})
				return;
			}
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
			const req3 = async () => 
			{
				this.setState({pageloadingStatus:true});
			  const request3 = await fetch(API,requestOptions)
			  const req3Response = await request3.json();
			  this.setState({pageloadingStatus:false});
			  if(!req3Response.success)
			  {
				  this.setState({loaderTestSteps:false})
				this.setState({modal:true})
				return this.setState({modalValidationText:'ISSUE: '+this.state.postResponceresult.servermessage})
			  }
			  else
			  {
				const Req3 = async () => 
				{
					this.setState({pageloadingStatus:true});
					const Req3 = await fetch(APIBasePath+'testscript/ ')
					const Response3 = await Req3.json();
					this.setState({allActionNameList:Response3});
					this.setState({customFunctionName:''})
					this.setState({customStepFrom:''})
					this.setState({customStepTo:''})
					this.setState({customFunctionObjective:''})
					this.setState({customFunctionParameter:''})
					this.setState({modal:true})
					this.setState({loaderTestSteps:false});
					this.setState({pageloadingStatus:false});
					return this.setState({modalValidationText:req3Response.servermessage})
				}
				Req3()
			  }
			  
			}
			req3();

		}
		else
		{
			this.setState({loaderTestSteps:false})
			this.setState({pageloadingStatus:false});
			this.setState({modal:true})
			return this.setState({modalValidationText:'Test Steps is missing in test scripts.'})
		}

	}
	updateENV(event){
		var onchangeenvvalue = event.target.value;
		var PrevEnv = this.state.Env;
		if(onchangeenvvalue===PrevEnv)
		{
			return;
		}
		this.setState({testscriptcheckENV : ''})
		this.setState({CommonDataTotalSize : 0})
		this.setState({CommonDataItem : []})
		this.setState({Env : ''})
		this.setState({Env : event.target.value})
		this.setState({loader : true})
		var URL =  APIBasePath+'testscript/'+onchangeenvvalue;
		const req1 = async () => 
		{
			this.setState({pageloadingStatus:true});
		  const request1 = await fetch(URL)
		  const req1Response = await request1.json();
		  this.setState({pageloadingStatus:false});
		  this.setState({CommonDataItem:executionHelper.GetListOfListItemforCommonItem(req1Response)})
		  this.setState({CommonDataTotalSize:this.state.CommonDataItem.length})
		  //@ add common Test Data
		  var UIModule = this.state.ModuleName;
		  var UITestID = this.state.NewTestID;
		  if(UIModule.trim()==="")
		  {
			  this.setState({loader : false})
			  return;
		  }
		  if(UITestID.trim()==="")
		  {
			  this.setState({loader : false})
			  return;
		  }
		  var testDataHeaderCol= [{dataField: 'testdatacolid',text: '#',headerStyle: { width: '40px' }}];
		  this.setState({ testDatacolumns:testDataHeaderCol});
		  this.setState({ testDataItemrowList:[]});
		  var testDataAPI =APIBasePath+'updatetestscript/'+onchangeenvvalue+'/'+UIModule+'/'+UITestID;
		  const TestScriptDataCheck = async () => 
		  {
			  this.setState({pageloadingStatus:true});
			  const testDataResponse = await fetch(testDataAPI);
			  const testDataContentItem = await testDataResponse.json();
			  this.setState({pageloadingStatus:false});
			  var colHeader=[];
			  if(testDataContentItem.length>0 )
			  {
				  var JsonTestDataItem = testDataContentItem[0];
				  var count = Object.keys(JsonTestDataItem).length;
				  if(count>0)
				  {
					  //@ Set HeaderName
					  var firstRowInfo= JsonTestDataItem[1];
					  colHeader = genericHelper.common_GetListKeyFromJsonResponce(firstRowInfo);
					  if(colHeader.length>0)
					  {
						 for(let i=0;i<colHeader.length;i++)
						 {
						  //var addcolumn = i;
						  var coldatafiledName='testdataColumn'+i
						  this.setState({ testDatacolumns: [...this.state.testDatacolumns, {
							  dataField: coldatafiledName,
							  text: colHeader[i],
							  headerEvents: {
								  onClick: (e) => 
								  {
									  this.setState({selectedHeaderColumn:e.target.innerHTML});
									  
								  }
								}
								
						  }] });
						 }
					  }
					  //@ Add Row Information
				  }
				  var allColItem=[];
				  var collist={}
				  for(let i=1;i<=count;i++)
				  {
					  collist={}
					  collist['testdatacolid']=i;
					  for(let j=0;j<colHeader.length;j++)
					  {
						  var keyName= colHeader[j];
						  collist['testdataColumn'+j] = JsonTestDataItem[i][keyName];
					  }
					  allColItem.push(collist);
					  
				  }
				  this.setState({ testDataItemrowList: allColItem});
				  this.setState({loader : false})
				  this.setState({pageloadingStatus:false});
			  }
			  else
			  {
				this.setState({pageloadingStatus:false});
				this.setState({loader : false})
			  }
		  }
		  TestScriptDataCheck();
		}
		req1();


	  }
	  updateTestID(event){

		var onChnageValue = event.target.value;
		var PrevTestID= this.state.NewTestID;
		if(onChnageValue===PrevTestID)
		{
			return;
		}
		this.setState({testscriptchecktestID : false})
		this.setState({NewTestID : ''})
		this.setState({NewTestID : onChnageValue})
		   //@ get module and ID
		   var UIEnv = this.state.Env;
		   var UIModule = this.state.ModuleName;
		   var UITestID = event.target.value;
		   const Request1 = async () => 
		   {
			 const Req1 = await fetch(APIBasePath+'testcase/'+UIModule+'/'+UITestID)
			 const Response1 = await Req1.json();
			 this.setState({testCaseName:Response1.TestCaseName})
		   }
		   Request1()
			var testscriptAPI =APIBasePath+'updatetestscript/'+UIModule+'/'+UITestID;
			const TestScriptContentCheck = async () => 
			{
				this.setState({pageloadingStatus:true});
				this.setState({loader:true})
				const ORResponse = await fetch(testscriptAPI);
				const testscriptcontentItem = await ORResponse.json();
				this.setState({pageloadingStatus:false});
				var JsonItem = testscriptcontentItem[0];
				var count = Object.keys(JsonItem).length;
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
				//@ set Test Data Column
				if(UIEnv.trim()!=="")
				{
					this.setState({loader:true})
					var testDataHeaderCol= [{dataField: 'testdatacolid',text: '#',headerStyle: { width: '40px' }}];
					this.setState({ testDatacolumns:testDataHeaderCol});
					this.setState({ testDataItemrowList:[]});
					var testDataAPI =APIBasePath+'updatetestscript/'+UIEnv+'/'+UIModule+'/'+UITestID;
					console.log(testDataAPI);
					const TestScriptDataCheck = async () => 
					{
						this.setState({pageloadingStatus:true});
						const testDataResponse = await fetch(testDataAPI);
						const testDataContentItem = await testDataResponse.json();
						this.setState({pageloadingStatus:false});
						var colHeader=[];
						if(testDataContentItem===null)
						{
							this.setState({loader:false})
							return;
						}
						if(testDataContentItem.length>0 )
						{
						    var JsonTestDataItem = testDataContentItem[0];
							var count = Object.keys(JsonTestDataItem).length;
							if(count>0)
							{
								//@ Set HeaderName
								var firstRowInfo= JsonTestDataItem[1];
								colHeader = genericHelper.common_GetListKeyFromJsonResponce(firstRowInfo);
								if(colHeader.length>0)
								{
								   for(let i=0;i<colHeader.length;i++)
								   {
									//var addcolumn = i;
									var coldatafiledName='testdataColumn'+i
									this.setState({ testDatacolumns: [...this.state.testDatacolumns, {
										dataField: coldatafiledName,
										text: colHeader[i],
										headerEvents: {
											onClick: (e) => 
											{
												this.setState({selectedHeaderColumn:e.target.innerHTML});
												
											}
										  }
										  
									}] });
								   }
								}
								//@ Add Row Information
							}
							var allColItem=[];
							var collist={}
							for(let i=1;i<=count;i++)
							{
								collist={}
								collist['testdatacolid']=i;
								for(let j=0;j<colHeader.length;j++)
								{
									var keyName= colHeader[j];
									collist['testdataColumn'+j] = JsonTestDataItem[i][keyName];
								}
								allColItem.push(collist);
								
							}
							this.setState({ testDataItemrowList: allColItem});
							this.setState({loader:false})
							this.setState({pageloadingStatus:false});
						}
						else
						{
							this.setState({loader:false})
							this.setState({pageloadingStatus:false});
						}
					}
					TestScriptDataCheck();
				}
			}
			TestScriptContentCheck();

		}
		DeleteTestScripts()
		{
			var testscriptModule= this.state.ModuleName;
			var testscriptNewTestID= this.state.NewTestID;
			var failMessage='';
			if(testscriptModule.trim()==='')
			{
				failMessage='Module can not be blank.'
				this.setState({testscriptcheckModule:true})
			}
			if(testscriptNewTestID.trim()==='')
			{
				failMessage=failMessage+' TestScript ID can not be blank.'
				this.setState({testscriptchecktestID:true})
			}
			console.log(failMessage)
			if(failMessage.trim()!=='')
			{
				this.setState({modal:true})
				return this.setState({modalValidationText:'Module/TestID can not be blank.'})
			}
			this.setState({loaderTestSteps:true})
			var DeletetAPI =APIBasePath+'customfunction/'+testscriptModule.trim()+'/'+testscriptNewTestID;
			const DeleteAPICall = async () => 
			{
				this.setState({pageloadingStatus:true});
				const APIRequest = await fetch(DeletetAPI);
				const APIResponse = await APIRequest.json();
				this.setState({loaderTestSteps:false})
				this.setState({pageloadingStatus:false});
				if(APIResponse.success)
				{
				  console.log(this.state.allTestID);
				  var newCusFunct=genericHelper.common_RemoveItesmfromListinJobject(this.state.allTestID,testscriptNewTestID)
				  console.log(newCusFunct);
				  this.setState({allTestID:newCusFunct})
				   this.setState({testDataItemrowList:''});
				   this.setState({NewTestID:''})
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
		  var ExceptionMessage ='';
		  var testscriptENV= this.state.Env;
		  var testscriptModule= this.state.ModuleName;
		  var testscriptNewTestID= this.state.NewTestID
		  var testscripttestCaseName = this.state.testCaseName;
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
			ExceptionMessage= ExceptionMessage+ 'TestID* can not be left blank.'
		  }
		  if(ExceptionMessage.trim() !=="")
		  {
			this.setState({modal:true})
			return this.setState({modalValidationText:ExceptionMessage})
		  }

		  //@ check action Name is not blank on step
		  var blankCheck= this.state.TestScriptTestData[0].action;
		  if(blankCheck.trim()==="")
		  {
			this.setState({modal:true})
			return this.setState({modalValidationText:'Action name can not be blank on test step.'})
		  }
		  var successTestStep = true;
		  this.setState({loaderTestSteps:true})
		  this.setState({pageloadingStatus:true});
		  const req1 = async () => 
		  {
				//-- Saving Common test data
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
					const req2 = async () => 
					{
					  const request2 = await fetch(APIBasePath+'testscript/'+testscriptENV,requestOptions)
					  const req2Response = await request2.json();
					  if(!req2Response.success)
					  {
						successTestStep= false;
						this.setState({loaderTestSteps:false})
						this.setState({modal:true})
						return this.setState({modalValidationText:'ISSUE: '+this.state.postResponceresult.servermessage})
					  }
					  
					}
					req2();
				}
				if(!successTestStep)
				{
					this.setState({loaderTestSteps:false})
					return;
				}
				//-- Saving  test data
				var testdataRowCount =this.state.testDataItemrowList.length;
				var jsTestda={};
				var jstestdataItemList={};
				//var runtimeText=[];
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
					requestOptions = 
					{
					method: 'POST',
					headers: {"Accept": "*/*",'Content-type': 'application/json'},
					body: JSON.stringify(json)
					};
					const req3 = async () => 
					{
					  const request3 = await fetch(APIBasePath+'testscript/'+testscriptENV+'/'+testscriptModule+'/'+testscriptNewTestID,requestOptions)
					  const req3Response = await request3.json();
					  if(!req3Response.success)
					  {
						this.setState({loaderTestSteps:false})
						this.setState({pageloadingStatus:false});
						successTestStep= false;
						this.setState({modal:true})
						return this.setState({modalValidationText:'ISSUE: '+req3Response.servermessage})
					  }
					}
					req3();
		
				}
				if(!successTestStep)
				{
					this.setState({loaderTestSteps:false})
					this.setState({pageloadingStatus:false});
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
							const ORResponse = await fetch(ORAPI,requestOptions);
							const ORJson = await ORResponse.json();
							if(!ORJson.success)
							{
								this.setState({pageloadingStatus:false});
								successTestStep= false;
								this.setState({modal:true})
								return this.setState({modalValidationText:ORJson.servermessage})
							}
		
						}
						SaveORRequest();
					}
					if(!successTestStep)
					{
						this.setState({pageloadingStatus:false});
						return;
					}
					json = genericHelper.common_ChangeJsoncontentforServer(jstestStepDatacollection);
					requestOptions = 
					{
					method: 'POST',
					headers: {"Accept": "*/*",'Content-type': 'application/json'},
					body: JSON.stringify(json)
					};
					var API=APIBasePath+'updatetestscript/'+testscriptModule+'/'+testscriptNewTestID+'/'+testscripttestCaseName+'/0';
					const req7 = async () => 
					{
					  const request7 = await fetch(API,requestOptions)
					  const req7Response = await request7.json();
					  if(!req7Response.success)
					  {
						this.setState({pageloadingStatus:false});
						this.setState({modal:true})
						return this.setState({modalValidationText:'ISSUE: '+this.state.postResponceresult.servermessage})
					  }
					  if(!successTestStep)
					  {
						this.setState({pageloadingStatus:false});
						this.setState({loaderTestSteps:false})
						return;
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
						// this.setState({TestScriptTestData:[{teststepid: 1, stepdescription: 'Add Test Step 1 description',action:'',locator:'',locatorproperty:'',value:'',exitIfFail:'Y'}]})
						this.setState({TestScriptTestData:[]})
						this.setState({testDataItemrowList:[]})
						this.setState({customFunctionName:''})
						this.setState({customStepFrom:''})
						this.setState({customStepTo:''})
						this.setState({customFunctionNameCheck:false})
						this.setState({customFunctionstepFromCheck:false})
						this.setState({customFunctionstepToCheck:false})
						const req8 = async () => 
						{
							this.setState({pageloadingStatus:true});
						  const request8 = await fetch(APIBasePath+'testcase/0')
						  const req8Response = await request8.json();
						  this.setState({pageloadingStatus:false});
						  this.setState({allModuleName:req8Response})
						  	const req9 = async () => 
							{
								this.setState({pageloadingStatus:true});
								const request9 = await fetch(APIBasePath+'testscript/0')
								const req9Response = await request9.json();
								this.setState({pageloadingStatus:false});
								this.setState({allActionNameList:req9Response})
								this.setState({loaderTestSteps:false})
								this.setState({modal:true})
								return this.setState({modalValidationText:'Test scripts is successfully updated.'})
							}
							req9();
						}
						req8();
					}
					req7();

				}
				else
				{
					this.setState({loaderTestSteps:false})
					this.setState({pageloadingStatus:false});
					this.setState({modal:true})
					return this.setState({modalValidationText:'Test Steps is missing in test scripts.'})
				}
		  }
		  req1();
		 
	}

	addNewCommonData = () => 
	{
		var ItemCount =this.state.CommonDataItem.length
		//console.log(ItemCount);
		if(ItemCount>0)
		{
			var valuecheck = this.state.CommonDataItem[ItemCount-1].commonKeyName
			//console.log(valuecheck);
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
        this.setState({loaderTestSteps:true})
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
		this.setState({loaderTestSteps:false})
		//# End of Implementation
	}
	addNewTestDataRow = () => 
	{
		this.setState({headernameCheck:false})
		//var itemlist ='';
		var lastColumn = this.state.testDatacolumns.length;
		if(lastColumn>1)
		{
			var lastOneId = this.state.testDataItemrowList.length + 1;
			//var valuetoadd = '';
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
		this.setState({selectedTestStepNumber:0})
		this.setState({selectedTestStepNumber:selectedID})
		this.setState({loaderTestSteps:false})
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
			var testcol = this.state.testDatacolumns.filter(el => el.text !== HeaderCol);
			for(let i=headerIndex;i<testcol.length;i++)
			{
				var index = i-1;
				var keyName='testdataColumn'+index;
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
			this.setState({selectedHeaderColumn:''});
			
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
    <Page title="Update Test Scripts" breadcrumbs={[{ name: 'Update Test Scripts', active: true }]}>
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
            <CardHeader>Test Script Setup
			<Button disabled={this.state.pageloadingStatus} color="primary" onClick={this.DeleteTestScripts.bind(this)} name ="deleteTestScript">Delete Test Script</Button>
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
				  <Input disabled={this.state.pageloadingStatus} type="select" value={this.state.ModuleName} invalid={this.state.testscriptcheckModule} name ="testscriptModule" onChange={this.updateModule.bind(this)}>
				  	<option selected="selected">{this.state.ModuleName}</option>
					  <OptionsValue options= {this.state.allModuleName}/>
				  </Input>
                  </Col>
                </FormGroup>
				<FormGroup col>
                  <Label for="exampleSelect" sm={5}>
                    TestID*
                  </Label>
                  <Col >
				  <Input disabled={this.state.pageloadingStatus} value={this.state.NewTestID} type="select" invalid={this.state.testscriptchecktestID} name ="testscriptTestID" onChange={this.updateTestID.bind(this)}>
					 <option selected="selected">{this.state.NewTestID}</option>
					  <OptionsValue options= {this.state.allTestID}/>
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
				<Input type="input" disabled="true" name="oldercolName"  value={this.state.selectedHeaderColumn} />
				<Input disabled={this.state.pageloadingStatus} invalid={this.state.checkNewColName} type="input" name="newColName" placeholder="Rename Colum name" value={this.state.NewColName} onChange={this.TypeNewColName.bind(this)}/>
				<Button disabled={this.state.pageloadingStatus} onClick={this.RenameColumn.bind(this)} color="primary" name ="RenameCol">Rename Column</Button>
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
				disabled={this.state.pageloadingStatus}
				data={ this.state.testDataItemrowList }
				columns={ this.state.testDatacolumns}
				striped
				hover
				condensed
				pagination={ paginationFactory(options) }
				cellEdit={ cellEditFactory({
					mode: 'click',
					blurToSave: true,
					})}
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
			visible = {this.state.loaderTestSteps}
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
		<Row>
		 <Col lg={12} md={12} sm={12} xs={12}>
          <Card>
            <CardHeader>Create New Custom Function
				<Button disabled={this.state.pageloadingStatus} onClick={this.saveCustomFunction.bind(this)} color="primary" name ="customfunc">Save Custom Function</Button>
			</CardHeader>
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

export default UpdateTestScript;
