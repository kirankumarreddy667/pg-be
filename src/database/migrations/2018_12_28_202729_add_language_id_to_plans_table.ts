import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`plans\`
      ADD COLUMN \`language_id\` int NOT NULL AFTER \`updated_at\`;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`plans\`
      DROP COLUMN \`language_id\`;
    `)
	},
}
