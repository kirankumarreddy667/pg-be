import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_question_answers\`
			ADD COLUMN \`animal_number\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_question_answers\`
			DROP COLUMN \`animal_number\`
		`)
	},
}
