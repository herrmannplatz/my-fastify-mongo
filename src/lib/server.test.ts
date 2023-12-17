import { fastify } from 'fastify'
import getConfig from './config'
import serverFactory from './server'

describe('server', () => {
  it('starts a real server and hits an authenticated route successfully', async () => {
    const server = fastify()
    await server.register(serverFactory, await getConfig())
    const response = await server.inject('/authenticated')
    expect(response.statusCode).toBe(401)
  })
})
