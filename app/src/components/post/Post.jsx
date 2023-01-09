import React from 'react'

function Post({ title, body, user: { name } }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{name}</h6>
        <p className="card-text">{body}</p>
        {/* <a href="#" className="card-link">
          Card link
        </a>
        <a href="#" className="card-link">
          Another link
        </a> */}
      </div>
    </div>
  )
}

export default Post
