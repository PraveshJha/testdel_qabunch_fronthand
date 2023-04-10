import React from 'react';
import {
  MdLeaderboard,
  MdMonitor,
  MdKeyboardArrowDown,
  MdSettings,
  MdOutlineCloud,
  MdOutlineTakeoutDining,
  MdAssistantNavigation
} from 'react-icons/md';
import { ImLab, ImCommand, ImCodepen, ImLibrary,ImMan,ImBug } from "react-icons/im";
import { AiFillApi, AiOutlineShopping, AiOutlineDatabase,AiFillBulb,AiFillRobot } from "react-icons/ai";
import { NavLink } from 'react-router-dom';
import {
  Collapse,
  Nav,
  NavItem,
  Navbar,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from '../../utils/bemnames';
import { Config } from '../../QAautoMATER/Config';

const sidebarBackground = {
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const uiTestingComponents = [
  { to: '/ui/testscript', name: 'Test Script', exact: false, Icon: ImCommand },
  { to: '/ui/executionlab', name: 'Execution lab', exact: false, Icon: ImLab },
  // { to: '/ui/aiscript', name: 'Test script creation using AI', exact: false, Icon: ImCodepen },
  { to: '/ui/customfunction', name: 'Custom Page Function', exact: false, Icon: MdOutlineTakeoutDining },
  { to: '/ui/or', name: 'Object repository', exact: false, Icon: AiOutlineShopping },
  { to: '/ui/testdata', name: 'Test data', exact: false, Icon: AiOutlineDatabase },
  { to: '/ui/configuration', name: 'Configuration', exact: false, Icon: MdSettings }
];

const apiTestingComponents = [
  { to: '/api/testscript', name: 'Api Test Script', exact: false, Icon: ImCommand },
  { to: '/api/executionlab', name: 'Execution lab', exact: false, Icon: ImLab },
  { to: '/api/aiscript', name: 'Autoscript using documentation', exact: false, Icon: ImCodepen },
  { to: '/api/mockdata', name: 'Mock repository', exact: false, Icon: ImLibrary },
  { to: '/api/configuration', name: 'Configuration', exact: false, Icon: MdSettings }
];

const manualTestingComponents = [
  { to: '/mn/dashboard', name: 'Dashboard', exact: false, Icon: MdLeaderboard },
  { to: '/mn/testcase', name: 'Test Cases', exact: false, Icon: MdAssistantNavigation },
  { to: '/mn/testplan', name: 'Test Execution', exact: false, Icon: AiFillBulb },
  { to: '/mn/defects', name: 'Defect', exact: false, Icon: ImBug },
  { to: '/mn/configuration', name: 'Configuration', exact: false, Icon: MdSettings }
];

const automationTestingComponents = [
  { to: '/ui/dashboard', name: 'Dashboard', exact: true, Icon: MdLeaderboard },
  { to: '/ui/cicd', name: 'Ci/Cd', exact: true, Icon: AiFillApi }
];

// const navItems = [
//   { to: '/dashboard', name: 'Dashboard', exact: true, Icon: MdLeaderboard },
//   { to: '/cicd', name: 'Ci/Cd', exact: true, Icon: AiFillApi },
// ];

// const navDevItems = [
//   { to: '/aboutus', name: 'About us', exact: true, Icon: AiOutlineTeam },
// ];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: false,
    isOpenContents: true,
    isOpenPages: true,
    isUIComponentsOpen: false,
    isApiComponentsOpen: false,
    isManualComponentOpen: false,
    isAutomationComponentOpen: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  handleUIClick = () => () => {
    if (this.state.isUIComponentsOpen) {
      this.setState({ isUIComponentsOpen: false });
    }
    else {
      this.setState({ isUIComponentsOpen: true });
    }
    this.setState({ isApiComponentsOpen: false });

  };

  handleApiClick = () => () => {
    if (this.state.isApiComponentsOpen) {
      this.setState({ isApiComponentsOpen: false });
    }
    else {
      this.setState({ isApiComponentsOpen: true });
    }
    this.setState({ isUIComponentsOpen: false });
  };

  handleManualComponentClick = () => () => {
    if (this.state.isManualComponentOpen) {
      this.setState({ isManualComponentOpen: false });
    }
    else {
      this.setState({ isManualComponentOpen: true });
    }
  };

  handleAutomationComponentClick = () => () => {
    if (this.state.isAutomationComponentOpen) {
      this.setState({ isAutomationComponentOpen: false });
    }
    else {
      this.setState({ isAutomationComponentOpen: true });
    }
  };

  render() {
    return (
      <aside className={bem.b()}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <h4 className="text-black">
              QAautoMATER
            </h4>
          </Navbar>
          <Nav vertical>
            {/* {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="active"
                  tag={NavLink}
                  to={to}
                  exact={exact.toString()}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))} */}
            {/* <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleUIClick()}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdMonitor className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">UI Testing</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isUIComponentsOpen
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isUIComponentsOpen}>
              {uiTestingComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="active"
                    tag={NavLink}
                    to={to}
                    exact={exact.toString()}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse> */}
            {/* <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleApiClick()}>
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdOutlineCloud className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">Api Testing</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isApiComponentsOpen
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isApiComponentsOpen}>
              {apiTestingComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="active"
                    tag={NavLink}
                    to={to}
                    exact={exact.toString()}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse> */}
            {Config.isManualComponentDisplayed && (<NavItem
              className={bem.e('nav-item')}
              onClick={this.handleManualComponentClick()}>
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <ImMan className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">Manual</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isManualComponentOpen
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            )}
            {Config.isManualComponentDisplayed && (<Collapse isOpen={this.state.isManualComponentOpen}>
              {manualTestingComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="active"
                    tag={NavLink}
                    to={to}
                    exact={exact.toString()}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
            )}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleAutomationComponentClick()}>
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <AiFillRobot className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">Automation</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isAutomationComponentOpen
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isAutomationComponentOpen}>
              {automationTestingComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="active"
                    tag={NavLink}
                    to={to}
                    exact={exact.toString()}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
                          <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleUIClick()}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdMonitor className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">UI Testing</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isUIComponentsOpen
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isUIComponentsOpen}>
              {uiTestingComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="active"
                    tag={NavLink}
                    to={to}
                    exact={exact.toString()}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleApiClick()}>
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdOutlineCloud className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">Api Testing</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isApiComponentsOpen
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isApiComponentsOpen}>
              {apiTestingComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="active"
                    tag={NavLink}
                    to={to}
                    exact={exact.toString()}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
            </Collapse>
          </Nav>
          {/* <Nav vertical>
            {navDevItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="active"
                  tag={NavLink}
                  to={to}
                  exact={exact.toString()}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
          </Nav> */}

        </div>
      </aside>
    );
  }
}

export default Sidebar;
