import { BusinessOutlet, User, Role, RoleUser } from '@/models/index'
import { generateRandomPassword } from '@/utils/password'
import { addToEmailQueue } from '@/queues/email.queue'
import db from '@/config/database'
import { Transaction } from 'sequelize'

interface CreateBusinessOutletInput {
	business_name: string
	owner_name: string
	email: string
	mobile: string
	business_address: string
}

interface OwnerInfo {
	id: number
	name: string
	email?: string
	phone_number: string
}

interface OutletResult {
	id: number
	business_name: string
	business_address: string
	owner: OwnerInfo
}

async function createOutletAndSendEmail({
	userId,
	name,
	email,
	phone_number,
	business_name,
	business_address,
	password,
	roleName,
	transaction,
}: {
	userId: number
	name: string
	email: string
	phone_number: string
	business_name: string
	business_address: string
	password: string
	roleName: string
	transaction: Transaction
}): Promise<OutletResult> {
	const role = await Role.findOne({ where: { name: roleName }, transaction })
	if (role) {
		await RoleUser.create(
			{
				user_id: userId,
				role_id: role.get('id'),
			},
			{ transaction },
		)
	}
	const outlet = await BusinessOutlet.create(
		{
			user_id: userId,
			business_name,
			business_address,
		},
		{ transaction },
	)
	addToEmailQueue({
		to: email,
		subject: 'Login Details',
		template: 'businessCredentials',
		data: {
			name,
			phone: phone_number,
			password,
		},
	})

	return {
		id: outlet.get('id'),
		business_name: outlet.business_name,
		business_address: outlet.business_address,
		owner: {
			id: userId,
			name,
			email,
			phone_number,
		},
	}
}

export class BusinessOutletService {
	public static async create({
		business_name,
		owner_name,
		email,
		mobile,
		business_address,
	}: CreateBusinessOutletInput): Promise<OutletResult> {
		const transaction = await db.sequelize.transaction()
		try {
			const existingUser = await User.findOne({
				where: { phone_number: mobile },
				transaction,
			})
			if (existingUser) {
				const existingOutlet = await BusinessOutlet.findOne({
					where: { user_id: existingUser.get('id') },
					transaction,
				})
				if (existingOutlet) {
					await transaction.rollback()
					throw new Error('Mobile already taken as a business outlet owner.')
				}
				const password = generateRandomPassword(8)
				await existingUser.update({ password: password }, { transaction })
				const result = await createOutletAndSendEmail({
					userId: existingUser.get('id'),
					name: owner_name,
					email,
					phone_number: mobile,
					business_name,
					business_address,
					password,
					roleName: 'Business',
					transaction,
				})
				await transaction.commit()
				return result
			}
			
			const password = generateRandomPassword(8)
			const user = await User.create(
				{
					name: owner_name,
					email,
					phone_number: mobile,
					password,
				},
				{ transaction },
			)
			const result = await createOutletAndSendEmail({
				userId: user.id,
				name: owner_name,
				email,
				phone_number: mobile,
				business_name,
				business_address,
				password,
				roleName: 'Business',
				transaction,
			})
			await transaction.commit()
			return result
		} catch (err) {
			await transaction.rollback()
			throw err
		}
	}

	public static async list(): Promise<BusinessOutlet[]> {
		return BusinessOutlet.findAll()
	}

	public static async update(
		id: number,
		data: Partial<{
			business_name: string
			business_address: string
			owner_name: string
			email: string
		}>,
	): Promise<BusinessOutlet> {
		const transaction = await db.sequelize.transaction()
		try {
			const outlet = await BusinessOutlet.findByPk(id, { transaction })
			if (!outlet) throw new Error('Business outlet not found')
			if (data.business_name) outlet.business_name = data.business_name
			if (data.business_address) outlet.business_address = data.business_address
			await outlet.save({ transaction })
			if (data.owner_name || data.email) {
				const user = await User.findByPk(outlet.user_id, { transaction })
				if (user) {
					if (data.owner_name) user.name = data.owner_name
					if (data.email) user.email = data.email
					await user.save({ transaction })
				}
			}
			await transaction.commit()
			return outlet
		} catch (err) {
			await transaction.rollback()
			throw err
		}
	}

	public static async delete(id: number): Promise<boolean> {
		const transaction = await db.sequelize.transaction()
		try {
			const outlet = await BusinessOutlet.findByPk(id, { transaction })
			if (!outlet) throw new Error('Business outlet not found')
			await outlet.destroy({ transaction })
			await transaction.commit()
			return true
		} catch (err) {
			await transaction.rollback()
			throw err
		}
	}
}
