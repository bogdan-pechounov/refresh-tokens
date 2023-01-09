import React, { useState } from 'react'

function PostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  return (
    <form>
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
