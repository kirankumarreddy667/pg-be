import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_question_answers\`
			ADD COLUMN \`animal_id\` int NOT NULL
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_question_answers\`
			DROP COLUMN \`animal_id\`
		`)
	},
}
