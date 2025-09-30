import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`categories\`
			ADD COLUMN \`sequence_number\` int NOT NULL AFTER \`updated_at\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`categories\`
			DROP COLUMN \`sequence_number\`;
		`)
	},
}
