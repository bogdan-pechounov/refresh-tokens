const bcrypt = require('bcrypt')

module.exports = {
  async hashPassword(password) {
    return await bcrypt.hash(password, 12)
  },
  async matchPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword)
    } catch {
      return false
    }
  },
}
