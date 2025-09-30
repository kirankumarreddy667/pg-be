import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`user_payment_history\`
      ADD COLUMN \`coupon_id\` int DEFAULT NULL AFTER \`offer_id\`;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`user_payment_history\`
      DROP COLUMN \`coupon_id\`;
    `)
	},
}
