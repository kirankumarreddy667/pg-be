import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface SummernoteAttributes {
	id?: number
	article_category_id: number
	language_id: number
	content: string
	article_thumb: string
	article_header: string
	article_summary: string
	article_images: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class Summernote
	extends Model<
		SummernoteAttributes,
		Optional<
			SummernoteAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
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
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof Summernote => {
	Summernote.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
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
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			article_header: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			article_summary: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			article_images: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'summernotes',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return Summernote
}
