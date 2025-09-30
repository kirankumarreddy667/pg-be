import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_question_language\`
			ADD COLUMN \`hint\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_question_language\`
			DROP COLUMN \`hint\`;
		`)
	},
}
