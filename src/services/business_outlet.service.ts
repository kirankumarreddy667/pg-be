import { BusinessOutlet, User, Role, RoleUser } from '@/models/index'
import { generateRandomPassword } from '@/utils/password'
import { addToEmailQueue } from '@/queues/email.queue'
import db from '@/config/database'
import { Transaction, Op, QueryTypes, col } from 'sequelize'
import { AnimalService, AnimalAnswerRecord } from './animal.service'
import { ValidationError, ValidationRequestError } from '@/utils/errors'

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

interface FarmerListResult {
	user_id: number
	name: string
	phone_number: string
	address: string
	created_at: Date
	id: number
}

interface AnimalCountBody {
	start_date?: string
	end_date?: string
	search: string
	type?: string
	user_id: number
}

interface AnimalCountResult {
	[animal_name: string]: {
		female: number
		heifer: number
		bull: number
		pregnant: number
		non_pregnant: number
		pregnant_heifer: number
		non_pregnant_heifer: number
		lactating: number
		nonLactating: number
	}
}

interface FarmerAnimalRow {
	animal_number: string
	user_id: number
	animal_id: number
	animal_name: string
}

type UserIdRow = { id: number }

interface DailyRecordData {
	question_tag: number
	Answers: Array<{
		answer: string
		created_at: string
		status: number
		user_id: number
	}>
}

interface UserWithCreatedAt {
	user_id: number
	created_at: string
}

interface MilkInfoResult {
	morningMilk: number
	eveningMilk: number
	morningFat: number
	eveningFat: number
	morningSNF: number
	eveningSNF: number
	totalMilk: number
	eveningSNFCount: number
	eveningFatCount: number
	morningSNFCount: number
	morningFatCount: number
	morningFatPercentage: number
	eveningFatPercentage: number
	morningSNFPercentage: number
	eveningSNFPercentage: number
}

interface HealthInfoAnimalRow {
	animal_number: string
	user_id: number
	animal_id: number
	created_at: string
	user_name: string
	farm_name: string
}

interface HealthInfoDetailed {
	animal_number: string
	totalMilkLoss: number
	animal_id: number
	diseases: string[]
	medicines: string[]
	user_name: string
	farm_name: string
	treatment_dates: string[]
}

interface HealthInfoResponse {
	health_information: {
		number_of_animal_affected: number
		total_milk_loss: number
		diseases: string[]
		medicines: string[]
	}
	detailed_information: HealthInfoDetailed[]
}

interface BreedingInfoAnimalRow {
	animal_number: string
	user_id: number
	animal_id: number
	animal_name: string
	farmer_name: string
	farm_name: string
}

interface BreedingData {
	farmer_name: string
	farm_name: string
	animal_number: string
	date_of_AI: string
	no_of_bull_used_AI: string
	semen_company_name: string
	bull_mother_yield: string
	name_of_doctor: string
	pregnancy_cycle: string
	Lactating: string
	pregnant: string
}

interface BreedingInfoResponse {
	animal_information: {
		total_animals: number
		pregnant_animals: number
		non_pregnant_animals: number
		lactating: number
		nonLactating: number
	}
	breeding_data: BreedingData[]
}

interface BreedingStats {
	pregnantAnimal: number
	nonPregnant: number
	lactating: number
	nonLactating: number
	breeding_data: BreedingData[]
}

interface HealthAggregation {
	resData: HealthInfoDetailed[]
	diseasesArray: string[]
	medicinesArray: string[]
	totalMilkLoss: number
}

export interface BusinessList {
	id: number
	business_name: string
	business_address: string
	owner_name: string
	owner_mobile_no: string
	owner_email: string
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
	const role = await Role.findOne({
		where: { name: roleName, deleted_at: null },
		transaction,
	})
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
			assign_to: userId,
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

async function getDailyRecordData(
	tag: number,
	user_id: number,
	startDate: string,
	endDate: string,
): Promise<DailyRecordData[]> {
	const records = await db.DailyRecordQuestion.findAll({
		where: { question_tag: tag, delete_status: 0 },
		include: [
			{
				model: db.AnimalQuestionAnswer,
				as: 'Answers',
				where: {
					user_id,
					created_at: { [Op.between]: [startDate, endDate] },
					status: { [Op.ne]: 1 },
					deleted_at: null,
				},
				required: true,
			},
		],
	})
	return records.map((r) => r.toJSON() as unknown as DailyRecordData)
}

function sumMilkFromAnswers(records: DailyRecordData[]): number {
	let total = 0
	for (const rec of records) {
		if (Array.isArray(rec.Answers)) {
			for (const answerObj of rec.Answers) {
				type ParsedAnswer = { amount?: unknown }
				const answer = JSON.parse(answerObj.answer) as ParsedAnswer[]
				if (
					Array.isArray(answer) &&
					answer[0] &&
					typeof answer[0].amount === 'number'
				) {
					total += answer[0].amount
				}
			}
		}
	}
	return total
}

function sumFatSnfFromAnswers(records: DailyRecordData[]): number {
	let total = 0
	for (const rec of records) {
		if (Array.isArray(rec.Answers)) {
			for (const answerObj of rec.Answers) {
				type ParsedAnswer = { name?: unknown }
				const answer = JSON.parse(answerObj.answer) as ParsedAnswer[]
				if (
					Array.isArray(answer) &&
					answer[0] &&
					typeof answer[0].name === 'number'
				) {
					total += answer[0].name
				}
			}
		}
	}
	return total
}

function countRecords(records: DailyRecordData[]): number {
	return records.length > 0 ? records.length : 1
}

const defaultMilkInfoResult: MilkInfoResult = {
	morningMilk: 0,
	eveningMilk: 0,
	morningFat: 0,
	eveningFat: 0,
	morningSNF: 0,
	eveningSNF: 0,
	totalMilk: 0,
	eveningSNFCount: 0,
	eveningFatCount: 0,
	morningSNFCount: 0,
	morningFatCount: 0,
	morningFatPercentage: 0,
	eveningFatPercentage: 0,
	morningSNFPercentage: 0,
	eveningSNFPercentage: 0,
}

async function getFarmers(
	data: {
		search: string
		type?: string
		start_date?: string
		end_date?: string
		user_id: number
	},
	outlet: BusinessOutlet | null,
): Promise<BreedingInfoAnimalRow[]> {
	if (!outlet) return []
	let userWhere: Record<string, unknown> = { deleted_at: null }
	if (data.search && data.search !== 'all_users') {
		userWhere = {
			[Op.or as unknown as string]: [
				{
					phone_number: { [Op.like as unknown as string]: `%${data.search}%` },
				},
				{ name: { [Op.like as unknown as string]: `%${data.search}%` } },
			],
		}
	}

	if (data.start_date || data.end_date) {
		userWhere.created_at = {
			...(userWhere.created_at || {}),
			...(data.start_date
				? { [Op.gte as unknown as string]: new Date(data.start_date) }
				: {}),
			...(data.end_date
				? { [Op.lte as unknown as string]: new Date(data.end_date) }
				: {}),
		}
	}

	const users = (await User.findAll({
		include: [
			{
				model: db.UserBusinessOutlet,
				as: 'UserBusinessOutlet',
				attributes: ['user_id'],
				where: { deleted_at: null },
				required: true,
			},
		],
		where: userWhere,
		attributes: ['id', 'name', 'phone_number', 'address', 'created_at'],
		raw: true,
	})) as unknown as Array<Record<string, unknown>>

	return users.map(
		(u): BreedingInfoAnimalRow => ({
			animal_number: String(u['animal_number']),
			user_id: Number(u['UserBusinessOutlet.user_id'] ?? u['id']),
			animal_id: Number(u['animal_id']),
			animal_name: String(u['animal_name']),
			farmer_name: String(u['name']),
			farm_name: String(u['farm_name']),
		}),
	)
}

async function getBreedingStats(
	farmers: BreedingInfoAnimalRow[],
): Promise<BreedingStats> {
	const breeding_data: BreedingData[] = []
	for (const value of farmers) {
		const breeding = await AnimalService._getLatestAnswerByTag(
			value.user_id,
			value.animal_id,
			value.animal_number,
			40,
		)
		if (breeding?.answer) {
			const breedingInfo = JSON.parse(breeding.answer) as BreedingData
			breeding_data.push(breedingInfo)
		}
	}

	let pregnantAnimal = 0
	let nonPregnant = 0
	let lactating = 0
	let nonLactating = 0

	for (const data of breeding_data) {
		if (data.pregnant === 'yes') {
			pregnantAnimal++
		} else {
			nonPregnant++
		}
		if (data.Lactating === 'yes') {
			lactating++
		} else {
			nonLactating++
		}
	}

	return {
		pregnantAnimal,
		nonPregnant,
		lactating,
		nonLactating,
		breeding_data,
	}
}

async function getHealthFarmers(
	data: {
		search: string
		type?: string
		start_date?: string
		end_date?: string
		user_id: number
	},
	outlet: BusinessOutlet | null,
): Promise<HealthInfoAnimalRow[]> {
	if (!outlet) return []
	const { search, type, start_date, end_date, user_id } = data
	if (
		type === 'all_time' &&
		!start_date &&
		!end_date &&
		search === 'all_users'
	) {
		return db.sequelize.query(
			`SELECT DISTINCT aqa.animal_number, aqa.user_id, aqa.animal_id, u.created_at, u.name as user_name, u.farm_name
			 FROM business_outlet bo
			 JOIN user_business_outlet ubo ON ubo.business_outlet_id = bo.id
			 JOIN animal_question_answers aqa ON aqa.user_id = ubo.user_id
			 JOIN users u ON u.id = ubo.user_id
			 WHERE bo.assign_to = :userId 
			 AND aqa.status != 1
			 AND bo.deleted_at IS NULL
			 AND ubo.deleted_at IS NULL
			 AND u.deleted_at IS NULL
			 AND aqa.deleted_at IS NULL`,
			{ replacements: { userId: user_id }, type: QueryTypes.SELECT },
		)
	} else if (start_date && end_date && !type && search === 'all_users') {
		return db.sequelize.query(
			`SELECT DISTINCT aqa.animal_number, aqa.user_id, aqa.animal_id, u.created_at, u.name as user_name, u.farm_name
			 FROM business_outlet bo
			 JOIN user_business_outlet ubo ON ubo.business_outlet_id = bo.id
			 JOIN animal_question_answers aqa ON aqa.user_id = ubo.user_id
			 JOIN users u ON u.id = ubo.user_id
			 WHERE bo.assign_to = :userId 
			 AND aqa.status != 1
			 AND bo.deleted_at IS NULL
			 AND ubo.deleted_at IS NULL
			 AND u.deleted_at IS NULL
			 AND aqa.deleted_at IS NULL
			 AND DATE(u.created_at) >= :startDate AND DATE(u.created_at) <= :endDate`,
			{
				replacements: {
					userId: user_id,
					startDate: start_date,
					endDate: end_date,
				},
				type: QueryTypes.SELECT,
			},
		)
	} else if (type === 'all_time' && !start_date && !end_date) {
		const userID: UserIdRow[] = await db.sequelize.query(
			`SELECT u.id as id
			 FROM users u
			 JOIN role_user ru ON ru.user_id = u.id
			 JOIN user_business_outlet ubo ON ubo.user_id = u.id
			 WHERE (u.phone_number LIKE :search OR u.name LIKE :search)
			   AND ru.role_id = 2 AND ubo.business_outlet_id = :outletId
			   AND u.deleted_at IS NULL
			   AND ru.deleted_at IS NULL
			   AND ubo.deleted_at IS NULL
			 LIMIT 1`,
			{
				replacements: { search: `%${search}%`, outletId: outlet.id },
				type: QueryTypes.SELECT,
			},
		)
		if (!userID[0]) return []
		return db.sequelize.query(
			`SELECT DISTINCT aqa.animal_number, aqa.user_id, aqa.animal_id, u.created_at, u.name as user_name, u.farm_name
			 FROM business_outlet bo
			 JOIN user_business_outlet ubo ON ubo.business_outlet_id = bo.id
			 JOIN animal_question_answers aqa ON aqa.user_id = ubo.user_id
			 JOIN users u ON u.id = ubo.user_id
			 WHERE bo.assign_to = :userId 
			 AND aqa.user_id = :searchUserId 
			 AND aqa.status != 1
			 AND bo.deleted_at IS NULL
			 AND ubo.deleted_at IS NULL
			 AND u.deleted_at IS NULL
			 AND aqa.deleted_at IS NULL`,
			{
				replacements: { userId: user_id, searchUserId: userID[0].id },
				type: QueryTypes.SELECT,
			},
		)
	} else if (start_date && end_date && !type) {
		const userID: UserIdRow[] = await db.sequelize.query(
			`SELECT u.id as id
			 FROM users u
			 JOIN role_user ru ON ru.user_id = u.id
			 JOIN user_business_outlet ubo ON ubo.user_id = u.id
			 WHERE (u.phone_number LIKE :search OR u.name LIKE :search)
			   AND ru.role_id = 2 AND ubo.business_outlet_id = :outletId
			   AND u.deleted_at IS NULL
			   AND ru.deleted_at IS NULL
			   AND ubo.deleted_at IS NULL
			 LIMIT 1`,
			{
				replacements: { search: `%${search}%`, outletId: outlet.id },
				type: QueryTypes.SELECT,
			},
		)
		if (!userID[0]) return []
		return db.sequelize.query(
			`SELECT DISTINCT aqa.animal_number, aqa.user_id, aqa.animal_id, u.created_at, u.name as user_name, u.farm_name
			 FROM business_outlet bo
			 JOIN user_business_outlet ubo ON ubo.business_outlet_id = bo.id
			 JOIN animal_question_answers aqa ON aqa.user_id = ubo.user_id
			 JOIN users u ON u.id = ubo.user_id
			 WHERE bo.assign_to = :userId 
			 AND aqa.user_id = :searchUserId 
			 AND aqa.status != 1
			 AND bo.deleted_at IS NULL
			 AND ubo.deleted_at IS NULL
			 AND u.deleted_at IS NULL
			 AND aqa.deleted_at IS NULL
			 AND DATE(u.created_at) >= :startDate AND DATE(u.created_at) <= :endDate`,
			{
				replacements: {
					userId: user_id,
					searchUserId: userID[0].id,
					startDate: start_date,
					endDate: end_date,
				},
				type: QueryTypes.SELECT,
			},
		)
	}
	return []
}

async function aggregateHealthInfo(
	farmers: HealthInfoAnimalRow[],
): Promise<HealthAggregation> {
	const resData: HealthInfoDetailed[] = []
	const diseasesArray: string[] = []
	const medicinesArray: string[] = []
	let totalMilkLoss = 0

	await Promise.all(
		farmers.map(async (value) => {
			let totalMilkLossAnimal = 0
			const medicine: string[] = []
			const disease: string[] = []
			const treatmentDate: string[] = []
			// Milk Loss (tag 41)
			const milkLoss = await AnimalService._getLatestAnswerByTag(
				value.user_id,
				value.animal_id,
				value.animal_number,
				41,
			)
			if (milkLoss?.answer && !isNaN(Number(milkLoss.answer))) {
				totalMilkLossAnimal = Number(milkLoss.answer)
				totalMilkLoss += totalMilkLossAnimal
			}
			// Diseases (tag 39)
			const diseases = await AnimalService._getLatestAnswerByTag(
				value.user_id,
				value.animal_id,
				value.animal_number,
				39,
			)
			if (diseases?.answer) {
				disease.push(diseases.answer)
				if (!diseasesArray.includes(diseases.answer)) {
					diseasesArray.push(diseases.answer)
				}
			}
			// Medicines (tag 55)
			const medicines = await AnimalService._getLatestAnswerByTag(
				value.user_id,
				value.animal_id,
				value.animal_number,
				55,
			)
			if (medicines?.answer) {
				medicine.push(medicines.answer)
				if (!medicinesArray.includes(medicines.answer)) {
					medicinesArray.push(medicines.answer)
				}
			}
			// Treatment Dates (tag 38)
			const treatmentDates = await AnimalService._getLatestAnswerByTag(
				value.user_id,
				value.animal_id,
				value.animal_number,
				38,
			)
			if (treatmentDates?.answer) {
				treatmentDate.push(treatmentDates.answer)
			}
			const healthDetail: HealthInfoDetailed = {
				animal_number: value.animal_number,
				totalMilkLoss: totalMilkLossAnimal,
				animal_id: value.animal_id,
				diseases: disease,
				medicines: medicine,
				user_name: value.user_name,
				farm_name: value.farm_name,
				treatment_dates: treatmentDate,
			}
			if (
				disease.length > 0 ||
				medicine.length > 0 ||
				totalMilkLossAnimal !== 0
			) {
				resData.push(healthDetail)
			}
		}),
	)
	return { resData, diseasesArray, medicinesArray, totalMilkLoss }
}

async function getMilkUsers(
	data: {
		search: string
		type?: string
		start_date?: string
		end_date?: string
		user_id: number
	},
	outlet: BusinessOutlet | null,
): Promise<UserWithCreatedAt[]> {
	const { search, user_id } = data
	if (!outlet) return []
	if (search === 'all_users') {
		return db.sequelize.query(
			`SELECT ubo.user_id, u.created_at 
			FROM user_business_outlet ubo
			JOIN business_outlet bo ON bo.id = ubo.business_outlet_id
			JOIN users u ON u.id = ubo.user_id
			WHERE bo.assign_to = :userId
			AND bo.deleted_at IS NULL
			AND ubo.deleted_at IS NULL
			AND u.deleted_at IS NULL`,
			{ replacements: { userId: user_id }, type: QueryTypes.SELECT },
		)
	} else {
		const userID: UserIdRow[] = await db.sequelize.query(
			`SELECT u.id as id FROM users u
			JOIN role_user ru ON ru.user_id = u.id
			JOIN user_business_outlet ubo ON ubo.user_id = u.id AND ubo.deleted_at IS NULL
			WHERE (u.phone_number LIKE :search OR u.name LIKE :search)
				AND ru.role_id = 2 AND ubo.business_outlet_id = :outletId
				AND u.deleted_at IS NULL
			LIMIT 1`,
			{
				replacements: { search: `%${search}%`, outletId: outlet.id },
				type: QueryTypes.SELECT,
			},
		)
		if (!userID[0]) return []
		return db.sequelize.query(
			`SELECT ubo.user_id, u.created_at FROM user_business_outlet ubo
       JOIN business_outlet bo ON bo.id = ubo.business_outlet_id
       JOIN users u ON u.id = ubo.user_id
       WHERE bo.assign_to = :userId AND u.id = :searchUserId`,
			{
				replacements: { userId: user_id, searchUserId: userID[0].id },
				type: QueryTypes.SELECT,
			},
		)
	}
}

async function aggregateMilkInfo(
	users: UserWithCreatedAt[],
	data: {
		type?: string
		start_date?: string
		end_date?: string
	},
): Promise<MilkInfoResult> {
	const resData: Record<number, MilkInfoResult> = {}
	for (const value of users) {
		let sDate = value.created_at
		let eDate = new Date().toISOString().slice(0, 10)
		if (data.type === 'all_time' && !data.start_date && !data.end_date) {
			sDate = value.created_at
			eDate = new Date().toISOString().slice(0, 10)
		} else if (data.start_date && data.end_date && !data.type) {
			sDate = data.start_date
			eDate = data.end_date
		}
		const morningMilk = await getDailyRecordData(
			26,
			value.user_id,
			sDate,
			eDate,
		)
		const eveningMilk = await getDailyRecordData(
			27,
			value.user_id,
			sDate,
			eDate,
		)
		const morningFat = await getDailyRecordData(17, value.user_id, sDate, eDate)
		const morningSNF = await getDailyRecordData(18, value.user_id, sDate, eDate)
		const eveningFat = await getDailyRecordData(19, value.user_id, sDate, eDate)
		const eveningSNF = await getDailyRecordData(20, value.user_id, sDate, eDate)
		resData[value.user_id] = {
			morningMilk: sumMilkFromAnswers(morningMilk),
			eveningMilk: sumMilkFromAnswers(eveningMilk),
			morningFat: sumFatSnfFromAnswers(morningFat),
			eveningFat: sumFatSnfFromAnswers(eveningFat),
			morningSNF: sumFatSnfFromAnswers(morningSNF),
			eveningSNF: sumFatSnfFromAnswers(eveningSNF),
			eveningSNFCount: countRecords(eveningSNF),
			eveningFatCount: countRecords(eveningFat),
			morningSNFCount: countRecords(morningSNF),
			morningFatCount: countRecords(morningFat),
			totalMilk: 0,
			morningFatPercentage: 0,
			eveningFatPercentage: 0,
			morningSNFPercentage: 0,
			eveningSNFPercentage: 0,
		}
	}
	// Aggregate
	let morningMilk = 0,
		eveningMilk = 0,
		morningFat = 0,
		eveningFat = 0,
		morningSNF = 0,
		eveningSNF = 0
	let eveningSNFCount1 = 0,
		eveningFatCount1 = 0,
		morningSNFCount1 = 0,
		morningFatCount1 = 0
	for (const data of Object.values(resData)) {
		morningMilk += data.morningMilk
		eveningMilk += data.eveningMilk
		morningFat += data.morningFat
		eveningFat += data.eveningFat
		morningSNF += data.morningSNF
		eveningSNF += data.eveningSNF
		eveningSNFCount1 += data.eveningSNFCount
		eveningFatCount1 += data.eveningFatCount
		morningSNFCount1 += data.morningSNFCount
		morningFatCount1 += data.morningFatCount
	}
	if (morningFatCount1 === 0) morningFatCount1 = 1
	if (eveningFatCount1 === 0) eveningFatCount1 = 1
	if (morningSNFCount1 === 0) morningSNFCount1 = 1
	if (eveningSNFCount1 === 0) eveningSNFCount1 = 1
	return {
		morningMilk: Number(morningMilk.toFixed(2)),
		eveningMilk: Number(eveningMilk.toFixed(2)),
		morningFat: Number(morningFat.toFixed(2)),
		eveningFat: Number(eveningFat.toFixed(2)),
		morningSNF: Number(morningSNF.toFixed(2)),
		eveningSNF: Number(eveningSNF.toFixed(2)),
		totalMilk: Number((morningMilk + eveningMilk).toFixed(2)),
		eveningSNFCount: Number(eveningSNFCount1.toFixed(2)),
		eveningFatCount: Number(eveningFatCount1.toFixed(2)),
		morningSNFCount: Number(morningSNFCount1.toFixed(2)),
		morningFatCount: Number(morningFatCount1.toFixed(2)),
		morningFatPercentage: Number((morningFat / morningFatCount1).toFixed(2)),
		eveningFatPercentage: Number((eveningFat / eveningFatCount1).toFixed(2)),
		morningSNFPercentage: Number((morningSNF / morningSNFCount1).toFixed(2)),
		eveningSNFPercentage: Number((eveningSNF / eveningSNFCount1).toFixed(2)),
	}
}

function countHeiferStats(
	heifer: AnimalAnswerRecord | null,
	pregnant: AnimalAnswerRecord | null,
): { heiferCount: number; pregnantHeifer: number; nonPregnantHeifer: number } {
	let heiferCount = 0,
		pregnantHeifer = 0,
		nonPregnantHeifer = 0
	if (heifer?.logic_value?.toLowerCase() === 'calf') {
		heiferCount++
		if (pregnant?.answer?.toLowerCase() === 'yes') pregnantHeifer++
		else nonPregnantHeifer++
	}
	return { heiferCount, pregnantHeifer, nonPregnantHeifer }
}

function countCowStats(
	pregnant: AnimalAnswerRecord | null,
	milkingStatus: AnimalAnswerRecord | null,
): {
	cowCount: number
	pregnantAnimal: number
	nonPregnant: number
	lactating: number
	nonLactating: number
} {
	const cowCount = 1
	let pregnantAnimal = 0,
		nonPregnant = 0,
		lactating = 0,
		nonLactating = 0
	if (pregnant?.answer?.toLowerCase() === 'yes') pregnantAnimal++
	else nonPregnant++
	if (milkingStatus?.answer?.toLowerCase() === 'yes') lactating++
	else nonLactating++
	return { cowCount, pregnantAnimal, nonPregnant, lactating, nonLactating }
}

function countAnimalStats(
	animalGender: AnimalAnswerRecord | null,
	heifer: AnimalAnswerRecord | null,
	pregnant: AnimalAnswerRecord | null,
	milkingStatus: AnimalAnswerRecord | null,
): {
	cowCount: number
	heiferCount: number
	bullCount: number
	pregnantAnimal: number
	nonPregnant: number
	pregnantHeifer: number
	nonPregnantHeifer: number
	lactating: number
	nonLactating: number
} {
	let cowCount = 0,
		heiferCount = 0,
		bullCount = 0,
		pregnantAnimal = 0,
		nonPregnant = 0,
		pregnantHeifer = 0,
		nonPregnantHeifer = 0,
		lactating = 0,
		nonLactating = 0
	if (!animalGender || animalGender.answer?.toLowerCase() === 'female') {
		const heiferStats = countHeiferStats(heifer, pregnant)
		heiferCount += heiferStats.heiferCount
		pregnantHeifer += heiferStats.pregnantHeifer
		nonPregnantHeifer += heiferStats.nonPregnantHeifer
		if (heiferStats.heiferCount === 0) {
			const cowStats = countCowStats(pregnant, milkingStatus)
			cowCount += cowStats.cowCount
			pregnantAnimal += cowStats.pregnantAnimal
			nonPregnant += cowStats.nonPregnant
			lactating += cowStats.lactating
			nonLactating += cowStats.nonLactating
		}
	} else if (animalGender.answer?.toLowerCase() === 'male') {
		bullCount++
	}
	return {
		cowCount,
		heiferCount,
		bullCount,
		pregnantAnimal,
		nonPregnant,
		pregnantHeifer,
		nonPregnantHeifer,
		lactating,
		nonLactating,
	}
}

async function aggregateAnimalCounts(
	farmers: FarmerAnimalRow[],
): Promise<AnimalCountResult> {
	async function getAnimalData(
		tag: number,
		user_id: number,
		animal_id: number,
		animal_number: string,
	): Promise<AnimalAnswerRecord | null> {
		return AnimalService._getLatestAnswerByTag(
			user_id,
			animal_id,
			animal_number,
			tag,
		)
	}
	const resData: Record<
		string,
		Array<{
			number: string
			female: number
			heifer: number
			bull: number
			name: string
			pregnant_animal: number
			'non-pregnantAnimal': number
			pregnant_heifer: number
			non_pregnant_heifer: number
			lactating: number
			nonLactating: number
		}>
	> = {}
	for (const value of farmers) {
		const [animalGender, heifer, pregnant, milkingStatus] = await Promise.all([
			getAnimalData(8, value.user_id, value.animal_id, value.animal_number),
			getAnimalData(60, value.user_id, value.animal_id, value.animal_number),
			getAnimalData(15, value.user_id, value.animal_id, value.animal_number),
			getAnimalData(16, value.user_id, value.animal_id, value.animal_number),
		])
		const stats = countAnimalStats(
			animalGender,
			heifer,
			pregnant,
			milkingStatus,
		)
		if (!resData[value.animal_name]) resData[value.animal_name] = []
		resData[value.animal_name].push({
			number: value.animal_number,
			female: stats.cowCount,
			heifer: stats.heiferCount,
			bull: stats.bullCount,
			name: value.animal_name,
			pregnant_animal: stats.pregnantAnimal,
			'non-pregnantAnimal': stats.nonPregnant,
			pregnant_heifer: stats.pregnantHeifer,
			non_pregnant_heifer: stats.nonPregnantHeifer,
			lactating: stats.lactating,
			nonLactating: stats.nonLactating,
		})
	}
	const responseData: AnimalCountResult = {}
	for (const [key, value1] of Object.entries(resData)) {
		const agg = value1.reduce(
			(acc, curr) => {
				acc.female += curr.female
				acc.heifer += curr.heifer
				acc.bull += curr.bull
				acc.pregnant += curr.pregnant_animal
				acc.non_pregnant += curr['non-pregnantAnimal']
				acc.pregnant_heifer += curr.pregnant_heifer
				acc.non_pregnant_heifer += curr.non_pregnant_heifer
				acc.lactating += curr.lactating
				acc.nonLactating += curr.nonLactating
				return acc
			},
			{
				female: 0,
				heifer: 0,
				bull: 0,
				pregnant: 0,
				non_pregnant: 0,
				pregnant_heifer: 0,
				non_pregnant_heifer: 0,
				lactating: 0,
				nonLactating: 0,
			},
		)
		responseData[key] = agg
	}
	return responseData
}

async function getAnimalCountFarmers(
	data: AnimalCountBody,
	outlet: BusinessOutlet | null,
): Promise<FarmerAnimalRow[]> {
	const { start_date, end_date, search, type, user_id } = data
	if (!outlet) return []
	if (
		type === 'all_time' &&
		!start_date &&
		!end_date &&
		search === 'all_users'
	) {
		return db.sequelize.query(
			`SELECT DISTINCT aqa.animal_number, aqa.user_id, aqa.animal_id, a.name as animal_name
			FROM business_outlet bo
			JOIN user_business_outlet ubo ON ubo.business_outlet_id = bo.id
			JOIN animal_question_answers aqa ON aqa.user_id = ubo.user_id
			JOIN animals a ON a.id = aqa.animal_id
			WHERE bo.assign_to = :userId 
			AND aqa.status != 1
			AND bo.deleted_at IS NULL
			AND ubo.deleted_at IS NULL
			AND aqa.deleted_at IS NULL
			AND a.deleted_at IS NULL`,
			{ replacements: { userId: user_id }, type: QueryTypes.SELECT },
		)
	} else if (start_date && end_date && !type && search === 'all_users') {
		return db.sequelize.query(
			`SELECT DISTINCT aqa.animal_number, aqa.user_id, aqa.animal_id, a.name as animal_name
			FROM business_outlet bo
			JOIN user_business_outlet ubo ON ubo.business_outlet_id = bo.id
			JOIN animal_question_answers aqa ON aqa.user_id = ubo.user_id
			JOIN users u ON u.id = ubo.user_id
			JOIN animals a ON a.id = aqa.animal_id
			WHERE bo.assign_to = :userId 
			AND aqa.status != 1
			AND bo.deleted_at IS NULL
			AND ubo.deleted_at IS NULL
			AND aqa.deleted_at IS NULL
			AND a.deleted_at IS NULL
			AND DATE(u.created_at) >= :startDate AND DATE(u.created_at) <= :endDate`,
			{
				replacements: {
					userId: user_id,
					startDate: start_date,
					endDate: end_date,
				},
				type: QueryTypes.SELECT,
			},
		)
	} else if (type === 'all_time' && !start_date && !end_date) {
		const userID: UserIdRow[] = await db.sequelize.query(
			`SELECT u.id as id
			FROM users u
			JOIN role_user ru ON ru.user_id = u.id
			JOIN user_business_outlet ubo ON ubo.user_id = u.id AND ubo.deleted_at IS NULL
			WHERE (u.phone_number LIKE :search OR u.name LIKE :search)
				AND ru.role_id = 2 AND ubo.business_outlet_id = :outletId
				AND u.deleted_at IS NULL
			LIMIT 1`,
			{
				replacements: { search: `%${search}%`, outletId: outlet.id },
				type: QueryTypes.SELECT,
			},
		)
		if (!userID[0]) return []
		return db.sequelize.query(
			`SELECT DISTINCT aqa.animal_number, aqa.user_id, aqa.animal_id, a.name as animal_name
			FROM business_outlet bo
			JOIN user_business_outlet ubo ON ubo.business_outlet_id = bo.id
			JOIN animal_question_answers aqa ON aqa.user_id = ubo.user_id
			JOIN animals a ON a.id = aqa.animal_id
			WHERE bo.assign_to = :userId 
			AND aqa.user_id = :searchUserId 
			AND aqa.status != 1
			AND bo.deleted_at IS NULL
			AND ubo.deleted_at IS NULL
			AND aqa.deleted_at IS NULL
			AND a.deleted_at IS NULL`,
			{
				replacements: { userId: user_id, searchUserId: userID[0].id },
				type: QueryTypes.SELECT,
			},
		)
	} else if (start_date && end_date && !type) {
		const userID: UserIdRow[] = await db.sequelize.query(
			`SELECT u.id as id
			FROM users u
			JOIN role_user ru ON ru.user_id = u.id
			JOIN user_business_outlet ubo ON ubo.user_id = u.id AND ubo.deleted_at IS NULL
			WHERE (u.phone_number LIKE :search OR u.name LIKE :search)
				AND ru.role_id = 2 AND ubo.business_outlet_id = :outletId
				AND u.deleted_at IS NULL
			LIMIT 1`,
			{
				replacements: { search: `%${search}%`, outletId: outlet.id },
				type: QueryTypes.SELECT,
			},
		)
		if (!userID[0]) return []
		return db.sequelize.query(
			`SELECT DISTINCT aqa.animal_number, aqa.user_id, aqa.animal_id, a.name as animal_name
			FROM business_outlet bo
			JOIN user_business_outlet ubo ON ubo.business_outlet_id = bo.id
			JOIN animal_question_answers aqa ON aqa.user_id = ubo.user_id
			JOIN users u ON u.id = ubo.user_id
			JOIN animals a ON a.id = aqa.animal_id
			WHERE bo.assign_to = :userId 
			AND aqa.user_id = :searchUserId 
			AND aqa.status != 1
			AND bo.deleted_at IS NULL
			AND ubo.deleted_at IS NULL
			AND aqa.deleted_at IS NULL
			AND a.deleted_at IS NULL
			AND DATE(u.created_at) >= :startDate AND DATE(u.created_at) <= :endDate`,
			{
				replacements: {
					userId: user_id,
					searchUserId: userID[0].id,
					startDate: start_date,
					endDate: end_date,
				},
				type: QueryTypes.SELECT,
			},
		)
	}
	return []
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
			const existingOutlet = await BusinessOutlet.findOne({
				where: { business_name, deleted_at: null },
				transaction,
			})

			if (existingOutlet) {
				throw new ValidationRequestError({
					business_name: ['The business name has already been taken.'],
				})
			}
			const existingUser = await User.findOne({
				where: { phone_number: mobile, deleted_at: null },
				include: [
					{
						model: RoleUser,
						as: 'role_users',
						where: { role_id: 3 },
						required: true,
					},
				],
				transaction,
			})
			if (existingUser) {
				throw new ValidationRequestError({
					mobile: ['The mobile number has already been taken.'],
				})
			}

			const password = generateRandomPassword(8)
			const user = await User.create(
				{
					name: owner_name,
					email,
					phone_number: mobile,
					password,
					otp_status: false,
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

	public static async list(): Promise<BusinessList[]> {
		const outlets = (await BusinessOutlet.findAll({
			where: { deleted_at: null },
			attributes: [
				'id',
				'business_name',
				'business_address',
				[col('BusinessUser.name'), 'name'],
				[col('BusinessUser.email'), 'email'],
				[col('BusinessUser.phone_number'), 'phone_number'],
			],
			include: [
				{
					model: db.User,
					as: 'BusinessUser',
					attributes: [],
					where: { deleted_at: null },
					required: true,
				},
			],
			raw: true, // flatten result
		})) as unknown as {
			id: number
			business_name: string
			business_address: string
			name: string
			email: string
			phone_number: string
		}[]

		if (!outlets) return []
		return outlets.map((outlet) => {
			return {
				id: outlet.id,
				business_name: outlet.business_name,
				business_address: outlet.business_address,
				owner_name: outlet.name,
				owner_email: outlet.email,
				owner_mobile_no: outlet.phone_number,
			}
		})
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
			const outlet = await BusinessOutlet.findOne({
				where: { id, deleted_at: null },
				transaction,
			})
			if (!outlet) throw new ValidationError('Business outlet not found')
			if (data.business_name) {
				outlet.business_name = data.business_name
				await BusinessOutlet.update(
					{ business_name: data.business_name },
					{ where: { id }, transaction },
				)
			}

			if (data.business_address) {
				outlet.business_address = data.business_address
				await BusinessOutlet.update(
					{ business_address: data.business_address },
					{ where: { id }, transaction },
				)
			}
			if (data.owner_name || data.email) {
				const user = await User.findOne({
					where: { id: outlet.get('assign_to'), deleted_at: null },
					transaction,
				})
				if (user) {
					if (data.owner_name) {
						user.name = data.owner_name
						await User.update(
							{ name: data.owner_name },
							{ where: { id: outlet.get('assign_to') }, transaction },
						)
					}
					if (data.email) {
						user.email = data.email
						await User.update(
							{ email: data.email },
							{ where: { id: outlet.get('assign_to') }, transaction },
						)
					}
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
			const outlet = await BusinessOutlet.findOne({
				where: { id, deleted_at: null },
				transaction,
			})
			if (!outlet) throw new ValidationError('Business outlet not found')
			if (outlet && outlet.get('assign_to'))
				await db.User.destroy({
					where: { id: outlet.get('assign_to') },
					transaction,
				})
			await db.BusinessOutlet.destroy({ where: { id }, transaction })
			await transaction.commit()
			return true
		} catch (err) {
			await transaction.rollback()
			throw err
		}
	}

	public static async mapUserWithBusinessOutlet({
		user_id,
		business_outlet_id,
	}: {
		user_id: number[]
		business_outlet_id: number
	}): Promise<void> {
		const mappingData = user_id.map((uid) => ({
			user_id: uid,
			business_outlet_id,
		}))

		const outletExists = await db.BusinessOutlet.findOne({
			where: { id: business_outlet_id, deleted_at: null },
		})
		if (!outletExists) {
			throw new ValidationRequestError({
				business_outlet_id: ['The selected business outlet id is invalid.'],
			})
		}

		const users = await db.User.findAll({
			where: { id: user_id, deleted_at: null },
			attributes: ['id'],
		})

		if (users.length !== user_id.length) {
			throw new ValidationRequestError({
				user_id: ['The selected user id is invalid.'],
			})
		}
		await db.UserBusinessOutlet.destroy({
			where: { business_outlet_id },
		})

		await db.UserBusinessOutlet.bulkCreate(mappingData)

		return
	}

	public static async businessOutletFarmers(
		business_outlet_id: number,
	): Promise<
		{
			business_outlet_name: string | null
			user_id: number
			user_name: string | null
			phone_number: string | null
			farm_name: string | null
		}[]
	> {
		const farmers = (await db.sequelize.query(
			`
		SELECT 
			ubo.user_id,
			u.name,
			u.phone_number,
			u.farm_name,
			bo.business_name
		FROM business_outlet bo
		JOIN users u ON u.id = bo.assign_to AND u.deleted_at IS NULL
		JOIN user_business_outlet ubo ON bo.id = ubo.business_outlet_id AND ubo.deleted_at IS NULL
		WHERE ubo.business_outlet_id = :business_outlet_id
		  AND bo.deleted_at IS NULL
		`,
			{
				replacements: { business_outlet_id },
				type: QueryTypes.SELECT,
			},
		)) as unknown as {
			user_id: number
			name: string | null
			phone_number: string | null
			farm_name: string | null
			business_name: string | null
		}[]

		return farmers.map((farmer) => ({
			business_outlet_name: farmer.business_name,
			user_id: farmer.user_id,
			user_name: farmer.name ?? null,
			phone_number: farmer.phone_number,
			farm_name: farmer.farm_name ?? null,
		}))
	}

	public static async farmersList({
		start_date,
		end_date,
		search,
	}: {
		start_date?: string
		end_date?: string
		search: string
	}): Promise<FarmerListResult[]> {
		let userWhere: Record<string, unknown> = { deleted_at: null }
		if (search && search !== 'all_users') {
			userWhere = {
				[Op.or as unknown as string]: [
					{ phone_number: { [Op.like as unknown as string]: `%${search}%` } },
					{ name: { [Op.like as unknown as string]: `%${search}%` } },
				],
			}
		}

		if (start_date || end_date) {
			userWhere.created_at = {
				...(userWhere.created_at || {}),
				...(start_date
					? { [Op.gte as unknown as string]: new Date(start_date) }
					: {}),
				...(end_date
					? { [Op.lte as unknown as string]: new Date(end_date) }
					: {}),
			}
		}

		const users = (await User.findAll({
			include: [
				{
					model: db.UserBusinessOutlet,
					as: 'UserBusinessOutlet',
					where: { deleted_at: null },
					attributes: ['user_id'],
					required: true,
				},
			],
			where: userWhere,
			attributes: ['id', 'name', 'phone_number', 'address', 'created_at'],
			raw: true,
		})) as unknown as Array<Record<string, unknown>>

		return users.map(
			(u): FarmerListResult => ({
				user_id: Number(u['UserBusinessOutlet.user_id'] ?? u['id']),
				name: String(u['name']),
				phone_number: String(u['phone_number']),
				address: String(u['address']),
				created_at: u['created_at'] as Date,
				id: Number(u['id']),
			}),
		)
	}

	public static async deleteMappedFarmerToBusinessOutlet(
		farmer_id: number,
		business_outlet_id: number,
		user_id: number,
	): Promise<boolean> {
		const businessOutlet = await db.BusinessOutlet.findOne({
			where: {
				id: business_outlet_id,
				assign_to: user_id,
				deleted_at: null,
			},
		})

		if (!businessOutlet) {
			return false
		}

		const deletedCount = await db.UserBusinessOutlet.destroy({
			where: {
				user_id: farmer_id,
				business_outlet_id: business_outlet_id,
				deleted_at: null,
			},
		})

		return deletedCount > 0
	}

	public static async businessOutletFarmersAnimalCount(
		data: AnimalCountBody,
	): Promise<{ message: string; data: AnimalCountResult }> {
		const { user_id } = data
		const outlet = await db.BusinessOutlet.findOne({
			where: { assign_to: user_id, deleted_at: null },
			raw: true,
		})
		if (!outlet) {
			return { message: 'No outlet assigned to user', data: {} }
		}
		const farmers: FarmerAnimalRow[] = await getAnimalCountFarmers(data, outlet)
		if (!farmers.length) {
			if (data.search !== 'all_users') {
				return { message: 'Invalid Phone Number/Name', data: {} }
			}
			return { message: 'Invalid Search', data: {} }
		}
		const responseData = await aggregateAnimalCounts(farmers)
		return { message: 'Success', data: responseData }
	}

	public static async businessOutletFarmersAnimalMilkInfo(data: {
		search: string
		type?: string
		start_date?: string
		end_date?: string
		user_id: number
	}): Promise<{ message: string; data: MilkInfoResult }> {
		const { user_id } = data
		const outlet = await db.BusinessOutlet.findOne({
			where: { assign_to: user_id, deleted_at: null },
			raw: true,
		})
		if (!outlet)
			return {
				message: 'No outlet assigned to user',
				data: defaultMilkInfoResult,
			}
		const users: UserWithCreatedAt[] = await getMilkUsers(data, outlet)
		if (!users.length) {
			if (data.search !== 'all_users') {
				return {
					message: 'Invalid Phone Number/Name',
					data: defaultMilkInfoResult,
				}
			}
			return {
				message: 'Invalid Search',
				data: defaultMilkInfoResult,
			}
		}
		const responseData = await aggregateMilkInfo(users, data)
		return { message: 'Success', data: responseData }
	}

	public static async businessOutletFarmersAnimalHealthInfo(data: {
		search: string
		type?: string
		start_date?: string
		end_date?: string
		user_id: number
	}): Promise<{ message: string; data: HealthInfoResponse | object }> {
		const { user_id } = data
		const outlet = await db.BusinessOutlet.findOne({
			where: { assign_to: user_id, deleted_at: null },
			raw: true,
		})
		if (!outlet) return { message: 'No outlet assigned to user', data: {} }

		const farmers: HealthInfoAnimalRow[] = await getHealthFarmers(data, outlet)
		if (!farmers.length) {
			if (data.search !== 'all_users') {
				return { message: 'Invalid Phone Number/Name', data: {} }
			}
			return { message: 'Invalid Search', data: {} }
		}

		const { resData, diseasesArray, medicinesArray, totalMilkLoss } =
			await aggregateHealthInfo(farmers)

		const healthInformation = {
			number_of_animal_affected: resData.length,
			total_milk_loss: totalMilkLoss,
			diseases: diseasesArray,
			medicines: medicinesArray,
		}
		const responseData: HealthInfoResponse = {
			health_information: healthInformation,
			detailed_information: resData,
		}
		return { message: 'Success', data: responseData }
	}

	public static async businessOutletFarmersAnimalBreedingInfo(data: {
		search: string
		type?: string
		start_date?: string
		end_date?: string
		user_id: number
	}): Promise<{ message: string; data: BreedingInfoResponse | object }> {
		const { user_id } = data
		const outlet = await db.BusinessOutlet.findOne({
			where: { assign_to: user_id, deleted_at: null },
			raw: true,
		})
		if (!outlet) return { message: 'No outlet assigned to user', data: {} }

		const farmers: BreedingInfoAnimalRow[] = await getFarmers(data, outlet)
		if (!farmers.length) {
			if (data.search !== 'all_users') {
				return { message: 'Invalid Phone Number/Name', data: {} }
			}
			return { message: 'Invalid Search', data: {} }
		}

		const {
			pregnantAnimal,
			nonPregnant,
			lactating,
			nonLactating,
			breeding_data,
		} = await getBreedingStats(farmers)
		const animal_info = {
			total_animals: farmers.length,
			pregnant_animals: pregnantAnimal,
			non_pregnant_animals: nonPregnant,
			lactating: lactating,
			nonLactating: nonLactating,
		}
		const resData: BreedingInfoResponse = {
			animal_information: animal_info,
			breeding_data: breeding_data,
		}
		return { message: 'Success', data: resData }
	}
}
