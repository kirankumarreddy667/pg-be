import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`daily_record_questions\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`category_id\` int DEFAULT NULL,
				\`sub_category_id\` int DEFAULT NULL,
				\`question\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`validation_rule_id\` int NOT NULL,
				\`form_type_id\` int NOT NULL,
				\`date\` tinyint(1) NOT NULL DEFAULT '0',
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('daily_record_questions')
	},
}
