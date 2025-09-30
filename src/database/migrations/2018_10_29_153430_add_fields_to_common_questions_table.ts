import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			ADD COLUMN \`question_tag\` int NOT NULL AFTER \`form_type_value\`,
			ADD COLUMN \`question_unit\` int DEFAULT NULL AFTER \`question_tag\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			DROP COLUMN \`question_unit\`,
			DROP COLUMN \`question_tag\`;
		`)
	},
}
