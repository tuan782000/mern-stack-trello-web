import React from 'react'
import './AppBar.scss'
import { Container as BootstrapContainer, Row, Col, InputGroup, FormControl, Dropdown } from 'react-bootstrap'
import trungquandevLogo from 'resources/images/logo-trungquandev-transparent-bg-192x192.png'
import UserAvatar from 'components/Common/UserAvatar'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, signOutUserAPI } from 'redux/user/userSlice'
import { Link } from 'react-router-dom'

function AppBar() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)

  return (
    <nav className="navbar-app">
      <BootstrapContainer className="trungquandev-trello-container">
        <Row>
          <Col md={5} sm={6} xs={12} className="col-no-padding">
            <div className="app-actions">
              <div className="item all"><i className="fa fa-th" /></div>
              <div className="item home"><i className="fa fa-home" /></div>
              <div className="item boards"><i className="fa fa-columns" />&nbsp;&nbsp;<strong>Boards</strong></div>
              <div className="item search">
                <InputGroup className="group-search">
                  <FormControl
                    className="input-search"
                    placeholder="Jump to..."
                  />
                  <InputGroup.Text className="input-icon-search"><i className="fa fa-search" /></InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </Col>
          <Col md={2} sm={2} xs={12} className="col-no-padding">
            <div className="app-branding text-center">
              <a href="https://github.com/tuan782000" target="blank">
                <img src={trungquandevLogo} className="top-logo" alt="trunguandev-logo" />
                <span className="trungquandev-slogan">Trello Web APP</span>
              </a>
            </div>
          </Col>
          <Col md={5} sm={4} xs={12} className="col-no-padding">
            <div className="user-actions">
              <div className="item quick"><i className="fa fa-plus-square-o" /></div>
              <div className="item news"><i className="fa fa-info-circle" /></div>
              <div className="item notification"><i className="fa fa-bell-o" /></div>
              {user &&
                <div className="item user-avatar">
                  <div className='common-dropdown'>
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic" size="sm">
                        <UserAvatar user={user}/>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          className="account tqd-send"
                          as={Link}
                          to={`/u/${user?.username}?tab=account`}
                        >
                          <i className="icon fa fa-user" />Account
                        </Dropdown.Item>

                        <Dropdown.Item
                          className="settings tqd-send"
                          as={Link}
                          to={`/u/${user?.username}?tab=settings`}
                        >
                          <i className="icon fa fa-cog" />Settings
                        </Dropdown.Item>

                        <Dropdown.Item
                          className="help tqd-send"
                          as={Link}
                          to={`/u/${user?.username}?tab=help`}
                        >
                          <i className="icon fa fa-question-circle" />Help
                        </Dropdown.Item>

                        <Dropdown.Item
                          className="sign-out tqd-send"
                          onClick={() => dispatch(signOutUserAPI())}
                        >
                          <i className="icon danger fa fa-sign-out" />Sign out
                        </Dropdown.Item>

                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              }
            </div>
          </Col>
        </Row>
      </BootstrapContainer>
    </nav>
  )
}

export default AppBar
