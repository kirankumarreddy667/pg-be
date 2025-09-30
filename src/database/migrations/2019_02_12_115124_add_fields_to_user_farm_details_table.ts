import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`user_farm_details\`
      ADD COLUMN \`loose_housing\` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER \`farm_type_id\`,
      ADD COLUMN \`silage\` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER \`loose_housing\`,
      ADD COLUMN \`azzola\` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER \`silage\`,
      ADD COLUMN \`hydroponics\` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER \`azzola\`;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`user_farm_details\`
      DROP COLUMN \`hydroponics\`,
      DROP COLUMN \`azzola\`,
      DROP COLUMN \`silage\`,
      DROP COLUMN \`loose_housing\`;
    `)
	},
}
