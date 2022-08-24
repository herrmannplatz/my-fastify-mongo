import fp from 'fastify-plugin'

export default fp(async function health(server) {
  server.route({
    method: 'GET',
    url: '/healthcheck',
    handler: async () => {
      return 'ok'
    }
  })
})
