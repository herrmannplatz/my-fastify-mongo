import mongoose, { InferSchemaType } from 'mongoose'

export const PetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }
  },
  {
    virtuals: {
      id: {
        get() {
          this._id.toString()
        }
      }
    }
  }
)

PetSchema.set('toJSON', {
  virtuals: true
})

export const PetModel = mongoose.model('Pet', PetSchema)

export type Pet = InferSchemaType<typeof PetSchema>

export type PetDocument = Pet & { id: string }
