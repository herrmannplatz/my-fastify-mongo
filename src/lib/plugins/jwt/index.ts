import type { VerifyPayloadType } from '@fastify/jwt'
import type { FastifyRequest } from 'fastify';
import type { Config } from '../../config';
import fp from 'fastify-plugin'
import { Unauthorized } from 'http-errors'
import fastifyJwt from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    authenticate: () => { refresh: boolean } & VerifyPayloadType
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { name: string; email: string }
  }
}

export default fp<Config>(async (server, options) => {
  function authenticate(this: FastifyRequest) {
    try {
      const data = server.jwt.verify(
        this.headers?.authorization?.replace(/^Bearer /, '') ?? ''
      )

      if ((data as any).refresh) {
        throw new Error()
      }

      this.log.info({ data }, 'authorised user')

      return data
    } catch (err) {
      this.log.info({ err }, 'error verifying jwt')

      throw new Unauthorized()
    }
  }

  server.register(fastifyJwt, {
    secret: options.security.jwtSecret
  })
  server.decorateRequest('authenticate', authenticate)
})