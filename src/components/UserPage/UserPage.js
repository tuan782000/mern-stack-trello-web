import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Tabs, Tab, Form, Button } from 'react-bootstrap'
import './UserPage.scss'
import UserAvatar from 'components/Common/UserAvatar'
import trelloAccountImg from 'resources/images/trello-account.svg'
import trelloSettingsImg from 'resources/images/trello-settings.png'
import trelloHelpImg from 'resources/images/trello-help.png'

import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, updateUserAPI } from 'redux/user/userSlice'
import {
  PASSWORD_RULE,
  fieldErrorMessage,
  PASSWORD_RULE_MESSAGE
} from 'utilities/validators'
import { toast } from 'react-toastify'

const UserPage = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // For multiple forms: https://stackoverflow.com/a/60277873/8324172
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      displayName: currentUser.displayName
    }
  })
  let navigate = useNavigate()

  let [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState('account')

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  const onSubmitGeneralInformation = data => {
    const { displayName } = data
    if (displayName === currentUser?.displayName) return

    toast.promise(dispatch(updateUserAPI({ displayName })), { pending: 'Updating ...' })
  }

  const onSubmitChangePassword = data => {
    const { currentPassword, newPassword, newPasswordConfirmation } = data
    if (!currentPassword || !newPassword || !newPasswordConfirmation) {
      toast.error('Please enter full password fields.')
      return
    }

    toast.promise(dispatch(updateUserAPI({ currentPassword, newPassword })), { pending: 'Updating ...' })
      .then((res) => {
        setValue('currentPassword', null),
        setValue('newPassword', null),
        setValue('newPasswordConfirmation', null)
      })
  }

  const handleSelectTab = (selectedTab) => {
    navigate({
      search: `?${createSearchParams({ tab: selectedTab })}`
    })
  }

  return (
    <>
      <div className="user__page__header">
        <div className="avatar">
          <Form className="common__form">
            <Form.Group controlId="formBasicFile">
              <Form.Label className='mb-0'>
                <UserAvatar
                  username="quando"
                  width="50px"
                  height="50px"
                  fontSize="18px"
                  tooltip="Click to change your avatar!"
                />
              </Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Form>
        </div>
        <div className="display-name">{currentUser.displayname}</div>
        <div className="username">@{currentUser.username}</div>
      </div>
      <div className="user__page__content">
        <Tabs activeKey={activeTab} className="user__tabs" onSelect={handleSelectTab}>
          <Tab eventKey="account" title="Account">
            <div className="tab-inner-content mt-5 account">
              <div className="media">
                <img className="panel__image" src={trelloAccountImg} alt="" />
              </div>
              <div className="notice mt-5">
                <h4>Manage your personal information</h4>
                <div className="notice__message">
                  <p>This is an awesome <a href="https://trungquandev.com/khoa-hoc-lap-trinh-mern-stack-100-du-an-thuc-te-chat-luong/" target="blank" style={{ 'textDecoration': 'none' }}>MERN Stack course</a> in the field of programming. This course teach everyone how to create a Trello web app clone.</p>
                  <p className="mb-0">To learn more, view our <a href="#" target="blank" style={{ 'textDecoration': 'none' }}>Terms of Service</a> or <a href="#" target="blank" style={{ 'textDecoration': 'none' }}>Privacy Policy</a>.</p>
                </div>
              </div>
              <Form className="common__form mt-5" onSubmit={handleSubmit(onSubmitGeneralInformation)}>
                <h5><strong>General Information</strong></h5>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name="email" value={currentUser.email} disabled />
                  <Form.Text className="text-muted">
                    We will never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={currentUser.username} disabled />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your display name..."
                    {...register('displayName', {
                      minLength: { value: 3, message: 'Min Length is 3 characters' },
                      maxLength: { value: 50, message: 'Max Length is 50 characters' }
                    })}
                  />
                  {fieldErrorMessage(errors, 'displayName')}
                </Form.Group>

                <Form.Group className="mb-5 text-right">
                  <Button variant="success" type="submit">Update</Button>
                </Form.Group>
              </Form>

              <Form className="common__form mb-5" onSubmit={handleSubmit(onSubmitChangePassword)}>
                <h5 className="mt-4"><strong>Change Password</strong></h5>
                <Form.Group className="mb-3" controlId="formBasicCurrentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    {...register('currentPassword', {
                      pattern: {
                        value: PASSWORD_RULE,
                        message: PASSWORD_RULE_MESSAGE
                      }
                    })}
                  />
                  {fieldErrorMessage(errors, 'currentPassword')}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    {...register('newPassword', {
                      pattern: {
                        value: PASSWORD_RULE,
                        message: PASSWORD_RULE_MESSAGE
                      }
                    })}
                  />
                  {fieldErrorMessage(errors, 'newPassword')}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicNewPasswordConfirmation">
                  <Form.Label>New Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    {...register('newPasswordConfirmation', {
                      validate: (value) => value === watch('newPassword') || 'New Password Confirmation does not match.'
                    })}
                  />
                  {fieldErrorMessage(errors, 'newPasswordConfirmation')}
                </Form.Group>

                <Form.Group className="mb-5 text-right">
                  <Button variant="success" type="submit">Change Password</Button>
                </Form.Group>
              </Form>
            </div>
          </Tab>

          <Tab eventKey="settings" title="Settings">
            <div className="tab-inner-content my-5 settings">
              <div className="media">
                <img className="panel__image" src={trelloSettingsImg} alt="" />
              </div>
              <div className="notice mt-5">
                <h4>System Settings</h4>
                <div className="notice__message">
                  <p>This is an awesome <a href="https://trungquandev.com/khoa-hoc-lap-trinh-mern-stack-100-du-an-thuc-te-chat-luong/" target="blank" style={{ 'textDecoration': 'none' }}>MERN Stack course</a> in the field of programming. This course teach everyone how to create a Trello web app clone.</p>
                  <p>To learn more, view our <a href="#" target="blank" style={{ 'textDecoration': 'none' }}>Terms of Service</a> or <a href="#" target="blank" style={{ 'textDecoration': 'none' }}>Privacy Policy</a>.</p>
                  <p>Author: <strong>Trungquandev Official</strong></p>
                  <p>Blog: <a href="https://trungquandev.com" target="blank" style={{ 'textDecoration': 'none' }}>https://trungquandev.com</a></p>
                  <p>CV: <a href="https://cv.trungquandev.com" target="blank" style={{ 'textDecoration': 'none' }}>https://cv.trungquandev.com</a></p>
                  <p>Yoututbe: <a href="https://www.youtube.com/c/TrungquandevOfficial" target="blank" style={{ 'textDecoration': 'none' }}>https://www.youtube.com/c/TrungquandevOfficial</a></p>
                </div>
              </div>
            </div>
          </Tab>

          <Tab eventKey="help" title="Help">
            <div className="tab-inner-content mt-5 help">
              <div className="media">
                <img className="panel__image" src={trelloHelpImg} alt="" />
              </div>
              <div className="notice mt-5">
                <h4>Any Questions?</h4>
                <div className="notice__message">
                  <p>This is an awesome <a href="https://trungquandev.com/khoa-hoc-lap-trinh-mern-stack-100-du-an-thuc-te-chat-luong/" target="blank" style={{ 'textDecoration': 'none' }}>MERN Stack course</a> in the field of programming. This course teach everyone how to create a Trello web app clone.</p>
                  <p>To learn more, view our <a href="#" target="blank" style={{ 'textDecoration': 'none' }}>Terms of Service</a> or <a href="#" target="blank" style={{ 'textDecoration': 'none' }}>Privacy Policy</a>.</p>
                  <p>Author: <strong>Trungquandev Official</strong></p>
                  <p>Blog: <a href="https://trungquandev.com" target="blank" style={{ 'textDecoration': 'none' }}>https://trungquandev.com</a></p>
                  <p>CV: <a href="https://cv.trungquandev.com" target="blank" style={{ 'textDecoration': 'none' }}>https://cv.trungquandev.com</a></p>
                  <p>Yoututbe: <a href="https://www.youtube.com/c/TrungquandevOfficial" target="blank" style={{ 'textDecoration': 'none' }}>https://www.youtube.com/c/TrungquandevOfficial</a></p>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  )
}

export default UserPage
