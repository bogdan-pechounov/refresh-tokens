import GoogleButton from 'react-google-button'
import GithubButton from 'react-github-login-button'
import api from '../../utils/api'

function OAuthButtons() {
  return (
    <div className="d-flex flex-column align-items-center gap-1 mb-3">
      <GoogleButton
        onClick={() => {
          api.google()
        }}
      />
      <GithubButton
        onClick={() => {
          api.github()
        }}
      />
    </div>
  )
}

export default OAuthButtons
