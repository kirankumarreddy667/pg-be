import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`vaccination_details\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`expense\` double(10,2) NOT NULL,
        \`date\` date NOT NULL,
        \`created_at\` timestamp NULL DEFAULT NULL,
        \`updated_at\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=1584 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE \`vaccination_details\`;
    `)
	},
}
