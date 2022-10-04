import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import './BoardBar.scss'
import { useSelector } from 'react-redux'
import { selectCurrentFullBoard } from 'redux/activeBoard/activeBoardSlice'
import UserAvatar from 'components/Common/UserAvatar'
import UserSelectPopover from 'components/Common/UserSelectPopover'
import {
  EMAIL_RULE,
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE_MESSAGE,
  fieldErrorMessage
} from 'utilities/validators'
import { inviteUserToBoardAPI } from 'actions/ApiCall'
import { socketIoInstance } from 'index'

function BoardBar() {
  const board = useSelector(selectCurrentFullBoard)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const [showInvitePopup, setShowInvitePopup] = useState(false)
  const toggleShowInvitePopup = () => setShowInvitePopup(!showInvitePopup)

  const onSubmitInvitation = (data) => {
    const { inviteeEmail } = data
    const boardId = board._id

    inviteUserToBoardAPI({ inviteeEmail, boardId })
      .then((invitation) => {
        setValue('inviteeEmail', null)
        socketIoInstance.emit('c_user_invited_to_board', invitation)
      })
  }

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
                    <div className="invite__label" onClick={toggleShowInvitePopup}>Invite</div>
                    {showInvitePopup &&
                     <div className="invite__popup">
                       <span className="invite__popup__close_btn" onClick={toggleShowInvitePopup}>
                         <i className="fa fa-close" />
                       </span>
                       <div className="invite__popup__title mb-2">Invite user to this board!</div>
                       <div className="invite__popup__form">
                         <Form className="common__form" onSubmit={handleSubmit(onSubmitInvitation)}>
                           <Form.Control
                             type="text"
                             className="invite__field mb-2"
                             placeholder="Enter email to invite..."
                             {...register('inviteeEmail', {
                               required: FIELD_REQUIRED_MESSAGE,
                               pattern: {
                                 value: EMAIL_RULE,
                                 message: EMAIL_RULE_MESSAGE
                               }
                             })}
                           />
                           {fieldErrorMessage(errors, 'inviteeEmail')}
                           <Form.Group className="text-right">
                             <Button variant="success" type="submit" size="sm" className="px-4 tqd-send">Invite</Button>
                           </Form.Group>
                         </Form>
                       </div>
                     </div>
                    }
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
