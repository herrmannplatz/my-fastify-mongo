import type { FastifyReply, FastifyRequest } from 'fastify'
import envSchema from 'env-schema'
import { Static, Type } from '@sinclair/typebox'
import { SwaggerOptions } from '@fastify/swagger'
import { FastifyCorsOptions } from '@fastify/cors'

const schema = Type.Object({
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test')
  ]),
  DB_DISABLED: Type.Boolean(),
  MONGODB_URI: Type.String(),
  HOST: Type.String(),
  PORT: Type.String(),
  CORS_ORIGIN: Type.String(),
  CORS_CREDENTIALS: Type.String(),
  LOG_LEVEL: Type.Union(
    [
      Type.Literal('fatal'),
      Type.Literal('error'),
      Type.Literal('warn'),
      Type.Literal('info'),
      Type.Literal('debug'),
      Type.Literal('trace'),
      Type.Literal('silent')
    ],
    { default: 'info' }
  ),
  JWT_SECRET: Type.String()
})

type Env = Static<typeof schema>

function parseCorsParameter(param: Env['CORS_ORIGIN']) {
  if (param === 'true') return true
  if (param === 'false') return false
  return param
}

export default async function getConfig() {
  const env = envSchema<Env>({ dotenv: true, schema })

  const isProduction = /^\s*production\s*$/i.test(env.NODE_ENV)

  const config = {
    isProduction,
    env: env.NODE_ENV,
    fastify: {
      host: env.HOST,
      port: +env.PORT
    },
    database: {
      disabled: env.DB_DISABLED,
      url: env.MONGODB_URI
    },
    fastifyInit: {
      disableRequestLogging: true,
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
    } as FastifyCorsOptions,
    swagger: {
      routePrefix: '/docs',
      exposeRoute: true,
      swagger: {
        info: {
          title: 'Fastify starter API',
          description: 'Fastify starter API',
          version: '' + process.env.npm_package_version
        }
      },
      refResolver: {
        // https://github.com/fastify/fastify-swagger#managing-your-refs
        buildLocalReference(json, _baseUri, __fragment, i) {
          return json.$id || `my-fragment-${i}`
        }
      }
    } as SwaggerOptions,
    security: {
      jwtSecret: env.JWT_SECRET
    }
  }

  return config
}

export type Config = Awaited<ReturnType<typeof getConfig>>
