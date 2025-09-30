import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`animal_lactation_yield_history\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`user_id\` int NOT NULL,
				\`animal_id\` int NOT NULL,
				\`animal_number\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`date\` date DEFAULT NULL,
				\`pregnancy_status\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
				\`lactating_status\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`),
				KEY \`animal_lactation_yield_history_user_id_index\` (\`user_id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=53486 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_lactation_yield_history')
	},
}
