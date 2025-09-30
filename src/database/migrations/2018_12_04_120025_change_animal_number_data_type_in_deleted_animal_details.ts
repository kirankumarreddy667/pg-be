import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`deleted_animal_details\` 
			CHANGE \`animal_number\` \`animal_number\` VARCHAR(11) NOT NULL;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			ALTER TABLE \`deleted_animal_details\` 
			CHANGE \`animal_number\` \`animal_number\` VARCHAR(195) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
		`)
	},
}
