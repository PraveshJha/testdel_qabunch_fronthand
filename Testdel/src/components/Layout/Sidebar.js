import sidebarBgImage from 'assets/img/sidebar/LeftNavBack.JPG';
import SourceLink from 'components/SourceLink';
import React from 'react';
import {
  MdDashboard,
  MdExtension,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdViewList,
  MdWidgets,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};
/*
const WebMaintenanceComponents = [
  { to: '/auweb/testattribute', name: 'Test Attribute', exact: false, Icon: MdViewList },
  {to: '/auweb/locatorproperty',name: 'Locator Property',exact: false,Icon: MdViewList,},
  {to: '/auweb/testdata',name: 'Test Data',exact: false,Icon: MdViewList,},
  {to: '/auweb/updatetestscript',name: 'Update Test Script',exact: false,Icon: MdViewList,},
  {to: '/auweb/customfunction',name: 'Custom Function',exact: false,Icon: MdViewList,},
  { to: '/auweb/seleniumgrid', name: 'Selenium Grid', exact: false, Icon: MdViewList },
  { to: '/auweb/configuration', name: 'Configuration Setup', exact: false, Icon: MdViewList },
];
*/
const WebMaintenanceComponents = [
  { to: '/auwebtestattribute', name: 'Test Attribute', exact: false, Icon: MdViewList },
  {to: '/auweblocatorproperty',name: 'Locator Property',exact: false,Icon: MdViewList,},
  {to: '/auwebtestdata',name: 'Test Data',exact: false,Icon: MdViewList,},
  {to: '/auwebupdatetestscript',name: 'Update Test Script',exact: false,Icon: MdViewList,},
  {to: '/auwebcustomfunction',name: 'Custom Function',exact: false,Icon: MdViewList,},
  { to: '/auwebseleniumgrid', name: 'Selenium Grid', exact: false, Icon: MdViewList },
  { to: '/auwebconfiguration', name: 'Configuration Setup', exact: false, Icon: MdViewList },
];

//const pageContents = [
 // { to: '/login', name: 'login / signup', exact: false, Icon: MdAccountCircle },
 // {
  //  to: '/login-modal',
  //  name: 'login modal',
   // exact: false,
    //Icon: MdViewCarousel,
 // },
//];

/*
const WebnavItems = [
  { to: '/auweb/dashboard', name: 'dashboard', exact: false, Icon: MdDashboard },
  { to: '/auweb/executionlabpage', name: 'Execution Lab', exact: false, Icon: MdInsertChart },
  { to: '/auweb/testscripts', name: 'Test Scripts', exact: false, Icon: MdWidgets },
  { to: '/auweb/cicd', name: 'CI/CD Support', exact: false, Icon: MdWidgets }
];
*/
const WebnavItems = [
  { to: '/auwebdashboard', name: 'dashboard', exact: false, Icon: MdDashboard },
  { to: '/auwebexecutionlabpage', name: 'Execution Lab', exact: false, Icon: MdInsertChart },
  { to: '/auwebtestscripts', name: 'Test Scripts', exact: false, Icon: MdWidgets },
  { to: '/auwebcicd', name: 'CI/CD Support', exact: false, Icon: MdWidgets }
];

/*
const APInavItems = [
  { to: '/auapi/dashboard', name: 'dashboard', exact: false, Icon: MdDashboard },
  { to: '/auapi/apiscripts', name: 'API Scripts', exact: false, Icon: MdWidgets },
  { to: '/auapi/updateapiscripts', name: 'Update API Scripts', exact: false, Icon: MdWidgets },
  { to: '/auapi/executionlabpage', name: 'Execution Lab', exact: false, Icon: MdInsertChart },
  { to: '/auapi/cicd', name: 'CI/CD Support', exact: false, Icon: MdWidgets },
  { to: '/auapi/configuration', name: 'Configuration', exact: false, Icon: MdWidgets }
  
];
*/
const APInavItems = [
  { to: '/auapidashboard', name: 'dashboard', exact: false, Icon: MdDashboard },
  { to: '/auapiapiscripts', name: 'API Scripts', exact: false, Icon: MdWidgets },
  { to: '/auapiupdateapiscripts', name: 'Update API Scripts', exact: false, Icon: MdWidgets },
  { to: '/auapiswaggerscripts', name: 'API Scripts using Swagger', exact: false, Icon: MdWidgets },
  { to: '/auapiexecutionlabpage', name: 'Execution Lab', exact: false, Icon: MdInsertChart },
  { to: '/auapicicd', name: 'CI/CD Support', exact: false, Icon: MdWidgets },
  { to: '/auapiconfiguration', name: 'Configuration', exact: false, Icon: MdWidgets }
  
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: false,
    isOpenContents: false,
    isOpenPages: false,
    IsOpenWeb:false,
    IsOpenMob:false,
    IsOpenAPI:false,
    IsOpenWebMaintenance:false,

  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];
      console.log(name)
      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  handleClickAPI(event)
  {
    var PreviousState= this.state.IsOpenAPI;
    if(PreviousState)
    {
      this.setState({IsOpenAPI :false});
    }
    else
    {
      this.setState({IsOpenAPI :true});
    }
  }
  handleClickWeb(event)
  {
    var PreviousState= this.state.IsOpenWeb;
    if(PreviousState)
    {
      this.setState({IsOpenWeb :false});
      this.setState({IsOpenWebMaintenance :false});
    }
    else
    {
      this.setState({IsOpenWeb :true});
    }
  }

  handleClickMobile(event)
  {
    var PreviousState= this.state.IsOpenMob;
    if(PreviousState)
    {
      this.setState({IsOpenMob :false});
    }
    else
    {
      this.setState({IsOpenMob :true});
    }
  }

  handleClickWebMaintenance(event)
  {
    var PreviousState= this.state.IsOpenWebMaintenance;
    if(PreviousState)
    {
      this.setState({IsOpenWebMaintenance :false});
    }
    else
    {
      this.setState({IsOpenWebMaintenance :true});
    }
  }



  render() {
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <span className="text-white">
                QA Automator
              </span>
            </SourceLink>
          </Navbar>
          <Nav vertical>
            <NavItem
              onClick={this.handleClickWeb.bind(this)}
              className={bem.e('nav-item')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                <MdExtension className={bem.e('nav-item-icon')} Icon={sidebarBgImage} />
                  <span className=" align-self-start">Web Testing</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.IsOpenWeb
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.IsOpenWeb}>
              {WebnavItems.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
                <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClickWebMaintenance.bind(this)}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <span className=" align-self-start">Maintenance</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.IsOpenWebMaintenance
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.IsOpenWebMaintenance}>
              {WebMaintenanceComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
        
            </Collapse>
            <NavItem
              onClick={this.handleClickAPI.bind(this)}
              className={bem.e('nav-item')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdExtension className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">API Testing</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.IsOpenAPI
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.IsOpenAPI}>
              {APInavItems.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
