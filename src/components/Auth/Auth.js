import React from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'

import './Auth.scss'
import authSignUpBg from 'resources/images/auth-sign-up-bg.webp'
import authSignInBg from 'resources/images/auth-sign-in-bg.png'
import SignIn from './SignIn/SignIn'
import SignUp from './SignUp/SignUp'

import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from 'redux/user/userSlice'

function Auth() {
  const location = useLocation()
  const signUpMode = location.pathname === '/signUp'

  const isAuthenticated = useSelector(selectIsAuthenticated)
  if (isAuthenticated) {
    return <Navigate to='/' replace={true} />
  }

  return (
    <div className={`auth__container ${signUpMode ? 'sign-up-mode': ''}`}>
      <div className="auth__container__forms">
        <div className="auth__form-area">
          <SignIn/>
          <SignUp/>
        </div>
      </div>
      <div className="auth__container__panels">
        <div className="panel panel__left">
          <div className="panel__content">
            <h3 className="panel__title">New here ?</h3>
            <p className="panel__paragraph">
              Enter your personal details and start journey with us
            </p>
            <Link to="/signUp">
              <button className="auth__btn auth__btn-transparent" id="sign-up-btn">
                Sign Up
              </button>
            </Link>
          </div>
          <img className="panel__image" src={authSignUpBg} alt="" />
        </div>
        <div className="panel panel__right">
          <div className="panel__content">
            <h3 className="panel__title">One of us ?</h3>
            <p className="panel__paragraph">
              To keep connected with us please login with your personal info
            </p>
            <Link to="/signIn">
              <button className="auth__btn auth__btn-transparent" id="sign-in-btn">
                Sign In
              </button>
            </Link>
          </div>
          <img className="panel__image" src={authSignInBg} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Auth
