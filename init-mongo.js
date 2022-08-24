/* global db */

db.createUser({
  user: 'pets-user',
  pwd: 'pets-pw',
  roles: [
    {
      role: 'readWrite',
      db: 'pets-database'
    }
  ]
})
