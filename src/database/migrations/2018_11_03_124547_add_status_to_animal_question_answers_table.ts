import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_question_answers\`
			ADD COLUMN \`status\` tinyint(1) NOT NULL DEFAULT 0
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_question_answers\`
			DROP COLUMN \`status\`
		`)
	},
}
