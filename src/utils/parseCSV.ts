import fs from 'fs'
import csvParser from 'csv-parser'

export async function parseCSV<T = Record<string, string>>(
	filePath: string,
	delimiter = '|',
): Promise<T[]> {
	return new Promise((resolve, reject) => {
		const results: T[] = []

		fs.createReadStream(filePath)
			.pipe(csvParser({ separator: delimiter }))
			.on('data', (data: T) => results.push(data))
			.on('end', () => resolve(results))
			.on('error', (err) => {
				console.error('CSV parsing error:', err)
				reject(err instanceof Error ? err : new Error(String(err)))
			})
	})
}
