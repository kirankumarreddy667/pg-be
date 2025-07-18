import db from '@/config/database'
import { Op } from 'sequelize'
import type { User } from '@/types/index'

export class PedigreeService {
	public static async getPedigree(
		user: User,
		animal_id: number,
		animal_number: string,
	): Promise<{
		mother: { tag_no: string; milk_yield: number }
		father: {
			tag_no: string
			semen_co_name: string
			sire_dam_yield: number | string
			daughter_yield: string
		}
	}> {
		const motherNo = await db.AnimalMotherCalf.findOne({
			where: { user_id: user.id, animal_id, calf_animal_number: animal_number },
			attributes: ['mother_animal_number', 'delivery_date'],
			raw: true,
		})
		let mother_milk_yield = 0
		let motherBullNoUsedForAI = ''
		let semen_co_name = ''
		let sire_dam_yield = ''
		if (motherNo) {
			mother_milk_yield =
				((await db.DailyMilkRecord.sum('morning_milk_in_litres', {
					where: {
						user_id: user.id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
					},
				})) ?? 0) +
				((await db.DailyMilkRecord.sum('evening_milk_in_litres', {
					where: {
						user_id: user.id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
					},
				})) ?? 0)
			const dateOfAI = await db.AnimalQuestionAnswer.findOne({
				where: {
					user_id: user.id,
					animal_id,
					animal_number: motherNo.mother_animal_number,
					status: { [Op.ne]: 1 },
				},
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 23 },
						attributes: [],
					},
				],
				order: [['created_at', 'DESC']],
				attributes: ['answer', 'created_at'],
				raw: true,
			})
			if (dateOfAI) {
				const [noOfBullUsedForAI, semenCoName, bullMotherYield] =
					await Promise.all([
						db.AnimalQuestionAnswer.findOne({
							where: {
								user_id: user.id,
								animal_id,
								animal_number: motherNo.mother_animal_number,
								status: { [Op.ne]: 1 },
								created_at: dateOfAI.created_at,
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 35 },
									attributes: [],
								},
							],
							attributes: ['answer'],
							raw: true,
						}) as Promise<{ answer?: string } | null>,
						db.AnimalQuestionAnswer.findOne({
							where: {
								user_id: user.id,
								animal_id,
								animal_number: motherNo.mother_animal_number,
								status: { [Op.ne]: 1 },
								created_at: dateOfAI.created_at,
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 42 },
									attributes: [],
								},
							],
							attributes: ['answer'],
							raw: true,
						}) as Promise<{ answer?: string } | null>,
						db.AnimalQuestionAnswer.findOne({
							where: {
								user_id: user.id,
								animal_id,
								animal_number: motherNo.mother_animal_number,
								status: { [Op.ne]: 1 },
								created_at: dateOfAI.created_at,
							},
							include: [
								{
									model: db.CommonQuestions,
									as: 'CommonQuestion',
									where: { question_tag: 14 },
									attributes: [],
								},
							],
							attributes: ['answer'],
							raw: true,
						}) as Promise<{ answer?: string } | null>,
					])
				motherBullNoUsedForAI = noOfBullUsedForAI?.answer ?? ''
				semen_co_name = semenCoName?.answer ?? ''
				sire_dam_yield = bullMotherYield?.answer ?? ''
			}
		}
		return {
			mother: {
				tag_no: motherNo?.mother_animal_number ?? '',
				milk_yield: Number(mother_milk_yield.toFixed(1)),
			},
			father: {
				tag_no: motherBullNoUsedForAI,
				semen_co_name: semen_co_name,
				sire_dam_yield: sire_dam_yield
					? Number(parseFloat(sire_dam_yield).toFixed(1))
					: '',
				daughter_yield: '',
			},
		}
	}

	public static async getFamilyRecord(
		user: User,
		animal_id: number,
		animal_number: string,
	): Promise<{
		parent: Array<{ animal_id: number; mother_no?: string; bull_no?: string }>
		children: Array<{ animal_id: number; calf_number: string }>
	}> {
		let bullNoUsed = ''
		const motherNo = await db.AnimalMotherCalf.findOne({
			where: {
				user_id: user.id,
				animal_id,
				calf_animal_number: animal_number,
			},
			attributes: ['mother_animal_number', 'delivery_date'],
			raw: true,
		})
		if (motherNo) {
			const dateOfAI = await db.AnimalQuestionAnswer.findOne({
				where: {
					user_id: user.id,
					animal_id,
					animal_number: motherNo.mother_animal_number,
					status: { [Op.ne]: 1 },
					answer: { [Op.lte]: motherNo.delivery_date },
				},
				include: [
					{
						model: db.CommonQuestions,
						as: 'CommonQuestion',
						where: { question_tag: 23 },
						attributes: [],
					},
				],
				order: [['created_at', 'DESC']],
				attributes: ['answer', 'created_at'],
				raw: true,
			})
			if (dateOfAI) {
				const noOfBullUsed = await db.AnimalQuestionAnswer.findOne({
					where: {
						user_id: user.id,
						animal_id,
						animal_number: motherNo.mother_animal_number,
						created_at: dateOfAI.created_at,
						status: { [Op.ne]: 1 },
					},
					include: [
						{
							model: db.CommonQuestions,
							as: 'CommonQuestion',
							where: { question_tag: 35 },
							attributes: [],
						},
					],
					attributes: ['answer', 'created_at'],
					raw: true,
				})
				bullNoUsed = noOfBullUsed?.answer ?? ''
			}
		}
		const childrenRows = (await db.AnimalMotherCalf.findAll({
			where: {
				user_id: user.id,
				animal_id,
				mother_animal_number: animal_number,
			},
			attributes: [['calf_animal_number', 'calf_number']],
			raw: true,
		})) as unknown as Array<{ calf_number: string }>
		const children = childrenRows.map((row) => ({
			animal_id,
			calf_number: row.calf_number,
		}))
		const mother = {
			animal_id,
			mother_no: motherNo?.mother_animal_number ?? '',
		}
		const father = { animal_id, bull_no: bullNoUsed ?? '' }
		return {
			parent: [mother, father],
			children,
		}
	}
}
