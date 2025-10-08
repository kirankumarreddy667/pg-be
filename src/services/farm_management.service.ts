import db from '@/config/database'
import {
	FarmDetails,
	InvestmentDetails,
} from '@/controllers/farm_management.controller'
import { FarmTypesLanguage } from '@/models/farm_types_language.model'
import { FixedInvestmentDetails } from '@/models/fixed_investment_details.model'
import { InvestmentTypesLanguage } from '@/models/investment_types_language.model'
import { ValidationRequestError } from '@/utils/errors'
import { Transaction } from 'sequelize'

interface ServiceResponse<T> {
	status: number
	message: string
	data: T
}

export class FarmManagementService {
	static async storeFarmDetails(
		userId: number,
		body: FarmDetails,
	): Promise<ServiceResponse<[]>> {
		if (!userId) return { status: 401, message: 'User not found', data: [] }
		const exists = await db.UserFarmDetails.findOne({
			where: { user_id: userId, deleted_at: null },
		})

		if (
			await db.UserFarmDetails.findOne({
				where: { farm_name: body.farm_name, deleted_at: null },
			})
		) {
			throw new ValidationRequestError({
				farm_name: ['The farm name has already been taken.'],
			})
		}

		if (exists)
			return {
				status: 400,
				message: 'Sorry !! cannot add more than one farm',
				data: [],
			}
		await db.UserFarmDetails.create({
			user_id: userId,
			farm_name: body.farm_name,
			farm_type: body.farm_type,
			farm_type_id: body.farm_type_id ?? null,
			loose_housing: body.loose_housing ?? null,
			silage: body.silage ?? null,
			azzola: body.azzola ?? null,
			hydroponics: body.hydroponics ?? null,
		})
		return { status: 200, message: 'Farm information successfully added', data: [] }
	}

	static async showFarmDetails(
		userId: number,
	): Promise<ServiceResponse<Record<string, unknown>>> {
		const user = await db.User.findOne({
			where: { id: userId, deleted_at: null },
		})
		if (!user) return { status: 404, message: 'User not found', data: {} }
		const userFarmDetails = await db.UserFarmDetails.findOne({
			where: { user_id: userId, deleted_at: null },
		})

		const totalFixedInvestment =
			((await db.FixedInvestmentDetails.sum('amount_in_rs', {
				where: { user_id: userId, deleted_at: null },
			})) as number | null) ?? 0

		const data = {
			user_id: userId ?? null,
			farm_name: user?.get('farm_name') ?? userFarmDetails?.farm_name ?? null,
			// address: userFarmDetails?.address ?? null, // not available in current model
			farm_type:
				userFarmDetails?.get('farm_type') ?? userFarmDetails?.farm_type ?? null,
			farm_type_id:
				userFarmDetails?.get('farm_type_id') ??
				userFarmDetails?.farm_type_id ??
				null,
			fixed_investment_amount: totalFixedInvestment,
			loose_housing:
				userFarmDetails?.get('loose_housing') ??
				userFarmDetails?.loose_housing ??
				null,
			silage: userFarmDetails?.get('silage') ?? userFarmDetails?.silage ?? null,
			azzola: userFarmDetails?.get('azzola') ?? userFarmDetails?.azzola ?? null,
			hydroponics:
				userFarmDetails?.get('hydroponics') ??
				userFarmDetails?.hydroponics ??
				null,
		}
		return { status: 200, message: 'Success', data }
	}

	static async updateFarmDetails(
		userId: number,
		body: FarmDetails,
		transaction: Transaction,
	): Promise<ServiceResponse<[]>> {
		const farmDetails = await db.UserFarmDetails.findOne({
			where: { farm_name: body.farm_name, deleted_at: null },
		})
		if (farmDetails && farmDetails.get('user_id') !== userId) {
			throw new ValidationRequestError({
				farm_name: ['The farm name has already been taken.'],
			})
		}
		await db.User.update(
			{ farm_name: body.farm_name },
			{ where: { id: userId }, transaction },
		)
		const [affectedRows] = await db.UserFarmDetails.update(
			{
				farm_name: body.farm_name,
				farm_type: body.farm_type,
				farm_type_id: body.farm_type_id ?? null,
				loose_housing: body.loose_housing ?? null,
				silage: body.silage ?? null,
				azzola: body.azzola ?? null,
				hydroponics: body.hydroponics ?? null,
			},
			{ where: { user_id: userId }, transaction },
		)
		if (affectedRows > 0) {
			await transaction.commit()
			return { status: 200, message: 'Farm information successfully updated', data: [] }
		} else {
			await transaction.rollback()
			return { status: 400, message: 'Something went wrong', data: [] }
		}
	}

	static async farmTypes(
		language_id: number,
	): Promise<
		ServiceResponse<Array<{ id: number; name: string; language_id: number }>>
	> {
		const farmTypes: FarmTypesLanguage[] = await db.FarmTypesLanguage.findAll({
			where: { language_id, deleted_at: null },
		})
		const data = farmTypes.map((value) => ({
			id: value.get('farm_type_id'),
			name: value.get('name'),
			language_id: value.get('language_id'),
		}))
		return { status: 200, message: 'Success', data }
	}

	static async storeFixedInvestmentDetails(
		userId: number,
		body: InvestmentDetails,
	): Promise<ServiceResponse<[]>> {
		if (!userId) return { status: 401, message: 'User not found', data: [] }

		const investmentDetails = await db.InvestmentTypesLanguage.findOne({
			where: { investment_type_id: body.type_of_investment, deleted_at: null },
		})

		if (!investmentDetails)
			throw new ValidationRequestError({
				type_of_investment: ['The selected type of investment is invalid.'],
			})

		await db.FixedInvestmentDetails.create({
			user_id: userId,
			type_of_investment: body.type_of_investment,
			amount_in_rs: body.amount_in_rs,
			date_of_installation_or_purchase: body.date_of_installation_or_purchase,
		})
		return { status: 200, message: 'Success', data: [] }
	}

	static async investmentTypes(language_id: number): Promise<
		ServiceResponse<
			Array<{
				id: number
				language_id: number
				investment_type_id: number
				investment_type: string
			}>
		>
	> {
		const data: InvestmentTypesLanguage[] =
			await db.InvestmentTypesLanguage.findAll({
				where: { language_id, deleted_at: null },
				order: [['created_at', 'ASC']],
			})
		const resData = data.map((value) => ({
			id: value.get('investment_type_id'),
			language_id: value.get('language_id'),
			investment_type_id: value.get('investment_type_id'),
			investment_type: value.get('investment_type'),
		}))
		return { status: 200, message: 'Success', data: resData }
	}

	static async investmentDetailsReport(
		user_id: number,
	): Promise<ServiceResponse<FixedInvestmentDetails[]>> {
		const data: FixedInvestmentDetails[] =
			await db.FixedInvestmentDetails.findAll({
				where: { user_id, deleted_at: null },
			})
		return { status: 200, message: 'Success', data }
	}

	static async updateInvestmentDetails(
		userId: number,
		id: number,
		data: { amount_in_rs: number; date_of_installation_or_purchase: string },
	): Promise<ServiceResponse<[]>> {
		const investmentDetails = await db.FixedInvestmentDetails.findOne({
			where: { id, user_id: userId, deleted_at: null },
		})
		if (!investmentDetails) {
			return { status: 404, message: 'Investment not found', data: [] }
		}

		const details = {
			amount_in_rs: data.amount_in_rs,
			date_of_installation_or_purchase: new Date(
				data.date_of_installation_or_purchase,
			),
			user_id: userId,
		}

		await db.FixedInvestmentDetails.update(details, { where: { id } })
		return { status: 200, message: 'Success', data: [] }
	}

	static async deleteInvestmentDetails(
		userId: number,
		id: number,
	): Promise<ServiceResponse<[]>> {
		const investmentDetails = await db.FixedInvestmentDetails.findOne({
			where: { id, user_id: userId, deleted_at: null },
		})
		if (!investmentDetails) {
			return { status: 404, message: 'Investment not found', data: [] }
		}
		await db.FixedInvestmentDetails.destroy({ where: { id } })
		return { status: 200, message: 'Success', data: [] }
	}
}
