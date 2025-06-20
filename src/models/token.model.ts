import { Model, DataTypes, Sequelize } from 'sequelize'
import { TokenAttributes } from '@/types/index'

export class Token extends Model<TokenAttributes> implements TokenAttributes {
	public id!: string
	public userId!: string
	public token!: string
	public type!: 'access' | 'refresh'
	public expiresAt!: Date
	public isRevoked!: boolean
	public readonly createdAt!: Date
	public readonly updatedAt!: Date
}

export type TokenCreationAttributes = Omit<
	TokenAttributes,
	'id' | 'createdAt' | 'updatedAt'
>

const TokenModel = (sequelize: Sequelize): typeof Token => {
	Token.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM('access', 'refresh'),
				allowNull: false,
			},
			expiresAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			isRevoked: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			tableName: 'tokens',
			timestamps: true,
		},
	)

	return Token
}

export default TokenModel
