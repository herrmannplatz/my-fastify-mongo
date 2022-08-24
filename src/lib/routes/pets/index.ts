import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { ObjectId } from '@fastify/mongodb';
import { NotFound, BadRequest } from 'http-errors'
import { createPet, deletePet, getPet, getPets } from './schema'

const plugin: FastifyPluginAsyncTypebox = async function(server) {
  server
    .get('/pets', {
      schema: getPets,
      handler: async function (request, response) {
        request.authenticate()

        const docs = (await this.mongo.db?.collection('pets').find()?.toArray()) as { _id: ObjectId, name: string }[]
        response.status(200).send(docs.map(doc => ({ id: doc._id.toString(), ...doc })))
      }
    })
    .post('/pets', {
      schema: createPet,
      handler: async function (request, response) {
        request.authenticate()

        const doc = request.body

        const result = await this.mongo.db?.collection('pets').insertOne(request.body)

        if (!result?.insertedId) {
          throw new BadRequest(`Failed to create pet`)
        }
        
        response.status(201).send({ id: result.insertedId.toString(), ...doc })
      }
    })
    .get('/pets/:petsId', {
      schema: getPet,
      handler: async function (request, response) {
        request.authenticate()

        const query = { _id: new ObjectId(request.params.petsId) }

        const doc = await this.mongo.db
          ?.collection('pets')
          .findOne(query) as { _id: ObjectId, name: string }

        if (!doc) {
          throw new NotFound('Pet not found')
        }
        
        const { _id, ...petProperties } = doc
        response.status(200).send({ id: _id.toString(), ...petProperties })
      }
    })
    .delete('/pets/:petsId', {
      schema: deletePet,
      handler: async function (request, response) {
        const query = { _id: new ObjectId(request.params.petsId) }

        const result = await this.mongo.db
          ?.collection('pets')
          .deleteOne(query)
        
        if (!result?.deletedCount) {
          throw new BadRequest(`Failed to delete pet with id ${query._id}`)
        }

        response.status(204)
      }
    })
}

export default plugin