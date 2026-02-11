import { Store } from '$lib/writable';
import type { ClientTypes } from '$lib/types/client';
import { Sleep } from '$lib/sleep';

export const Dialog = Store<ClientTypes.DialogData | undefined>();

export async function showDialog(data: ClientTypes.DialogData) {
	if (Dialog()) {
		hideDialog();
		await Sleep(300);
	}

	Dialog.set(data);
}

export async function hideDialog() {
	Dialog.set(undefined);
}
