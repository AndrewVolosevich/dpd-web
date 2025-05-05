'use client';
import type { Department } from '@/types/structure';
import DepartmentItem from './DepartmentItem';

interface DepartmentTreeProps {
	departments: Department[];
	parentId?: string | null;
	level?: number;
}

export default function DepartmentTree({
	departments,
	parentId = null,
	level = 0,
}: DepartmentTreeProps) {
	// Filter departments by parent ID
	const filteredDepartments = departments.filter(
		(department) =>
			(parentId === null && department.parentId === null) ||
			department.parentId === parentId,
	);

	if (filteredDepartments.length === 0) {
		return null;
	}

	return (
		<div className={`${level > 0 ? 'ml-6 border-l pl-4' : ''}`}>
			{filteredDepartments.map((department) => (
				<DepartmentItem
					key={department.id}
					department={department}
					allDepartments={departments}
					level={level}
				/>
			))}
		</div>
	);
}
