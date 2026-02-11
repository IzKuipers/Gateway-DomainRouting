/**
 * CommandResult utility class
 *
 * A class designed to clearly return the error- or success state of
 * an operation, like a database mutation. Originally written for
 * @IzKuipers/Eureka-Notes, ported to ArcOS v7 and now Gateway-DomainRouting.
 *
 * © IzKuipers 2026
 */
import { DefaultCommandResultOptions, type CommandResultOptions } from './types/result';

export class CommandResult<T = string> {
	public result: T | undefined;
	public error?: Error;
	public errorMessage?: string;
	public successMessage?: string;
	public success = false;
	public statusCode?: number;

	constructor(result?: T, options: CommandResultOptions = DefaultCommandResultOptions) {
		this.result = result;
		this.successMessage = options.successMessage;
		this.errorMessage = options.errorMessage;
		this.success = options.success ?? false;
		this.statusCode = options.statusCode ?? 200;
	}

	static Ok<T>(value: T, successMessage?: string, statusCode?: number) {
		return new this<T>(value, { success: true, successMessage, statusCode });
	}

	static Error<T = any>(errorMessage: string, statusCode?: number) {
		return new this<T>(undefined, { errorMessage, statusCode });
	}
}
