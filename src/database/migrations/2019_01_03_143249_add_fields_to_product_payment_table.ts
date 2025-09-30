import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`product_payment\`
      ADD COLUMN \`coupon_id\` int DEFAULT NULL AFTER \`address\`,
      ADD COLUMN \`status\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL AFTER \`coupon_id\`;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`product_payment\`
      DROP COLUMN \`status\`,
      DROP COLUMN \`coupon_id\`;
    `)
	},
}
