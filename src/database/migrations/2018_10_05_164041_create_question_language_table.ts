import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      CREATE TABLE \`question_language\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`question_id\` INT NOT NULL,
        \`language_id\` INT NOT NULL,
        \`question\` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        \`created_at\` TIMESTAMP NULL DEFAULT NULL,
        \`updated_at\` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS \`question_language\`;
    `)
	},
}
