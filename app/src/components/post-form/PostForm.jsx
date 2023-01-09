import React, { useContext, useState } from 'react'
import api from '../../utils/api'
import { ToastContext } from '../toast/Toast'

function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const { show, setTitle: setToastTitle, setMsg } = useContext(ToastContext)

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const post = await api.createPost({ title, body })
      onPostCreated(post)
      setTitle('')
      setBody('')
    } catch (err) {
      setToastTitle('Error')
      setMsg(Object.values(err.response.data))
      show()
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {title && (
        <>
          <div className="mb-3">
            <label htmlFor="body" className="form-label">
              Body
            </label>
            <textarea
              className="form-control"
              id="body"
              rows="3"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
          <div className="d-flex">
            <button
              type="submit"
              className="btn btn-primary ms-auto"
              disabled={title === '' || body === ''}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </form>
  )
}

export default PostForm
