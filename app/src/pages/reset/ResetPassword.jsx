import React, { useContext, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../utils/api'
import ReactDOM from 'react-dom'
import { ToastContext } from '../../components/toast/Toast'

function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState([])
  const navigate = useNavigate()
  const { show, setTitle, setMsg } = useContext(ToastContext)

  async function handleSubmit(e) {
    e.preventDefault()
    const j = { token, password, confirmPassword }
    try {
      await api.resetPassword(j)
      show()
      setTitle('Password reset')
      setMsg('Use your new password to login.')
      navigate('/')
    } catch (err) {
      const msg = err.response.data
      setErrorMessage(Object.values(msg))
    }
  }
  return (
    <div className='container mt-1'>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            type='password'
            className='form-control'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='confirmPassword' className='form-label'>
            Confirm Password
          </label>
          <input
            type='password'
            className='form-control'
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {errorMessage.map((msg, i) => (
          <div className='alert alert-danger' role='alert' key={i}>
            {msg}
          </div>
        ))}
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
