'use strict'

module.exports = {
  up: async (queryInterface) => {
    const now = new Date()

    await queryInterface.bulkInsert('offers', [
      {
        image: 'https://example.com/images/offer1.jpg',
        additional_months: 3,
        additional_years: 0,
        language_id: 1,
        created_at: now,
        updated_at: now,
      },
      {
        image: 'https://example.com/images/offer2.jpg',
        additional_months: 0,
        additional_years: 1,
        language_id: 2,
        created_at: now,
        updated_at: now,
      },
      {
        image: 'https://example.com/images/offer3.jpg',
        additional_months: 6,
        additional_years: 0,
        language_id: 3, 
        created_at: now,
        updated_at: now,
      },
    ])
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('offers', null, {})
  },
}
