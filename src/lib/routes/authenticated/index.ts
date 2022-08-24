import fp from 'fastify-plugin'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { authenticated } from './schema'

const plugin: FastifyPluginAsyncTypebox = async function(server) {
  server
    .get('/authenticated', {
      schema: authenticated,
      handler: async (request, response) => {
        request.authenticate()
        response.status(204)
      }
    })
}

export default plugin
