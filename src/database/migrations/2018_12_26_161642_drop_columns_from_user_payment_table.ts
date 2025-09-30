import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`user_payment\`
			DROP COLUMN \`payment_id\`,
			DROP COLUMN \`email\`,
			DROP COLUMN \`billing_instrument\`,
			DROP COLUMN \`phone\`,
			DROP COLUMN \`offer_id\`,
			DROP COLUMN \`coupon_id\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`user_payment\`
			ADD COLUMN \`payment_id\` INT NOT NULL AFTER \`amount\`,
			ADD COLUMN \`email\` VARCHAR(191) NULL AFTER \`plan_exp_date\`,
			ADD COLUMN \`billing_instrument\` VARCHAR(191) NOT NULL AFTER \`email\`,
			ADD COLUMN \`phone\` VARCHAR(191) NOT NULL AFTER \`billing_instrument\`,
			ADD COLUMN \`offer_id\` INT DEFAULT NULL AFTER \`updated_at\`,
			ADD COLUMN \`coupon_id\` INT DEFAULT NULL AFTER \`offer_id\`;
		`)
	},
}
