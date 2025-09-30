import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`question_language\`
      ADD COLUMN \`hint\` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`question_language\`
      DROP COLUMN \`hint\`;
    `)
	},
}
