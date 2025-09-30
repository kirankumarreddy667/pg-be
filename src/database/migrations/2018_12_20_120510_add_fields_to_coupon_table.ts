import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`coupon\`
			ADD COLUMN \`type\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
			ADD COLUMN \`exp_date\` timestamp NULL DEFAULT NULL;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`coupon\`
			DROP COLUMN \`type\`,
			DROP COLUMN \`exp_date\`;
		`)
	},
}
