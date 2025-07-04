import { Request, Response, NextFunction } from 'express'
import { UnitService } from '@/services/unit.service'
import RESPONSE from '@/utils/response'

export class UnitController {
  static async getAllUnits(this: void, req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const units = await UnitService.getAllUnits()
      RESPONSE.SuccessResponse(res, 200, {
        data: units,
        message: 'Success',
      })
    } catch (error) {
      next(error)
    }
  }

  static async getUnitById(this: void, req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: number = Number(req.params.id)
      const unit = await UnitService.getUnitById(id)
      if (!unit) {
        RESPONSE.FailureResponse(res, 404, { message: 'Unit not found' })
        return
      }

      RESPONSE.SuccessResponse(res, 200, {
        data: unit,
        message: 'Success',
      })
    } catch (error) {
      next(error)
    }
  }

  static async createUnit(this: void, req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, display_name } = req.body as { name: string; display_name: string }
      const unit = await UnitService.createUnit({ name, display_name })

      RESPONSE.SuccessResponse(res, 201, {
        data: [],
        message: 'Success',
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateUnit(this: void, req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: number = Number(req.params.id)
      const { name, display_name } = req.body as { name?: string; display_name?: string }
      const updated = await UnitService.updateUnit(id, { name, display_name })

      if (!updated) {
        RESPONSE.FailureResponse(res, 404, { message: 'Not found.' })
        return
      }

      RESPONSE.SuccessResponse(res, 200, {
        data: [],
        message: 'Success',
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteUnit(this: void, req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: number = Number(req.params.id)
      const deleted = await UnitService.deleteUnit(id)

      if (!deleted) {
        RESPONSE.FailureResponse(res, 404, { message: 'Not found.' })
        return
      }

      RESPONSE.SuccessResponse(res, 200, {
        data: [],
        message: 'Success',
      })
    } catch (error) {
      next(error)
    }
  }
}
