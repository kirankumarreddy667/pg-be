import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`user_payment\`
			ADD COLUMN \`payment_history_id\` INT NOT NULL DEFAULT 0 AFTER \`plan_exp_date\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`user_payment\`
			DROP COLUMN \`payment_history_id\`;
		`)
	},
}
