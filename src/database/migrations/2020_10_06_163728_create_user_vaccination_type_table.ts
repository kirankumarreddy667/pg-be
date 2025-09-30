import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`user_vaccination_type\` (
        \`vaccination_id\` int NOT NULL,
        \`type_id\` int NOT NULL,
        PRIMARY KEY (\`vaccination_id\`, \`type_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`user_vaccination_type\`
    `)
	},
}
