import type { Db, Collection, WithId } from 'mongodb'
import { ObjectId } from 'mongodb'

function mapObjectIdToString<T extends WithId<unknown>>({
  _id,
  ...docProperties
}: T) {
  return { id: _id.toString(), ...docProperties }
}

export interface Pet {
  name: string
}

export class PetsService {
  collection: Collection<Pet>

  constructor(db: Db) {
    this.collection = db?.collection<Pet>('pets')
  }

  async getPets(limit = 50, offset = 0) {
    return this.collection
      .find()
      .map(mapObjectIdToString)
      .limit(limit)
      .skip(offset)
      .toArray()
  }

  async createPet(pet: Pet) {
    const result = await this.collection.insertOne(pet)
    if (!result?.insertedId) {
      return null
    }
    return { id: result.insertedId.toString(), ...pet }
  }

  async getPet(id: string) {
    if (!ObjectId.isValid(id)) {
      return null
    }

    const doc = await this.collection.findOne({ _id: new ObjectId(id) })
    if (!doc) {
      return null
    }
    const { _id, ...properties } = doc
    return { id: _id.toString(), ...properties }
  }

  async deletePet(id: string) {
    if (!ObjectId.isValid(id)) {
      return false
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    if (!result?.deletedCount) {
      return false
    }
    return true
  }
}
