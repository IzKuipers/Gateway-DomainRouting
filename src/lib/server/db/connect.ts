import mongoose from 'mongoose';
import Configuration from '../config';
import { Logger } from '../logging';

export async function ConnectDatabase() {
	Logger.info(`Connecting to database`);
	try {
		await mongoose.connect(`mongodb://${Configuration.mongo.hostname}:${Configuration.mongo.port}/${Configuration.mongo.database}`);

		Logger.info(`Database connection is good to go`);
	} catch (e) {
		Logger.error(`Failed to connect to database: ${e}`);

		process.exit(1);
	}
}
