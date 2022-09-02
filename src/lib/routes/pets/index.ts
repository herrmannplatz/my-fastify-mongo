import fp from 'fastify-plugin'
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { NotFound, BadRequest } from 'http-errors'
import { createPet, deletePet, ErrorSchema, getPet, getPets, PetSchema } from './schema'
import { PetsRepository } from './repository'

const plugin: FastifyPluginAsyncTypebox = async function (server) {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const petsRepository = new PetsRepository(server.mongo.db!)

  server.addSchema(ErrorSchema)
  server.addSchema(PetSchema)

  server
    .get('/pets', {
      schema: getPets,
      handler: async function (request, response) {
        request.authenticate()

        const pets = await petsRepository.getPets()

        response.status(200).send(pets)
      }
    })
    .post('/pets', {
      schema: createPet,
      handler: async function (request, response) {
        request.authenticate()

        const pet = await petsRepository.createPet(request.body)
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

        const pet = await petsRepository.getPet(request.params.petsId)
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
        const deleted = await petsRepository.deletePet(request.params.petsId)
        if (!deleted) {
          throw new BadRequest(`Failed to delete pet with id ${id}`)
        }
        response.status(204)
      }
    })
}

export default fp(plugin)
