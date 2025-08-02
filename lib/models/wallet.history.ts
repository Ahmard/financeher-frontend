import BaseModel from '@/lib/models/base.model';

export class WalletHistory extends BaseModel {
	wallet_id: string;
	action: WalletHistoryAction;
	balance_before: string;
	amount: string;
	balance_after: string;
	narration: string;
}

export enum WalletHistoryAction {
	DEBIT = 'debit',
	CREDIT = 'credit',
}
