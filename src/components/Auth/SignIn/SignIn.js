import React from 'react'

function SignIn() {
  return (
    <form className="auth__form form__sign-in">
      <h2 className="auth__form__title">Sign In</h2>
      <div className="auth__form__input-field">
        <i className="fa fa-envelope"></i>
        <input type="email" name="email" placeholder="Email" required />
      </div>
      <div className="auth__form__input-field">
        <i className="fa fa-lock"></i>
        <input type="password" name="password" placeholder="Password" required />
      </div>

      <button className="auth__form__submit" type="button">Login</button>
    </form>
  )
}

export default SignIn