import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			ADD COLUMN \`hint\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci AFTER \`question_unit\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			DROP COLUMN \`hint\`;
		`)
	},
}
