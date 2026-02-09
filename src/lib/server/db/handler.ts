import type { Document, Model } from 'mongoose';
import { Logger } from '../logging';

export function DatabaseHandler<T extends Document = Document>() {
	abstract class Handler {
		static db: Model<T>;

		static async getAll() {
			return (await this.db.find({})) as T[];
		}

		static async getAllSerializable() {
			return (await this.getAll()).map((r) => r.toJSON()) as T[];
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

    return Handler;
}
