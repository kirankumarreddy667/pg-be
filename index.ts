import Server from './src/app'

const serverInstance = new Server()
serverInstance.start().catch((error) => {
	console.error('Failed to start server:', error)
	process.exit(1)
})
