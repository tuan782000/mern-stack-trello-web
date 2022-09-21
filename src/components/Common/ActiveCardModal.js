import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Container as BootstrapContainer, Row, Col, Modal, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { singleFileValidator } from 'utilities/validators'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from 'redux/user/userSlice'
import { updateCardInBoard } from 'redux/activeBoard/activeBoardSlice'
import {
  clearCurrentActiveCard,
  updateCurrentActiveCard,
  selectCurrentActiveCard
} from 'redux/activeCard/activeCardSlice'
import UserAvatar from 'components/Common/UserAvatar'
import UserSelectPopover from 'components/Common/UserSelectPopover'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'
import { updateCardAPI } from 'actions/ApiCall'
import { isEmpty } from 'lodash'
import moment from 'moment'

function ActiveCardModal() {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const currentUser = useSelector(selectCurrentUser)
  const currentActiveCard = useSelector(selectCurrentActiveCard)

  const [cardDescription, setCardDescription] = useState(currentActiveCard?.description)
  const [markdownMode, setMarkdownMode] = useState(false)

  const beforeUpdateCardTitle = (e) => {
    if (!e?.target?.value) {
      toast.error('Please enter card Title')
      return false
    }
    if (e?.target?.value === currentActiveCard?.title) {
      return false
    }
    updateCard({ title: e?.target?.value })
  }

  const beforeUpdateCardDescription = (e) => {
    disableMarkdownMode()
    if (e?.target?.value === currentActiveCard?.description) {
      return false
    }
    updateCard({ description: e?.target?.value })
  }

  const beforeUpdateCardCover = (e) => {
    const err = singleFileValidator(e.target?.files[0])
    if (err) {
      toast.error(err)
      e.target.value= ''
      return
    }

    let reqData = new FormData()
    reqData.append('cover', e.target?.files[0])

    toast.promise(
      updateCard(reqData)
        .then(() => e.target.value = '')
        .catch(() => e.target.value = ''),
      { pending: 'Updating...' }
    )
  }

  const beforeUpdateCardComment = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!e?.target?.value) {
        return false
      }

      const commentToUpdate = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: e?.target?.value
      }
      updateCard({ newComment: commentToUpdate })
      e.target.value = ''
    }
  }

  const updateCard = async (updateData) => {
    const updatedcard = await updateCardAPI(currentActiveCard._id, updateData)
    dispatch(updateCurrentActiveCard(updatedcard))
    dispatch(updateCardInBoard(updatedcard))
    return updateCard
  }

  const enableMarkdownMode = () => setMarkdownMode(true)
  const disableMarkdownMode = () => setMarkdownMode(false)

  const onClose = () => {
    dispatch(clearCurrentActiveCard())
  }

  return (
    <Modal
      show={currentActiveCard}
      onHide={onClose}
      backdrop="static"
      keyboard={true}
      animation={true}
      size="lg"
    >
      <Form className="common__form">
        <Modal.Body>
          <BootstrapContainer className="card__modal">
            { currentActiveCard?.cover &&
              <Row className="card__modal__cover">
                <Col>
                  <img
                    src={currentActiveCard.cover}
                    className="card__modal__cover__img"
                    alt="trungquandev-alt-img"
                  />
                </Col>
              </Row>
            }
            <Row className="card__modal__header mt-2">
              <span className="card__modal__header__subject_icon">
                <i className="fa fa-credit-card" />
              </span>
              <span className="card__modal__header__close_btn" onClick={onClose}>
                <i className="fa fa-close" />
              </span>
              <Col className="mb-3 px-5">
                <Form.Control
                  size="md"
                  type="text"
                  className="trungquandev-content-editable card__modal__header__title"
                  defaultValue={currentActiveCard?.title}
                  onBlur={beforeUpdateCardTitle}
                  onKeyDown={saveContentAfterPressEnter}
                  onClick={selectAllInlineText}
                  onMouseDown={e => e.preventDefault()}
                  spellCheck="false"
                />
              </Col>
            </Row>
            <Row className="card__modal__body">
              <Col md={9}>
                <div className="card__element__title">Members</div>
                <div className="member__avatars mb-4">
                  <div className="member__avatars__item">
                    <img src="https://trungquandev.com/wp-content/uploads/2021/01/trungquandev-avatar-2021.jpg" alt="avatar-trungquandev" title="trungquandev" />
                  </div>
                  <div className="member__avatars__item">
                    <img src="https://trungquandev.com/wp-content/uploads/2018/04/trungquandev-avatar.jpeg" alt="avatar-trungquandev" title="trungquandev" />
                  </div>
                  <div className="member__avatars__item">
                    <img src="https://trungquandev.com/wp-content/uploads/2019/03/trungquandev-avatar-01-scaled.jpg" alt="avatar-trungquandev" title="trungquandev" />
                  </div>
                  <div className="member__avatars__item">
                    <img src="https://trungquandev.com/wp-content/uploads/2017/03/aboutme.jpg" alt="avatar-trungquandev" title="trungquandev" />
                  </div>
                  <div className="member__avatars__item">
                    <img src="https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png" alt="avatar-trungquandev" title="trungquandev" />
                  </div>
                  <div className="member__avatars__item">
                    <UserSelectPopover />
                  </div>
                </div>
                <div className="card__modal__description mb-4">
                  <div className="card__modal__description__title mb-3">
                    <div><i className="fa fa-list" /></div>
                    <div>Description&nbsp;&nbsp;<i className="fa fa-edit enable-edit-description" onClick={enableMarkdownMode} /></div>
                  </div>
                  <div className="card__modal__description__content" data-color-mode="light">
                    {markdownMode
                      ? <div className="custom-markdown-editor">
                        <MDEditor
                          className="tqd-markdown-editor"
                          value={cardDescription}
                          onChange={setCardDescription}
                          onBlur={beforeUpdateCardDescription}
                          previewOptions={{
                            rehypePlugins: [[rehypeSanitize]]
                          }}
                          height={500}
                          preview="edit"
                          hideToolbar={true}
                          autoFocus={true}
                        />
                      </div>
                      : <div className="custom-markdown-preview" onClick={enableMarkdownMode}>
                        <MDEditor.Markdown source={cardDescription} />
                      </div>
                    }
                  </div>
                </div>
                <hr />
                <div className="card__modal__activity mb-4">
                  <div className="card__modal__activity__title mb-3">
                    <div><i className="fa fa-tasks" /></div>
                    <div>Activity & Comments</div>
                  </div>
                  <div className="card__modal__activity__content">
                    <div className="comment__form mb-4">
                      <div className="user-avatar">
                        <UserAvatar
                          user={currentUser}
                          width="32px"
                          height="32px"
                        />
                      </div>
                      <div className="write-comment">
                        <Form.Group controlId="card-comment-input" >
                          <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder="Write a comment..."
                            onKeyDown={beforeUpdateCardComment}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="comments__list">
                      {isEmpty(currentActiveCard?.comments) && <div style={{ marginLeft: '42px' }}>No comment here!</div>}
                      {currentActiveCard?.comments?.map((i, index) => (
                        <div className="comments__list__item" key={index}>
                          <div className="user-avatar">
                            <UserAvatar
                              user={{
                                displayName: i.userDisplayName,
                                avatar: i.userAvatar
                              }}
                              width="32px"
                              height="32px"
                            />
                          </div>
                          <div className="user-comment">
                            <div className="user-info">
                              <span className="username">{i.userDisplayName}</span>
                              <span className="datetime">{i.createdAt && moment(i.createdAt).format('llll')}</span>
                            </div>
                            <div className="comment-value">{i.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={3}>
                <div className="menu__group">
                  <div className="menu__group__title">Suggested</div>
                  <div className="menu__group__item">
                    <i className="fa fa-user-circle-o" /> Join
                  </div>
                </div>
                <div className="menu__group">
                  <div className="menu__group__title">Add to card</div>
                  <div className="menu__group__item">
                    <i className="fa fa-tag" /> Labels
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-check-square-o" /> Checklist
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-calendar" /> Dates
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-paperclip" /> Attachment
                  </div>
                  <Form.Group controlId="formBasicCardCover">
                    <Form.Label className='mb-0' style={{ cursor: 'pointer', width: '100%' }}>
                      <div className="menu__group__item">
                        <i className="fa fa-window-maximize" /> Cover
                      </div>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      style={{ display: 'none' }}
                      onChange={beforeUpdateCardCover}
                    />
                  </Form.Group>
                </div>
                <div className="menu__group">
                  <div className="menu__group__title">Power-Ups</div>
                  <div className="menu__group__item">
                    <i className="fa fa-google" /> Google Drive
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-plus" /> Add Power-Ups
                  </div>
                </div>
                <div className="menu__group">
                  <div className="menu__group__title">Automation</div>
                  <div className="menu__group__item">
                    <i className="fa fa-plus" /> Add Button
                  </div>
                </div>
                <div className="menu__group">
                  <div className="menu__group__title">Actions</div>
                  <div className="menu__group__item">
                    <i className="fa fa-arrows" /> Move
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-copy" /> Copy
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-wpforms" /> Make Template
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-eye" /> Watch
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-archive" /> Archive
                  </div>
                  <div className="menu__group__item">
                    <i className="fa fa-share-alt" /> Share
                  </div>
                </div>
              </Col>
            </Row>
          </BootstrapContainer>
        </Modal.Body>
      </Form>
    </Modal>
  )
}

export default ActiveCardModal