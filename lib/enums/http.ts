export enum ResponseCode {
	Ok = '000',
	Created = '001',
	Accepted = '002',
	NoContent = '003',
	BadRequest = '004',
	Unauthorized = '005',
	PaymentRequired = '006',
	Forbidden = '007',
	NotFound = '008',
	Conflict = '009',
	InternalServerError = '010',
	ServiceUnavailable = '011',
	NotImplemented = '012',

	PasswordCreationRequired = '9001',
	AwaitingApproval = '9002',
	OtpVerificationRequired = '9003',
	LoginDenied = '9004',
}

export enum HttpMethod {
	Get = 'Get',
	Post = 'Post',
	Put = 'Put',
	Patch = 'Patch',
	Delete = 'Delete',
}
