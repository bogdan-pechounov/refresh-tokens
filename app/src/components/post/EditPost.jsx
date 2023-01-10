import React, { useState } from 'react'

function EditPost({ title, body, onCancel, onEdit }) {
  const [editTitle, setEditTitle] = useState(title)
  const [editBody, setEditBody] = useState(body)

  function onSubmit(e) {
    e.preventDefault()
    onEdit(editTitle, editBody)
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-1">
        <input
          type="text"
          className="form-control"
          id="title"
          placeholder="Title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          id="body"
          rows="2"
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
        ></textarea>
      </div>
      <div className="d-flex">
        <div className="btn-group ms-auto" role="group">
          <button type="button" className="btn btn-danger" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default EditPost
