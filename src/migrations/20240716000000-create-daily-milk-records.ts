import { QueryInterface } from 'sequelize'

module.exports = {
	up: async (
		queryInterface: QueryInterface,
		Sequelize: typeof import('sequelize'),
	) => {
		await queryInterface.createTable('daily_milk_records', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onDelete: 'CASCADE',
			},
			animal_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'animals', key: 'id' },
				onDelete: 'CASCADE',
			},
			animal_number: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			record_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			morning_milk_in_litres: {
				type: Sequelize.DECIMAL(8, 2),
				allowNull: false,
			},
			evening_milk_in_litres: {
				type: Sequelize.DECIMAL(8, 2),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})
		await queryInterface.addIndex('daily_milk_records', [
			'animal_id',
			'record_date',
		])
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable('daily_milk_records')
	},
}
