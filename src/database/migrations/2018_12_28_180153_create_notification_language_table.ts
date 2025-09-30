import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`notification_language\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`user_id\` int NOT NULL,
				\`language_id\` int NOT NULL,
				\`langauge_message\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`heading\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`animal_id\` int NOT NULL,
				\`animal_number\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`send_notification_date\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=1317304 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('notification_language')
	},
}
