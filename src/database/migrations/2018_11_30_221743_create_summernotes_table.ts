import { QueryInterface } from 'sequelize'
module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`summernotes\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`article_category_id\` int NOT NULL,
        \`language_id\` int NOT NULL,
        \`content\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`article_thumb\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`article_header\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`article_summary\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`article_images\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`created_at\` timestamp NULL DEFAULT NULL,
        \`updated_at\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`summernotes\`;
    `)
	},
}
