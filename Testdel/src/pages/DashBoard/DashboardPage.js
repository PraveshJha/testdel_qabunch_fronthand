import Page from '../Page';
import React from 'react';
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
  ButtonGroup,
  Button,
  Nav,
  Modal, ModalHeader,
  ModalBody,
  Fade,
} from 'reactstrap';
import bn from '../../utils/bemnames';
import { DoughnutChart, BarChart, LineChart } from '../../uiLayout/components/chart'
import { TextWidget, NumberWidget } from '../../uiLayout/components/widget';
import { DashBoardData } from './DashboardData'
import DashBoardGetter from './DashBoardGetter'
import DropDownOptions from '../../uiLayout/components/DropDownOptions'
import BootstrapTable from 'react-bootstrap-table-next';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from 'react-bootstrap-table2-editor';
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../LoaderMessage';
import { ExecutionTableHeader } from '../Api/ExecutionLab/ExecutionTableHeader'
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import DataGeneratorUtility from '../../QAautoMATER/funcLib/DataGeneratorUtility';
import ReactJson from 'react-json-view'
import { ResponseAsserionTableHeader, UITestResultsTableHeader } from '../Api/ExecutionLab/ExecutionTableHeader'
const bem = bn.create('header');

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      //****** Page Loader ***********************************************************
      isPageLoading: false,

      //****** Button Color ***********************************************************
      buttonWebColor: 'dark',
      buttonApiColor: 'white',

      //****** WIDGET Data ***********************************************************
      totalTestScripts: DashBoardData.TotalTestScripts,
      totalComponents: DashBoardData.TotalComponents,
      totalTestScriptsOnLastExecution: DashBoardData.TotalTestScriptsOnLastExecution,

      //****** Component Script Count Data ********************************************
      passPercentageInLastExecution: DashBoardData.PassPercentageInLastExecution,
      moduleScriptCountXaxis: DashBoardData.ModuleScriptCountXaxis,
      moduleScriptCountYaxis: DashBoardData.ModuleScriptCountYaxis,
      componentScriptCountColorCode: DashBoardData.ComponentScriptCountColorCode,

      //****** Environment Data for Last X Execution ********************************************
      environmentList: DashBoardData.EnvironmentList,
      selectedEnvforSummary: DashBoardData.SelectedEnvironment,

      //****** Pass Fail Data for Last X Execution ********************************************
      reportHistoryCounter: DashBoardData.ReportHistoryCounter,
      totalPassFailInLastXResults: DashBoardData.TotalPassFailInLastXResults,
      totalPassFailColorCode: DashBoardData.TotalPassFailColorCode,

      //****** execution History Data for Last X Execution ********************************************
      executionXaxisInLastXResults: DashBoardData.ExecutionXaxisInLastXResults,
      executionYaxisInLastXResults: DashBoardData.ExecutionYaxisInLastXResults,
      executionHistoryColorCode: DashBoardData.ExecutionHistoryColorCode,

      //****** execution time Data for Last X Execution ********************************************
      executionTimeXaxisInLastXResults: DashBoardData.ExecutionTimeXaxisInLastXResults,
      executionTimeYaxisInLastXResults: DashBoardData.ExecutionTimeYaxisInLastXResults,
      executionTimeColorCode: DashBoardData.ExecutionTimeColorCode,

      //****** Failed component data for Last X Execution ********************************************
      failedComponentInLastXResults: DashBoardData.FailedComponentInLastXResults,
      componentFailedCountColorCode: DashBoardData.ComponentFailedCountColorCode,

      //****** Detailed test Results for Last X Execution ********************************************
      defaultSaveDaysToReport: DashBoardData.DefaultSaveDaysToReport,
      pastDateList: DashBoardData.PastDateList,
      selectedExecutionDate: DashBoardData.SelectedExecutionDate,
      listOfExecutionTimeForaDay: DashBoardData.ListOfExecutionTimeForaDay,
      selectedExecutionTime: DashBoardData.SelectedExecutionTime,
      isViewResultButtonDisabled: DashBoardData.IsViewResultButtonDisabled,

      //****** Day Wise Test scrips development for Last X Days ********************************************
      defaultSaveDaysToDevelopment: DashBoardData.DefaultSaveDaysToDevelopment,
      pastDateListForDevandExecution: DashBoardData.ListOfPastDateforDaysToDevelopment,
      dayWiseTestScriptDevelopment: DashBoardData.DayWiseTestScriptDevelopment,
      testScriptDevelopmentColorCode: DashBoardData.TestScriptDevelopmentColorCode,

      //****** Day Wise Test execution for Last X Days ********************************************
      dayWiseTestExecutionData: DashBoardData.DayWiseTestExecutionData,
      testScriptExecutionColorCode: DashBoardData.TestScriptExecutionColorCode,

      //****** View Results Modal***********************************************************
      isViewResultsOpen: false,

      //********** Screenshot MOdal****************************************
      isScreenshotModalOpen: DashBoardData.IsScreenshotModalOpen,
      imageData: DashBoardData.ImageData,
      stepsDetailsForScreenshot: DashBoardData.StepsDetailsForScreenshot,

    }

  };
  async componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({ isPageLoading: true });
    await DashBoardGetter.dashboardPageLoadData(DashBoardData.SelectedTab);

    //****** Button color ***********************************************************
    this.setState({ buttonWebColor: await DashBoardGetter.getWebButtonColor() })
    this.setState({ buttonApiColor: await DashBoardGetter.getApiButtonColor() })

    //****** WIDGET Data ***********************************************************
    this.setState({ totalTestScripts: DashBoardData.TotalTestScripts });
    this.setState({ totalComponents: DashBoardData.TotalComponents });
    this.setState({ totalTestScriptsOnLastExecution: DashBoardData.TotalTestScriptsOnLastExecution });
    this.setState({ passPercentageInLastExecution: DashBoardData.PassPercentageInLastExecution });

    //****** Component Script Count Data ********************************************
    this.setState({ moduleScriptCountXaxis: DashBoardData.ModuleScriptCountXaxis });
    this.setState({ moduleScriptCountYaxis: DashBoardData.ModuleScriptCountYaxis });
    DashBoardData.ComponentScriptCountColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ componentScriptCountColorCode: DashBoardData.ComponentScriptCountColorCode });

    //****** Environment Data ********************************************************
    this.setState({ environmentList: DashBoardData.EnvironmentList });
    this.setState({ selectedEnvforSummary: DashBoardData.SelectedEnvironment });

    //****** Pass Fail Data for Last X Execution ********************************************
    this.setState({ reportHistoryCounter: DashBoardData.ReportHistoryCounter });
    this.setState({ totalPassFailInLastXResults: DashBoardData.TotalPassFailInLastXResults });
    DashBoardData.TotalPassFailColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(2);
    this.setState({ totalPassFailColorCode: DashBoardData.TotalPassFailColorCode });

    //****** execution History Data for Last X Execution ********************************************
    this.setState({ executionXaxisInLastXResults: DashBoardData.ExecutionXaxisInLastXResults });
    this.setState({ executionYaxisInLastXResults: DashBoardData.ExecutionYaxisInLastXResults });
    DashBoardData.ExecutionHistoryColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(2);
    this.setState({ executionHistoryColorCode: DashBoardData.ExecutionHistoryColorCode })

    //****** execution time Data for Last X Execution ********************************************
    this.setState({ executionTimeXaxisInLastXResults: DashBoardData.ExecutionTimeXaxisInLastXResults });
    this.setState({ executionTimeYaxisInLastXResults: DashBoardData.ExecutionTimeYaxisInLastXResults });
    DashBoardData.ExecutionTimeColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ executionTimeColorCode: DashBoardData.ExecutionTimeColorCode })

    //****** Failed component data for Last X Execution ********************************************
    this.setState({ failedComponentInLastXResults: DashBoardData.FailedComponentInLastXResults });
    DashBoardData.ComponentFailedCountColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ componentFailedCountColorCode: DashBoardData.ComponentFailedCountColorCode })

    //****** Detailed  Test Script data for Last X Execution ********************************************
    this.setState({ defaultSaveDaysToReport: DashBoardData.DefaultSaveDaysToReport });
    this.setState({ pastDateList: DashBoardData.PastDateList });
    this.setState({ selectedExecutionDate: DashBoardData.SelectedExecutionDate });
    this.setState({ listOfExecutionTimeForaDay: DashBoardData.ListOfExecutionTimeForaDay });
    this.setState({ selectedExecutionTime: DashBoardData.SelectedExecutionTime });
    this.setState({ isViewResultButtonEnabled: DashBoardData.IsViewResultButtonDisabled });

    //****** Day Wise Test scrips development for Last X Days ********************************************
    this.setState({ defaultSaveDaysToDevelopment: DashBoardData.DefaultSaveDaysToDevelopment });
    this.setState({ pastDateListForDevandExecution: DashBoardData.ListOfPastDateforDaysToDevelopment });
    this.setState({ dayWiseTestScriptDevelopment: DashBoardData.DayWiseTestScriptDevelopment });
    DashBoardData.TestScriptDevelopmentColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ testScriptDevelopmentColorCode: DashBoardData.TestScriptDevelopmentColorCode })

    //****** Day Wise Test execution data or Last X Days ********************************************
    this.setState({ dayWiseTestExecutionData: DashBoardData.DayWiseTestExecutionData });
    DashBoardData.TestScriptExecutionColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ testScriptExecutionColorCode: DashBoardData.TestScriptExecutionColorCode });

    this.setState({ isPageLoading: false });

    //****** View Results Modal *****************************************************************
    this.setState({ selectedReportTotalPassFailData: DashBoardData.SelectedReportTotalPassFailData });
    this.setState({ selectedReportListOfTestScripts: DashBoardData.SelectedReportListOfTestScripts });
    this.setState({ selectedReportExecutionTimeGraphXaxis: DashBoardData.SelectedReportExecutionTimeGraphXaxis })
    this.setState({ selectedReportExecutionTimeGraphYaxis: DashBoardData.SelectedReportExecutionTimeGraphYaxis })
    DashBoardData.SelectedReportExecutionTimeColor = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ selectedReportExecutionTimeColor: DashBoardData.SelectedReportExecutionTimeColor })
    this.setState({ selectedReportComponentPassFailData: await DashBoardData.SelectedReportComponentPassFailData })

    //********** Screenshot Modal****************************************
    this.setState({ isScreenshotModalOpen: DashBoardData.IsScreenshotModalOpen })
    this.setState({ imageData: DashBoardData.ImageData })
    this.setState({ stepsDetailsForScreenshot: DashBoardData.StepsDetailsForScreenshot })
  }

  //****** Component Choose Environment ***********************************************
  selectEnvForExecutionSummary = async (event) => {
    var selectedEnv = await event.target.value;
    if (this.state.selectedEnvforSummary !== await selectedEnv) {
      this.setState({ selectedEnvforSummary: await selectedEnv })
      DashBoardData.SelectedEnvironment = await selectedEnv;
      this.setState({ isPageLoading: true });
      await DashBoardGetter.dashboardPageLoadData(DashBoardData.SelectedTab, true);


      //****** WIDGET Data ***********************************************************
      this.setState({ totalTestScripts: DashBoardData.TotalTestScripts });
      this.setState({ totalComponents: DashBoardData.TotalComponents });
      this.setState({ totalTestScriptsOnLastExecution: DashBoardData.TotalTestScriptsOnLastExecution });
      this.setState({ passPercentageInLastExecution: DashBoardData.PassPercentageInLastExecution });

      //****** Component Script Count Data ********************************************
      this.setState({ moduleScriptCountXaxis: DashBoardData.ModuleScriptCountXaxis });
      this.setState({ moduleScriptCountYaxis: DashBoardData.ModuleScriptCountYaxis });
      DashBoardData.ComponentScriptCountColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ componentScriptCountColorCode: DashBoardData.ComponentScriptCountColorCode });

      //****** Environment Data ********************************************************
      this.setState({ environmentList: DashBoardData.EnvironmentList });
      this.setState({ selectedEnvforSummary: DashBoardData.SelectedEnvironment });

      //****** Pass Fail Data for Last X Execution ********************************************
      this.setState({ reportHistoryCounter: DashBoardData.ReportHistoryCounter });
      this.setState({ totalPassFailInLastXResults: DashBoardData.TotalPassFailInLastXResults });
      DashBoardData.TotalPassFailColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(2);
      this.setState({ totalPassFailColorCode: DashBoardData.TotalPassFailColorCode });

      //****** execution History Data for Last X Execution ********************************************
      this.setState({ executionXaxisInLastXResults: DashBoardData.ExecutionXaxisInLastXResults });
      this.setState({ executionYaxisInLastXResults: DashBoardData.ExecutionYaxisInLastXResults });
      DashBoardData.ExecutionHistoryColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(2);
      this.setState({ executionHistoryColorCode: DashBoardData.ExecutionHistoryColorCode })

      //****** execution time Data for Last X Execution ********************************************
      this.setState({ executionTimeXaxisInLastXResults: DashBoardData.ExecutionTimeXaxisInLastXResults });
      this.setState({ executionTimeYaxisInLastXResults: DashBoardData.ExecutionTimeYaxisInLastXResults });
      DashBoardData.ExecutionTimeColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ executionTimeColorCode: DashBoardData.ExecutionTimeColorCode })

      //****** Failed component data for Last X Execution ********************************************
      this.setState({ failedComponentInLastXResults: DashBoardData.FailedComponentInLastXResults });
      DashBoardData.ComponentFailedCountColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ componentFailedCountColorCode: DashBoardData.ComponentFailedCountColorCode })

      //****** Detailed  Test Script data for Last X Execution ********************************************
      this.setState({ defaultSaveDaysToReport: DashBoardData.DefaultSaveDaysToReport });
      this.setState({ pastDateList: DashBoardData.PastDateList });
      this.setState({ selectedExecutionDate: DashBoardData.SelectedExecutionDate });
      this.setState({ listOfExecutionTimeForaDay: DashBoardData.ListOfExecutionTimeForaDay });
      this.setState({ selectedExecutionTime: DashBoardData.SelectedExecutionTime });

      //****** Day Wise Test scrips development for Last X Days ********************************************
      this.setState({ defaultSaveDaysToDevelopment: DashBoardData.DefaultSaveDaysToDevelopment });
      this.setState({ pastDateListForDevandExecution: DashBoardData.ListOfPastDateforDaysToDevelopment });
      this.setState({ dayWiseTestScriptDevelopment: DashBoardData.DayWiseTestScriptDevelopment });
      DashBoardData.TestScriptDevelopmentColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ testScriptDevelopmentColorCode: DashBoardData.TestScriptDevelopmentColorCode })

      //****** Day Wise Test execution data or Last X Days ********************************************
      this.setState({ dayWiseTestExecutionData: DashBoardData.DayWiseTestExecutionData });
      DashBoardData.TestScriptExecutionColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ testScriptExecutionColorCode: DashBoardData.TestScriptExecutionColorCode });

      this.setState({ isPageLoading: false });
    }

  };
  selectExecutionDate = async (event) => {
    var selectedExecutionDate = await event.target.value;
    if (this.state.selectedExecutionDate !== await selectedExecutionDate) {
      this.setState({ selectedExecutionDate: await selectedExecutionDate })
      this.setState({ selectedExecutionTime: '' });
      this.setState({ isViewResultButtonDisabled: true });
      DashBoardData.SelectedExecutionDate = await selectedExecutionDate;
      DashBoardData.SelectedExecutionTime = '';
      DashBoardData.IsViewResultButtonDisabled = true;
      this.setState({ listOfExecutionTimeForaDay: [] });
      DashBoardData.ListOfExecutionTimeForaDay = [];
      if (selectedExecutionDate !== '') {
        this.setState({ isPageLoading: true })
        await DashBoardGetter.SelectedExecutionDate();
        this.setState({ listOfExecutionTimeForaDay: DashBoardData.ListOfExecutionTimeForaDay });
        this.setState({ isPageLoading: false })
      }
    }

  };
  selectExecutionTime = async (event) => {
    var selectedExecutionTime = await event.target.value;
    if (this.state.selectedExecutionTime !== await selectedExecutionTime) {
      this.setState({ selectedExecutionTime: await selectedExecutionTime });
      DashBoardData.SelectedExecutionTime = await selectedExecutionTime;
      if (await selectedExecutionTime === '') {
        this.setState({ isViewResultButtonDisabled: true });
        DashBoardData.IsViewResultButtonDisabled = true;
      }
      else {
        this.setState({ isViewResultButtonDisabled: false });
        DashBoardData.IsViewResultButtonDisabled = false;

      }
    }

  };

  selectWebDashboard = async () => {
    if (DashBoardData.SelectedTab !== 'Web') {
      this.setState({ isPageLoading: true });
      DashBoardData.SelectedTab = 'Web';
      this.setState({ buttonWebColor: 'dark' })
      this.setState({ buttonApiColor: 'white' })
      DashBoardData.IsViewResultButtonDisabled = true;
      this.setState({ isViewResultButtonDisabled: true });
      DashBoardData.SelectedExecutionDate = '';
      this.setState({ selectedExecutionDate: '' });
      DashBoardData.ListOfExecutionTimeForaDay = [];
      this.setState({ listOfExecutionTimeForaDay: [] });
      DashBoardData.SelectedExecutionTime = '';
      this.setState({ selectedExecutionTime: '' });
      await DashBoardGetter.dashboardPageLoadData(DashBoardData.SelectedTab);

      //****** WIDGET Data ***********************************************************
      this.setState({ totalTestScripts: DashBoardData.TotalTestScripts });
      this.setState({ totalComponents: DashBoardData.TotalComponents });
      this.setState({ totalTestScriptsOnLastExecution: DashBoardData.TotalTestScriptsOnLastExecution });
      this.setState({ passPercentageInLastExecution: DashBoardData.PassPercentageInLastExecution });

      //****** Component Script Count Data ********************************************
      this.setState({ moduleScriptCountXaxis: DashBoardData.ModuleScriptCountXaxis });
      this.setState({ moduleScriptCountYaxis: DashBoardData.ModuleScriptCountYaxis });
      DashBoardData.ComponentScriptCountColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ componentScriptCountColorCode: DashBoardData.ComponentScriptCountColorCode });

      //****** Environment Data ********************************************************
      this.setState({ environmentList: DashBoardData.EnvironmentList });
      this.setState({ selectedEnvforSummary: DashBoardData.SelectedEnvironment });

      //****** Pass Fail Data for Last X Execution ********************************************
      this.setState({ reportHistoryCounter: DashBoardData.ReportHistoryCounter });
      this.setState({ totalPassFailInLastXResults: DashBoardData.TotalPassFailInLastXResults });
      DashBoardData.TotalPassFailColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(2);
      this.setState({ totalPassFailColorCode: DashBoardData.TotalPassFailColorCode });

      //****** execution History Data for Last X Execution ********************************************
      this.setState({ executionXaxisInLastXResults: DashBoardData.ExecutionXaxisInLastXResults });
      this.setState({ executionYaxisInLastXResults: DashBoardData.ExecutionYaxisInLastXResults });
      DashBoardData.ExecutionHistoryColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(2);
      this.setState({ executionHistoryColorCode: DashBoardData.ExecutionHistoryColorCode })

      //****** execution time Data for Last X Execution ********************************************
      this.setState({ executionTimeXaxisInLastXResults: DashBoardData.ExecutionTimeXaxisInLastXResults });
      this.setState({ executionTimeYaxisInLastXResults: DashBoardData.ExecutionTimeYaxisInLastXResults });
      DashBoardData.ExecutionTimeColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ executionTimeColorCode: DashBoardData.ExecutionTimeColorCode })

      //****** Failed component data for Last X Execution ********************************************
      this.setState({ failedComponentInLastXResults: DashBoardData.FailedComponentInLastXResults });
      DashBoardData.ComponentFailedCountColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ componentFailedCountColorCode: DashBoardData.ComponentFailedCountColorCode })

      //****** Detailed  Test Script data for Last X Execution ********************************************
      this.setState({ defaultSaveDaysToReport: DashBoardData.DefaultSaveDaysToReport });
      this.setState({ pastDateList: DashBoardData.PastDateList });
      this.setState({ selectedExecutionDate: DashBoardData.SelectedExecutionDate });
      this.setState({ listOfExecutionTimeForaDay: DashBoardData.ListOfExecutionTimeForaDay });
      this.setState({ selectedExecutionTime: DashBoardData.SelectedExecutionTime });

      //****** Day Wise Test scrips development for Last X Days ********************************************
      this.setState({ defaultSaveDaysToDevelopment: DashBoardData.DefaultSaveDaysToDevelopment });
      this.setState({ pastDateListForDevandExecution: DashBoardData.ListOfPastDateforDaysToDevelopment });
      this.setState({ dayWiseTestScriptDevelopment: DashBoardData.DayWiseTestScriptDevelopment });
      DashBoardData.TestScriptDevelopmentColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ testScriptDevelopmentColorCode: DashBoardData.TestScriptDevelopmentColorCode })

      //****** Day Wise Test execution data or Last X Days ********************************************
      this.setState({ dayWiseTestExecutionData: DashBoardData.DayWiseTestExecutionData });
      DashBoardData.TestScriptExecutionColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ testScriptExecutionColorCode: DashBoardData.TestScriptExecutionColorCode });

      this.setState({ isPageLoading: false });
    }
  }
  selectApiDashboard = async () => {
    if (DashBoardData.SelectedTab !== 'Api') {
      this.setState({ isPageLoading: true });
      DashBoardData.SelectedTab = 'Api';
      this.setState({ buttonWebColor: 'white' })
      this.setState({ buttonApiColor: 'dark' })
      DashBoardData.IsViewResultButtonDisabled = true;
      this.setState({ isViewResultButtonDisabled: true });
      DashBoardData.SelectedExecutionDate = '';
      this.setState({ selectedExecutionDate: '' });
      DashBoardData.ListOfExecutionTimeForaDay = [];
      this.setState({ listOfExecutionTimeForaDay: [] });
      DashBoardData.SelectedExecutionTime = '';
      this.setState({ selectedExecutionTime: '' });
      await DashBoardGetter.dashboardPageLoadData(DashBoardData.SelectedTab);

      //****** WIDGET Data ***********************************************************
      this.setState({ totalTestScripts: DashBoardData.TotalTestScripts });
      this.setState({ totalComponents: DashBoardData.TotalComponents });
      this.setState({ totalTestScriptsOnLastExecution: DashBoardData.TotalTestScriptsOnLastExecution });
      this.setState({ passPercentageInLastExecution: DashBoardData.PassPercentageInLastExecution });

      //****** Component Script Count Data ********************************************
      this.setState({ moduleScriptCountXaxis: DashBoardData.ModuleScriptCountXaxis });
      this.setState({ moduleScriptCountYaxis: DashBoardData.ModuleScriptCountYaxis });
      DashBoardData.ComponentScriptCountColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ componentScriptCountColorCode: DashBoardData.ComponentScriptCountColorCode });

      //****** Environment Data ********************************************************
      this.setState({ environmentList: DashBoardData.EnvironmentList });
      this.setState({ selectedEnvforSummary: DashBoardData.SelectedEnvironment });

      //****** Pass Fail Data for Last X Execution ********************************************
      this.setState({ reportHistoryCounter: DashBoardData.ReportHistoryCounter });
      this.setState({ totalPassFailInLastXResults: DashBoardData.TotalPassFailInLastXResults });
      DashBoardData.TotalPassFailColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(2);
      this.setState({ totalPassFailColorCode: DashBoardData.TotalPassFailColorCode });

      //****** execution History Data for Last X Execution ********************************************
      this.setState({ executionXaxisInLastXResults: DashBoardData.ExecutionXaxisInLastXResults });
      this.setState({ executionYaxisInLastXResults: DashBoardData.ExecutionYaxisInLastXResults });
      DashBoardData.ExecutionHistoryColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(2);
      this.setState({ executionHistoryColorCode: DashBoardData.ExecutionHistoryColorCode })

      //****** execution time Data for Last X Execution ********************************************
      this.setState({ executionTimeXaxisInLastXResults: DashBoardData.ExecutionTimeXaxisInLastXResults });
      this.setState({ executionTimeYaxisInLastXResults: DashBoardData.ExecutionTimeYaxisInLastXResults });
      DashBoardData.ExecutionTimeColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ executionTimeColorCode: DashBoardData.ExecutionTimeColorCode })

      //****** Failed component data for Last X Execution ********************************************
      this.setState({ failedComponentInLastXResults: DashBoardData.FailedComponentInLastXResults });
      DashBoardData.ComponentFailedCountColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ componentFailedCountColorCode: DashBoardData.ComponentFailedCountColorCode })

      //****** Detailed  Test Script data for Last X Execution ********************************************
      this.setState({ defaultSaveDaysToReport: DashBoardData.DefaultSaveDaysToReport });
      this.setState({ pastDateList: DashBoardData.PastDateList });
      this.setState({ selectedExecutionDate: DashBoardData.SelectedExecutionDate });
      this.setState({ listOfExecutionTimeForaDay: DashBoardData.ListOfExecutionTimeForaDay });
      this.setState({ selectedExecutionTime: DashBoardData.SelectedExecutionTime });

      //****** Day Wise Test scrips development for Last X Days ********************************************
      this.setState({ defaultSaveDaysToDevelopment: DashBoardData.DefaultSaveDaysToDevelopment });
      this.setState({ pastDateListForDevandExecution: DashBoardData.ListOfPastDateforDaysToDevelopment });
      this.setState({ dayWiseTestScriptDevelopment: DashBoardData.DayWiseTestScriptDevelopment });
      DashBoardData.TestScriptDevelopmentColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ testScriptDevelopmentColorCode: DashBoardData.TestScriptDevelopmentColorCode })

      //****** Day Wise Test execution data or Last X Days ********************************************
      this.setState({ dayWiseTestExecutionData: DashBoardData.DayWiseTestExecutionData });
      DashBoardData.TestScriptExecutionColorCode = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
      this.setState({ testScriptExecutionColorCode: DashBoardData.TestScriptExecutionColorCode });

      this.setState({ isPageLoading: false });
    }
  }

  //***** View Result Modal *************************************************************************
  toggleViewResultModal = async () => {
    this.setState({ isViewResultsOpen: false });
  }

  expandTestResults(row) {
    var boarderColor = 'default';
    var assertionData = [];
    if (DashBoardData.AssertionResultsForAllResults[row.id] !== undefined) {
      assertionData = DashBoardData.AssertionResultsForAllResults[row.id];
    }
    var testResultData = {};
    if (DashBoardData.ResponseDataForAllResults[row.id] !== undefined) {
      testResultData = DashBoardData.ResponseDataForAllResults[row.id];
    }
    if (DashBoardData.SelectedReportListOfTestScripts[Number(row.id) - 1]['status'] === 'Pass') {
      boarderColor = '#17E798';
    }
    if (DashBoardData.SelectedReportListOfTestScripts[Number(row.id) - 1]['status'] === 'Fail') {
      boarderColor = '#FF5733'
    }
    return <Row>
      {DashBoardData.SelectedTab === 'Api' && (<Col lg={6} md={6} sm={6} xs={12}>
        <Card style={{ borderColor: boarderColor }}>
          <CardHeader>Expected vs Actual
          </CardHeader>
          <CardBody>
            <Col>
              <BootstrapTable
                keyField='id'
                data={assertionData}
                columns={ResponseAsserionTableHeader}
                wrapperClasses="table-responsive"
                striped
                hover
                condensed
              />
            </Col>
          </CardBody>
        </Card>
      </Col>
      )}
      {DashBoardData.SelectedTab === 'Api' && (<Col lg={6} md={6} sm={6} xs={12}>
        <Card style={{ borderColor: boarderColor }}>
          <CardHeader>Test results data
          </CardHeader>
          <CardBody>
            <Col>
              <ReactJson name={false} collapsed={true} collapseStringsAfterLength={25} displayDataTypes={false} indentWidth={0} iconStyle="circle" src={testResultData} />
            </Col>
          </CardBody>
        </Card>
      </Col>
      )}
      {DashBoardData.SelectedTab === 'Web' && (<Col lg={12} md={12} sm={12} xs={12}>
        <Card style={{ borderColor: boarderColor }}>
          <CardHeader>Test Step Results ({DashBoardData.ExecutionTimeForUITestScripts[row.id]} seconds)
          </CardHeader>
          <CardBody>
            <Col>
              <BootstrapTable
                keyField='id'
                data={assertionData}
                columns={UITestResultsTableHeader}
                wrapperClasses="table-responsive"
                striped
                hover
                condensed
                cellEdit={cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  onStartEdit: (row, column, rowIndex, columnIndex) => {
                    if (columnIndex === 5) {
                      this.setState({ isScreenshotModalOpen: true });
                      this.setState({ stepsDetailsForScreenshot: DashBoardData.StepsDetailsForScreenshot })
                      this.setState({ imageData: DashBoardData.ImageData })
                    }
                  }
                })}
              />

            </Col>
          </CardBody>
        </Card>
      </Col>
      )}
    </Row>
  }

  viewReport = async () => {
    this.setState({ isPageLoading: true });
    DashBoardData.SelectedReportComponentPassFailData = [[]]
    this.setState({ selectedReportComponentPassFailData: DashBoardData.SelectedReportComponentPassFailData })
    await DashBoardGetter.getSelectedReportData();
    this.setState({ isPageLoading: false });
    this.setState({ isViewResultsOpen: true });
    this.setState({ selectedReportTotalPassFailData: await DashBoardData.SelectedReportTotalPassFailData });
    this.setState({ selectedReportExecutionTimeGraphXaxis: await DashBoardData.SelectedReportExecutionTimeGraphXaxis })
    this.setState({ selectedReportExecutionTimeGraphYaxis: DashBoardData.SelectedReportExecutionTimeGraphYaxis })
    DashBoardData.SelectedReportExecutionTimeColor = await DataGeneratorUtility.gerHexaColorCodeForArray(1);
    this.setState({ selectedReportExecutionTimeColor: DashBoardData.SelectedReportExecutionTimeColor })
    this.setState({ selectedReportComponentPassFailData: DashBoardData.SelectedReportComponentPassFailData })
    this.setState({ selectedReportListOfTestScripts: await DashBoardData.SelectedReportListOfTestScripts });
  }
  //*********** Toggle screenshot */
  toggleScreenshotModal = async () => {
    this.setState({ isScreenshotModalOpen: false });
    DashBoardData.IsScreenshotModalOpen = false;
  }

  render() {
    const expandRow = {
      showExpandColumn: true,
      expandByColumnOnly: false,
      renderer: this.expandTestResults.bind(this)
    };
    return (
      <Page
        className="DashboardPage"
        title="Dashboard"
      >
        {this.state.isPageLoading && <PageLoader sentences={LoaderMessage} height='150%' color="black" />}
        <Fade in={!this.state.isPageLoading}>
          <Row>
            {/* <ButtonGroups>
          </ButtonGroups> */}
            <Nav className={bem.e('nav-right')}>
              <ButtonGroup className="mr-3 mb-3" size="sm">
                <Button color={this.state.buttonWebColor} onClick={this.selectWebDashboard.bind(this)}  >Web</Button>
                <Button color={this.state.buttonApiColor} onClick={this.selectApiDashboard.bind(this)}>Api</Button>
              </ButtonGroup>
            </Nav>
          </Row>
          <Row>
            <Col lg={4} md={6} sm={6} xs={12}>
              <TextWidget
                title="Total automated test case"
                number={this.state.totalTestScripts}
                color="black"
              />
            </Col>
            <Col lg={4} md={6} sm={6} xs={12}>
              <TextWidget
                title="Total components"
                number={this.state.totalComponents}
                color="black"
              />
            </Col>
            <Col lg={4} md={6} sm={6} xs={12}>
              <NumberWidget
                title="Last Execution Results"
                number={this.state.totalTestScriptsOnLastExecution}
                color="success"
                progress={{
                  value: this.state.passPercentageInLastExecution,
                  label: 'Pass',
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Component
                  <small> Script count</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.moduleScriptCountXaxis} data={this.state.moduleScriptCountYaxis} color={this.state.componentScriptCountColorCode}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Choose Environment</CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup col>
                      <Label sm={5}>
                        Environment*
                      </Label>
                      <Col>
                        <Input type="select" onChange={this.selectEnvForExecutionSummary.bind(this)} name="envListforSummary" value={this.state.selectedEnvforSummary}>
                          <DropDownOptions options={this.state.environmentList} />
                        </Input>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Pass Fail Count
                  <small> Last {this.state.reportHistoryCounter} Results</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <DoughnutChart labels={['Pass', 'Fail']} data={this.state.totalPassFailInLastXResults} color={this.state.totalPassFailColorCode}></DoughnutChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Execution history
                  <small> Last {this.state.reportHistoryCounter} Results</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <LineChart label={['Pass', 'Fail']} labels={this.state.executionXaxisInLastXResults} data={this.state.executionYaxisInLastXResults} color={this.state.executionHistoryColorCode}></LineChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Execution Time in seconds
                  <small> Last {this.state.reportHistoryCounter} Results</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <LineChart labels={this.state.executionTimeXaxisInLastXResults} data={this.state.executionTimeYaxisInLastXResults} color={this.state.executionTimeColorCode}></LineChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Component Failed Count
                  <small> Last {this.state.reportHistoryCounter} Results</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.moduleScriptCountXaxis} data={this.state.failedComponentInLastXResults} color={this.state.componentFailedCountColorCode}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-center">
                    Detail Execution Report Last {this.state.defaultSaveDaysToReport} Days
                    {/* <small> Last {this.state.defaultSaveDaysToReport} Days</small> */}
                    <Button size="sm" color='dark' disabled={this.state.isViewResultButtonDisabled} onClick={this.viewReport.bind(this)} >
                      <small>View Reports</small>
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup row>
                      <Label sm={4}>
                        Execution Date*
                      </Label>
                      <Col>
                        <Input type="select" name="executionDate" value={this.state.selectedExecutionDate} onChange={this.selectExecutionDate.bind(this)}>
                          <option></option>
                          <DropDownOptions options={this.state.pastDateList} />
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4}>
                        Execution Time*
                      </Label>
                      <Col>
                        <Input type="select" name="executionTime" value={this.state.selectedExecutionTime} onChange={this.selectExecutionTime.bind(this)}>
                          <option></option>
                          <DropDownOptions options={this.state.listOfExecutionTimeForaDay} />
                        </Input>
                      </Col>
                    </FormGroup>
                    {/* <Col>
                    <BootstrapTable
                      keyField='id'
                      data={this.state.tableDataforDetailedReports}
                      columns={TableDetailResultsHeaderColumn}
                      wrapperClasses="table-responsive"
                      striped
                      hover
                      condensed
                    />
                  </Col> */}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Test scripts development
                  <small> Last {this.state.defaultSaveDaysToDevelopment} Days</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.pastDateListForDevandExecution} data={this.state.dayWiseTestScriptDevelopment} color={this.state.testScriptDevelopmentColorCode}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} md={6} sm={6} xs={12}>
              <Card>
                <CardHeader>Test execution
                  <small> Last {this.state.defaultSaveDaysToDevelopment} Days</small>
                </CardHeader>
                <CardBody>
                  <Col>
                    <BarChart labels={this.state.pastDateListForDevandExecution} data={this.state.dayWiseTestExecutionData} color={this.state.testScriptExecutionColorCode}></BarChart>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal size="xl" isOpen={this.state.isViewResultsOpen} className={this.props.className} backdrop="static">
            <ModalHeader toggle={this.toggleViewResultModal.bind(this)}>{DashBoardData.SelectedTab} {DashBoardData.TestingMethod} Test Results {this.state.selectedExecutionDate} {this.state.selectedExecutionTime}</ModalHeader>
            <ModalBody>
              <Row>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card>
                    <CardHeader>Total Pass fail count
                    </CardHeader>
                    <CardBody>
                      <Col>
                        <DoughnutChart color={['#17E798', '#F38295']} labels={['Pass', 'Fail']} data={this.state.selectedReportTotalPassFailData}></DoughnutChart>
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={4} md={6} sm={6} xs={12}>
                  <Card>
                    <CardHeader>Component execution time in seconds
                    </CardHeader>
                    <CardBody>
                      <Col>
                        <LineChart labels={this.state.selectedReportExecutionTimeGraphXaxis} data={this.state.selectedReportExecutionTimeGraphYaxis} color={this.state.selectedReportExecutionTimeColor}></LineChart>
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={5} md={6} sm={6} xs={12}>
                  <Card>
                    <CardHeader>Pass Fail Count
                    </CardHeader>
                    <CardBody>
                      <Col>
                        <BarChart color={['#17E798', '#F38295']} labels={this.state.selectedReportExecutionTimeGraphXaxis} data={this.state.selectedReportComponentPassFailData}></BarChart>
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={6} xs={12}>
                  <TextWidget
                    title="Execution Time"
                    number={DashBoardData.ExistingReportTestExecutionTime}
                  />
                </Col>
                <Col lg={6} md={6} sm={6} xs={12}>
                  <TextWidget
                    title="Execution From"
                    number={DashBoardData.ExistingReportExecutionStartFrom}
                  />
                </Col>
                {DashBoardData.SelectedTab === 'Web' && (<Col lg={6} md={6} sm={6} xs={12}>
                  <TextWidget
                    title="Platform"
                    number={DashBoardData.ExistingReportExecutionPlatform}
                  />
                </Col>
                )}
                {DashBoardData.SelectedTab === 'Web' && (<Col lg={6} md={6} sm={6} xs={12}>
                  <TextWidget
                    title="Browser"
                    number={DashBoardData.ExistingReportExecutionDevice}
                  />
                </Col>
                )}
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Card>
                    <CardHeader>
                      <div className="d-flex justify-content-between align-items-center">
                        Detailed Test Report
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Col>
                        <BootstrapTable
                          keyField='id'
                          data={this.state.selectedReportListOfTestScripts}
                          columns={ExecutionTableHeader}
                          wrapperClasses="table-responsive"
                          striped
                          hover
                          condensed
                          filter={filterFactory()}
                          pagination={paginationFactory()}
                          expandRow={expandRow}
                        />
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
          <Modal size="xl" isOpen={this.state.isScreenshotModalOpen} className={this.props.className} backdrop="static">
            <ModalHeader toggle={this.toggleScreenshotModal.bind(this)}>Screenshot-{this.state.stepsDetailsForScreenshot}</ModalHeader>
            <ModalBody>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Form>
                    <FormGroup row>
                      <img alt ='imagedata' src={this.state.imageData}></img>;
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </Fade>
      </Page>
    );
  }
}
export default DashboardPage;
