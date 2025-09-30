import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`slider_articles\`
      ADD COLUMN \`subtitle\` VARCHAR(191) 
      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`slider_articles\`
      DROP COLUMN \`subtitle\`;
    `)
	},
}
