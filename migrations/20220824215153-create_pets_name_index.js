module.exports = {
  async up(db, client) {
    return db.collection('pets').createIndex({ name: 1 })
  },

  async down(db, client) {
    return db.collection('pets').dropIndex({ name: 1 })
  }
}
