import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`notification\` 
      CHANGE \`animal_id\` \`animal_id\` INT(11) NULL DEFAULT NULL,
      CHANGE \`animal_number\` \`animal_number\` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		// Reverting to INT and VARCHAR with no NULL explicitly (modify as needed)
		await queryInterface.sequelize.query(`
      ALTER TABLE \`notification\` 
      CHANGE \`animal_id\` \`animal_id\` INT DEFAULT NULL,
      CHANGE \`animal_number\` \`animal_number\` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL;
    `)
	},
}
