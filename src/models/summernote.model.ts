import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface SummernoteAttributes {
	id?: number
	article_category_id: number
	language_id: number
	content: string
	article_thumb: string
	article_header: string
	article_summary: string
	article_images: string // JSON string
	created_at?: Date
	updated_at?: Date
}

export class Summernote
	extends Model<
		SummernoteAttributes,
		Optional<SummernoteAttributes, 'id' | 'created_at' | 'updated_at'>
	>
	implements SummernoteAttributes
{
	public id!: number
	public article_category_id!: number
	public language_id!: number
	public content!: string
	public article_thumb!: string
	public article_header!: string
	public article_summary!: string
	public article_images!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date
}

export default (sequelize: Sequelize): typeof Summernote => {
	Summernote.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			article_category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			language_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			content: {
				type: DataTypes.TEXT('long'),
				allowNull: false,
			},
			article_thumb: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			article_header: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			article_summary: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			article_images: {
				type: DataTypes.TEXT,
				allowNull: false,
				comment: 'JSON string: [{"img":"filename.jpg","name":"desc"}]',
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
			tableName: 'summernotes',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	)
	return Summernote
}
