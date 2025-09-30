import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_questions\`
			ADD COLUMN \`question_id\` int NOT NULL,
			ADD KEY \`animal_questions_question_id_index\` (\`question_id\`)
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_questions\`
			DROP INDEX \`animal_questions_question_id_index\`,
			DROP COLUMN \`question_id\`
		`)
	},
}
