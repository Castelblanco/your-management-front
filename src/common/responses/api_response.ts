export type TApiResponses<T> = {
	item: T;
	status: number;
};

export class ApiResponses<T> implements TApiResponses<T> {
	item: T;
	status: number;

	constructor(item: T, status: number) {
		this.item = item;
		this.status = status;
	}
}
