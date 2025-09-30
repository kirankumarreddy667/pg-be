import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`subcategories\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`name\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`created_at\` timestamp NULL DEFAULT NULL,
        \`updated_at\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`subcategories_name_unique\` (\`name\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`subcategories\`;
    `)
	},
}
