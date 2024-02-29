export type TListResponses<T> = {
	items: T[];
	status: number;
};

export class ListResponse<T> implements TListResponses<T> {
	items: T[];
	status: number;

	constructor(items: T[], status: number) {
		this.items = items;
		this.status = status;
	}
}
