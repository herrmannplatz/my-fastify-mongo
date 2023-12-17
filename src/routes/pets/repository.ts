import mongoose from 'mongoose'
import type { Pet, PetDocument } from './model'
import { PetModel } from './model'

export class PetsRepository {
  async getPets(limit = 50, offset = 0): Promise<PetDocument[]> {
    return PetModel.find<PetDocument>().limit(limit).skip(offset)
  }

  async createPet(pet: Pet): Promise<PetDocument | null> {
    try {
      return (await PetModel.create(pet)) as PetDocument
    } catch (err) {
      return null
    }
  }

  async getPet(id: string): Promise<PetDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null
    }
    return PetModel.findById(id)
  }

  async deletePet(id: string): Promise<boolean> {
    try {
      await PetModel.deleteOne({ _id: id })
      return true
    } catch (err) {
      return false
    }
  }
}
