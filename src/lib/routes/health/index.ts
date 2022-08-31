import fp from 'fastify-plugin'
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

const plugin: FastifyPluginAsyncTypebox = async function (server) {
  server.route({
    method: 'GET',
    url: '/healthcheck',
    handler: async () => {
      return 'ok'
    }
  })
}

export default fp(plugin)
