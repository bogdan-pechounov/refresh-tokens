const mongoose = require('mongoose')
const app = require('./app')
const { PORT, DB_URI } = require('./config')
const logger = require('./utils/logger')

//Listen
app.listen(PORT, () => {
  logger.info('Listening on port: ' + PORT)
})

//Connect to database
mongoose.set('strictQuery', true)
mongoose
  .connect(DB_URI)
  .then(() => {
    logger.info('Connected to ' + DB_URI)
  })
  .catch((err) => {
    logger.error({ err }, 'Failed to connect to ' + DB_URI)
  })
