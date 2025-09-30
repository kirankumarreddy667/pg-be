import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`products\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`product_category_id\` int NOT NULL,
        \`language\` int NOT NULL,
        \`product_title\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`product_images\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`product_amount\` int DEFAULT NULL,
        \`product_description\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        \`product_variants\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`product_delivery_to\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        \`product_specifications\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`created_at\` timestamp NULL DEFAULT NULL,
        \`updated_at\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`products\`;
    `)
	},
}
