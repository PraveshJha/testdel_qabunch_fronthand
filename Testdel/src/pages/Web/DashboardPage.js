import Page from 'components/Page';
import {NumberWidget } from 'components/Widget';
import {Pie } from 'react-chartjs-2';
import React from 'react';
import { Bar, Line ,Doughnut} from 'react-chartjs-2';
import genericHelper from '../funcLibraries/GenericHelper.js';
import dashboardHelper from '../funcLibraries/dashboardHelper.js';
import graph from '../funcLibraries/graph.js';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  Form,
  FormGroup,
  Input,
  Label,
} 
from 'reactstrap';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

var APIBasePath= window.ENV.APIURL;

function Options({ options }) {
    return (
        options.map(option => 
                    <option >{option.Environment}</option>)
                   );
}

function DateOptions({ options }) {
  let allitem = []
  for (let i = 0; i < options.length; i++) 
  {
    allitem.push(options[i]);
    
  }
  return (
          allitem.map((i,index) => 
          <option >{allitem[index]}</option>)
        );
  
}
function TimeOptions({ options }) {
  return (
          Object.keys(options).map((key)  => 
          <option >{key}</option>)
        );
  
}
class DashboardPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      items: [],
      summary: [],
      dashboardTotalDays:[],
      defaultEnv:'',
      ENV:'',
      EXECUTIONDATE:'',
      executionDateList:[],
      EXECUTIONHTMLTime:'',
      allModule :[],
      allModuleName:[],
      PassModulewise:[],
      allPassModuleWise:[],
      FailModulewise:[],
      allFailModuleWise:[],
      ConfigurationFile:[],
      CommonTestData:[],
      loader:true,
      ExecutionTimeXaxis:[],
      ExecutionTimeYAxis:[],
      Build1ExecutionDate:'',
      Build1ExecutionTime:'',
      Build2ExecutionDate:'',
      Build2ExecutionTime:'',
      build1ExecutionTimeList:[],
      build2ExecutionTimeList:[],
      buildLoader:false,
      Build1Summary:[],
      Build2Summary:[],
      Build1TotalExecutedScripts:0,
      Build2TotalExecutedScripts:0,
      Build1TotalExecutionTime:'00:00:00',
      Build2TotalExecutionTime:'00:00:00',
      Build1TotalComponentExecuted:0,
      Build2TotalComponentExecuted:0,
      ExecutionTimeList:[],
      Build1ExecutionData:[],
      Build2ExecutionData:[],
      BuildHeaderColumn :[{dataField: 'id',text: '#',headerStyle: {backgroundColor: '#aa66cc'}},{dataField: 'module',text: 'Module',filter: textFilter(),headerStyle: {backgroundColor: '#aa66cc'}},{dataField: 'pass',text: 'PASS',headerStyle: {backgroundColor: '#aa66cc'}},{dataField: 'fail',text: 'Fail',headerStyle: {backgroundColor: '#aa66cc'}},{dataField: 'buildmoduleexetime',text: 'Execution Time',headerStyle: {backgroundColor: '#aa66cc'}}],
      Build1SummarySection:false,
      Build2SummarySection:false,
      buildLoader2:false,
      build1Env:'',
      build2Env:'',
      TestScriptModalData:[],
      CustomFunctionModalData:[],
      pageloadingStatus :false,
      ReportPublishPath:'',

    }
    const GetLoaderData = async () => 
    {
      this.setState({pageloadingStatus:true});
      const homepage = await fetch(APIBasePath+'dashboard');
      const homepageResponse = await homepage.json();
      this.setState({pageloadingStatus:false});
      if(homepageResponse.success)
      {
        this.setState({pageloadingStatus:true});
        this.setState({ReportPublishPath:homepageResponse['ReportPublishPath']});
          this.setState({ConfigurationFile:homepageResponse.Configuration});
          this.setState({CommonTestData:homepageResponse.CommonTestData});
          this.setState({defaultEnv:this.state.ConfigurationFile.DefaultEnvironment})
          this.setState({ENV:this.state.ConfigurationFile.DefaultEnvironment})
          this.setState({build1Env:this.state.ConfigurationFile.DefaultEnvironment})
          this.setState({build2Env:this.state.ConfigurationFile.DefaultEnvironment})
          this.setState({EXECUTIONDATE:'Last '+homepageResponse.Configuration.DashboardHistoryCount+' Execution Results'})
          // Request 2
        const req2 = async () => 
        {
          const request2 = await fetch(APIBasePath+'as')
          const req2Response = await request2.json();
          this.setState({items:req2Response})
          // Request 3
          const req3 = async () => 
          {
            console.log(APIBasePath+'summary/'+this.state.ConfigurationFile.DefaultEnvironment+'/Last '+this.state.ConfigurationFile.DashboardHistoryCount+' Execution Results/0');
            const request3 = await fetch(APIBasePath+'summary/'+this.state.ConfigurationFile.DefaultEnvironment+'/Last '+this.state.ConfigurationFile.DashboardHistoryCount+' Execution Results/0')
            const req3Response = await request3.json();
            this.setState({summary:req3Response})
            // Request 4
            const req4 = async () => 
            {
              const request4 = await fetch(APIBasePath+'summary/'+this.state.ConfigurationFile.DashboardTotalDayCount)
              const req4Response = await request4.json();
              this.setState({dashboardTotalDays:genericHelper.common_GetListvalueFromJsonResponce(req4Response)})
              // Request 5
              const req5 = async () => 
              {
                const request5 = await fetch(APIBasePath+'testcase/0')
                const req5Response = await request5.json();
                this.setState({allModuleName:req5Response})
                var ModuleName = genericHelper.common_GetListvalueFromJsonResponce(this.state.allModuleName)
                this.setState({allModule:ModuleName});
                 // Request 6
                const req6 = async () => 
                {
                  const request6 = await fetch(APIBasePath+'dashboard/'+this.state.ENV+'/'+this.state.ConfigurationFile.DashboardHistoryCount+'/0')
                  const req6Response = await request6.json();
                  this.setState({PassModulewise:req6Response})
                  var RunTimeCheck = genericHelper.common_GetListvalueFromJsonResponce(this.state.PassModulewise)
                  this.setState({allPassModuleWise:RunTimeCheck});
                   // Request 7
                  const req7 = async () => 
                  {
                    const request7 = await fetch(APIBasePath+'dashboard/'+this.state.ENV+'/'+this.state.ConfigurationFile.DashboardHistoryCount+'/1')
                    const req7Response = await request7.json();
                    this.setState({FailModulewise:req7Response})
                    var RunTimeCheck = genericHelper.common_GetListvalueFromJsonResponce(this.state.FailModulewise)
                    this.setState({allFailModuleWise:RunTimeCheck});
                    const req8 = async () => 
                    {
                      const request8 = await fetch(APIBasePath+'dashboard/'+this.state.ENV+'/'+this.state.ConfigurationFile.DashboardHistoryCount)
                      const req8Response = await request8.json();
                      this.setState({ExecutionTimeList:req8Response})
                      this.setState({ExecutionTimeXaxis:genericHelper.common_GetListKeyFromJsonResponce(req8Response)});
                      this.setState({ExecutionTimeYAxis:genericHelper.common_GetListvalueFromJsonResponce(req8Response)});
                      this.setState({loader:false})
                      this.setState({pageloadingStatus:false});
                    }
                    req8();
                  }
                  req7();
                }
                req6();
              }
              req5();
            }
            req4();
          }
          req3();
        }
        req2();
      }
    }
    GetLoaderData();
    
   // this is needed, because InfiniteCalendar forces window scroll
     window.scrollTo(0, 0);
  }
  
  updateENV(event)
  {
    var PreviousEnv = this.state.ENV;
    var onchangeenvvalue = event.target.value;
    this.setState({ENV : onchangeenvvalue})
    if(PreviousEnv ===onchangeenvvalue)
    {
      return;
    }
    if(this.state.EXECUTIONDATE.includes('Execution Results'))
    {
      this.setState({executionDateList : ''})
      this.setState({loader:true})
      const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'summary/'+onchangeenvvalue+'/Last '+this.state.ConfigurationFile.DashboardHistoryCount+' Execution Results')
        const Response1 = await Req1.json();
        this.setState({summary:Response1})
        this.setState({loader:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();
      
    }
    else
    {
      this.setState({loader:true})
      const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'summary/'+onchangeenvvalue+'/'+this.state.EXECUTIONDATE)
        const Response1 = await Req1.json();
        this.setState({executionDateList:Response1})
        this.setState({loader:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();

    }
    if(PreviousEnv !==onchangeenvvalue)
    {
      this.setState({loader:true})
      this.setState({pageloadingStatus:true});
      const Request1 = async () => 
      {
        const Req1 = await fetch(APIBasePath+'dashboard/'+onchangeenvvalue+'/'+this.state.ConfigurationFile.DashboardHistoryCount+'/0')
        const Response1 = await Req1.json();
        this.setState({PassModulewise:Response1})
        var RunTimeCheck = genericHelper.common_GetListvalueFromJsonResponce(this.state.PassModulewise)
        this.setState({allPassModuleWise:RunTimeCheck});
        const Request2 = async () => 
        {
          const Req2 = await fetch(APIBasePath+'dashboard/'+onchangeenvvalue+'/'+this.state.ConfigurationFile.DashboardHistoryCount+'/1')
          const Response2 = await Req2.json();
          this.setState({FailModulewise:Response2})
          var RunTimeCheck = genericHelper.common_GetListvalueFromJsonResponce(this.state.FailModulewise)
          this.setState({allFailModuleWise:RunTimeCheck});
          const Request3 = async () => 
          {
            const Req3 = await fetch(APIBasePath+'testcase/ ')
            const Response3 = await Req3.json();
            this.setState({allModuleName:Response3})
            var ModuleName = genericHelper.common_GetListvalueFromJsonResponce(this.state.allModuleName)
            this.setState({allModule:ModuleName});
            const req8 = async () => 
            {
              const request8 = await fetch(APIBasePath+'dashboard/'+this.state.ENV+'/'+this.state.ConfigurationFile.DashboardHistoryCount)
              const req8Response = await request8.json();
              this.setState({ExecutionTimeList:req8Response})
              this.setState({ExecutionTimeXaxis:genericHelper.common_GetListKeyFromJsonResponce(req8Response)});
              this.setState({ExecutionTimeYAxis:genericHelper.common_GetListvalueFromJsonResponce(req8Response)});
              this.setState({loader:false})
              this.setState({pageloadingStatus:false});
            }
            req8();
          }
          Request3();
        }
        Request2();
      }
      Request1();
    }

  }

    OpenHTMLfileForLastResults()
    {
      var HtmlLastResultResultAPI = APIBasePath+'report/0'
      const HTMLLastResult = async () => 
      {
        this.setState({pageloadingStatus:true});
        const ORResponse = await fetch(HtmlLastResultResultAPI);
        const ORJson = await ORResponse.json();
        this.setState({pageloadingStatus:false});
        if(ORJson.success.toLowerCase()==='true')
        {
          var htmlfileName= ORJson.servermessage;
          window.open(this.state.ReportPublishPath+'TestSuiteSummaryfile/'+htmlfileName);
        }
        
      }
      HTMLLastResult();
      
    }

    OpenHTMLfilebasedonDateandTime()
    {
        var htmlenv = this.state.ENV;
        if(htmlenv.trim()==="")
        {
          return;
        }
        var executionDate =this.state.EXECUTIONDATE;
        if(executionDate.trim()==='Last '+this.state.ConfigurationFile.DashboardHistoryCount+' Execution Results')
        {
          return;;
        }
        if(executionDate.trim()==="")
        {
          return;
        }
        var executionTime =this.state.EXECUTIONHTMLTime;
        if(executionTime.trim()==="")
        {
          return;
        }
        var Month =''
        var Dateformat = executionDate.toString().split(' ');
        switch(Dateformat[1])
        {
            case"Jan":
            Month="01";
            break;
            case"Feb":
            Month="02";
            break;
            case"Mar":
            Month="03";
            break;
            case"Apr":
            Month="04";
            break;
            case"May":
            Month="05";
            break;
            case"Jun":
            Month="06";
            break;
            case"Jul":
            Month="07";
            break;
            case"Aug":
            Month="08";
            break;
            case"Sep":
            Month="09";
            break;
            case"Oct":
            Month="10";
            break;
            case"Nov":
            Month="11";
            break;
            case"Dec":
            Month="12";
            break;
            default:
              break;

        }
        var Monthformated=Month+'-'+Dateformat[0]+'-'+Dateformat[2];
        var htmlfileName='TestSummary_'+htmlenv+'_'+Monthformated+'_'+executionTime+'.html'
        window.open(this.state.ReportPublishPath+'TestSuiteSummaryfile/'+htmlenv+'/'+htmlfileName);
    }

    OpenHTMLfileforBuild()
    {
      var htmlenv= this.state.build1Env;
      var executionDate= this.state.Build1ExecutionDate;
      var executionTime= this.state.Build1ExecutionTime;
        if(htmlenv.trim()==="")
        {
          return;
        }
        if(executionDate.trim()==="")
        {
          return;
        }
        if(executionTime.trim()==="")
        {
          return;
        }
        var Month =''
        var Dateformat = executionDate.toString().split(' ');
        switch(Dateformat[1])
        {
            case"Jan":
            Month="01";
            break;
            case"Feb":
            Month="02";
            break;
            case"Mar":
            Month="03";
            break;
            case"Apr":
            Month="04";
            break;
            case"May":
            Month="05";
            break;
            case"Jun":
            Month="06";
            break;
            case"Jul":
            Month="07";
            break;
            case"Aug":
            Month="08";
            break;
            case"Sep":
            Month="09";
            break;
            case"Oct":
            Month="10";
            break;
            case"Nov":
            Month="11";
            break;
            case"Dec":
            Month="12";
            break;
            default:
              break;

        }
        var Monthformated=Month+'-'+Dateformat[0]+'-'+Dateformat[2];
        var htmlfileName='TestSummary_'+htmlenv+'_'+Monthformated+'_'+executionTime+'.html'
        window.open(this.state.ReportPublishPath+'TestSuiteSummaryfile/'+htmlenv+'/'+htmlfileName);
    }

    OpenHTMLfileforBuild2()
    {
      var htmlenv= this.state.build2Env;
      var executionDate= this.state.Build2ExecutionDate;
      var executionTime= this.state.Build2ExecutionTime;
        if(htmlenv.trim()==="")
        {
          return;
        }
        if(executionDate.trim()==="")
        {
          return;
        }
        if(executionTime.trim()==="")
        {
          return;
        }
        var Month =''
        var Dateformat = executionDate.toString().split(' ');
        switch(Dateformat[1])
        {
            case"Jan":
            Month="01";
            break;
            case"Feb":
            Month="02";
            break;
            case"Mar":
            Month="03";
            break;
            case"Apr":
            Month="04";
            break;
            case"May":
            Month="05";
            break;
            case"Jun":
            Month="06";
            break;
            case"Jul":
            Month="07";
            break;
            case"Aug":
            Month="08";
            break;
            case"Sep":
            Month="09";
            break;
            case"Oct":
            Month="10";
            break;
            case"Nov":
            Month="11";
            break;
            case"Dec":
            Month="12";
            break;
            default:
              break;

        }
        var Monthformated=Month+'-'+Dateformat[0]+'-'+Dateformat[2];
        var htmlfileName='TestSummary_'+htmlenv+'_'+Monthformated+'_'+executionTime+'.html'
        window.open(this.state.ReportPublishPath+'TestSuiteSummaryfile/'+htmlenv+'/'+htmlfileName);
    }
    updateExecutionDate(event)
    {
      var executionDate = event.target.value;
      this.setState({EXECUTIONDATE : event.target.value})
      if(executionDate.includes('Execution Results'))
      {
        this.setState({executionDateList : ''})
        this.setState({loader:true})
        const Request1 = async () => 
        {
          this.setState({pageloadingStatus:true});
          const Req1 = await fetch(APIBasePath+'summary/'+this.state.ENV+'/Last '+this.state.ConfigurationFile.DashboardHistoryCount+' Execution Results')
          const Response1 = await Req1.json();
          this.setState({summary:Response1})
          this.setState({loader:false})
          this.setState({pageloadingStatus:false});
        }
        Request1();
      }
      else
      {
        this.setState({loader:true})
        this.setState({pageloadingStatus:true});
        const Request1 = async () => 
        {
          const Req1 = await fetch(APIBasePath+'summary/'+this.state.ENV+'/'+executionDate)
          const Response1 = await Req1.json();
          this.setState({executionDateList:Response1})
          this.setState({loader:false})
          this.setState({pageloadingStatus:false});
        }
        Request1();
      
      }
    }
    updateBuild1ExecutionDate(event)
    {
      var executionDate = event.target.value;
      var BuildEnv = this.state.build1Env;
      if(executionDate===this.state.Build1ExecutionDate)
      {
        return;
      }
      if(BuildEnv.trim()==="")
      {
        return;
      }
      this.setState({Build1ExecutionTime:''})
      this.setState({Build1Summary:[]})
      this.setState({Build1ExecutionDate : event.target.value})
      this.setState({buildLoader:true})
      const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'summary/'+BuildEnv+'/'+executionDate)
        const Response1 = await Req1.json();
        this.setState({build1ExecutionTimeList:Response1})
        this.setState({buildLoader:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();
    }


    updateBuild2ExecutionDate(event)
    {
      var executionDate = event.target.value;
      if(executionDate===this.state.Build2ExecutionDate)
      {
        return;
      }
      var Build2Environment = this.state.build2Env;
      if(Build2Environment.trim()==="")
      {
        return;
      }
      this.setState({Build2ExecutionTime:''})
      this.setState({Build2Summary:[]})
      this.setState({Build2ExecutionDate : event.target.value})
      this.setState({buildLoader2:true})
      const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'summary/'+Build2Environment+'/'+executionDate)
        const Response1 = await Req1.json();
        this.setState({build2ExecutionTimeList:Response1})
        this.setState({buildLoader2:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();
    }
    updateBuild1Env(event)
    {
      this.setState({buildLoader:true})
      var BUild1Environment= event.target.value;
      if(BUild1Environment===this.state.build1Env)
      {
        this.setState({buildLoader:false})
        return;
      }
      this.setState({Build1ExecutionDate:''})
      this.setState({Build1ExecutionTime:''})
      this.setState({Build1Summary:[]})
      this.setState({build1Env : event.target.value})
      this.setState({buildLoader:false})
    }

    updateBuild2Env(event)
    {
      this.setState({buildLoader2:true})
      var BUild2Environment= event.target.value;
      if(BUild2Environment===this.state.build2Env)
      {
        this.setState({buildLoader2:false})
        return;
      }
      this.setState({Build2ExecutionDate:''})
      this.setState({Build2ExecutionTime:''})
      this.setState({Build2Summary:[]})
      this.setState({build2Env : event.target.value})
      this.setState({buildLoader2:false})
    }
    graphPopulateBasedOnExecutionTime(event)
    {
      var executionTime = event.target.value;
      this.setState({EXECUTIONHTMLTime:executionTime});
      var API = APIBasePath+'summary/'+this.state.ENV+'/'+this.state.EXECUTIONDATE+'/'+executionTime;
      this.setState({loader:true})
      const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(API)
        const Response1 = await Req1.json();
        this.setState({summary:Response1})
        this.setState({loader:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();
    }
    Build1Graph(event)
    {
      var executionTime = event.target.value;
      if(executionTime===this.state.Build1ExecutionTime)
      {
        return;
      }
      this.setState({Build1ExecutionTime:executionTime});
      var API = APIBasePath+'summary/'+this.state.build1Env+'/'+this.state.Build1ExecutionDate+'/'+executionTime;
      this.setState({buildLoader:true})
      const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(API)
        const Response1 = await Req1.json();
        this.setState({Build1Summary:Response1})
        this.setState({Build1TotalExecutedScripts:dashboardHelper.GetTotalTestScripts(Response1.SummaryPass,Response1.SummaryFail)})
        this.setState({Build1TotalComponentExecuted:dashboardHelper.GetTotalExecutedComponents(Response1)})
        this.setState({Build1SummarySection:true})
        this.setState({pageloadingStatus:false});
        //@ add datatable
        let allModule = Object.keys(Response1);
        var ModuleDataSet=[]
        for(let i=0;i<allModule.length;i++)
        {
           var ModuleRowWiseData={}
            var ModuleName = allModule[i];
            if(ModuleName==='SummaryPass' || ModuleName==='SummaryFail')
            {

            }
            else
            {
              try
              {
                var allKeyValue= Response1[ModuleName];
                var modulePassCount= allKeyValue.split('|')[0];
                var moduleFailCount= allKeyValue.split('|')[1];
                var moduleExecutionTime= allKeyValue.split('|')[2];
                ModuleRowWiseData['id']=i+1
                ModuleRowWiseData['module']=ModuleName;
                ModuleRowWiseData['pass']=modulePassCount;
                ModuleRowWiseData['fail']=moduleFailCount;
                ModuleRowWiseData['buildmoduleexetime']=moduleExecutionTime+' Minutes';
                ModuleDataSet.push(ModuleRowWiseData);
                
              }
              catch(error)
              {}
            }
        }
        const req1 = async () => 
        {
          this.setState({pageloadingStatus:true});
          const request1 = await fetch(APIBasePath+'dashboard/'+this.state.build1Env+'/'+this.state.ConfigurationFile.DashboardHistoryCount)
          const req1Response = await request1.json();
          console.log(req1Response);
          this.setState({pageloadingStatus:false});
          var exeKeysName = this.state.Build1ExecutionDate+' | '+this.state.Build1ExecutionTime;
          var output=req1Response[exeKeysName]+' Minutes'
          this.setState({Build1TotalExecutionTime:output})
          this.setState({Build1ExecutionData:ModuleDataSet})
          this.setState({buildLoader:false})

        }
        req1();
        
        
      }
      Request1();
    }

    Build2Graph(event)
    {
      var executionTime = event.target.value;
      if(executionTime===this.state.Build2ExecutionTime)
      {
        return;
      }
      this.setState({Build2ExecutionTime:executionTime});
      var API = APIBasePath+'summary/'+this.state.build2Env+'/'+this.state.Build2ExecutionDate+'/'+executionTime;
      this.setState({buildLoader2:true})
      const Request1 = async () => 
      {
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(API)
        const Response1 = await Req1.json();
        this.setState({Build2Summary:Response1})
        this.setState({Build2TotalExecutedScripts:dashboardHelper.GetTotalTestScripts(Response1.SummaryPass,Response1.SummaryFail)})
        this.setState({Build2TotalComponentExecuted:dashboardHelper.GetTotalExecutedComponents(Response1)})
        this.setState({Build2SummarySection:true})
        this.setState({pageloadingStatus:false});
        //@ add datatable
        let allModule = Object.keys(Response1);
        var ModuleDataSet=[]
        for(let i=0;i<allModule.length;i++)
        {
           var ModuleRowWiseData={}
            var ModuleName = allModule[i];
            if(ModuleName==='SummaryPass' || ModuleName==='SummaryFail')
            {

            }
            else
            {
              try
              {
                var allKeyValue= Response1[ModuleName];
                var modulePassCount= allKeyValue.split('|')[0];
                var moduleFailCount= allKeyValue.split('|')[1];
                var moduleExecutionTime= allKeyValue.split('|')[2];
                ModuleRowWiseData['id']=i+1
                ModuleRowWiseData['module']=ModuleName;
                ModuleRowWiseData['pass']=modulePassCount;
                ModuleRowWiseData['fail']=moduleFailCount;
                ModuleRowWiseData['buildmoduleexetime']=moduleExecutionTime+' Minutes';
                ModuleDataSet.push(ModuleRowWiseData);
                
              }
              catch(error)
              {}
            }
        }
        const req1 = async () => 
        {
          this.setState({pageloadingStatus:true});
          const request1 = await fetch(APIBasePath+'dashboard/'+this.state.build2Env+'/'+this.state.ConfigurationFile.DashboardHistoryCount)
          const req1Response = await request1.json();
          var exeKeysName = this.state.Build2ExecutionDate+' | '+this.state.Build2ExecutionTime;
          var output=req1Response[exeKeysName]+' Minutes'
          this.setState({Build2TotalExecutionTime:output})
          this.setState({Build2ExecutionData:ModuleDataSet})
          this.setState({buildLoader2:false})
          this.setState({pageloadingStatus:false});

        }
        req1();
       
        
      }
      Request1();
    }
    toggleTestScriptModal = modalType => () => {
      if (!modalType) {
        return this.setState({
          ComponentModalPopUp: !this.state.ComponentModalPopUp,
        });
      }
    
      this.setState({
        [`ComponentModalPopUp_${modalType}`]: !this.state[`ComponentModalPopUp_${modalType}`],
      });
    };

    toggleFunctionModal = modalType => () => {
      if (!modalType) {
        return this.setState({
          FunctionModalPopUp: !this.state.FunctionModalPopUp,
        });
      }
    
      this.setState({
        [`FunctionModalPopUp_${modalType}`]: !this.state[`FunctionModalPopUp_${modalType}`],
      });
    };

    CheckComponentScriptCount()
	  {
      this.setState({TestScriptModalData:''})

        const Req1 = async () => 
        {
          this.setState({loader:true})
          const Reqest1 = await fetch(APIBasePath+'widget')
          const Response1 = await Reqest1.json();
          var TotalFunction = Object.keys(Response1).length;
          var TotalItem =[];
          for(let i=1;i<=TotalFunction;i++)
          {
            var utilityContent ={}
            utilityContent['id']=i;
            var keyName =Object.keys(Response1)[i-1];
	          var keyVal =Response1[keyName];
            utilityContent['component']=keyName;
            utilityContent['testscriptCount']=keyVal;
            TotalItem.push(utilityContent);
          }
          this.setState({TestScriptModalData:TotalItem})
          this.setState({loader:false})
          this.setState({ComponentModalPopUp:true})
        }
        Req1();
      
    }
    
    CheckCustomFunction()
	  {
      this.setState({CustomFunctionModalData:''})

        const Req1 = async () => 
        {
          this.setState({loader:true})
          const Reqest1 = await fetch(APIBasePath+'widget/0')
          const Response1 = await Reqest1.json();
          var TotalFunction = Response1.length;
          var TotalItem =[];
          for(let i=0;i<TotalFunction;i++)
          {
            var utilityContent ={}
            utilityContent['id']=Number(i+1);
            console.log(Number(i+1))
            utilityContent['function']=Response1[i]['FunctionName'];
            utilityContent['objective']=Response1[i]['Objective'];
            utilityContent['parameter']=Response1[i]['Parameter'];
            TotalItem.push(utilityContent);
            console.log(utilityContent)
          }
          this.setState({CustomFunctionModalData:TotalItem})
          this.setState({loader:false})
          this.setState({FunctionModalPopUp:true})
        }
        Req1();
      
	  }
  render() {
    
    var {items,summary,defaultEnv,executionDateList} = this.state;
    var tpass=0;
    try{
     tpass=items.map((postdetails,index)=> {
                return postdetails.totalpass
               })
              }catch(error)
              {}
      var tFail=0;
      try{
     tFail=items.map((postdetails,index)=> {
    return postdetails.totalfail
    })}
    catch(error)
    {}
    var summaryPass = summary.SummaryPass;
    var summaryFail = summary.SummaryFail;
    var test1 = dashboardHelper.GetAllModule(summary);
    var test2 =dashboardHelper.GetAllPass(summary);
    var test3 =dashboardHelper.GetAllFail(summary);

      const BuildPagination = {
        sizePerPage: 5,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true
        };
      var TestScriptModalColumn = [
        {
          dataField: 'id',
          text: '#'
        },
        {
          dataField: 'component',
          text: 'Component',
          filter: textFilter()
        },
        {
          dataField: 'testscriptCount',
          text: 'Script Count'
        }
        ]
        var FunctionModalColumn = [
          {
            dataField: 'id',
            text: '#'
          },
          {
            dataField: 'function',
            text: 'Function',
            filter: textFilter()
          },
          {
            dataField: 'objective',
            text: 'Objective'
          },
          {
            dataField: 'parameter',
            text: 'Parameter'
          }
          ]
    return (
      <Page
        className="DashboardPage"
        title="Web Testing Dashboard"
        breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
         <Loader 
         type="ThreeDots"
         color="#00BFFF"
         height={50}
         width={100}
         timeout={120000} //3 secs
         visible = {this.state.loader}
        />
        <Row>
		       <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget disabled={this.state.pageloadingStatus} onClick={this.CheckComponentScriptCount.bind(this)}
              title="Total Test Sctipts"
              try
              number={items.map((postdetails,index)=> {
                return postdetails.totaltestscripts
               })}
              color="secondary"
            />
            </Col>
          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget disabled={this.state.pageloadingStatus}
              title="Total Components"
              number={items.map((postdetails,index)=> {
                return postdetails.totalcomponents
               })}
              color="secondary"
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget disabled={this.state.pageloadingStatus} onClick={this.CheckCustomFunction.bind(this)}
              title="Total Custom Function"
              number={items.map((postdetails,index)=> {
                return postdetails.totalcustomfunction
               })}
              color="secondary"
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            < NumberWidget disabled={this.state.pageloadingStatus} onClick={this.OpenHTMLfileForLastResults.bind(this)}
              title="Last Results"
              subtitle={"PASS: " + tpass+ " FAIL: "+tFail}
                number=  {items.map((postdetails,index)=> {
                return postdetails.lastresult
               })}
              color="secondary"
              />
          </Col>
          <Modal
				    isOpen={this.state.ComponentModalPopUp}
				    toggle={this.toggleTestScriptModal()}
				    backdrop="static"
					  className={this.props.className}>
					  <ModalHeader  toggle={this.toggleTestScriptModal()} >Component Script Count</ModalHeader>
            <ModalBody >
              <BootstrapTable 
                  keyField="id"
                  disabled={this.state.pageloadingStatus}
                  data={ this.state.TestScriptModalData }
                  columns={ TestScriptModalColumn }
                  striped
                  hover
                  condensed
                  pagination={ paginationFactory(BuildPagination) }
                  filter={ filterFactory() }
              />
            </ModalBody>
          </Modal>
          <Modal
				    isOpen={this.state.FunctionModalPopUp}
				    toggle={this.toggleFunctionModal()}
				    backdrop="static"
					  className={this.props.className}>
					  <ModalHeader  toggle={this.toggleFunctionModal()} >Custom Function</ModalHeader>
            <ModalBody >
              <BootstrapTable 
                  keyField="id"
                  disabled={this.state.pageloadingStatus}
                  data={ this.state.CustomFunctionModalData }
                  columns={ FunctionModalColumn }
                  striped
                  hover
                  condensed
                  pagination={ paginationFactory(BuildPagination) }
                  filter={ filterFactory() }
              />
            </ModalBody>
          </Modal>
        </Row>
      <Row>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Selection Citieria</CardHeader>
            <CardBody>
              <Form>
                <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                   Environment*
                  </Label>
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="env" defaultValue = {defaultEnv} value={this.state.ENV} onChange={this.updateENV.bind(this)}>
					          <Options options={this.state.CommonTestData} />
					          </Input>
                  </Col>
                </FormGroup>
				<FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Summary*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="executionsummary" value={this.state.text} onChange={this.updateExecutionDate.bind(this)}>
					          <option>Last {this.state.ConfigurationFile.DashboardHistoryCount} Execution Results</option>
                    <DateOptions options={this.state.dashboardTotalDays} />
					          </Input>
                  </Col>
                </FormGroup>
				<FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Time
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="executiontime" defaultValue = "" value={this.state.text} onChange={this.graphPopulateBasedOnExecutionTime.bind(this)}>
                    <option></option>
                    <TimeOptions options={executionDateList} />
                    </Input>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
		 <Col xl={6} >
          <Card>
            <CardHeader>Total Pass Fail Count</CardHeader>
            <CardBody>
			  <Col disabled={this.state.pageloadingStatus} onClick={this.OpenHTMLfilebasedonDateandTime.bind(this)}>
              <Pie  data={graph.GetPieChart(summaryPass,summaryFail)} />
			  </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
        <Row>
        <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>
                Execution Status 
                <small> Last {this.state.ConfigurationFile.DashboardHistoryCount} Results</small>
              </CardHeader>
            <CardBody>
              <Line
                data={graph.GetLineChart(test1,test2,test3)}
                options={{
                  scales: {
                    xAxes: [
                      {
                        scaleLabel: {
                          display: true,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        stacked: true,
                        scaleLabel: {
                          display: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </CardBody>
          </Card>
        </Col>
        <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Execution Summary
            <small> Last {this.state.ConfigurationFile.DashboardHistoryCount} Results</small>
            </CardHeader>
            <CardBody>
              <Bar data={graph.GetBarChart(test1,test2,test3)} 
              options={{
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                },
              }}
              />
            </CardBody>
          </Card>
        </Col>
        <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Module Pass/Fail Graph
            <small> Last {this.state.ConfigurationFile.DashboardHistoryCount} Results</small>
            </CardHeader>
            <CardBody>
            <Line disabled={this.state.pageloadingStatus} data={graph.genLineDataforModuleFail(this.state.allModule,this.state.allPassModuleWise,this.state.allFailModuleWise)} />
            </CardBody>
          </Card>
        </Col>
        <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Execution Time in Minutes
            <small> Last {this.state.ConfigurationFile.DashboardHistoryCount} Results</small>
            </CardHeader>
            <CardBody>
            <Line disabled={this.state.pageloadingStatus} data={graph.genTimeDuration(this.state.ExecutionTimeXaxis,this.state.ExecutionTimeYAxis)} />
            </CardBody>
          </Card>
        </Col>
        </Row>
        <Row>
        <Col xs={6}>
          <Card>
            <CardHeader>Build Comparison (Build 1)
            <Loader 
              type="ThreeDots"
              color="#00BFFF"
              height={50}
              width={100}
              timeout={120000} //3 secs
              visible = {this.state.buildLoader}
              />
            </CardHeader>
            <CardBody>
              <Form>
              <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Environment*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="Build1ExecutionDate" value={this.state.build1Env} onChange={this.updateBuild1Env.bind(this)}>
                    <option></option>
                    <Options options={this.state.CommonTestData} />
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Date*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="executionsummary" value={this.state.Build1ExecutionDate} onChange={this.updateBuild1ExecutionDate.bind(this)}>
                    <option></option>
                    <DateOptions options={this.state.dashboardTotalDays} />
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Time*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="executiontime" value={this.state.Build1ExecutionTime} onChange={this.Build1Graph.bind(this)}>
                    <option></option>
                    <TimeOptions options={this.state.build1ExecutionTimeList} />
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup col style={{visibility: this.state.Build1SummarySection ? 'visible' : 'hidden' }} >
                  <Col disabled={this.state.pageloadingStatus} onClick={this.OpenHTMLfileforBuild.bind(this)}>
                      <Doughnut disabled={this.state.pageloadingStatus} data={graph.GetPieChart(this.state.Build1Summary.SummaryPass,this.state.Build1Summary.SummaryFail)} />
                  </Col>
                  <NumberWidget
                    title="Total Executed Test Scripts"
                    number={this.state.Build1TotalExecutedScripts}
                  />
                  <NumberWidget disabled={this.state.pageloadingStatus}
                    title="Total Execution Time"
                    number={this.state.Build1TotalExecutionTime}
                  />
                  <NumberWidget disabled={this.state.pageloadingStatus}
                    title="Total Executed Components"
                    number={this.state.Build1TotalComponentExecuted}
                  />
                </FormGroup>
                <FormGroup col style={{visibility: this.state.Build1SummarySection ? 'visible' : 'hidden' }}>
                  <BootstrapTable 
                  keyField="id"
                  data={ this.state.Build1ExecutionData }
                  columns={ this.state.BuildHeaderColumn }
                  striped
                  hover
                  condensed
                  pagination={ paginationFactory(BuildPagination) }
                  filter={ filterFactory() }
                />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Build Comparison (Build 2)
            <Loader 
              type="ThreeDots"
              color="#00BFFF"
              height={50}
              width={100}
              timeout={120000} //3 secs
              visible = {this.state.buildLoader2}
              />
            </CardHeader>
            <CardBody>
              <Form>
              <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Environment*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="Build2ExecutionDate" value={this.state.build2Env} onChange={this.updateBuild2Env.bind(this)}>
                    <option></option>
                    <Options options={this.state.CommonTestData} />
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Date*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="executionsummary2" value={this.state.Build2ExecutionDate} onChange={this.updateBuild2ExecutionDate.bind(this)}>
                    <option></option>
                    <DateOptions options={this.state.dashboardTotalDays} />
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Time*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="executiontime2" value={this.state.Build2ExecutionTime} onChange={this.Build2Graph.bind(this)}>
                    <option></option>
                    <TimeOptions options={this.state.build2ExecutionTimeList} />
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup col style={{visibility: this.state.Build2SummarySection ? 'visible' : 'hidden' }}>
                  <Col disabled={this.state.pageloadingStatus} onClick={this.OpenHTMLfileforBuild2.bind(this)}>
                      <Doughnut disabled={this.state.pageloadingStatus} data={graph.GetPieChart(this.state.Build2Summary.SummaryPass,this.state.Build2Summary.SummaryFail)} />
                  </Col>
                  <NumberWidget
                    title="Total Executed Test Scripts"
                    number={this.state.Build2TotalExecutedScripts}
                  />
                  <NumberWidget disabled={this.state.pageloadingStatus}
                    title="Total Execution Time"
                    number={this.state.Build2TotalExecutionTime}
                  />
                  <NumberWidget disabled={this.state.pageloadingStatus}
                    title="Total Executed Components"
                    number={this.state.Build2TotalComponentExecuted}
                  />
                </FormGroup>
                <FormGroup col style={{visibility: this.state.Build2SummarySection ? 'visible' : 'hidden' }}>
                  <BootstrapTable 
                  keyField="id"
                  data={ this.state.Build2ExecutionData }
                  columns={ this.state.BuildHeaderColumn }
                  striped
                  hover
                  condensed
                  pagination={ paginationFactory(BuildPagination) }
                  filter={ filterFactory() }
                />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      </Page>
    );
  }
}
export default DashboardPage;
