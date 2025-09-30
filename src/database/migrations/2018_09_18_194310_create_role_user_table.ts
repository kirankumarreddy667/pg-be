import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`role_user\` (
        \`user_id\` int unsigned NOT NULL,
        \`role_id\` int unsigned NOT NULL,
        PRIMARY KEY (\`user_id\`, \`role_id\`),
        KEY \`role_user_role_id_foreign\` (\`role_id\`),
        CONSTRAINT \`role_user_role_id_foreign\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`role_user_user_id_foreign\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`role_user\`;
    `)
	},
}
