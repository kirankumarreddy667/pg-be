import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			ADD COLUMN \`form_type_value\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER \`date\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			DROP COLUMN \`form_type_value\`;
		`)
	},
}
