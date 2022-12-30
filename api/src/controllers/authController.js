const bcrypt = require('bcrypt')

async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

module.exports = { hashPassword }
