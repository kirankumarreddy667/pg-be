import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_questions\`
			DROP COLUMN \`category_id\`,
			DROP COLUMN \`sub_category_id\`,
			DROP COLUMN \`question\`,
			DROP COLUMN \`validation_rule_id\`
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`animal_questions\`
			ADD COLUMN \`category_id\` int NOT NULL,
			ADD COLUMN \`sub_category_id\` int DEFAULT NULL,
			ADD COLUMN \`question\` text NOT NULL,
			ADD COLUMN \`validation_rule_id\` varchar(255) NOT NULL
		`)
	},
}
