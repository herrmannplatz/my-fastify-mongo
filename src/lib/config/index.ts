import type { FastifyReply, FastifyRequest } from 'fastify'
import envSchema from 'env-schema'
import { Static, Type } from '@sinclair/typebox'

const { version } = require('../../../package.json')

const schema = Type.Object({
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production')
  ]),
  API_HOST: Type.String(),
  API_PORT: Type.String(),
  CORS_ORIGIN: Type.String(),
  CORS_CREDENTIALS: Type.String(),
  TIME_ZONE: Type.String(),
  LOG_LEVEL: Type.Union([
    Type.Literal('fatal'),
    Type.Literal('error'),
    Type.Literal('warn'),
    Type.Literal('info'),
    Type.Literal('debug'),
    Type.Literal('trace'),
    Type.Literal('silent'),
  ], { default: 'info' }),
  JWT_SECRET: Type.String(),
})

type Env = Static<typeof schema>   

function parseCorsParameter(param: Env["CORS_ORIGIN"]) {
  if (param === 'true') return true
  if (param === 'false') return false
  return param
}

export default async function getConfig() {
  const env = envSchema<Env>({ dotenv: true, schema })

  const isProduction = /^\s*production\s*$/i.test(env.NODE_ENV)

  const config = {
    isProduction,
    timeZone: env.TIME_ZONE,
    fastify: {
      host: env.API_HOST,
      port: +env.API_PORT
    },
    fastifyInit: {
      trustProxy: 2,
      disableRequestLogging: true,
      requestIdHeader: 'x-amz-request-id',
      logger: {
        level: env.LOG_LEVEL,
        serializers: {
          req: (request: FastifyRequest) => ({
            method: request.raw.method,
            url: request.raw.url,
            hostname: request.hostname
          }),
          res: (response: FastifyReply) => ({
            statusCode: response.statusCode
          })
        }
      }
    },
    cors: {
      origin: parseCorsParameter(env.CORS_ORIGIN),
      credentials: /true/i.test(env.CORS_CREDENTIALS)
    },
    swagger: {
      routePrefix: '/docs',
      exposeRoute: true,
      swagger: {
        info: {
          title: 'Fastify starter API',
          description: 'Fastify starter API',
          version
        }
      }
    },
    security: {
      jwtSecret: env.JWT_SECRET
    }
  }

  return config
}

export type Config = Awaited<ReturnType<typeof getConfig>>
