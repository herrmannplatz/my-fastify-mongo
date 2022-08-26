/* global db */

db.createUser({
  user: 'pets',
  pwd: 'pets',
  roles: [
    {
      role: 'readWrite',
      db: 'pets'
    }
  ]
})

db.pets.insertMany(
  Array.from({ length: 1000000 }).map((_, index) => ({
    name: [
      'Luna',
      'Fido',
      'Fluffy',
      'Carina',
      'Spot',
      'Beethoven',
      'Baxter',
      'Dug',
      'Zero',
      "Santa's Little Helper",
      'Snoopy'
    ][index % 9],
    type: ['dog', 'cat', 'bird', 'reptile'][index % 4],
    age: (index % 18) + 1,
    breed: [
      'Havanese',
      'Bichon Frise',
      'Beagle',
      'Cockatoo',
      'African Gray',
      'Tabby',
      'Iguana'
    ][index % 7],
    index
  }))
)
