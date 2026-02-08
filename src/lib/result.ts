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

	constructor(result?: T, options: CommandResultOptions = DefaultCommandResultOptions) {
		this.result = result;
		this.successMessage = options.successMessage;
		this.errorMessage = options.errorMessage;
		this.success = options.success ?? false;
	}

	static Ok<T>(value: T, successMessage?: string) {
		return new this<T>(value, { success: true, successMessage });
	}

	static Error<T = any>(errorMessage: string) {
		return new this<T>(undefined, { errorMessage });
	}
}
