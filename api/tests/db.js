const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

module.exports = () => {
  let mongod

  return {
    async connect() {
      mongod = await MongoMemoryServer.create() //one instance per call to prevent test suites from using the same object concurrently
      await mongoose.connect(mongod.getUri())
    },
    async disconnect() {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
      await mongod.stop()
    },
    async clear() {
      const collections = Object.values(mongoose.connection.collections)
      for (const collection in collections) {
        collection.deleteMany()
      }
    },
  }
}
