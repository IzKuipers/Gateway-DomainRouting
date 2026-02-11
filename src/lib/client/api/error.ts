import { CommandResult } from '$lib/result';
import { AxiosError } from 'axios';

export function parseRequestError(e: unknown): CommandResult<any> {
	if (e instanceof AxiosError) {
		return CommandResult.Error(e?.response?.data?.message ?? 'Unknown error', e.status);
	}

	return CommandResult.Error(`${e}`);
}
