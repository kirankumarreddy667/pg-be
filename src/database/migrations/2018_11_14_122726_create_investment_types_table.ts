import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`investment_types\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`investment_type\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`created_at\` timestamp NULL DEFAULT NULL,
        \`updated_at\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('investment_types')
	},
}
