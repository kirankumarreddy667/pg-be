import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			ADD COLUMN \`form_type_id\` int DEFAULT NULL AFTER \`updated_at\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			DROP COLUMN \`form_type_id\`;
		`)
	},
}
