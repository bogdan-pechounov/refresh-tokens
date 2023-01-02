const logger = require('../utils/logger')

function errorHandler(err, req, res, next) {
  //unique fields
  if (err.name === 'MongoServerError' && err.code === 11000) {
    let field = Object.keys(err.keyValue)[0]
    const mapping = { name: 'Username', email: 'Email' }
    const msg = { [field]: `${mapping[field] || field} already taken.` }
    res.status(400).send(msg)
  }
  //mongoose validation
  else if (err.name === 'ValidationError') {
    const msg = {}
    for (const [key, value] of Object.entries(err.errors)) {
      msg[key] = value.message
    }
    res.status(400).send(msg)
  }
  //something unforeseen went wrong
  else {
    logger.error(err)
    res.status(500).send(err)
  }
}

module.exports = errorHandler
