import { QueryInterface } from 'sequelize'

module.exports = {
	async up(queryInterface: QueryInterface) {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`user_offers\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`offer_id\` int NOT NULL,
        \`plan_id\` int DEFAULT NULL,
        \`product_id\` int DEFAULT NULL,
        \`offer_type\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`created_at\` timestamp NULL DEFAULT NULL,
        \`updated_at\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`user_offers\`;
    `)
	},
}
