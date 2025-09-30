import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			DROP COLUMN \`validation_rule\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`common_questions\`
			ADD COLUMN \`validation_rule\` int NOT NULL AFTER \`question\`;
		`)
	},
}
