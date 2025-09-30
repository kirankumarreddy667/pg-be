import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\`
			ADD COLUMN \`question_tag\` int NOT NULL AFTER \`form_type_id\`;
            ADD COLUMN \`question_unit\` int NOT NULL AFTER \`question_tag\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\`
			DROP COLUMN \`question_tag\`,
            DROP COLUMN \`question_unit\`;
		`)
	},
}
