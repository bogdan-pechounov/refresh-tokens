import React, { useContext } from 'react'
import { AppContext } from '../../App'

function Post({
  _id,
  title,
  body,
  user: { name, _id: userId },
  onPostDeleted,
}) {
  const { user } = useContext(AppContext)

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{name}</h6>
        <p className="card-text">{body}</p>
        {user?._id === userId && (
          <div
            className="btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onPostDeleted(_id)}
            >
              Delete
            </button>
            <button type="button" className="btn btn-primary">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
