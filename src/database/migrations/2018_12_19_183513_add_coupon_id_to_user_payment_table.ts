import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`user_payment\`
			ADD COLUMN \`coupon_id\` INT DEFAULT NULL AFTER \`offer_id\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`user_payment\`
			DROP COLUMN \`coupon_id\`;
		`)
	},
}
