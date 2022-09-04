import { sign } from 'jsonwebtoken'
import fastify from 'fastify'
import getConfig, { Config } from '../../config'
import { faker } from '@faker-js/faker'

xdescribe('pets route', () => {
  let options: Config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let server: any

  beforeAll(async () => {
    options = await getConfig()

    server = fastify()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    server.register(require('../../plugins/jwt'), options)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    server.register(require('../../plugins/mongo'), options)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    server.register(require('.'), options)
    await server.ready()
  })

  beforeEach(() => {
    jest.setTimeout(10e4)
    jest.resetAllMocks()
  })

  afterAll(async () => server.close())

  it('should return pets', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/pets',
      headers: {
        Authorization: `Bearer ${sign(
          { id: faker.lorem.word() },
          options.security.jwtSecret
        )}`
      }
    })

    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual([])
  })
})
