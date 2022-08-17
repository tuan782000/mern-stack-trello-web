import React from 'react'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE,
  fieldErrorMessage
} from 'utilities/validators'
import { signUpUserApi } from 'actions/ApiCall'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const onSubmitSignUp = (data) => {
    toast.promise(signUpUserApi(data), { pending: 'Signin up ...' })
      .then(user => {
        navigate(`/signIn?successEmail=${user.email}`, { replace: true })
      })
  }

  return (
    <form className="auth__form form__sign-up" onSubmit={handleSubmit(onSubmitSignUp)}>
      <h2 className="auth__form__title">Sign Up</h2>
      <div className="auth__form__input-field">
        <i className="fa fa-envelope"></i>
        <input
          type="text"
          placeholder="Email"
          {...register('email', {
            required: FIELD_REQUIRED_MESSAGE,
            pattern: {
              value: EMAIL_RULE,
              message: EMAIL_RULE_MESSAGE
            }
          })}
        />
      </div>
      {fieldErrorMessage(errors, 'email')}

      <div className="auth__form__input-field">
        <i className="fa fa-lock"></i>
        <input
          type="password" name="password"
          placeholder="Password"
          {...register('password', {
            required: FIELD_REQUIRED_MESSAGE,
            pattern: {
              value: PASSWORD_RULE,
              message: PASSWORD_RULE_MESSAGE
            }
          })}
        />
      </div>
      {fieldErrorMessage(errors, 'password')}

      <div className="auth__form__input-field">
        <i className="fa fa-lock"></i>
        <input
          type="password"
          placeholder="Password Confirmation"
          {...register('password_confirmation', {
            validate: (value) => value === watch('password') || 'Password Confirmation does not match.'
          })}
        />
      </div>
      {fieldErrorMessage(errors, 'password_confirmation')}

      <button className="auth__form__submit" type="submit">Sign Up</button>
    </form>
  )
}

export default SignUp