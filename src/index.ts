import fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import startServer from './lib/server'
import getConfig from './lib/config'

const main = async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err)
    process.exit(1)
  })

  const config = await getConfig()

  const server = fastify(config.fastifyInit).withTypeProvider<TypeBoxTypeProvider>()
  server.register(startServer, config)

  const address = await server.listen(config.fastify)
  server.log.info(`Server running at: ${address}`)

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    // Use once() so that double signals exits the app
    process.once(signal, () => {
      server.log.info({ signal }, 'closing application')
      server
        .close()
        .then(() => {
          server.log.info({ signal }, 'application closed')
          process.exit(0)
        })
        .catch(err => {
          server.log.error({ err }, 'Error closing the application')
          process.exit(1)
        })
    })
  }
}

main()
