import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`question_tag_mapping\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`question_id\` INT NOT NULL,
        \`question_tag_id\` INT NOT NULL,
        \`created_at\` TIMESTAMP NULL DEFAULT NULL,
        \`updated_at\` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`question_tag_mapping\`;
    `)
	},
}
