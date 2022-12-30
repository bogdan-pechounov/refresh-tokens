const pino = require('pino')

const fileLogger = pino({}, pino.destination('./access.log'))

module.exports = fileLogger
