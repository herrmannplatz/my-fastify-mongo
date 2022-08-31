import fastify, { FastifyInstance } from 'fastify'
import { faker } from '@faker-js/faker'
import jwt from 'jsonwebtoken'
import jwtPlugin from './index'
import getConfig, { Config } from '../../config/'

describe('jwt plugin', () => {
  let server: FastifyInstance
  let options: Config

  beforeAll(async () => {
    options = await getConfig()
    options.security.jwtSecret = 'test'

    server = fastify()
    server.register(jwtPlugin, options)

    // route that will attempt to authenticate
    server.route({
      method: 'GET',
      url: '/authenticate',
      handler: async (request) => {
        return request.authenticate()
      }
    })

    await server.ready()
  })

  beforeEach(() => {
    jest.setTimeout(10e4)
    jest.resetAllMocks()
  })

  afterAll(() => server.close())

  it('should return data from a valid token', async () => {
    const result = {
      id: faker.lorem.word()
    }

    const response = await server.inject({
      method: 'GET',
      url: '/authenticate',
      headers: {
        Authorization: `Bearer ${jwt.sign(result, options.security.jwtSecret)}`
      }
    })

    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.payload)).toEqual(
      expect.objectContaining(result)
    )
  })

  it('should return a 401 code when a token is missing', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/authenticate'
    })

    expect(response.statusCode).toEqual(401)
  })

  it('should return a 401 code when a token has expired', async () => {
    const token = jwt.sign(
      { exp: Math.floor(new Date().getTime() / 1000) - 3600 },
      options.security.jwtSecret
    )

    const response = await server.inject({
      method: 'GET',
      url: '/authenticate',
      headers: { Authorization: `Bearer ${token}` }
    })

    expect(response.statusCode).toEqual(401)
  })
})
