import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			ADD COLUMN \`validation_rule_id\` int NOT NULL AFTER \`form_type_id\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			DROP COLUMN \`validation_rule_id\`;
		`)
	},
}
