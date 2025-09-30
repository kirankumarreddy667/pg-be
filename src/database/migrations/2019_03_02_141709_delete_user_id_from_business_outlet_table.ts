import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`business_outlet\`
			DROP COLUMN \`user_id\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`business_outlet\`
			ADD COLUMN \`user_id\` int NOT NULL AFTER \`id\`;
		`)
	},
}
