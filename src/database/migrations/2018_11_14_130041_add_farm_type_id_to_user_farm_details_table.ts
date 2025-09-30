'use strict'

import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`user_farm_details\`
      ADD COLUMN \`farm_type_id\` int DEFAULT NULL AFTER \`updated_at\`,
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`user_farm_details\`
      DROP COLUMN \`farm_type_id\`,
    `)
	},
}
