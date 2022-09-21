import React from 'react'
import { Container as BootstrapContainer, Row, Col } from 'react-bootstrap'
import './BoardBar.scss'
import { useSelector } from 'react-redux'
import { selectCurrentFullBoard } from 'redux/activeBoard/activeBoardSlice'
import UserAvatar from 'components/Common/UserAvatar'
import UserSelectPopover from 'components/Common/UserSelectPopover'

function BoardBar() {
  const board = useSelector(selectCurrentFullBoard)

  return (
    <nav className="navbar-board">
      <BootstrapContainer className="trungquandev-trello-container">
        <Row>
          <Col md={10} sm={12} className="col-no-padding">
            <div className="board-info">
              <div className="item board-logo-icon"><i className="fa fa-coffee" />&nbsp;&nbsp;<strong>{board?.title}</strong></div>
              <div className="divider"></div>

              <div className="item board-type">Private Workspace</div>
              <div className="divider"></div>

              <div className="item member__avatars">
                {board?.users.map((u, index) => {
                  if (index <= 2) {
                    return (
                      <div className="member__avatars__item" key={index}>
                        <UserAvatar
                          user={u}
                          width="28px"
                          height="28px"
                        />
                      </div>
                    )
                  }
                })}
                {(board?.totalUsers - 3) > 0 &&
                  <div className="member__avatars__item">
                    <UserSelectPopover
                      label={`+${board?.totalUsers - 3}`}
                      users={board?.users}
                    />
                  </div>
                }
                <div className="member__avatars__item">
                  <div className="invite">
                    <div className="invite__label">Invite</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={2} sm={12} className="col-no-padding">
            <div className="board-actions">
              <div className="item menu"><i className="fa fa-ellipsis-h mr-2" />Show menu</div>
            </div>
          </Col>
        </Row>
      </BootstrapContainer>
    </nav>
  )
}

export default BoardBar
