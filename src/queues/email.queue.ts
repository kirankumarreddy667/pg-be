import Queue, { Job } from 'bull'
import { EmailTemplateMap } from '@/utils/emailTemplates'
import { sendEmail } from '@/utils/email'

interface Attachments {
	filename: string
	path: string
}

// Generic Email type for template mapping
type Email<K extends keyof EmailTemplateMap = keyof EmailTemplateMap> = {
	to: string
	text?: string
	subject: string
	html?: string
	attachments?: Attachments[]
	template?: K
	data?: K extends keyof EmailTemplateMap ? EmailTemplateMap[K] : undefined
}

export const emailQueue = new Queue('email', {
	redis: process.env.REDIS_URL,
})

export const addToEmailQueue = (email: Email): void => {
	emailQueue
		.add(
			{ ...email },
			{
				attempts: 3,
				backoff: 5000,
				removeOnComplete: true,
				removeOnFail: true,
			},
		)
		.catch((err) => {
			console.error('Failed to add email to queue:', err)
		})
}

emailQueue
	.process(
		async <K extends keyof EmailTemplateMap>(
			job: Job<{
				to: string
				subject: string
				template: K
				data: EmailTemplateMap[K]
				text?: string
				attachments?: { filename: string; path: string }[]
			}> & {
				data: {
					to: string
					subject: string
					template: K
					data: EmailTemplateMap[K]
					text?: string
					attachments?: { filename: string; path: string }[]
				}
			},
		) => {
			try {
				await sendEmail(job.data)
			} catch (error) {
				console.error('Failed to send email:', error)
				throw error
			}
		},
	)
	.catch((err) => {
		console.error('Failed to register email queue processor:', err)
	})
