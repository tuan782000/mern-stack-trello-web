import React, { useState } from 'react'
import { Container as BootstrapContainer, Row, Col, Modal, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { fieldErrorMessage } from 'utilities/validators'
import { useSelector } from 'react-redux'
import {
  selectCurrentUser
} from 'redux/user/userSlice'
import UserAvatar from 'components/Common/UserAvatar'
import UserSelectPopover from 'components/Common/UserSelectPopover'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'

function ActiveCardModal() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const currentUser = useSelector(selectCurrentUser)

  const mkdStr = `
  # Markdown Editor
  
  ---
  
  **Hello world!!!**
  
  [![](https://avatars.githubusercontent.com/u/1680273?s=80&v=4)](https://avatars.githubusercontent.com/u/1680273?v=4)
  
  \`\`\`javascript
  import React from "react";
  import ReactDOM from "react-dom";
  import MEDitor from '@uiw/react-md-editor';
  
  \`\`\`
  `
  let currentCard = {
    title: 'Làm tí coffee không?',
    description: mkdStr
  }
  const [cardDescription, setCardDescription] = useState(currentCard.description)
  const [markdownMode, setMarkdownMode] = useState(false)

  const handleCardTitleChange = () => {
    console.log('card title change ne')
  }
  const debounceUpdateCardTitle = () => {
    console.log('goi api update card title ne')
  }

  const debounceUpdateCardDescription = () => {
    console.log(cardDescription)
    disableMarkdownMode()
  }
  const enableMarkdownMode = () => setMarkdownMode(true)
  const disableMarkdownMode = () => setMarkdownMode(false)

  return (
    <Modal
      show={true}
      // onHide={onClose}
      backdrop="static"
      keyboard={true}
      animation={true}
      size="lg"
    >
      <Form className="common__form">
        <Modal.Body>
          <BootstrapContainer className="card__modal">
            <Row className="card__modal__cover">
              <Col>
                <img
                  src="https://trungquandev.com/wp-content/uploads/2021/05/trungquandev-cover-animation-scaled.jpg"
                  className="card__modal__cover__img"
                  alt="trungquandev-alt-img"
                />
              </Col>
            </Row>
            <Row className="card__modal__header">
              <span className="card__modal__header__subject_icon">
                <i className="fa fa-credit-card" />
              </span>
              <span className="card__modal__header__close_btn">
                <i className="fa fa-close" />
              </span>
              <Col className="mb-3 px-5">
                <Form.Control
                  size="md"
                  type="text"
                  className="trungquandev-content-editable card__modal__header__title"
                  defaultValue={currentCard.title}
                  onChange={handleCardTitleChange}
                  onBlur={debounceUpdateCardTitle}
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
                    <div>Description</div>
                  </div>
                  <div className="card__modal__description__content" data-color-mode="light">
                    {markdownMode
                      ? <div className="custom-markdown-editor">
                        <MDEditor
                          className="tqd-markdown-editor"
                          value={cardDescription}
                          onChange={setCardDescription}
                          onBlur={debounceUpdateCardDescription}
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
                          <Form.Control as="textarea" rows={1} placeholder="Write a comment..." />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="comments__list">
                      <div className="comments__list__item">
                        <div className="user-avatar">
                          <UserAvatar
                            user={currentUser}
                            width="32px"
                            height="32px"
                          />
                        </div>
                        <div className="user-comment">
                          <div className="user-info">
                            <span className="username">Trungquandev Official</span>
                            <span className="datetime">Jun 21 at 10:39 PM</span>
                          </div>
                          <div className="comment-value">This is an example comment!</div>
                        </div>
                      </div>
                      <div className="comments__list__item">
                        <div className="user-avatar">
                          <UserAvatar
                            user={currentUser}
                            width="32px"
                            height="32px"
                          />
                        </div>
                        <div className="user-comment">
                          <div className="user-info">
                            <span className="username">Trungquandev Official</span>
                            <span className="datetime">Jun 21 at 10:39 PM</span>
                          </div>
                          <div className="comment-value">This is an example comment!</div>
                        </div>
                      </div>
                      <div className="comments__list__item">
                        <div className="user-avatar">
                          <UserAvatar
                            user={currentUser}
                            width="32px"
                            height="32px"
                          />
                        </div>
                        <div className="user-comment">
                          <div className="user-info">
                            <span className="username">Trungquandev Official</span>
                            <span className="datetime">Jun 21 at 10:39 PM</span>
                          </div>
                          <div className="comment-value">This is an example comment!</div>
                        </div>
                      </div>
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
                  <div className="menu__group__item">
                    <i className="fa fa-window-maximize" /> Cover
                  </div>
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