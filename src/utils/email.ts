import nodemailer from 'nodemailer'
import { emailTemplates, EmailTemplateMap } from './emailTemplates'

export async function sendEmail<K extends keyof EmailTemplateMap>({
	to,
	subject,
	template,
	data,
	text,
	attachments,
}: {
	to: string
	subject: string
	template: K
	data: EmailTemplateMap[K]
	text?: string
	attachments?: { filename: string; path: string }[]
}): Promise<void> {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT) || 587,
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	})

	const html = emailTemplates[template](data)

	await transporter.sendMail({
		from: process.env.SMTP_FROM || 'no-reply@powergotha.com',
		to,
		subject,
		html,
		text,
		attachments,
	})
}
