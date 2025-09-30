import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`validation_rules\`
      ADD COLUMN \`constant_value\` int NOT NULL AFTER \`description\`;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`validation_rules\`
      DROP COLUMN \`constant_value\`;
    `)
	},
}
