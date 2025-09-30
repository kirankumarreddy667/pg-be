import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`summernotes\`
			ADD COLUMN \`deleted_at\` timestamp NULL DEFAULT NULL
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`summernotes\`
			DROP COLUMN \`deleted_at\`
		`)
	},
}
