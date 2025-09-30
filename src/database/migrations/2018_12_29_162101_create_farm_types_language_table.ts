import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`farm_types_language\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`farm_type_id\` int NOT NULL,
				\`language_id\` int NOT NULL,
				\`name\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('farm_types_language')
	},
}
