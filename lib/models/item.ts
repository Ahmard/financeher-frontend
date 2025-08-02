import BaseModel from '@/lib/models/base.model';
import { xhrGet } from '@/lib/xhr';
import { apiUrl } from '@/lib/helpers/url';
import { FileExtHelper } from '@/lib/helpers/file.ext';

export class Item extends BaseModel {
	created_by: string;
	folder_id: string | null;
	parent_folder_id: string | null;
	uploaded_for: string | null;
	legacy_app_code: string | null;
	creator_full_name: string | null;
	parent_folder_name: string | null;
	owner_id: string;
	owner_type: string;
	name: string;
	size: number;
	orig_name: string | null;
	file_storage_path: string | null;
	file_ext: string | null;
	file_count: number;
	visibility: ItemVisibility;
	description: string | null;
	s3_bucket: string | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	metadata?: Record<string, any>;
	is_folder: boolean;
	is_readonly: boolean;
	is_temp: boolean;
	deleted_at: string | null;

	nameWithoutExt(): string {
		return new FileExtHelper().removeExtension(this.name);
	}

	kindName(): string {
		return this.is_folder ? 'folder' : 'file';
	}
}

export enum ItemVisibility {
	Private = 'private',
	Public = 'public',
	Team = 'team',
}

export interface IBreadcrumb {
	id: string;
	name: string;
	is_folder: boolean;
}

export async function fetchBreadcrumb(id: string) {
	const resp = await xhrGet<IBreadcrumb[]>(apiUrl(`items/${id}/breadcrumb`));
	return resp.data;
}
