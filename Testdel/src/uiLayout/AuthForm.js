import logo from '../../src/image/QAautoMATER.PNG';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageSpinner from '../uiLayout/PageSpinner';
import { MainLayout} from '../pages';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import DropDownOptions from '../uiLayout/components/DropDownOptions'
import { Config, Users } from '../QAautoMATER/Config'
import AuthGetter from './AuthGetter';
import PageLoader from 'react-fullpage-custom-loader'
import { LoaderMessage } from '../pages/LoaderMessage';
import NotificationSystem from 'react-notification-system';

//*****  DashBoard Page  ***************************
const DashboardPage = React.lazy(() => import('../pages/DashBoard/DashboardPage'));
const CICDPage = React.lazy(() => import('../pages/CICD/CICDPage'));

//*****  UI Page  ***************************
const UIExecutionLab = React.lazy(() => import('../pages/Web/ExecutionLab/ExecutionLabPage'));
const UIConfigurationPage = React.lazy(() => import('../pages/Web/Configuration/ConfigurationPage'));
const UITestDataPage = React.lazy(() => import('../pages/Web/TestData/TestDataPage'));
const UIORPage = React.lazy(() => import('../pages/Web/ObjectRepository/ObjectRepositoryPage'));
const UITestScriptPage = React.lazy(() => import('../pages/Web/TestScript/TestScriptPage'));
const UICustomFunctionPage = React.lazy(() => import('../pages/Web/CustomFunction/CustomFunctionPage'));

//*****  API Page  ***************************
const APIConfiguration = React.lazy(() => import('../pages/Api/Configuration/ConfigurationPage'));
const APIExecutionLab = React.lazy(() => import('../pages/Api/ExecutionLab/ExecutionLabPage'));
const APIScript = React.lazy(() => import('../pages/Api/TestScript/TestScriptPage'));
const MockRepoPage = React.lazy(() => import('../pages/Api/MockRepo/MockRepoPage'));
const ApiAutoScriptPage = React.lazy(() => import('../pages/Api/AutoScript/AutoScriptPage'));

//*****  About us  ***************************
const AboutUs = React.lazy(() => import('../pages/AboutUs/AboutUsPage'));

//*****  Manual  ***************************
const ManualTCPage = React.lazy(() => import('../pages/Manual/TestCase/TestCasePage'));
const ManualConfigurationPage = React.lazy(() => import('../pages/Manual/Configuration/ConfigurationPage'));
const DefectPage = React.lazy(() => import('../pages/Manual/Defects/DefectPage'));
const TestPlanPage = React.lazy(() => import('../pages/Manual/TestPlan/TestPlan'));
const ManualDashboardPage = React.lazy(() => import('../pages/Manual/Dashboard/DashboardPage'));

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};
class AuthForm extends React.Component {
  notificationSystem = React.createRef();
  state = {

    //****** Page Loader ***********************************************************
    isPageLoading: false,
    isUserAuthenticated: Users.isUserAuthenticated,

    //******  Email Address ***********************************************************
    userEmail: Users.userEmail,
    highlightedUserEmail: false,
    isUserExistOnServer: Users.isUserExistOnServer,
    allAccountList: Users.accounts,
    userSelectedAccount: Users.userSelectedAccount,
    userPassword: Users.userPassword,
    highlightedUserPassword: false,
    highlightedUserAccount: false,
  };
  async componentDidMount() {

    window.scrollTo(0, 0);
    //****** Environment and Component Data ********************************************
    this.setState({ isUserAuthenticated: Users.isUserAuthenticated })
    this.setState({ userEmail: Users.userEmail })
    this.setState({ isUserExistOnServer: Users.isUserExistOnServer })
    this.setState({ allAccountList: Users.accounts })
    if (Users.accounts.length > 0) {
      this.setState({ userSelectedAccount: Users.accounts[0] })
    }
    else {
      this.setState({ userSelectedAccount: '' })
    }
    this.setState({ userPassword: Users.userPassword })

  }

  //************************* Notification ***************************************************************
  async getNotification(level, message) {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: message,
      level: level
    });
  }

  //****** Email Address ***************************************************

  addUserEmail = async (event) => {
    this.setState({ highlightedUserEmail: false })
    var userChoice = await event.target.value;
    if (this.state.userEmail !== await userChoice) {
      this.setState({ userEmail: await userChoice });
      Users.userEmail = await userChoice;
    }

  };

  addUserPassword = async (event) => {
    this.setState({ highlightedUserPassword: false })
    var userChoice = await event.target.value;
    if (this.state.userPassword !== await userChoice) {
      this.setState({ userPassword: await userChoice });
      Users.userPassword = await userChoice;
      if (userChoice.toString().trim() !== '') {
        this.setState({ highlightedUserPassword: false });
        Users.isUserPasswordValid = true;

      }
      else {
        Users.isUserPasswordValid = false;
        this.setState({ highlightedUserPassword: true })
      }
    }

  };

  clickOnNextButton = async (event) => {
    if (await this.state.userEmail.toString().trim() === '') {
      return this.setState({ highlightedUserEmail: true })
    }
    else {
      var isValid = await String(this.state.userEmail)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      if (!await isValid) {
        this.setState({ highlightedUserEmail: true });
        Users.isUserEmailValid = false;
        return await this.getNotification('error', 'Email Address is not valid');
      }
    }
    if (!await Users.isUserExistOnServer) {
      this.setState({ isPageLoading: true });
      var isUserExist = await AuthGetter.isUserExistOnServer();
      this.setState({ isPageLoading: false });
      if (await isUserExist) {
        this.setState({ isUserExistOnServer: await Users.isUserExistOnServer });
        this.setState({ allAccountList: await Users.accounts });
        this.setState({ userSelectedAccount: await Users.userSelectedAccount });
      }
      else {
        this.setState({ highlightedUserEmail: true })
        return await this.getNotification('error', Config.ErrorMessage);
      }
    }
    else {
      if (!await Users.isUserPasswordValid) {
        return this.setState({ highlightedUserPassword: true })
      }
      if (await Users.userSelectedAccount.trim() === '') {
        return this.setState({ highlightedUserAccount: true })
      }
      this.setState({ isPageLoading: true });
      var isUserAuthenticated = await AuthGetter.authenticateUser();
      this.setState({ isPageLoading: false });
      if (await isUserAuthenticated) {
        this.setState({ isUserAuthenticated: await Users.isUserAuthenticated });
      }
      else {
        this.setState({ highlightedUserPassword: true })
        return await this.getNotification('error', 'Password does not match');
      }
    }
  }

  selectAccount = async (event) => {
    var dataChoive = await event.target.value;
    if (this.state.userSelectedAccount !== await dataChoive) {
      this.setState({ userSelectedAccount: await dataChoive });
      Users.userSelectedAccount = await dataChoive;
      Config.SelectedProject = await Users.userSelectedAccount;
    }

  };

  render() {
    return (
      <>
        <NotificationSystem ref={this.notificationSystem} />
        {this.state.isPageLoading && (<PageLoader sentences={LoaderMessage} height='100%' color="black" />)}
        {this.state.isUserAuthenticated && (<BrowserRouter basename={getBasename()}>
          <MainLayout breakpoint={this.props.breakpoint}>
            <React.Suspense fallback={<PageSpinner />}>
              <Routes>
                <Route path="/" element={<AboutUs />} />
                <Route path="/ui/dashboard" element={<DashboardPage />} />
                <Route path="/ui/cicd" element={<CICDPage />} />
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
        {!this.state.isUserAuthenticated && (<div class='row' style={{ 'justify-content': 'center', 'align-items': 'center' }}>
          <div class='col-md-6 col-lg-4'>
            <div class='card card-body'>
              <Form>
                <div className="text-center pb-4">
                  <img
                    src={logo}
                    className="rounded"
                    alt="logo" />
                </div>
                {!this.state.isUserExistOnServer && (<FormGroup>
                  <Label for="exampleEmail">Email</Label>
                  <Input name="email" type="input"  placeholder='your@email.com' invalid={this.state.highlightedUserEmail} value={this.state.userEmail} onChange={this.addUserEmail.bind(this)}>
                  </Input>
                </FormGroup>
                )}
                {this.state.isUserExistOnServer && (<FormGroup>
                  <Label>Password</Label>
                  <Input placeholder='your password' type='password' invalid={this.state.highlightedUserPassword} value={this.state.userPassword} onChange={this.addUserPassword.bind(this)}>
                  </Input>
                </FormGroup>
                )}
                {this.state.isUserExistOnServer && (<FormGroup>
                  <Label>Account</Label>
                  <Input type='select' name='account' value={this.state.userSelectedAccount} onChange={this.selectAccount.bind(this)}>
                    <DropDownOptions invalid={this.state.highlightedUserAccount} options={this.state.allAccountList} />
                  </Input>
                </FormGroup>
                )}
                <Button size="lg" color="black" block onClick={this.clickOnNextButton.bind(this)}> Next </Button>
              </Form>
            </div>
          </div>
        </div>)}</>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';


export default AuthForm;
