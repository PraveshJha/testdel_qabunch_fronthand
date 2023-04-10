import Page from 'components/Page';
import React from 'react';
import genericHelper from '../funcLibraries/GenericHelper.js';
import graph from '../funcLibraries/graph.js';
import {NumberWidget } from 'components/Widget';
import 'react-widgets/dist/css/react-widgets.css';
import { Bar, Line ,Doughnut} from 'react-chartjs-2';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-accordion/dist/index.css'

var APIBasePath= window.ENV.APIURL;

function GetOptionKeys({ options }) {

  return (
    Object.keys(options).map((key)  => 
    <option >{key}</option>)
  );
}

class APIDashboardPage extends React.Component{

	constructor(props)
	{
		super(props);
		this.state=
		{
      //-----
      loader:true,
      pageloadingStatus:true,
      buildLoader:false,
      totalAPIScripts:0,
      totalAPIComponent:0,
      componentScriptDetails:[],
      lastExecutionResults:[],
      lastExecutionhtmllocation:'',
      DefaultEnvironment:'',
      EnvName:[],
      dashboardHistoryCount:0,
      dashboardDaysCount:0,
      totalPassFailCount:[],
      executionSummaryXaxis:[],
      executionSummaryPassData:[],
      executionSummaryFailData:[],
      allComponentName:[],
      allPassModuleWise:[],
      allFailModuleWise:[],
      graphaxisforexecutionTime:[],
      ExecutionTimeYaxis:[],
      ExecutionTimeRule:[],
      executionHistory1env:'',
      allExecutionistoryDate:[],
      Build1ExecutionDate:'',
      build1ExecutionTimeList:[],
      Build1Summary:[],
      allExecutionistoryTime:[],
      Build1ExecutionTime:'',
      BuildHeaderColumn :[{dataField: 'id',text: '#',headerStyle: {backgroundColor: '#aa66cc'}},{dataField: 'module',text: 'Module',filter: textFilter(),headerStyle: {backgroundColor: '#aa66cc'}},{dataField: 'pass',text: 'PASS',headerStyle: {backgroundColor: '#aa66cc'}},{dataField: 'fail',text: 'Fail',headerStyle: {backgroundColor: '#aa66cc'}},{dataField: 'buildmoduleexetime',text: 'Execution Time',headerStyle: {backgroundColor: '#aa66cc'}}],
      Build1TableData:[],
      buildLoader2:false,
      executionHistory2env:'',
      Build2Summary:[],
      Build2ExecutionTime:'',
      Build2TableData:[],
      allExecutionistoryTime2:[],

		}

		const GetLoaderData = async () => 
		{
      try{
			const homepage = await fetch(APIBasePath+'apidashboard');
			const homepageResponse = await homepage.json();
      if(Object.keys(homepageResponse).length>0)
      {
      this.setState({componentScriptDetails:homepageResponse['ComponentScriptDetails']})
      this.setState({totalAPIScripts:homepageResponse['TotalScripts']})
      this.setState({totalAPIComponent:homepageResponse['TotalComponents']})
      this.setState({lastExecutionhtmllocation:homepageResponse['LatestResultLocation']})
      this.setState({lastExecutionResults:homepageResponse['LatestResultGraph']})
      this.setState({allComponentName:genericHelper.common_GetListKeyFromJsonResponce(homepageResponse['allComponent'])})
      }
      const GetLoaderData2 = async () => 
      {
        const configPage = await fetch(APIBasePath+'apiconfig');
        const configPageResponse = await configPage.json();
        if(Object.keys(configPageResponse).length>0)
        {
        this.setState({DefaultEnvironment : configPageResponse['EXECUTIONSETUP']['DefaultEnvironment']});
        this.setState({executionHistory1env : configPageResponse['EXECUTIONSETUP']['DefaultEnvironment']});
        this.setState({executionHistory2env : configPageResponse['EXECUTIONSETUP']['DefaultEnvironment']});
        this.setState({EnvName:configPageResponse['ENVIRONMENTSETUP']})
        this.setState({dashboardHistoryCount : configPageResponse['EXECUTIONSETUP']['DashboardHistoryCount']});
        this.setState({dashboardDaysCount : configPageResponse['EXECUTIONSETUP']['DashboardTotalDayCount']});
        this.setState({ExecutionTimeRule : configPageResponse['EXECUTIONSETUP']['ExecutionTimeGrpahIn']});
        }
        const GetLoaderData3 = async () => 
        {
          var graphcount =this.state.dashboardHistoryCount;
          if(graphcount==='')
          {
            graphcount=0;
          }
          const configPage = await fetch(APIBasePath+'apidashboard/'+this.state.DefaultEnvironment+'/'+graphcount);
          const configPageResponse = await configPage.json();
          if(Object.keys(configPageResponse).length>0)
          {
            this.setState({totalPassFailCount:configPageResponse['graphTotalPassFail']})
            var xaxis= configPageResponse['ExecutionSummaryXaxis'];
            this.setState({executionSummaryXaxis:genericHelper.common_GetListvalueFromJsonResponce(xaxis)});
            this.setState({executionSummaryPassData:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['ExecutionSummaryPassData'])});
            this.setState({executionSummaryFailData:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['ExecutionSummaryFailData'])});
            this.setState({graphaxisforexecutionTime:genericHelper.common_GetListvalueFromJsonResponce(xaxis)});
            this.setState({ExecutionTimeYaxis:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['ExecutionTimeData'])});
            this.setState({allPassModuleWise:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['TotalModulePassData'])});
            this.setState({allFailModuleWise:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['TotalModuleFailData'])});
            this.setState({allExecutionistoryDate:configPageResponse['allExecutionHistoryDate']});
          }
          this.setState({loader:false});
          this.setState({pageloadingStatus:false});
        }
        GetLoaderData3();
      }
      GetLoaderData2();
     
    }
    catch(error)
    {
      this.setState({loader:false});
      this.setState({pageloadingStatus:false});
    }
		}
		GetLoaderData();
		
	}
  OpenHTMLfile()
  {
    try{
      var htmlPath = this.state.lastExecutionhtmllocation;
    if(htmlPath !=='')
    {
      window.open(htmlPath);
    }
  }
  catch(error)
  {}
  }
  OpenHTMLfileforBuild()
  {
    try{
    var htmlPath= this.state.Build1Summary['htmlLocation'];
    if(htmlPath !==undefined)
    {
      window.open(htmlPath);
    }
    }
    catch(error)
    {}
  }
  OpenHTMLfileforBuild2()
  {
    try{
    var htmlPath= this.state.Build2Summary['htmlLocation'];
    if(htmlPath !==undefined)
    {
      window.open(htmlPath);
    }
    }
    catch(error)
    {}
  }
  updateENV(event)
  {
    var env = event.target.value;
    if(env !== this.state.DefaultEnvironment)
    {
      this.setState({DefaultEnvironment: env})
      const Request1 = async () => 
      {
        this.setState({loader:true})
        this.setState({pageloadingStatus:true});
        const configPage = await fetch(APIBasePath+'apidashboard/'+env+'/'+this.state.dashboardHistoryCount);
        const configPageResponse = await configPage.json();
        this.setState({totalPassFailCount:configPageResponse['graphTotalPassFail']})
        var xaxis= configPageResponse['ExecutionSummaryXaxis'];
        this.setState({executionSummaryXaxis:genericHelper.common_GetListvalueFromJsonResponce(xaxis)});
        this.setState({executionSummaryPassData:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['ExecutionSummaryPassData'])});
        this.setState({executionSummaryFailData:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['ExecutionSummaryFailData'])});
        this.setState({graphaxisforexecutionTime:genericHelper.common_GetListvalueFromJsonResponce(xaxis)});
        this.setState({ExecutionTimeYaxis:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['ExecutionTimeData'])});
        this.setState({allPassModuleWise:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['TotalModulePassData'])});
        this.setState({allFailModuleWise:genericHelper.common_GetListvalueFromJsonResponce(configPageResponse['TotalModuleFailData'])});
        this.setState({allExecutionistoryDate:configPageResponse['allExecutionHistoryDate']});
        this.setState({loader:false});
        this.setState({pageloadingStatus:false});
      }
      Request1();

    }
  }
  updateBuild1ExecutionDate(event)
  {
    var executionDate = event.target.value;
    if(executionDate !== this.state.Build1ExecutionDate)
    {
      this.setState({Build1ExecutionTime: ''})
      this.setState({allExecutionistoryTime:[]});
      this.setState({Build1ExecutionDate: executionDate})
      this.setState({Build1Summary: []})
      this.setState({Build1TableData:[]});
      if(executionDate==='')
      {
        return;
      }
      var BuildEnv = this.state.executionHistory1env;
      const Request1 = async () => 
      {
        this.setState({buildLoader:true})
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'apidashboard/'+BuildEnv+'/'+executionDate+'/0')
        const Response1 = await Req1.json();
        this.setState({allExecutionistoryTime:Response1})
        this.setState({buildLoader:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();
    }
  }
  updateBuild2ExecutionDate(event)
  {
    var executionDate = event.target.value;
    if(executionDate !== this.state.Build2ExecutionDate)
    {
      this.setState({Build2ExecutionTime: ''})
      this.setState({allExecutionistoryTime2:[]});
      this.setState({Build2ExecutionDate: executionDate})
      this.setState({Build2Summary: []})
      this.setState({Build2TableData:[]});
      if(executionDate==='')
      {
        return;
      }
      var BuildEnv = this.state.executionHistory2env;
      const Request1 = async () => 
      {
        this.setState({buildLoader2:true})
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'apidashboard/'+BuildEnv+'/'+executionDate+'/0')
        const Response1 = await Req1.json();
        this.setState({allExecutionistoryTime2:Response1})
        this.setState({buildLoader2:false})
        this.setState({pageloadingStatus:false});
      }
      Request1();
    }
  }
  updateBuild1ExecutionTime(event)
  {
    var exeTime = event.target.value;
    if(exeTime !== this.state.Build1ExecutionTime)
    {
      if(exeTime==='')
      {
        this.setState({Build1Summary:[]})
        this.setState({Build1TableData:[]})
        return;
      }
      this.setState({Build1Summary:[]})
      this.setState({Build1TableData:[]})
      this.setState({Build1ExecutionTime: exeTime})
      var BuildEnv = this.state.executionHistory1env;
      var executiondate = this.state.Build1ExecutionDate;
      var executiontimeIn = this.state.ExecutionTimeRule;
      const Request1 = async () => 
      {
        try{
        this.setState({buildLoader:true})
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'apidashboard/'+BuildEnv+'/'+executiondate+'/'+exeTime+'/'+executiontimeIn)
        const Response1 = await Req1.json();
        this.setState({Build1Summary:Response1})
        this.setState({Build1TableData:Response1['BuildSummaryTableData']})
        this.setState({buildLoader:false})
        this.setState({pageloadingStatus:false});
        }
        catch(error)
        {
          this.setState({buildLoader:false})
          this.setState({pageloadingStatus:false});
        }
      }
      Request1();
      
    }
  }
  updateBuild2ExecutionTime(event)
  {
    var exeTime = event.target.value;
    if(exeTime !== this.state.Build2ExecutionTime)
    {
      if(exeTime==='')
      {
        this.setState({Build2Summary:[]})
        this.setState({Build2TableData:[]})
        return;
      }
      this.setState({Build2Summary:[]})
      this.setState({Build2TableData:[]})
      this.setState({Build2ExecutionTime: exeTime})
      var BuildEnv = this.state.executionHistory2env;
      var executiondate = this.state.Build2ExecutionDate;
      var executiontimeIn = this.state.ExecutionTimeRule;
      const Request1 = async () => 
      {
        try{
        this.setState({buildLoader2:true})
        this.setState({pageloadingStatus:true});
        const Req1 = await fetch(APIBasePath+'apidashboard/'+BuildEnv+'/'+executiondate+'/'+exeTime+'/'+executiontimeIn)
        const Response1 = await Req1.json();
        this.setState({Build2Summary:Response1})
        this.setState({Build2TableData:Response1['BuildSummaryTableData']})
        this.setState({buildLoader2:false})
        this.setState({pageloadingStatus:false});
        }
        catch(error)
        {
          this.setState({buildLoader2:false})
          this.setState({pageloadingStatus:false});
        }
      }
      Request1();
      
    }
  }
  UpdateexecutionHistory1Env(event)
  {
    var env = event.target.value;
    if(env !== this.state.executionHistory1env)
    {
      this.setState({executionHistory1env: env})
      this.setState({Build1Summary:[]})
      this.setState({Build1TableData:[]})
      this.setState({allExecutionistoryTime:[]})
      this.setState({Build1ExecutionTime:''})
      this.setState({Build1ExecutionDate:''})
    }
  }
  UpdateexecutionHistory2Env(event)
  {
    var env = event.target.value;
    if(env !== this.state.executionHistory2env)
    {
      this.setState({executionHistory2env: env})
      this.setState({Build2Summary:[]})
      this.setState({Build2TableData:[]})
      this.setState({allExecutionistoryTime2:[]})
      this.setState({Build2ExecutionTime:''})
      this.setState({Build2ExecutionDate:''})
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
	
	  render() {
      const BuildPagination = {
        sizePerPage: 10,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true
        };
	
  return (
    <Page title="API Testing Dashboard">
		<Loader 
         type="ThreeDots"
         color="#00BFFF"
         height={50}
         width={100}
         timeout={120000} //3 secs
         visible = {this.state.loader}
        />
		<Row>
      <Col lg={6} md={6} sm={6} xs={6}>
        <NumberWidget disabled={this.state.pageloadingStatus}
          title="Total API Scripts"
          number= {this.state.totalAPIScripts}
          color="primary"
        />
      </Col>
      <Col lg={6} md={6} sm={6} xs={6}>
              <NumberWidget disabled={this.state.pageloadingStatus}
                title="Total API Component"
                number= {this.state.totalAPIComponent}
                color="primary"
              />
      </Col>
		</Row>
		  <Row>
      <Col xl={6} >
          <Card>
            <CardHeader>Component's Test Scripts Count</CardHeader>
            <CardBody>
			  <Col >
              <Doughnut  data={graph.GetDoughnutChart_Dynamic(this.state.componentScriptDetails)} />
			  </Col>
            </CardBody>
          </Card>
        </Col>
		  <Col xl={6} >
          <Card>
            <CardHeader>Latest Execution Results</CardHeader>
            <CardBody>
			  <Col onClick={this.OpenHTMLfile.bind(this)}>
              <Doughnut  data={graph.GetDoughnutChart_Dynamic(this.state.lastExecutionResults)} />
			  </Col>
            </CardBody>
          </Card>
        </Col>
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
                    <Input disabled={this.state.pageloadingStatus} type="select" name="env" value={this.state.DefaultEnvironment} onChange={this.updateENV.bind(this)}>
					          <GetOptionKeys options={this.state.EnvName} />
					          </Input>
                  </Col>
                </FormGroup>
				      </Form>
            </CardBody>
          </Card>
        </Col>
        <Col xl={6} >
          <Card>
            <CardHeader>Total Pass Fail Count for Last {this.state.dashboardHistoryCount} Results</CardHeader>
            <CardBody>
			  <Col>
              <Doughnut  data={graph.GetDoughnutChart_Dynamic(this.state.totalPassFailCount)} />
			  </Col>
            </CardBody>
          </Card>
        </Col>
        <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Execution Summary
            <small> Last {this.state.dashboardHistoryCount} Results</small>
            </CardHeader>
            <CardBody>
              <Bar data={graph.GetBarChart(this.state.executionSummaryXaxis,this.state.executionSummaryPassData,this.state.executionSummaryFailData)} 
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
            <CardHeader>Component Pass/Fail Graph
            <small>Last {this.state.dashboardHistoryCount} Results</small>
            </CardHeader>
            <CardBody>
            <Bar disabled={this.state.pageloadingStatus} data={graph.GetBarChart(this.state.allComponentName,this.state.allPassModuleWise,this.state.allFailModuleWise)} />
            </CardBody>
          </Card>
        </Col>
        <Col lg={12} md={6} sm={6} xs={12}>
          <Card>
            <CardHeader>Execution Time Graph
            <small> Last {this.state.dashboardHistoryCount} Results in {this.state.ExecutionTimeRule}</small>
            </CardHeader>
            <CardBody>
            <Line disabled={this.state.pageloadingStatus} data={graph.genLineChart(this.state.graphaxisforexecutionTime,this.state.ExecutionTimeYaxis)} />
            </CardBody>
          </Card>
        </Col>
        </Row>
        <Row>
        <Col xs={6}>
          <Card>
            <CardHeader>Execution History selection criteria
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
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="env" value={this.state.executionHistory1env} onChange={this.UpdateexecutionHistory1Env.bind(this)}>
					          <GetOptionKeys options={this.state.EnvName} />
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Date*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="execution1History" value={this.state.Build1ExecutionDate} onChange={this.updateBuild1ExecutionDate.bind(this)}>
                    <option></option>
                    <GetOptionKeys options={this.state.allExecutionistoryDate} />
					          </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Time*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="execution1Time" value={this.state.Build1ExecutionTime} onChange={this.updateBuild1ExecutionTime.bind(this)}>
                    <option></option>
                    <GetOptionKeys options={this.state.allExecutionistoryTime} />
					          </Input>
                  </Col>
                </FormGroup>
                <FormGroup col  >
                  <Col  onClick={this.OpenHTMLfileforBuild.bind(this)}>
                      <Doughnut disabled={this.state.pageloadingStatus} data={graph.GetPieChart(this.state.Build1Summary['TotalPass'],this.state.Build1Summary['TotalFail'])} />
                  </Col>
                  <NumberWidget
                    title="Total Executed Test Scripts"
                    number={this.state.Build1Summary['TotalExecutedScripts']}
                  />
                  <NumberWidget disabled={this.state.pageloadingStatus}
                    title="Total Executed Components"
                    number={this.state.Build1Summary['TotalComponentsExecuted']}
                  />
                  <NumberWidget disabled={this.state.pageloadingStatus}
                    title="Total Execution Time"
                    number={this.state.Build1Summary['TotalExecutionTime']}
                  />
                </FormGroup>
                <FormGroup col>
                  <BootstrapTable 
                  keyField="id"
                  data={ this.state.Build1TableData }
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
        <Col xs={6}>
          <Card>
            <CardHeader>Execution History selection criteria for Comparison
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
                  <Col>
                    <Input disabled={this.state.pageloadingStatus} type="select" name="env" value={this.state.executionHistory2env} onChange={this.UpdateexecutionHistory2Env.bind(this)}>
					          <GetOptionKeys options={this.state.EnvName} />
					          </Input>
                  </Col>
                </FormGroup>
				        <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Date*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="execution1History" value={this.state.Build2ExecutionDate} onChange={this.updateBuild2ExecutionDate.bind(this)}>
                    <option></option>
                    <GetOptionKeys options={this.state.allExecutionistoryDate} />
					          </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={4}>
                    Execution Time*
                  </Label>
                  <Col >
                    <Input disabled={this.state.pageloadingStatus} type="select" name="execution1Time" value={this.state.Build2ExecutionTime} onChange={this.updateBuild2ExecutionTime.bind(this)}>
                    <option></option>
                    <GetOptionKeys options={this.state.allExecutionistoryTime2} />
					          </Input>
                  </Col>
                </FormGroup>
                <FormGroup col  >
                  <Col  onClick={this.OpenHTMLfileforBuild2.bind(this)}>
                      <Doughnut disabled={this.state.pageloadingStatus} data={graph.GetPieChart(this.state.Build2Summary['TotalPass'],this.state.Build2Summary['TotalFail'])} />
                  </Col>
                  <NumberWidget
                    title="Total Executed Test Scripts"
                    number={this.state.Build2Summary['TotalExecutedScripts']}
                  />
                  <NumberWidget disabled={this.state.pageloadingStatus}
                    title="Total Executed Components"
                    number={this.state.Build2Summary['TotalComponentsExecuted']}
                  />
                  <NumberWidget disabled={this.state.pageloadingStatus}
                    title="Total Execution Time"
                    number={this.state.Build2Summary['TotalExecutionTime']}
                  />
                </FormGroup>
                <FormGroup col>
                  <BootstrapTable 
                  keyField="id"
                  data={ this.state.Build2TableData }
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
};

export default APIDashboardPage;
