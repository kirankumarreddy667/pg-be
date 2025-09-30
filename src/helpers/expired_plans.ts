import { QueryTypes } from 'sequelize'
import db from '../config/database'
import moment from 'moment'

export const expiredPlans = async (): Promise<void> => {
	const today = moment().format('YYYY-MM-DD')
	await db.sequelize.query(
		`UPDATE users 
     SET payment_status = 'free' 
     WHERE id IN (
       SELECT DISTINCT user_id 
       FROM user_payment 
       WHERE DATE(plan_exp_date) <= ?
     )`,
		{
			type: QueryTypes.UPDATE,
			replacements: [today],
		},
	)
}
