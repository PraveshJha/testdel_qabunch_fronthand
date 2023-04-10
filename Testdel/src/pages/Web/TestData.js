import Page from 'components/Page';
import React from 'react';
import bg3Image from 'assets/img/bg/deleterow.JPG';
import bg1Image from 'assets/img/bg/addnewrow.JPG';
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
} from 'reactstrap';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

var APIBasePath= window.ENV.APIURL;

function Options({ options }) {
    return (
        options.map(option => 
                    <option key={option.Environment}>                                   
                    {option.Environment}
                    </option>)
                   );
}
function GetAllModule({ options }) {

	return (
	  Object.keys(options).map((key)  => 
	  <option >{options[key]}</option>)
	);
	
  }
class TestData extends React.Component{

	constructor(props)
	{
		super(props);
		this.state=
		{
			envEnv:'',
			testdataEnv:'',
			checkenvEnv:false,
			envCopy:'',
			checkenvCopy:false,
			envRename:'',
			checkenvRename:false,
			CommonDataItem: [],
			modEnv:'',
			checkmodEnv:false,
			CommonDataTotalSize:0,
			CommonTestDataChange: false,
			selectedCommonID:0,
			selectedTestData:0,
			testDataModule:'',
			allModuleName: [],
			testDatacolumns :[{}],
			testDataItemrowList:[],
			checkTestDataEnv:false,
			checkTestDataModule:false,
			PreviousTestDataState:[],
			CommonTestData:[],
			loader:true,
			loaderTestData:false,
			pageloadingStatus :false,
		}

		const GetLoaderData = async () => 
		{
			this.setState({pageloadingStatus:true});
		  const homepage = await fetch(APIBasePath+'dashboard');
		  const homepageResponse = await homepage.json();
		  this.setState({CommonTestData:homepageResponse.CommonTestData});
		  this.setState({loader:false});
		  this.setState({pageloadingStatus:false});
		}
		GetLoaderData();
		
	}

	SelectenvEnv(event)
	{
	  
	  this.setState({envEnv: event.target.value})
	  
	}
	SaveModuleTestData()
	{
		var tesEnv = this.state.testdataEnv;
		var tesModule = this.state.testDataModule;
		var Message='';
		if(tesEnv.trim()==="")
		{
			this.setState({checkTestDataEnv:true})
			Message='Environment can not be blank';
		}
		if(tesModule.trim()==="")
		{
			this.setState({checkTestDataModule:true})
			Message='Module can not be blank';
		}
		if(Message.trim()!=="")
		{
			return;
		}
		var ItemList = this.state.testDataItemrowList;
		var ColList = this.state.testDatacolumns;
		if(ItemList.length===0)
		{
			this.setState({modal:true})
		    return this.setState({modalValidationText:'Please add the test data information.'});
		}
		if(ColList.length===1 || ColList.length===0)
		{
			this.setState({modal:true})
		    return this.setState({modalValidationText:'Please add the test data information.'});
		}
		for(let i=0;i<ItemList.length;i++)
		{
			var testIDName= ItemList[i]['testdatacolid1'];
			if(testIDName.trim() ==="")
			{
				this.setState({modal:true})
				return this.setState({modalValidationText:'Please add the test data information for record number '+(i+1)+', before saving the record.'});
			}
		}
		this.setState({loaderTestData:true})
		var NewItemList=[];
		
		for(let i=0;i<ItemList.length;i++)
		{
			var newContent={}
			newContent['id']=i+1;
			for(let j=1;j<ColList.length;j++)
			{
				newContent[ColList[j].text]=ItemList[i]['testdatacolid'+j]
			}
			NewItemList.push(newContent);
		}
		//@ Post Request Send for Save Test Data.
		//console.log(NewItemList)
		var APIBody = genericHelper.common_ChangeJsoncontentforServer(NewItemList);
		console.log(APIBody);

		//var APIBody = JSON.stringify({QA:1})
		var API =APIBasePath+'testdata/'+tesEnv+'/'+tesModule;
        var requestOptions = {
          method: 'POST',
          headers: {"Accept": "*/*",'Content-type': 'application/json'},
      	  body: JSON.stringify(APIBody)
        };
        const SaveTestDataRequest = async () => 
        {
			this.setState({pageloadingStatus:true});
          const APIResponse = await fetch(API,requestOptions);
		  const APIResponseJson = await APIResponse.json();
		  this.setState({loaderTestData:false})
		  this.setState({pageloadingStatus:false});
		  this.setState({modal:true})
		  return this.setState({modalValidationText:APIResponseJson.servermessage})
          
          
        }
        SaveTestDataRequest();
	}
	SelectTestDataEnv(event)
	{
	  var TEnv= event.target.value;
	  var oldEnv = this.state.testdataEnv;
	  
	  this.setState({testdataEnv: TEnv})
	  this.setState({checkTestDataEnv:false})
	  if(TEnv.trim().toString() !== oldEnv.trim().toString())
	  {
		this.setState({loaderTestData:true})
		const GetModule = async () => 
		{
			this.setState({pageloadingStatus:true});
			const ModuleResponce = await fetch(APIBasePath+'testcase/0')
			const ModuleList = await ModuleResponce.json();
			this.setState({allModuleName:ModuleList})
			this.setState({loaderTestData:false})
			this.setState({pageloadingStatus:false});
		}
		GetModule();
	  }
	  
	}

	SelectTestDataModule(event)
	{
		var TestDModule = event.target.value;
		var OldModule = this.state.testDataModule;
		
		this.setState({testDataModule : TestDModule})
		this.setState({checkTestDataModule:false})
		var keyName= '';
		var keyValNew='';
		//@ Logic For Test Data
		var TestEn= this.state.testdataEnv;
		if(TestDModule.trim().toString() !== OldModule.trim().toString())
		{
			try 
			{
			  this.setState({loaderTestData:true})
			  this.setState({pageloadingStatus:true})
			  this.setState({PreviousTestDataState:[]})
			  var TotalHeader=[];
			  var testDataFile = {};
			  const Request1 = async () => 
			  {
				const Req1 = await fetch(APIBasePath+'testdata/'+TestEn+'/'+TestDModule)
				const Response1 = await Req1.json();
				testDataFile=Response1;
				let allTestID = Object.keys(testDataFile);
				for(let i=0;i<allTestID.length;i++)
				{
				  var allTestIDcontent = testDataFile[allTestID[i]][0][1];
				  let TestDataFromID= Object.keys(allTestIDcontent);
				  for(let j=0;j<TestDataFromID.length;j++)
				  {
					 keyName =TestDataFromID[j];
					if(!TotalHeader.includes(keyName))
					{
					  TotalHeader.push(keyName);
					}
				  }
				}
				//@ Set Header Column
				this.setState({testDatacolumns:[]});
				var testDataHeaderCol= [{dataField: 'id',text: '#'},{dataField: 'testdatacolid1',text: 'TESTID'}];
				this.setState({ testDatacolumns:testDataHeaderCol});
				this.setState({ testDataItemrowList:[]});
				
				for(let i=0;i<TotalHeader.length;i++)
				{
				  var Item={}
				  var coldatafiledName='testdatacolid'+(i+2)
				  Item={dataField:coldatafiledName,text:TotalHeader[i]}
				  testDataHeaderCol.push(Item)
				}
				this.setState({ testDatacolumns:testDataHeaderCol});
  
				//@ Set Row Details
				var allRowItem=[];
				
				var counter=0;
				for(let i=0;i<allTestID.length;i++)
				{
					var TestID=allTestID[i];
				   var CheckData = testDataFile[TestID][0];
				   var TestDataIteration1 = Object.keys(CheckData);
					for(let j=0;j<TestDataIteration1.length;j++)
					{
					  counter=counter+1;
					  var RowList={}
					  RowList['id']=counter;
					  RowList['testdatacolid1']=TestID;
					  for(let k=0;k<TotalHeader.length;k++)
					  {
						   keyName= TotalHeader[k];
						   keyValNew=''
						  try
						  {
							keyValNew= CheckData[j+1][keyName];
						   if(keyValNew===undefined)
						   {
							  keyValNew='';
						   }
						  }
						  catch(err)
						  {
							  keyValNew='';
						  }
						  var colNumber = (k+2);
						  RowList['testdatacolid'+colNumber] = keyValNew
					  }
					  allRowItem.push(RowList);
				  }
				  
				}
			   this.setState({ testDataItemrowList: allRowItem});
			   this.setState({PreviousTestDataState:allRowItem})
			   this.setState({loaderTestData:false})
			   this.setState({pageloadingStatus:false})
			  }
			  Request1();


			}
			catch (err) 
			{
				this.setState({testDatacolumns:[]});
				this.setState({ testDataItemrowList:[]});
				this.setState({loaderTestData:false})
				this.setState({pageloadingStatus:false})
				return null;
			}
		}
		
	
	}
	SelectenvCopy(event)
	{
	  var envcopyvalue = event.target.value;
	  
	  this.setState({envCopy: event.target.value})
	  this.setState({checkenvCopy:false})
	  
	  var allItem = this.state.CommonTestData
	  for(let i=0;i<allItem.length;i++)
	  {
		  if(allItem[i].Environment.toString().trim().toLowerCase()===envcopyvalue.trim().toString().toLowerCase())
		  {
			this.setState({checkenvCopy:true})
			return this.setState({modalValidationText:'Env is already present'})
		  }
	  }
  
	}

	SelectenvRename(event)
	{
	  var envcopyvalue=event.target.value;
	  
	  this.setState({envRename: event.target.value})
	  this.setState({checkenvRename:false})
	  
	  var allItem = this.state.CommonTestData
	  for(let i=0;i<allItem.length;i++)
	  {
		  if(allItem[i].Environment.toString().trim().toLowerCase()===envcopyvalue.trim().toString().toLowerCase())
		  {
			this.setState({checkenvRename:true})
			return this.setState({modalValidationText:'Env is already present'})
		  }
	  }
  
	}

	DeleteEnv()
	{
	  //var ExceptionMessage='';
	  var env= this.state.envEnv
	  if(env.trim()==="")
	  {
		//ExceptionMessage= ExceptionMessage+ 'Environment* can not be left blank.'
		return this.setState({checkenvEnv:true})
	  }
      this.setState({loader:true})
	  this.setState({pageloadingStatus:true})
	  var ORAPI =APIBasePath+'or/'+env;
	  const DeleteEnvReq = async () => 
	  {
		const ORResponse = await fetch(ORAPI);
		const ORJson = await ORResponse.json();
		this.setState({loader:false})
		this.setState({pageloadingStatus:false})
		if(ORJson.success.toLowerCase()==='true')
		{
		  this.state.envEnv='';
		  this.setState({modal:true})
		  return this.setState({modalValidationText:ORJson.servermessage})
		}
		else
		{
		  this.setState({modal:true})
		  return this.setState({modalValidationText:ORJson.servermessage})
		}
		
		
	  }
	  DeleteEnvReq();
  
	}

	CreateNewEnvCopy()
	{
	  var ExceptionMessage ='';
	  var envName= this.state.envEnv
	  var envCopy= this.state.envCopy
	  if(envName.trim()==="")
	  {
		this.setState({checkenvEnv:true})
		ExceptionMessage= ExceptionMessage+ 'Environment* can not be left blank.'
	  }
	  if(envCopy.trim()==="")
	  {
		this.setState({checkenvCopy:true})
		ExceptionMessage= ExceptionMessage+ 'New Env. Copy* can not be left blank.'
	  }
	  if(ExceptionMessage.trim() !=="")
	  {
	   // this.setState({modal:true})
		return this.setState({modalValidationText:ExceptionMessage})
	  }
	  if(envName.trim().toLowerCase()===envCopy.trim().toLowerCase())
	  {
		//this.setState({modal:true})
		this.setState({checkenvCopy:true})
		return this.setState({modalValidationText:'No Changes to Save'})
	  }
	  this.setState({loader:true})
	  var allItem = this.state.CommonTestData
	  for(let i=0;i<allItem.length;i++)
	  {
		  if(allItem[i].Environment.toString().trim().toLowerCase()===envCopy.trim().toString().toLowerCase())
		  {
			this.setState({checkenvCopy:true})
			return this.setState({modalValidationText:'No Changes to Save'})
		  }
	  }
	  var ORAPI =APIBasePath+'or/'+envName+'/'+envCopy+'/0';
	  const NewEnvCopy = async () => 
	  {
		this.setState({pageloadingStatus:true})
		const ORResponse = await fetch(ORAPI);
		const ORJson = await ORResponse.json();
		this.setState({pageloadingStatus:false})
		if(ORJson.success.toLowerCase()==='true')
		{
		  this.setState({loader:false})
		  this.state.envEnv='';
		  this.setState({modal:true})
		  return this.setState({modalValidationText:ORJson.servermessage})
		}
		else
		{
		  this.setState({loader:false})
		  this.setState({modal:true})
		  return this.setState({modalValidationText:ORJson.servermessage})
		}
		
		
	  }
	  NewEnvCopy();
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
		this.setState({loader:true})
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
			this.setState({pageloadingStatus:true})
		  const ORResponse = await fetch(ORAPI,requestOptions);
		  const ORJson = await ORResponse.json();
		  this.setState({modal:true})
		  this.setState({loader:false})
		  this.setState({pageloadingStatus:false})
		  return this.setState({modalValidationText:ORJson.servermessage})
		}
		commonDataRequest();

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
		const Request1 = async () => 
		{
			this.setState({pageloadingStatus:true})
		  const Req1 = await fetch(URL)
		  const Response1 = await Req1.json();
		  this.setState({CommonDataItem:executionHelper.GetListOfListItemforCommonItem(Response1)})
		  this.setState({CommonDataTotalSize:this.state.CommonDataItem.length})
		  this.setState({loader:false})
		  this.setState({pageloadingStatus:false})
		}
		Request1();

	  }

	RenameEnv()
	{
	  var ExceptionMessage ='';
	  var envName= this.state.envEnv
	  var envCopy= this.state.envRename
	  if(envName.trim()==="")
	  {
		this.setState({checkenvEnv:true})
		ExceptionMessage= ExceptionMessage+ 'Environment* can not be left blank.'
	  }
	  if(envCopy.trim()==="")
	  {
		this.setState({checkenvRename:true})
		ExceptionMessage= ExceptionMessage+ 'Rename Env* can not be left blank.'
	  }
	  if(ExceptionMessage.trim() !=="")
	  {
	   // this.setState({modal:true})
		return this.setState({modalValidationText:ExceptionMessage})
	  }
	  if(envName.trim().toLowerCase()===envCopy.trim().toLowerCase())
	  {
		//this.setState({modal:true})
		this.setState({checkenvRename:true})
		return this.setState({modalValidationText:'No Changes to Save'})
	  }
	  var allItem = this.state.CommonTestData
	  for(let i=0;i<allItem.length;i++)
	  {
		  if(allItem[i].Environment.toString().trim().toLowerCase()===envCopy.trim().toString().toLowerCase())
		  {
			this.setState({checkenvRename:true})
			return this.setState({modalValidationText:'Env is already present'})
		  }
	  }
      this.setState({loader:true})
	  var ORAPI =APIBasePath+'or/'+envName+'/'+envCopy+'/0/0';
	  const RenameEnv = async () => 
	  {
		this.setState({pageloadingStatus:true})
		const ORResponse = await fetch(ORAPI);
		const ORJson = await ORResponse.json();
		this.setState({pageloadingStatus:false})
		this.setState({loader:false})
		if(ORJson.success.toLowerCase()==='true')
		{
		  this.state.envEnv='';
		  this.setState({modal:true})
		  return this.setState({modalValidationText:ORJson.servermessage})
		}
		else
		{
		  this.setState({modal:true})
		  return this.setState({modalValidationText:ORJson.servermessage})
		}
		
		
	  }
	  RenameEnv();

  
	}
	addNewCommonData = () => 
	{
		var env = this.state.modEnv;
		if(env.trim()==="")
		{
			this.setState({checkmodEnv:true})
			return;
		}
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
	deleteCommonData = () => {

		var allItem = this.state.CommonDataItem.length;
		if(allItem===0)
		{
			return;
		}
		var selectedrowid = this.state.selectedCommonID;
		if(selectedrowid===0)
		{
			this.setState({modal:true})
			return this.setState({modalValidationText:'Please select record before delete action.'})
		}
		this.setState({loader:true})
		var commontestDataItems = this.state.CommonDataItem.filter(m => m.id !== selectedrowid);
		for(let i=selectedrowid-1;i<allItem-1;i++)
		{
			commontestDataItems[i].id=i+1;
		}
		this.setState({ CommonDataItem: commontestDataItems });
		this.setState({ selectedCommonID:selectedrowid });
		this.setState({loader:false})
		

	  };
	  handleOnSelect = (row, isSelect) => {
		if (isSelect) 
		{
			var selectedrow= row.id;
			this.setState({ selectedCommonID:selectedrow });

		}
	}
	handleOnSelectForTestData = (row, isSelect) => {
		if (isSelect) 
		{
			var selectedrow= row.id;
			this.setState({ selectedTestData:selectedrow });

		}
	}
	addNewTestDataRow = () => 
	{
		var ItemList = this.state.testDataItemrowList;
		var ColList = this.state.testDatacolumns;
		if(ColList.length===1)
		{
			return;
		}
		if(ItemList.length>1)
		{
			for(let i=0;i<ItemList.length;i++)
			{
				var testIDName= ItemList[i]['testdatacolid1'];
				if(testIDName.trim() ==="")
				{
					this.setState({modal:true})
			        return this.setState({modalValidationText:'Please add the test data information for record number '+(i+1)+', before adding new record.'});
				}
			}
		}
		this.setState({loaderTestData:true})
		var selectedID = this.state.selectedTestData;
		if(selectedID>ItemList.length)
		{
			selectedID=0;
		}
		//@ Add New Row using variable
		if(selectedID ===0)
		{
			selectedID= ItemList.length;
		}
		var UpdatedRow=[]
		for(let i=0;i<selectedID;i++)
		{
			UpdatedRow[i]= this.state.testDataItemrowList[i];
		}
		//@ add New Row
		var NewItemContent ={};
		try
		{
		selectedID= parseInt(selectedID.trim())
		}
		catch(error)
		{}
		NewItemContent['id']=selectedID+1;
		NewItemContent['testdatacolid1']=''
		for(let i=2;i<ColList.length;i++)
		{
			var keyName = 'testdatacolid'+i
			NewItemContent[keyName]='';
		}
		UpdatedRow.push(NewItemContent)
		for(let i=selectedID;i<ItemList.length;i++)
		{
			ItemList[i]['id']=i+2;
			UpdatedRow.push(ItemList[i]);
		}
		this.setState({ testDataItemrowList: UpdatedRow});
		this.setState({loaderTestData:false})

	}
	deleteTestDataRow = () =>
	 {
		var ItemList = this.state.testDataItemrowList;
		if(ItemList.length===0)
		{
			return;
		}
		var selectedID = this.state.selectedTestData;
		if(selectedID===0)
		{
			return;
		}
		this.setState({loaderTestData:true})
		var testData = this.state.testDataItemrowList.filter(m => m.id !== selectedID);
		for(let i=selectedID;i<=testData.length;i++)
		{
			testData[i-1]['id']=i;
		}
		this.setState({ testDataItemrowList: testData });
		this.setState({selectedTestData:selectedID})
		this.setState({loaderTestData:false})
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
	
	  render() {
	
		var {allModuleName} = this.state;
	  
		const selectRow = {
			mode: 'radio',
			onSelect: this.handleOnSelect
			};
		const selectRowforTestData = {
			mode: 'radio',
			onSelect: this.handleOnSelectForTestData
			};
		const rowEvents = {
			onClick: (e, row, rowIndex) => {
				//console.log(`clicked on row with index: ${rowIndex}`);
		}};
		const afterSaveCell=(oldValue, newValue) =>
		{
			this.setState({CommonTestDataChange:true})
		};
		const options = {
		sizePerPage: 20,
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
  return (
    <Page title="Test Data" breadcrumbs={[{ name: 'Test Data', active: true }]}>
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
            <CardHeader>Update Environment</CardHeader>
            <CardBody>
              <Form inline>
                <FormGroup row>
                  <Label for="exampleSelect" >
                    Environment*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkenvEnv} type="select" name="envEnv" value={this.state.envEnv} onChange={this.SelectenvEnv.bind(this)}>
					<option selected="selected">{this.state.envEnv}</option>
					<Options options={this.state.CommonTestData} />
					</Input>
                  </Col>
				</FormGroup>
				<Col>
				  <Button disabled={this.state.pageloadingStatus} onClick={this.DeleteEnv.bind(this)} color="primary" name="envDelete" >Delete</Button>
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
			  <FormGroup row>
                  <Label for="exampleSelect" >
                    New Env. Copy*
                  </Label>
                    <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkenvCopy} value={this.state.envCopy} type="input" name="newEnvCopy" placeholder="New env name."  onChange={this.SelectenvCopy.bind(this)}/>
                  </Col>
              </FormGroup>
			  <Col>
				  <Button disabled={this.state.pageloadingStatus} onClick={this.CreateNewEnvCopy.bind(this)} color="primary" name ="newEnvCopy">Save</Button>
			  </Col>
			  <FormGroup row>
                  <Label for="exampleSelect" >
                    Rename Env.*
                  </Label>
                    <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkenvRename} value={this.state.envRename} type="input" name="newEnvName" placeholder="New env name." onChange={this.SelectenvRename.bind(this)}/>
                  </Col>
              </FormGroup>
			  <Col>
				  <Button disabled={this.state.pageloadingStatus} onClick={this.RenameEnv.bind(this)} color="primary" name ="newEnvName">Save</Button>
			  </Col>
              </Form>
            </CardBody>
          </Card>
        </Col>
		<Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Common Test Data 
				<row>
					<Button disabled={this.state.pageloadingStatus} onClick={this.SaveCommonTestData.bind(this)} color="primary" name ="saveCommonTestData">Save</Button>
				</row>
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
					 disabled={this.state.pageloadingStatus}
					  src={bg1Image}
					  style={{ width: 'auto', height: 30 }}
					  onClick={ () => this.addNewCommonData() }
					/>
					<CardImg
					  className="card-img-right"
					  disabled={this.state.pageloadingStatus}
					  src={bg3Image}
					  style={{ width: 'auto', height: 30 }}
					  onClick={ () => this.deleteCommonData() } 
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
					afterSaveCell
					})}
			/>
            </CardBody>
          </Card>
        </Col>
	</Row>
	  <Row>
	  	<Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Update Test Script Data
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
				<Button disabled={this.state.pageloadingStatus} onClick={this.SaveModuleTestData.bind(this)} color="primary" name ="saveTestData">Save</Button>
				<Loader 
				type="ThreeDots"
				color="#00BFFF"
				height={50}
				width={100}
				timeout={120000} //3 secs
				visible = {this.state.loaderTestData}
				/>
			</CardHeader>
            <CardBody>
			<Form >
                <FormGroup row>
                  <Label for="exampleSelect" >
                    Environment*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkTestDataEnv} type="select" name="testdataEnv" value={this.state.testdataEnv} onChange={this.SelectTestDataEnv.bind(this)}>
					<option selected="selected">{this.state.testdataEnv}</option>
					<Options options={this.state.CommonTestData} />
					</Input>
                  </Col>
				  <Label for="exampleSelect" >
                    Module*
                  </Label>
				  <Col >
                    <Input disabled={this.state.pageloadingStatus} invalid={this.state.checkTestDataModule} type="select" name="testDataModule" value={this.state.testDataModule} onChange={this.SelectTestDataModule.bind(this)}>
					<option selected="selected">{this.state.testDataModule}</option>
					<GetAllModule options={allModuleName} />
					</Input>
                  </Col>
				</FormGroup>
				<CardBody>
				<BootstrapTable
					keyField="id"
					disabled={this.state.pageloadingStatus}
					data={ this.state.testDataItemrowList }
					columns={ this.state.testDatacolumns}
					striped
					hover
					condensed
					pagination={ paginationFactory(options) }
					selectRow={ selectRowforTestData }
					cellEdit={ cellEditFactory({
						mode: 'click',
						blurToSave: true,
						})}
				/>
                </CardBody>
            </Form>
            </CardBody>
          </Card>
        </Col>			
        </Row>
		</Page>
  );
  }
};

export default TestData;
