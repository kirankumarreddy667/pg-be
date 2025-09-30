import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`animal_questions\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`category_id\` int NOT NULL,
				\`sub_category_id\` int DEFAULT NULL,
				\`question\` text NOT NULL,
				\`validation_rule_id\` varchar(255) NOT NULL,
				\`animal_id\` int NOT NULL,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`),
				KEY \`animal_questions_animal_id_index\` (\`animal_id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_questions')
	},
}
