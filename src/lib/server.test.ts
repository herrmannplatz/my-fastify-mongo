import { FastifyInstance, fastify } from 'fastify'
import getConfig from './config'
import serverFactory from './server'

describe('server', () => {
  it('starts a mock server and register plugins', async () => {
    const server = {
      register: jest.fn(),
      addHook: jest.fn(),
      setErrorHandler: jest.fn()
    }

    server.register.mockReturnValue(server)
    serverFactory(server as unknown as FastifyInstance, await getConfig())
    expect(server.register).toHaveBeenCalledTimes(5)
  })

  it('starts a real server and hits an authenticated route successfully', async () => {
    const server = fastify()

    await server.register(serverFactory, await getConfig())

    const response = await server.inject('/authenticated')

    expect(response.statusCode).toBe(401)
  })
})
