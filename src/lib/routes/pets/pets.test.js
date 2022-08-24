import getConfig from "src/lib/config"

describe('health route', () => {
  let server, options

  beforeAll(async () => {
    options = await getConfig()
    server = require('fastify')()
    server.register(require('.').default)
    server.register(require('../../plugins/jwt').default, options)
    server.register(require('../../plugins/mongo').default, options)
    await server.ready()
  })

  beforeEach(() => {
    jest.setTimeout(10e4)
    jest.resetAllMocks()
  })

  afterAll(async () => server.close())

  it('should return pets', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ rowCount: 1 })

    server.pg.write.query = mockInsert
    
    const response = await server.inject({
      method: 'GET',
      url: '/healthcheck'
    })

    expect(mockInsert).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual([/* pets */])
  })
})
