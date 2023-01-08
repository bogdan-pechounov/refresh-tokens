import React, { useContext, useRef } from 'react'
import { getRoot } from '../../utils/utils'
import ReactDOM from 'react-dom'
import api from '../../utils/api'
import { AppContext } from '../../App'

function DeleteConfirmation() {
  const closeButton = useRef()
  const { user, setUser } = useContext(AppContext)

  async function onClick() {
    await api.deleteAccount()
    setUser(null)
    closeButton.current.click()
  }
  return ReactDOM.createPortal(
    <div
      className="modal fade"
      id="deleteModal"
      tabIndex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteModalLabel">
              Delete Account
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {user.name}, are you sure you want to delete your account?
          </div>
          <div className="modal-footer">
            <button
              ref={closeButton}
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-danger" onClick={onClick}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>,
    getRoot('modal-root')
  )
}

export default DeleteConfirmation
