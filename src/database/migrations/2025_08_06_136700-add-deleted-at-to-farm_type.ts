import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`farm_type\`
			ADD COLUMN \`deleted_at\` timestamp NULL DEFAULT NULL
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`farm_type\`
			DROP COLUMN \`deleted_at\`
		`)
	},
}
