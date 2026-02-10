import type { Document, Model, ProjectionType } from 'mongoose';
import { Logger } from '../logging';

/**
 * Database handler 'factory' for passing T to the static properties/methods of a class.
 * Taken from GitHub issue #43587 of @microsoft/TypeScript.
 *
 * https://github.com/microsoft/TypeScript/issues/43587#issuecomment-815919628
 */

export function DatabaseHandler<T extends Document = Document>() {
	abstract class Handler {
		static db: Model<T>;

		static async getAll(projection?: ProjectionType<T>) {
			return (await this.db.find({}, projection)) as T[];
		}

		static async getAllSerializable(projection?: ProjectionType<T>) {
			return (await this.getAll(projection)).map((r) => r.toJSON()) as T[];
		}

		static async getOneById(id: string): Promise<T | null> {
			return await this.db.findById(id);
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
