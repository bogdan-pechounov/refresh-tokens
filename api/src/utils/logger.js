const pino = require('pino')
const { LOG_ENABLED } = require('../config/config')

const logger = pino({
  enabled: LOG_ENABLED,
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname',
    },
  },
})

module.exports = logger
