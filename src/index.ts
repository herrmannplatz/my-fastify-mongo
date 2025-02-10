import fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import closeWithGrace from 'close-with-grace'

import startServer from './server'
import getConfig from './config'

const main = async () => {
  const config = await getConfig()

  const server = fastify(
    config.fastifyInit
  ).withTypeProvider<TypeBoxTypeProvider>()
  server.register(startServer, config)

  const address = await server.listen(config.fastify)
  server.log.info(`✅ Server running at: ${address}`)

  closeWithGrace(async ({ err }) => {
    if (err) {
      server.log.error({ err }, '💥 Error closing the application')
    }
    server.log.info('closing application')
    await server.close()
  })
}

main()
