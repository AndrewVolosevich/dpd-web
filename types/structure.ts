import type { UserData } from './entities';

export interface Department {
	id: string;
	title: string;
	parentId: string | null;
	parent?: Department | null;
	subDepartments?: Department[];
	positions?: Position[];
	users?: UserData[];
	createdAt: string;
	updatedAt: string;
}

export interface Position {
	id: string;
	title: string;
	departmentId: string;
	department?: Department;
	supervisedPanelId?: string;
	user?: UserData;
	createdAt: string;
	updatedAt: string;
}
