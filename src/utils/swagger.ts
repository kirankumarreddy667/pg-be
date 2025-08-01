const swagOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'POWERGOTHA API Documentation',
			version: '1.0.0',
			description:
				'RESTful API documentation for the POWERGOTHA cattle management platform',
			contact: {
				name: 'API Support',
				email: process.env.SUPPORT_EMAIL || 'support@powergotha.com',
			},
		},
		servers: [
			{
				url: process.env.SWAGGER_URL || 'http://143.244.132.143:8888',
				description:
					process.env.NODE_ENV === 'production'
						? 'Production Server'
						: 'Development Server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'Enter your JWT token in the format: Bearer <token>',
				},
			},
			schemas: {
				SuccessResponse: {
					type: 'object',
					properties: {
						status: {
							type: 'number',
							enum: [200, 201],
							example: 200,
						},
						message: {
							type: 'string',
							example: 'Operation successful',
						},
						data: {
							type: 'object',
							additionalProperties: true,
							example: {},
						},
						meta: {
							type: 'object',
							properties: {
								totalPages: {
									type: 'number',
									example: 10,
								},
								currentPage: {
									type: 'number',
									example: 1,
								},
							},
						},
						links: {
							type: 'object',
							properties: {
								currentPage: {
									type: 'string',
									example: '/api/v1/resource?page=1',
								},
								firstPage: {
									type: 'string',
									example: '/api/v1/resource?page=1',
								},
								prevPage: {
									type: ['string', 'null'],
									example: null,
								},
								nextPage: {
									type: ['string', 'null'],
									example: '/api/v1/resource?page=2',
								},
								lastPage: {
									type: 'string',
									example: '/api/v1/resource?page=10',
								},
							},
						},
					},
				},
				FailureResponse: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
							example: 'Error message',
						},
						status: {
							type: 'number',
							enum: [400, 401, 403, 404, 413, 422, 429, 409, 500, 503],
							example: 400,
						},
					},
					additionalProperties: true,
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [
		'./src/services/**/*.ts',
		'./src/routes/**/*.ts',
		'./src/models/**/*.ts',
	],
}

export default swagOptions
