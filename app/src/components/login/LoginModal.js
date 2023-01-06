import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import isEmail from 'validator/lib/isEmail'
import { AppContext } from '../../App'
import api from '../../utils/api'
import { getRoot } from '../../utils/utils'
import { ToastContext } from '../toast/Toast'
import OAuthButtons from './OAuthButtons'

export function Login() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { setUser } = useContext(AppContext)

  async function handleSubmit() {
    const user = isEmail(name) ? { email: name, password } : { name, password }
    try {
      const loggedInUser = await api.login(user)
      setUser(loggedInUser)
      close()
    } catch (err) {
      setErrorMessage(err.response.data)
    }
  }

  //close
  const closeButton = useRef()

  function close() {
    closeButton.current.click()
  }

  //reset state on close
  useEffect(() => {
    function reset() {
      setName('')
      setPassword('')
      setErrorMessage('')
    }
    const loginModal = document.getElementById('loginModal')
    loginModal.addEventListener('hidden.bs.modal', reset)
    return () => {
      loginModal.removeEventListener('hidden.bs.modal', reset)
    }
  }, [])

  //reset password
  const [confirmEmail, setConfirmEmail] = useState('')
  const { show, setTitle, setMsg } = useContext(ToastContext)

  useEffect(() => {
    //reuse email instead of retyping it
    if (isEmail(name)) {
      setConfirmEmail(name)
    }
  }, [name])

  async function handleResetPassword(e) {
    e.preventDefault()
    await api.requestNewPassword(confirmEmail)
    close()
    show()
    setTitle('Reset password')
    setMsg('An email has been sent')
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">
          Login
        </h1>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        {/* Form */}
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Username or email
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>
        {/* Reset password */}
        <p>
          <a
            className="link-primary"
            data-bs-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            Forgot your password?
          </a>
        </p>
        <div className="collapse" id="collapseExample">
          <div className="card card-body">
            <form className="row" onSubmit={handleResetPassword}>
              <div className="col">
                <input
                  type="email"
                  className="form-control"
                  placeholder="reset@password.com"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary">
                  Send email
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Errors */}
        {errorMessage && (
          <div className="alert alert-danger mb-0" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
      {/* OAuth */}
      <OAuthButtons />
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
          ref={closeButton}
        >
          Close
        </button>
        {/* Submit */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Login
        </button>
      </div>
    </div>
  )
}

function LoginModal() {
  return ReactDOM.createPortal(
    <div
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <Login />
      </div>
    </div>,
    getRoot('modal-root')
  )
}

export default LoginModal
