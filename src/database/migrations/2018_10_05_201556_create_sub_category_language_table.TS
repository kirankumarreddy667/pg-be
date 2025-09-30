import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
            CREATE TABLE \`sub_category_language\` (
                \`id\` int unsigned NOT NULL AUTO_INCREMENT,
                \`sub_category_id\` int NOT NULL,
                \`language_id\` int NOT NULL,
                \`sub_category_language_name\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                \`created_at\` timestamp NULL DEFAULT NULL,
                \`updated_at\` timestamp NULL DEFAULT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('sub_category_language')
	},
}
