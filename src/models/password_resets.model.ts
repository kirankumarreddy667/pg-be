import { Model, DataTypes, Sequelize, Optional } from 'sequelize'

export interface PasswordResetAttributes {
	email: string
	token: string
	created_at?: Date | null
}

export class PasswordReset
	extends Model<
		PasswordResetAttributes,
		Optional<PasswordResetAttributes, 'created_at'>
	>
	implements PasswordResetAttributes
{
	public email!: string
	public token!: string
	public created_at?: Date | null
}

export default function PasswordResetModel(
	sequelize: Sequelize,
): typeof PasswordReset {
	PasswordReset.init(
		{
			email: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
			token: {
				type: DataTypes.STRING(191),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'password_resets',
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci',
		},
	)

	return PasswordReset
}
