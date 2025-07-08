export interface EmailTemplateMap {
	businessCredentials: { name: string; phone: string; password: string }
}

export const emailTemplates: {
	[K in keyof EmailTemplateMap]: (data: EmailTemplateMap[K]) => string
} = {
	businessCredentials: ({ name, phone, password }) => `
    <h2>Login Details</h2>
    <p>Name: ${name}</p>
    <p>Phone: ${phone}</p>
    <p>Password: ${password}</p>
  `,
}
