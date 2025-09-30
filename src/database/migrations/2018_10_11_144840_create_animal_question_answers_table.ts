import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`animal_question_answers\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`question_id\` int NOT NULL,
				\`user_id\` int NOT NULL,
				\`answer\` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`),
				KEY \`animal_question_answers_user_id_index\` (\`user_id\`)
			) ENGINE=InnoDB  AUTO_INCREMENT=1321091 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('animal_question_answers')
	},
}
