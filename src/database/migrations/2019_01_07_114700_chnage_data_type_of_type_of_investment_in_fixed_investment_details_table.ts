import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`fixed_investment_details\`
			CHANGE \`type_of_investment\` \`type_of_investment\` INT(191) NOT NULL;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`fixed_investment_details\`
			CHANGE \`type_of_investment\` \`type_of_investment\` INT NOT NULL;
		`)
	},
}
