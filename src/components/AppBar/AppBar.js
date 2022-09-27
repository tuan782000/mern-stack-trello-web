import React, { useEffect } from 'react'
import './AppBar.scss'
import { Container as BootstrapContainer, Row, Col, InputGroup, FormControl, Dropdown, Button, Badge } from 'react-bootstrap'
import trungquandevLogo from 'resources/images/logo-trungquandev-transparent-bg-192x192.png'
import UserAvatar from 'components/Common/UserAvatar'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, signOutUserAPI } from 'redux/user/userSlice'
import { Link } from 'react-router-dom'
import { selectCurrentNotifications, fetchInvitationsAPI } from 'redux/notifications/notificationsSlice'
import { isEmpty } from 'lodash'
import moment from 'moment'

function AppBar() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const notifications = useSelector(selectCurrentNotifications)

  useEffect(() => {
    dispatch(fetchInvitationsAPI())
  }, [dispatch])

  return (
    <nav className="navbar-app">
      <BootstrapContainer className="trungquandev-trello-container">
        <Row>
          <Col md={5} sm={6} xs={12} className="col-no-padding">
            <div className="app-actions">
              <div className="item all"><i className="fa fa-th" /></div>
              <div className="item home"><i className="fa fa-home" /></div>
              <div className="item boards">
                <Link to={`/u/${user?.username}/boards?currentPage=1`}>
                  <i className="fa fa-columns" />&nbsp;&nbsp;<strong>Boards</strong>
                </Link>
              </div>
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
              <div className="item notification">
                <div className='common-dropdown'>
                  <Dropdown autoClose="outside">
                    <Dropdown.Toggle id="dropdown-basic" size="sm">
                      {/* <i className="fa fa-bell icon" /> */}
                      <i className="fa fa-bell icon ring" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <div className="notification__item__header">
          Notifications
                      </div>

                      <div className="notification__item__wrapper">
                        {isEmpty(notifications) &&
                             <Dropdown.Item className="notification__item">
                               <div className="notification__item__content">You have no new notification.</div>
                             </Dropdown.Item>
                        }
                        {notifications?.map((notification, index) => {
                          if (notification.type === 'BOARD_INVITATION') {
                            return (
                              <Dropdown.Item className="notification__item" key={index}>
                                <div className="notification__item__content">
                                  <strong>{notification?.inviter?.displayName}</strong> had invited you to join the board: <strong>{notification?.board?.title}</strong>
                                </div>
                                {notification?.boardInvitation?.status === 'PENDING' &&
                                  <div className="notification__item__actions">
                                    <Button variant="success" type="button" size="sm" className="px-4">Accept</Button>
                                    <Button variant="secondary" type="button" size="sm" className="px-4">Reject</Button>
                                  </div>
                                }
                                {notification?.boardInvitation?.status === 'ACCEPTED' &&
                                  <div className="notification__item__actions">
                                    <Badge bg="success">Accepted</Badge>
                                  </div>
                                }
                                {notification?.boardInvitation?.status === 'REJECTED' &&
                                  <div className="notification__item__actions">
                                    <Badge bg="secondary">Rejected</Badge>
                                  </div>
                                }
                                <div className="notification__item__actions">
                                  {/* <Badge bg="info">Wed, Sep 21, 2022 9:05 PM</Badge> */}
                                  <Badge bg="info">{notification.createdAt && moment(notification.createdAt).format('llll')}</Badge>
                                </div>
                              </Dropdown.Item>
                            )
                          }
                        })}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

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
