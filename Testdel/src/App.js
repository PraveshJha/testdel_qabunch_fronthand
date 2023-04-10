//import {MainLayout } from 'components/Layout';
import React from 'react';
import {EmptyLayout,MainLayout } from './pages';
import PageSpinner from '../src/uiLayout/PageSpinner';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import componentQueries from 'react-component-queries'
import { Users } from '../src/QAautoMATER/Config'
import '././themeColor/uiComponentTheme.scss'
import AppGetter from './AppGetter';

//*****  Login Page  ***************************
const AuthPage = React.lazy(() => import('../src/uiLayout/AuthForm'));

//*****  DashBoard Page  ***************************
const DashboardPage = React.lazy(() => import('../src/pages/DashBoard/DashboardPage'));
const CICDPage = React.lazy(() => import('../src/pages/CICD/CICDPage'));

//*****  UI Page  ***************************
const UIExecutionLab = React.lazy(() => import('../src/pages/Web/ExecutionLab/ExecutionLabPage'));
const UIConfigurationPage = React.lazy(() => import('../src/pages/Web/Configuration/ConfigurationPage'));
const UITestDataPage = React.lazy(() => import('../src/pages/Web/TestData/TestDataPage'));
const UIORPage = React.lazy(() => import('../src/pages/Web/ObjectRepository/ObjectRepositoryPage'));
const UITestScriptPage = React.lazy(() => import('../src/pages/Web/TestScript/TestScriptPage'));
const UICustomFunctionPage = React.lazy(() => import('../src/pages/Web/CustomFunction/CustomFunctionPage'));

//*****  API Page  ***************************
const APIConfiguration = React.lazy(() => import('../src/pages/Api/Configuration/ConfigurationPage'));
const APIExecutionLab = React.lazy(() => import('../src/pages/Api/ExecutionLab/ExecutionLabPage'));
const APIScript = React.lazy(() => import('../src/pages/Api/TestScript/TestScriptPage'));
const MockRepoPage = React.lazy(() => import('../src/pages/Api/MockRepo/MockRepoPage'));
const ApiAutoScriptPage = React.lazy(() => import('../src/pages/Api/AutoScript/AutoScriptPage'));

//*****  About us  ***************************
const AboutUs = React.lazy(() => import('../src/pages/AboutUs/AboutUsPage'));

//*****  Manual  component  ***************************
const ManualConfigurationPage = React.lazy(() => import('../src/pages/Manual/Configuration/ConfigurationPage'));
const ManualTCPage = React.lazy(() => import('../src/pages/Manual/TestCase/TestCasePage'));
const DefectPage = React.lazy(() => import('../src/pages/Manual/Defects/DefectPage'));
const TestPlanPage = React.lazy(() => import('../src/pages/Manual/TestPlan/TestPlan'));
const ManualDashboardPage = React.lazy(() => import('../src/pages/Manual/Dashboard/DashboardPage'));


const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  state = {
    isUserAuthenticated: Users.isUserAuthenticated,
  };
  async componentDidMount() {
    await AppGetter.isUserAlreadyLogged();
    this.setState({isUserAuthenticated:Users.isUserAuthenticated});
  }
  render() {
    return (
      <>
        {!this.state.isUserAuthenticated && (<EmptyLayout breakpoint={this.props.breakpoint}>
          <React.Suspense fallback={<PageSpinner />}>
            <AuthPage />
          </React.Suspense>
        </EmptyLayout>
        )}
        {this.state.isUserAuthenticated && (<BrowserRouter basename={getBasename()}>
          <MainLayout breakpoint={this.props.breakpoint}>
            <React.Suspense fallback={<PageSpinner />}>
              <Routes>
                <Route path="/" element={<AboutUs />} />
                <Route path="/ui/dashboard" element={<DashboardPage />} />
                <Route path="/cicd" element={<CICDPage />} />
                <Route path="/ui/executionlab" element={<UIExecutionLab />} />
                <Route path="/ui/configuration" element={<UIConfigurationPage />} />
                <Route path="/ui/testdata" element={<UITestDataPage />} />
                <Route path="/ui/or" element={<UIORPage />} />
                <Route path="/ui/testscript" element={<UITestScriptPage />} />
                <Route path="/ui/customfunction" element={<UICustomFunctionPage />} />
                <Route path="/api/executionlab" element={<APIExecutionLab />} />
                <Route path="/api/configuration" element={<APIConfiguration />} />
                <Route path="/api/testscript" element={<APIScript />} />
                <Route path="/api/mockdata" element={<MockRepoPage />} />
                <Route path="/api/aiscript" element={<ApiAutoScriptPage />} />
                <Route path="/ui/cicd" element={<CICDPage />} />
                <Route path="/mn/testcase" element={<ManualTCPage />} />
                <Route path="/mn/configuration" element={<ManualConfigurationPage />} />
                <Route path="/mn/defects" element={<DefectPage />} />
                <Route path="/mn/testplan" element={<TestPlanPage />} />
                <Route path="/mn/dashboard" element={<ManualDashboardPage />} />
              </Routes>
            </React.Suspense>
          </MainLayout>
        </BrowserRouter>
        )}
      </>
    )
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
