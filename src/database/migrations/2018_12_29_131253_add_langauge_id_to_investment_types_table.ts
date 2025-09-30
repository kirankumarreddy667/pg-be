import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`investment_types\`
      ADD COLUMN \`language_id\` int NOT NULL AFTER \`updated_at\`;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`investment_types\`
      DROP COLUMN \`language_id\`;
    `)
	},
}
