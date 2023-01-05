const express = require('express')
require('express-async-errors')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('./utils/logger')
const pinoHTTP = require('pino-http')
const fileLogger = require('./utils/fileLogger')
const morgan = require('morgan')
const config = require('./config/config')
const { ORIGIN, LOG_ENABLED } = require('./config/config')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

//cors
logger.info('Allowed access to ' + config.ORIGIN)

//Log
if (LOG_ENABLED) {
  app.use(morgan('dev')) //log requests
  app.use(
    pinoHTTP({
      logger: fileLogger,
    })
  ) //log full requests to file
}

//Middlewares
app.use(express.json()) //json post requests
app.use(
  cors({
    credentials: true,
    origin: ORIGIN,
    exposedHeaders: 'X-Access-Token',
  })
) //cors with credentials
app.use(cookieParser()) //cookies for jwt tokens

//sanity check
app.get('/', (_, res) => {
  res.send('Hello there!')
})

//Routes
app.use('/auth', require('./routes/auth'))

//Error handling
app.use(errorHandler)

module.exports = app
