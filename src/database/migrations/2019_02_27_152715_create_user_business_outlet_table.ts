import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`user_business_outlet\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`business_outlet_id\` int NOT NULL,
        \`created_at\` timestamp NULL DEFAULT NULL,
        \`updated_at\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=11459 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`user_business_outlet\`;
    `)
	},
}
