//.env file during development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//provide defaults to missing env variables
const config = {
  PORT: 3001,
  ORIGIN: 'http://localhost:3000',
  DB_URI: 'mongodb://127.0.0.1:27017/forums',
  ACCESS_TOKEN_SECRET: 'secret',
  REFRESH_TOKEN_SECRET: 'secret',
  EMAIL_APP_PASSWORD: undefined,
  GOOGLE_CLIENT_ID: undefined,
  GOOGLE_CLIENT_SECRET: undefined,
  GITHUB_CLIENT_ID: undefined,
  GITHUB_CLIENT_SECRET: undefined,
}

//use env variable if defined and check if missing in production
for (const key in config) {
  env_var = process.env[key]
  if (env_var) config[key] = env_var
  else if (process.env.NODE_ENV === 'production')
    throw new Error(`${key} not set`)
}

//other fields
config.LOG_ENABLED = process.env.NODE_ENV !== 'test'

module.exports = config
