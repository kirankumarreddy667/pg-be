import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`daily_record_question_answer\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`daily_record_question_id\` int NOT NULL,
				\`user_id\` int NOT NULL,
				\`answer\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`answer_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`),
				KEY \`daily_record_question_answer_user_id_index\` (\`user_id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=467220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('daily_record_question_answer')
	},
}
