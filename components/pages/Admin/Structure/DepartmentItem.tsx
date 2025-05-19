'use client';

import { useEffect, useState } from 'react';
import {
	ChevronRight,
	ChevronDown,
	Plus,
	Edit,
	Trash2,
	Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Department } from '@/types/structure';
import DepartmentTree from './DepartmentTree';
import PositionsList from './PositionsList';
import CreateDepartmentModal from './CreateDepartmentModal';
import EditDepartmentModal from './EditDepartmentModal';
import DeleteDepartmentModal from './DeleteDepartmentModal';
import CreatePositionModal from './CreatePositionModal';

interface DepartmentItemProps {
	department: Department;
	allDepartments: Department[];
	level: number;
	isAllExpanded: boolean;
}

export default function DepartmentItem({
	department,
	allDepartments,
	level,
	isAllExpanded = false,
}: DepartmentItemProps) {
	const [isExpanded, setIsExpanded] = useState(level === 0);
	const [isCreateDeptModalOpen, setIsCreateDeptModalOpen] = useState(false);
	const [isEditDeptModalOpen, setIsEditDeptModalOpen] = useState(false);
	const [isDeleteDeptModalOpen, setIsDeleteDeptModalOpen] = useState(false);
	const [isCreatePositionModalOpen, setIsCreatePositionModalOpen] =
		useState(false);
	const [showPositions, setShowPositions] = useState(false);

	const hasChildren = allDepartments.some(
		(dept) => dept.parentId === department.id,
	);

	const handleToggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const handleTogglePositions = () => {
		setShowPositions(!showPositions);
	};

	useEffect(() => {
		setIsExpanded(isAllExpanded);
		// setShowPositions(isAllExpanded); ??
	}, [isAllExpanded]);

	return (
		<div className="mb-2">
			<div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
				<Button
					variant="ghost"
					size="sm"
					className="p-0 h-6 w-6 mr-2"
					onClick={handleToggleExpand}
					disabled={!hasChildren}
				>
					{hasChildren ? (
						isExpanded ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)
					) : (
						<div className="w-4" />
					)}
				</Button>

				<div className="flex-1 font-medium">{department.title}</div>

				<div className="flex items-center space-x-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleTogglePositions}
						className="flex items-center"
					>
						<Users className="h-4 w-4 mr-1" />
						<span className="text-xs">Должности</span>
					</Button>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsCreatePositionModalOpen(true)}
					>
						<Plus className="h-4 w-4" />
					</Button>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsCreateDeptModalOpen(true)}
					>
						<Plus className="h-4 w-4 mr-1" />
						<span className="text-xs">Отдел</span>
					</Button>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsEditDeptModalOpen(true)}
					>
						<Edit className="h-4 w-4" />
					</Button>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsDeleteDeptModalOpen(true)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{showPositions && <PositionsList departmentId={department.id} />}

			{isExpanded && hasChildren && (
				<DepartmentTree
					departments={allDepartments}
					parentId={department.id}
					level={level + 1}
					isAllExpanded={isAllExpanded}
				/>
			)}

			<CreateDepartmentModal
				isOpen={isCreateDeptModalOpen}
				onClose={() => setIsCreateDeptModalOpen(false)}
				parentDepartment={department}
			/>

			<EditDepartmentModal
				isOpen={isEditDeptModalOpen}
				onClose={() => setIsEditDeptModalOpen(false)}
				department={department}
			/>

			<DeleteDepartmentModal
				isOpen={isDeleteDeptModalOpen}
				onClose={() => setIsDeleteDeptModalOpen(false)}
				department={department}
			/>

			<CreatePositionModal
				isOpen={isCreatePositionModalOpen}
				onClose={() => setIsCreatePositionModalOpen(false)}
				departmentId={department.id}
			/>
		</div>
	);
}
