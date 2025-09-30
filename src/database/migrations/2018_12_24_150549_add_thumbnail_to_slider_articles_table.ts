import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`slider_articles\`
      ADD COLUMN \`thumbnail\` VARCHAR(191) 
      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`slider_articles\`
      DROP COLUMN \`thumbnail\`;
    `)
	},
}
