import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`fixed_investment_details\` (
				\`id\` int unsigned NOT NULL AUTO_INCREMENT,
				\`type_of_investment\` int NOT NULL,
				\`amount_in_rs\` int NOT NULL,
				\`user_id\` int NOT NULL,
				\`date_of_installation_or_purchase\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				\`created_at\` timestamp NULL DEFAULT NULL,
				\`updated_at\` timestamp NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=7314 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('fixed_investment_details')
	},
}
