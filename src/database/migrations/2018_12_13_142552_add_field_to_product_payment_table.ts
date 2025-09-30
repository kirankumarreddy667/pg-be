import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`product_payment\`
      ADD COLUMN \`offer_id\` int DEFAULT NULL AFTER \`updated_at\`,
      ADD COLUMN \`address\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL AFTER \`offer_id\`;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`product_payment\`
      DROP COLUMN \`address\`,
      DROP COLUMN \`offer_id\`;
    `)
	},
}
