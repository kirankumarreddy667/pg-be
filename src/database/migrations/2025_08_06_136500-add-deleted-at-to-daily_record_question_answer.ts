import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_question_answer\`
			ADD COLUMN \`deleted_at\` timestamp NULL DEFAULT NULL
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_question_answer\`
			DROP COLUMN \`deleted_at\`
		`)
	},
}
