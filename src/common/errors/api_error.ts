export class ApiError {
	code: string | number;
	message: string;
	metadata: {
		code: number;
		status: number;
		error: string;
		message: string;
	};

	constructor(err: any) {
		this.code = err.code;
		this.message = err.message || 'Internal server error';
		this.metadata = err.metadata;
	}
}
