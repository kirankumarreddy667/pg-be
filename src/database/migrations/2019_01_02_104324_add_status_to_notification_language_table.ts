import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`notification_language\`
			ADD \`status\` int NOT NULL;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`notification_language\`
			DROP COLUMN \`status\`;
		`)
	},
}
