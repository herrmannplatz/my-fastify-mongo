import fp from 'fastify-plugin'
import fastifyMongodb from '@fastify/mongodb'
import type { Config } from '../../config';

export default fp<Config>(async (server, options) => {
  if (options.database.disabled) {
    return
  }
  server.register(fastifyMongodb, {
    forceClose: true,
    url: options.database.url
  })
})