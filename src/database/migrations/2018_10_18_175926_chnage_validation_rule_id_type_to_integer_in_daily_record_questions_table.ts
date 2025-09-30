import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\`
			CHANGE \`validation_rule_id\` \`validation_rule_id\` INT(191) NOT NULL;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		// Revert to previous type, assuming it was VARCHAR(191) — adjust if it was different
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\`
			CHANGE \`validation_rule_id\` \`validation_rule_id\` VARCHAR(191) NOT NULL;
		`)
	},
}
