import { logger } from './src/config/logger'
import Server from './src/app'

const serverInstance = new Server()
serverInstance.start().catch((error) => {
	logger.error(
		`Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
	)
	process.exit(1)
})
