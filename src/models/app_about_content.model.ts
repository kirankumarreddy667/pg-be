import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface AppAboutContentAttributes {
	id: number
	type: string
	language_id: number
	content: string
	created_at?: Date
	updated_at?: Date
}

export class AppAboutContent
	extends Model<
		AppAboutContentAttributes,
		Optional<AppAboutContentAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements AppAboutContentAttributes
{
	public id!: number
	public type!: string
	public language_id!: number
	public content!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof AppAboutContent => {
	AppAboutContent.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: 'AppAboutContent',
			tableName: 'app_about_contents',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return AppAboutContent
}
