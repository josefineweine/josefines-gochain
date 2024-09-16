import React, { useState } from 'react'
import { login, register } from '../services/auth';
import { Popup } from './Popup';

export const Login = ({setShowLogin, setUserInfo, setUpdateHeader, updateHeader}) => {

  const [loginInfo, setLoginInfo] = useState({})
  const [signupInfo, setSignupInfo] = useState({})
  const [showSignup, setShowSignup] = useState(false)
  const [displayPopup, setDisplayPopup] = useState("")

  const handleChangeLogin = (e) => {
    const { name, value } = e.target
    setLoginInfo(prev => ({...prev, [name]: value}))
  }

  const handleChangeSignup = (e) => {
    let { name, value } = e.target
    setSignupInfo(prev => ({...prev, [name]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(showSignup) {

      try {
        const response = await register(signupInfo);

        if(response.statusCode === 201) {
          localStorage.setItem("loginInfo", response.token)
          setUpdateHeader(prevState => !prevState)
          setShowLogin(false)
        } else {
          return setDisplayPopup({title: "Error", text: response.error || "Sign-up error"});
        }
      } catch (error) {
        return setDisplayPopup({title: "Error", text: "Server error"});
      }

    } else {

      try {
        const response = await login(loginInfo);

        if(response.statusCode === 200) {
          localStorage.setItem("loginInfo", response.token)
          setUpdateHeader(prevState => !prevState)
          setShowLogin(false)
        } else {
          return setDisplayPopup({title: "Error", text: response.error});
        }
      } catch (error) {
        return setDisplayPopup({title: "Error", text: "Server error"});
      }
    }    
  }

  const cancel = () => { 
    document.getElementById("login-form").reset();
  }

  const handleClickSignup = (e) => {
    e.preventDefault();
    cancel()
    setShowSignup(true)
  }

  return (
    <>
    <div className="login-wrapper">
      {showSignup === false ? (
      <div className="login-frame">
        <button className="exit-button" onClick={() => setShowLogin(false)}>X</button>
        <form onSubmit={handleSubmit} id="login-form">
          <h2>SIGN IN</h2>
          <div className="form-control">
            <label htmlFor="login-input-email">E-mail:</label>
            <input type="text" id="login-input-email" name="email" onChange={handleChangeLogin} autoComplete="off"></input>
          </div>
          <div className="form-control">
            <label htmlFor="login-input-password">Password:</label>
            <input type="password" id="login-input-password" name="password" onChange={handleChangeLogin} autoComplete="off"></input>
          </div>
          <div className="button-control">
          <button className="application-button">Login</button>
          </div>
        </form>
        <div className="sign-up-button-wrapper">
        <span>Create Account</span>
          <div className="button-control">
            <button className="application-button" onClick={handleClickSignup}>Sign up</button>
          </div>
        </div>
      </div>
      ) : (
        <div className="sign-up-frame">
        <button className="exit-button" onClick={() => setShowLogin(false)}>X</button>
        <form onSubmit={handleSubmit} id="signup-form">
          <h2>Provide your sign-up details</h2>
          <div className="form-control">
            <label htmlFor="signup-input-email">Email</label>
            <input type="text" id="signup-input-email" name="email" onChange={handleChangeSignup} autoComplete="off"></input>
          </div>
          <div className="form-control">
            <label htmlFor="signup-input-password">Password</label>
            <input type="password" id="signup-input-password" name="password" onChange={handleChangeSignup}></input>
          </div>
          <div className="form-control">
            <label htmlFor="signup-input-fname">Name</label>
            <input type="text" id="signup-input-fname" name="fname" onChange={handleChangeSignup} autoComplete="off"></input>
          </div>
          <div className="form-control">
            <label htmlFor="signup-input-lname">Surname</label>
            <input type="text" id="signup-input-lname" name="lname" onChange={handleChangeSignup} autoComplete="off"></input>
          </div>
          <div className="button-control">
          <button className="application-button">Sign up</button>
          </div>
        </form>
      </div>
      )}
    </div>
    {displayPopup !== "" &&
      <Popup setDisplayPopup={setDisplayPopup} displayPopup={displayPopup}/>
    }</>
  )
}
