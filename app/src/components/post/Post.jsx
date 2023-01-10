import React, { useContext, useState } from 'react'
import { AppContext } from '../../App'
import EditPost from './EditPost'

function Post({
  _id,
  title,
  body,
  user: { name, _id: userId },
  onPostDeleted,
  onPostEdited,
}) {
  const { user } = useContext(AppContext)
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    function hide() {
      setIsEditing(false)
    }

    function onEdit(title, body) {
      hide()
      onPostEdited({ _id, title, body })
    }
    return (
      <EditPost title={title} body={body} onCancel={hide} onEdit={onEdit} />
    )
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{name}</h6>
        <p className="card-text">{body}</p>
        {user?._id === userId && (
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onPostDeleted(_id)}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
