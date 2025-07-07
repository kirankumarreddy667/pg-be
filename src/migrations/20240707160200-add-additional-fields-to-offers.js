'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('offers', 'additional_months', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })

    await queryInterface.addColumn('offers', 'additional_years', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('offers', 'additional_months')
    await queryInterface.removeColumn('offers', 'additional_years')
  },
}
