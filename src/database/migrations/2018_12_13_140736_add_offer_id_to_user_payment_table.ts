import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`user_payment\`
			ADD COLUMN \`offer_id\` INT DEFAULT NULL AFTER \`updated_at\`;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`user_payment\`
			DROP COLUMN \`offer_id\`;
		`)
	},
}
