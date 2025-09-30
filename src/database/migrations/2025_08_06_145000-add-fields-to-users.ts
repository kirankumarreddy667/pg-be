import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`users\`
      ADD COLUMN \`google_id\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL UNIQUE AFTER \`deleted_at\`,
      ADD COLUMN \`facebook_id\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL UNIQUE AFTER \`google_id\`,
      ADD COLUMN \`provider\` JSON DEFAULT NULL AFTER \`facebook_id\`,
      ADD COLUMN \`avatar\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER \`provider\`;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`users\`
      DROP COLUMN \`avatar\`,
      DROP COLUMN \`provider\`,
      DROP COLUMN \`facebook_id\`,
      DROP COLUMN \`google_id\`;
    `)
	},
}
