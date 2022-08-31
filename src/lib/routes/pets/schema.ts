import { Type } from '@sinclair/typebox'

// TODO: refs
export const getPets = {
  operationId: 'getPets',
  response: {
    200: Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String()
      })
    )
  }
}
export const createPet = {
  operationId: 'createPet',
  body: Type.Object({
    name: Type.String()
  }),
  response: {
    201: Type.Object({
      id: Type.String(),
      name: Type.String()
    })
  }
}

export const getPet = {
  operationId: 'getPet',
  params: Type.Object({
    petsId: Type.String()
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      name: Type.String()
    })
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
    400: Type.Object({
      statusCode: Type.String(),
      error: Type.String(),
      message: Type.String()
    })
  }
}
