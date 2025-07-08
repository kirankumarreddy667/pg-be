import db from '@/config/database';
import { Unit } from '@/models/unit.model';
import { UniqueConstraintError } from 'sequelize';

// Optional: Create an interface for Unit input
interface UnitInput {
  name: string;
  display_name: string;
}

export class UnitService {
  static async getAllUnits(): Promise<Unit[]> {
    return await db.Unit.findAll();
  }

  static async getUnitById(id: number): Promise<Unit | null> {
    return await db.Unit.findByPk(id);
  }

  static async createUnit(data: UnitInput): Promise<Unit> {
    try {
      return await db.Unit.create(data);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintError) {
        throw new Error('Unit with this name already exists');
      }
      throw error;
    }
  }

  static async updateUnit(id: number, data: Partial<UnitInput>): Promise<Unit | null> {
    const unit = await db.Unit.findByPk(id);
    if (!unit) return null;
    await unit.update(data);
    return unit;
  }

  static async deleteUnit(id: number): Promise<boolean> {
    const deleted = await db.Unit.destroy({ where: { id } });
    return deleted > 0;
  }
}
