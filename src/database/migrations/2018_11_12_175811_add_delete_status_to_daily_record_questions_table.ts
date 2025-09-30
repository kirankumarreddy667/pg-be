import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\`
			ADD COLUMN \`delete_status\` tinyint(1) NOT NULL DEFAULT '0' AFTER \`question_unit\`;
         
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\`
			DROP COLUMN \`delete_status\`;
		`)
	},
}
