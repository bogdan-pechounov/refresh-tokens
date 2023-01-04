import React, { createContext, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Toast as BToast } from 'bootstrap'

export const ToastContext = createContext()

function Toast({ toastRef, title, msg }) {
  return ReactDOM.createPortal(
    <div className='toast-container position-fixed bottom-0 end-0 p-3'>
      <div
        id='liveToast'
        className='toast'
        role='alert'
        aria-live='assertive'
        aria-atomic='true'
        ref={toastRef}
      >
        <div className='toast-header'>
          <strong className='me-auto'>{title}</strong>
          <small>Just now</small>
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='toast'
            aria-label='Close'
          ></button>
        </div>
        <div className='toast-body'>{msg}</div>
      </div>
    </div>,
    document.getElementById('toast-root')
  )
}

export function ToastProvider({ children }) {
  const toastRef = useRef()
  const [title, setTitle] = useState('')
  const [msg, setMsg] = useState('')

  function show() {
    const toast = new BToast(toastRef.current)
    toast.show()
  }
  return (
    <ToastContext.Provider value={{ show, setTitle, setMsg }}>
      <Toast toastRef={toastRef} title={title} msg={msg} />
      {children}
    </ToastContext.Provider>
  )
}

export default Toast
