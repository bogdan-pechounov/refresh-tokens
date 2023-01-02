import React, { useContext, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import isEmail from 'validator/lib/isEmail'
import { AppContext } from '../../App'
import api from '../../utils/api'

function LoginModal() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setUser } = useContext(AppContext)

  const closeButton = useRef()

  async function handleSubmit(e) {
    const user = isEmail(name) ? { email: name, password } : { name, password }
    try {
      setUser(await api.login(user))
      closeButton.current.click()
    } catch (err) {
      setErrorMessage(err.response.data)
    }
  }

  return ReactDOM.createPortal(
    <div
      className='modal fade'
      id='loginModal'
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              Login
            </h1>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>
            <form>
              <div className='mb-3'>
                <label htmlFor='exampleInputEmail1' className='form-label'>
                  Username or email
                </label>
                <input
                  type='email'
                  className='form-control'
                  id='exampleInputEmail1'
                  aria-describedby='emailHelp'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='exampleInputPassword1' className='form-label'>
                  Password
                </label>
                <input
                  type='password'
                  className='form-control'
                  id='exampleInputPassword1'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </form>
            {errorMessage && (
              <div className='alert alert-danger' role='alert'>
                {errorMessage}
              </div>
            )}
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              data-bs-dismiss='modal'
              ref={closeButton}
            >
              Close
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default LoginModal
