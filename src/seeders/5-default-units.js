'use strict'

module.exports = {
  up: async (queryInterface) => {
    const now = new Date()
    await queryInterface.bulkInsert('units', [
      {
        name: 'kg',
        display_name: 'Kilogram',
        created_at: now,
        updated_at: now,
      },
      {
        name: 'ltr',
        display_name: 'Litre',
        created_at: now,
        updated_at: now,
      },
      {
        name: 'gm',
        display_name: 'Gram',
        created_at: now,
        updated_at: now,
      },
    ])
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('units', null, {})
  },
}
