import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`otp\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`user_id\` int unsigned NOT NULL,
        \`otp\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`created_at\` timestamp NULL DEFAULT NULL,
        \`updated_at\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`otp_user_id_foreign\` (\`user_id\`),
        CONSTRAINT \`otp_user_id_foreign\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=51582 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`otp\`;
    `)
	},
}
