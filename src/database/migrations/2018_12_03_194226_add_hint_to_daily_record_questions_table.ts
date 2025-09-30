import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\`
			ADD COLUMN \`hint\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci AFTER \`delete_status\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\`
			DROP COLUMN \`hint\`;
		`)
	},
}
