import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface SliderArticleAttributes {
	id?: number
	language_id: number
	name: string
	image: string
	web_url: string
	subtitle?: string | null
	thumbnail: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class SliderArticle
	extends Model<
		SliderArticleAttributes,
		Optional<
			SliderArticleAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'subtitle'
		>
	>
	implements SliderArticleAttributes
{
	public id!: number
	public language_id!: number
	public name!: string
	public image!: string
	public web_url!: string
	public subtitle?: string | null
	public thumbnail!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default function SliderArticleModel(
	sequelize: Sequelize,
): typeof SliderArticle {
	SliderArticle.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			web_url: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			subtitle: {
				type: DataTypes.STRING(191),
				allowNull: true,
			},
			thumbnail: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'slider_articles',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return SliderArticle
}
