import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\` 
			CHANGE \`question_tag\` \`question_tag\` INT(191) NOT NULL, 
			CHANGE \`question_unit\` \`question_unit\` INT(191) NOT NULL;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`daily_record_questions\` 
			CHANGE \`question_tag\` \`question_tag\` VARCHAR(191) NULL, 
			CHANGE \`question_unit\` \`question_unit\` VARCHAR(191) NULL;
		`)
	},
}
