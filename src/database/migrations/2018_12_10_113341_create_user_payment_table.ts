import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			CREATE TABLE \`user_payment\` (
				\`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
				\`user_id\` INT NOT NULL,
				\`plan_id\` INT NOT NULL,
				\`amount\` INT NOT NULL,
				\`payment_id\` INT NOT NULL,
				\`num_of_valid_years\` INT NOT NULL,
				\`plan_exp_date\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				\`email\` VARCHAR(191) NULL,
				\`billing_instrument\` VARCHAR(191) NOT NULL,
				\`phone\` VARCHAR(191) NOT NULL,
				\`created_at\` TIMESTAMP NULL DEFAULT NULL,
				\`updated_at\` TIMESTAMP NULL DEFAULT NULL,
				PRIMARY KEY (\`id\`)
			) ENGINE=InnoDB AUTO_INCREMENT=498 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
		`)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
			DROP TABLE IF EXISTS \`user_payment\`;
		`)
	},
}
