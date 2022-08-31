import fp from 'fastify-plugin';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { ObjectId } from '@fastify/mongodb';
import { NotFound, BadRequest } from 'http-errors'
import { createPet, deletePet, getPet, getPets } from './schema'
import { PetsService, Pet } from './service'

const plugin: FastifyPluginAsyncTypebox = async function(server) {

  const petsService = new PetsService(server.mongo.db!)

  server
    .get('/pets', {
      schema: getPets,
      handler: async function (request, response) {
        request.authenticate()

        const pets = await petsService.getPets()

        response.status(200).send(pets)
      }
    })
    .post('/pets', {
      schema: createPet,
      handler: async function (request, response) {
        request.authenticate()

        const pet = await petsService.createPet(request.body)
        if (!pet) {
          throw new BadRequest(`Failed to create pet`)
        }
        
        response.status(201).send(pet)
      }
    })
    .get('/pets/:petsId', {
      schema: getPet,
      handler: async function (request, response) {
        request.authenticate()

        const pet = await petsService.getPet(request.params.petsId)
        if (!pet) {
          throw new NotFound('Pet not found')
        }
        response.status(200).send(pet)
      }
    })
    .delete('/pets/:petsId', {
      schema: deletePet,
      handler: async function (request, response) {
        const id = request.params.petsId
        const deleted = await petsService.deletePet(request.params.petsId)
        if (!deleted) {
          throw new BadRequest(`Failed to delete pet with id ${id}`)
        }
        response.status(204)
      }
    })
}

export default fp(plugin)