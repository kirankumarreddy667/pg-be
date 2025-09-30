import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`dialy_record_questions\`
			ADD COLUMN \`sequence_number\` int NOT NULL AFTER \`hint\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`dialy_record_questions\`
			DROP COLUMN \`sequence_number\`;
		`)
	},
}
