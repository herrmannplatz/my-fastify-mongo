import fp from 'fastify-plugin'
import type { Config } from '../../config'
import mongoose from 'mongoose'

export default fp<Config>(async (server, options) => {
  if (options.env === 'test') {
    return
  }
  mongoose
    .connect(options.database.url)
    .then(() => server.log.info('✅ MongoDB connected'))
    .catch((err) => server.log.error(err))

  server.addHook('onClose', async () => {
    await mongoose.connection.close()
  })
})
