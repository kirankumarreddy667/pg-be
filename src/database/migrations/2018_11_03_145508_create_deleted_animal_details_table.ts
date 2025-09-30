import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`deleted_animal_details\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`user_id\` int NOT NULL,
				\`animal_id\` int NOT NULL,
				\`animal_number\` varchar(195) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`question_id\` int NOT NULL,
				\`answer\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=23150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('deleted_animal_details')
	},
}
