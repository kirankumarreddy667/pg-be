import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface SliderArticleAttributes {
	id: number
	language_id: number
	name: string
	image: string
	web_url: string
	subtitle?: string | null
	thumbnail: string
	created_at?: Date
	updated_at?: Date
}

export class SliderArticle
	extends Model<
		SliderArticleAttributes,
		Optional<SliderArticleAttributes, 'id' | 'created_at' | 'updated_at'>
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
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof SliderArticle => {
	SliderArticle.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			web_url: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			subtitle: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			thumbnail: {
				type: DataTypes.STRING,
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
			modelName: 'SliderArticle',
			tableName: 'slider_articles',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return SliderArticle
}
