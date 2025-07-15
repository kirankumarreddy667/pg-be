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
    return await db.Coupon.findAll()
  }

  static async createFromCSV(file: Express.Multer.File): Promise<boolean> {
    try {
      const filePath = file.path

      const data: CouponCSVRow[] = await parseCSV(filePath, '|')
      if (!data.length) return false

      const coupons = data.map((row) => ({
        coupon_code: row.coupon_code,
        amount: Number(row.amount),
        type: row.type,
        created_at: new Date(),
        updated_at: new Date(),
      }))

      const result = await db.Coupon.bulkCreate(coupons)
      return result.length > 0
    } catch (error) {
      console.error('Error creating coupons from CSV:', error)
      throw new Error('Failed to process CSV file')
    }
  }

  static async findByCode(code: string, type: string): Promise<Coupon | null> {
    return await db.Coupon.findOne({
      where: {
        coupon_code: code,
        type,
        status: true,
      },
    })
  }
}
