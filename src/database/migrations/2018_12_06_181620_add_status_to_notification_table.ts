import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`notification\` ADD \`status\` TINYINT(1) NOT NULL DEFAULT 0;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`notification\` DROP COLUMN \`status\`;
    `)
	},
}
