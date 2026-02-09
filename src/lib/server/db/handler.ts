import type { Document, Model } from 'mongoose';
import { Logger } from '../logging';

export abstract class DatabaseHandler {
	static db: Model<Document>;

	static async getAll<T extends Document = Document>() {
		return await this.db.find({}) as T[];
	}

	static async getAllSerializable<T extends Document = Document>() {
		return (await this.getAll<T>()).map((r) => r.toJSON()) as T[];
	}

	static LogInfo(msg: string, ...a: unknown[]) {
		Logger.info(`${this.db.modelName}: ${msg}`, ...a);
	}

	static LogWarning(msg: string, ...a: unknown[]) {
		Logger.warn(`${this.db.modelName}: ${msg}`, ...a);
	}

	static LogError(msg: string, ...a: unknown[]) {
		Logger.error(`${this.db.modelName}: ${msg}`, ...a);
	}

	static LogDebug(msg: string, ...a: unknown[]) {
		Logger.debug(`${this.db.modelName}: ${msg}`, ...a);
	}

	static LogVerbose(msg: string, ...a: unknown[]) {
		Logger.verbose(`${this.db.modelName}: ${msg}`, ...a);
	}
}
