import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`offers\`
      ADD COLUMN \`additional_months\` INT DEFAULT NULL,
      ADD COLUMN \`additional_years\` INT DEFAULT NULL;
    `)
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(`
      ALTER TABLE \`offers\`
      DROP COLUMN \`additional_months\`,
      DROP COLUMN \`additional_years\`;
    `)
	},
}
