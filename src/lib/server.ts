import type { Config } from './config/index';

import path from 'path'
import fp from 'fastify-plugin'
import autoLoad from '@fastify/autoload'
import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import swagger from '@fastify/swagger'

export default fp<Config>(async (server, config) => {
  if (!config.isProduction) {
    server.register(swagger, config.swagger)
  }

  server
    .register(cors, config.cors)
    .register(formbody)
    .register(autoLoad, {
      dir: path.join(__dirname, 'plugins'),
      options: config
    })
    .register(autoLoad, {
      dir: path.join(__dirname, 'routes'),
      options: config
    })

  server.addHook('onRequest', async (req, res) => {
    req.log.info({ req }, 'incoming request')
  })

  server.addHook('onResponse', async (req, res) => {
    req.log.info({ req, res }, 'request completed')
  })

  server.addHook('onSend', async (req, res) => {
    res.header('Cache-Control', 'no-store')
    res.header('Pragma', 'no-cache')
  })

  server.setErrorHandler((err, req, res) => {
    if (res.statusCode >= 500) {
      req.log.error({ req, res, err }, err && err.message)
    } else if (res.statusCode >= 400) {
      req.log.info({ req, res, err }, err && err.message)
    }

    if (res.statusCode >= 500) {
      res.send('An error has occurred')
    } else {
      res.send(err)
    }
  })
})
