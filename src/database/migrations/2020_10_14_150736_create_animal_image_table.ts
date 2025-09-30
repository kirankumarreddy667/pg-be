import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`animal_image\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`user_id\` int NOT NULL,
                \`animal_id\` int NOT NULL,
                \`animal_number\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`image\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=1440 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_image')
	},
}
