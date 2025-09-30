import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface AppAboutContentAttributes {
	id: number
	type: string
	language_id: number
	content: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class AppAboutContent
	extends Model<
		AppAboutContentAttributes,
		Optional<
			AppAboutContentAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements AppAboutContentAttributes
{
	public id!: number
	public type!: string
	public language_id!: number
	public content!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function AppAboutContentModel(
	sequelize: Sequelize,
): typeof AppAboutContent {
	AppAboutContent.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING(191),
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
			tableName: 'app_about_contents',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return AppAboutContent
}
