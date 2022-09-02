import { Type } from '@sinclair/typebox'

export const PetSchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String()
  },
  { $id: 'PetResponse' }
)

export const ErrorSchema = Type.Object(
  {
    statusCode: Type.String(),
    error: Type.String(),
    message: Type.String()
  },
  { $id: 'ApiError' }
)

export const getPets = {
  operationId: 'getPets',
  response: {
    200: Type.Array(Type.Ref(PetSchema))
  }
}

export const createPet = {
  operationId: 'createPet',
  body: Type.Object({
    name: Type.String()
  }),
  response: {
    201: Type.Ref(PetSchema)
  }
}

export const getPet = {
  operationId: 'getPet',
  params: Type.Object({
    petsId: Type.String()
  }),
  response: {
    200: Type.Ref(PetSchema)
  }
}

export const deletePet = {
  operationId: 'deletePet',
  params: Type.Object({
    petsId: Type.String()
  }),
  response: {
    202: Type.Object({
      deleted: Type.Boolean()
    }),
    400: Type.Ref(ErrorSchema)
  }
}
