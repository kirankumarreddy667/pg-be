import db from '@/config/database'
import {
	FarmDetails,
	InvestmentDetails,
} from '@/controllers/farm_management.controller'
import { FarmTypesLanguage } from '@/models/farm_types_language.model'
import { FixedInvestmentDetails } from '@/models/fixed_investment_details.model'
import { InvestmentTypesLanguage } from '@/models/investment_types_language.model'

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
			where: { user_id: userId },
		})
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
		return { status: 201, message: 'Success', data: [] }
	}

	static async showFarmDetails(
		userId: number,
	): Promise<ServiceResponse<Record<string, unknown>>> {
		const user = await db.User.findByPk(userId)
		if (!user) return { status: 404, message: 'User not found', data: {} }
		const userFarmDetails = await db.UserFarmDetails.findOne({
			where: { user_id: userId },
		})
		const data = {
			user_id: userId ?? null,
			farm_name: userFarmDetails?.get('farm_name') ?? userFarmDetails?.farm_name ?? null,
			farm_type:
				userFarmDetails?.get('farm_type') ?? userFarmDetails?.farm_type ?? null,
			farm_type_id:
				userFarmDetails?.get('farm_type_id') ??
				userFarmDetails?.farm_type_id ??
				null,
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
	): Promise<ServiceResponse<[]>> {
		await db.User.update(
			{ farm_name: body.farm_name },
			{ where: { id: userId } },
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
			{ where: { user_id: userId } },
		)
		if (affectedRows > 0) {
			return { status: 200, message: 'Success', data: [] }
		} else {
			return { status: 400, message: 'Something went wrong', data: [] }
		}
	}

	static async farmTypes(
		language_id: number,
	): Promise<
		ServiceResponse<Array<{ id: number; name: string; language_id: number }>>
	> {
		const farmTypes: FarmTypesLanguage[] = await db.FarmTypesLanguage.findAll({
			where: { language_id },
		})
		const data = farmTypes.map((value) => ({
			id: value.farm_type_id,
			name: value.name,
			language_id: value.language_id,
		}))
		return { status: 200, message: 'Success', data }
	}

	static async storeFixedInvestmentDetails(
		userId: number,
		body: InvestmentDetails,
	): Promise<ServiceResponse<[]>> {
		if (!userId) return { status: 401, message: 'User not found', data: [] }
		await db.FixedInvestmentDetails.create({
			user_id: userId,
			type_of_investment: body.type_of_investment,
			amount_in_rs: body.amount_in_rs,
			date_of_installation_or_purchase: body.date_of_installation_or_purchase,
		})
		return { status: 201, message: 'Success', data: [] }
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
				where: { language_id },
				order: [['created_at', 'ASC']],
			})
		const resData = data.map((value) => ({
			id: value.investment_type_id,
			language_id: value.language_id,
			investment_type_id: value.investment_type_id,
			investment_type: value.investment_type,
		}))
		return { status: 200, message: 'Success', data: resData }
	}

	static async investmentDetailsReport(
		user_id: number,
	): Promise<ServiceResponse<FixedInvestmentDetails[]>> {
		const data: FixedInvestmentDetails[] =
			await db.FixedInvestmentDetails.findAll({ where: { user_id } })
		return { status: 200, message: 'Success', data }
	}
}
