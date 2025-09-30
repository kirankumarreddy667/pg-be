import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`business_outlet\`
			ADD COLUMN \`assign_to\` int NOT NULL AFTER \`business_address\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`business_outlet\`
			DROP COLUMN \`assign_to\`;
		`)
	},
}
