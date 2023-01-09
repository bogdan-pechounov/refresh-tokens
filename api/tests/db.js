const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongod

module.exports = {
  async connect() {
    mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
  },
  async disconnect() {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
  },
  async clear() {
    const collections = Object.values(mongoose.connection.collections)
    for (const collection of collections) {
      await collection.deleteMany()
    }
  },
}
