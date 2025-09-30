import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`category_language\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`category_id\` int NOT NULL,
				\`language_id\` int NOT NULL,
				\`category_language_name\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('category_language')
	},
}
