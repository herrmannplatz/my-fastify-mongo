import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fp from 'fastify-plugin'
import { authenticated } from './schema'

export default fp(async function(server) {
  server.withTypeProvider<TypeBoxTypeProvider>()
    .get('/authenticated', {
      schema: authenticated,
      handler: async (request, response) => {
        request.authenticate()
        response.status(204)
      }
    })
})
