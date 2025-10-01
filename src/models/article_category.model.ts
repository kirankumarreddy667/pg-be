import { DataTypes, Model, Sequelize, Optional } from 'sequelize'

export interface ArticleCategoryAttributes {
	id?: number
	name: string
	created_at?: Date | null
	updated_at?: Date | null
	deleted_at?: Date | null
}

export class ArticleCategory
	extends Model<
		ArticleCategoryAttributes,
		Optional<
			ArticleCategoryAttributes,
			'id' | 'created_at' | 'updated_at' | 'deleted_at'
		>
	>
	implements ArticleCategoryAttributes
{
	public id!: number
	public name!: string
	public created_at?: Date | null
	public updated_at?: Date | null
	public deleted_at?: Date | null
}

export default (sequelize: Sequelize): typeof ArticleCategory => {
	ArticleCategory.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'article_category',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			paranoid: true,
			deletedAt: 'deleted_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)
	return ArticleCategory
}
