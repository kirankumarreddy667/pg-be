import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`daily_milk_records\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`user_id\` int NOT NULL,
				\`animal_number\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`animal_id\` int NOT NULL,
				\`morning_milk_in_litres\` double(10,2) NOT NULL,
				\`evening_milk_in_litres\` double(10,2) NOT NULL,
				\`record_date\` date NOT NULL,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=430949 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('daily_milk_records')
	},
}
