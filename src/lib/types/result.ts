export interface CommandResultOptions {
	errorMessage?: string;
	successMessage?: string;
	success?: boolean;
  statusCode?: number;
}

export const DefaultCommandResultOptions: CommandResultOptions = {};
