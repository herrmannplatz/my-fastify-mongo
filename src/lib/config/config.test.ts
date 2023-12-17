import { faker } from '@faker-js/faker'
import getConfig from '.'

describe('configuration', () => {
  const currentEnv = Object.assign({}, process.env)

  beforeAll(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.resetModules()
    Object.assign(process.env, currentEnv)
  })

  it('returns values according to environment variables', async () => {
    const NODE_ENV = 'development'
    const CONFIG_VAR_PREFIX = ''
    const HOST = faker.internet.ip()
    const PORT = faker.number.int()
    const MONGODB_URI = faker.internet.ip()
    const CORS_ORIGIN = faker.lorem.word()
    const CORS_CREDENTIALS = faker.datatype.boolean()
    const LOG_LEVEL = faker.helpers.arrayElement(['debug', 'warn', 'silent'])
    const JWT_SECRET = faker.lorem.word()

    Object.assign(process.env, {
      NODE_ENV,
      CONFIG_VAR_PREFIX,
      HOST,
      PORT,
      MONGODB_URI,
      CORS_ORIGIN,
      CORS_CREDENTIALS,
      LOG_LEVEL,
      JWT_SECRET
    })

    const config = await getConfig()

    expect(config.isProduction).toEqual(false)

    expect(config.fastify).toEqual({
      host: HOST,
      port: PORT
    })

    expect(config.fastifyInit.logger).toEqual(
      expect.objectContaining({
        level: LOG_LEVEL
      })
    )

    expect(config.cors).toEqual({
      origin: CORS_ORIGIN,
      credentials: CORS_CREDENTIALS
    })

    expect(config.security).toEqual({
      jwtSecret: JWT_SECRET
    })

    expect(config.database).toEqual({
      disabled: true,
      url: MONGODB_URI
    })
  })
})
