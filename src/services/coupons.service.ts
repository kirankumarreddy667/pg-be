import db from '@/config/database'
import { Coupon } from '@/models/coupon.model'
import { parseCSV } from '@/utils/parseCSV'
import { Express } from 'express'
interface CouponCSVRow {
	coupon_code: string
	amount: string | number
	type: string
}

export class CouponService {
	static async getAllCoupons(): Promise<Coupon[]> {
		return await db.Coupon.findAll({ where: { deleted_at: null } })
	}

	static async createFromCSV(file: Express.Multer.File): Promise<boolean> {
		try {
			const filePath = file.path

			// Parse the CSV — first row will be headers
			const data: CouponCSVRow[] = await parseCSV(filePath, '|')

			if (!data.length) {
				throw new Error('CSV file is empty')
			}

			// Validate headers
			const requiredHeaders = ['coupon_code', 'amount', 'type']
			const csvHeaders = Object.keys(data[0])

			// Check missing headers
			const missingHeaders = requiredHeaders.filter(
				(h) => !csvHeaders.includes(h),
			)
			if (missingHeaders.length > 0) {
				throw new Error(
					`Missing required header(s): ${missingHeaders.join(', ')}`,
				)
			}

			// Check extra headers
			const extraHeaders = csvHeaders.filter(
				(h) => !requiredHeaders.includes(h),
			)
			if (extraHeaders.length > 0) {
				throw new Error(
					`Unexpected header(s) found: ${extraHeaders.join(', ')}`,
				)
			}

			// Map to DB structure
			const coupons = data.map((row, index) => {
				if (!row.coupon_code || !row.amount || !row.type) {
					throw new Error(`Missing required field(s) in row ${index + 2}`) // +2 because of header + 1-based index
				}

				if (isNaN(Number(row.amount))) {
					throw new Error(`Invalid amount in row ${index + 2}`)
				}

				return {
					coupon_code: row.coupon_code.trim(),
					amount: Number(row.amount),
					type: row.type.trim(),
					created_at: new Date(),
					updated_at: new Date(),
				}
			})

			const result = await db.Coupon.bulkCreate(coupons)
			return result.length > 0
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : 'Failed to process CSV file',
			)
		}
	}

	static async findByCode(code: string, type: string): Promise<Coupon | null> {
		return await db.Coupon.findOne({
			where: {
				coupon_code: code,
				type,
				deleted_at: null,
			},
		})
	}
}
