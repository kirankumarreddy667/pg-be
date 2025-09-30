import schedule from 'node-schedule'
import { expiredPlans } from '@/helpers/expired_plans'

schedule.scheduleJob('0 0 * * *', { tz: 'Asia/Kolkata' }, async () => {
	await expiredPlans()
})
