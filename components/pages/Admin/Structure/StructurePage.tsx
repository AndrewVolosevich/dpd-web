'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Loader } from '@/components/common/Loader/Loader';
import DepartmentTree from '@/components/pages/Admin/Structure/DepartmentTree';
import CreateDepartmentModal from '@/components/pages/Admin/Structure/modals/CreateDepartmentModal';
import { useDepartments } from '@/lib/api/queries/Structure/useDepartments';
import { exportStuctureToCsv } from '@/lib/exportToCsv';
import { useLazyQuery } from '@/lib/api/queries/Common/useLazyQuery';
import useApi from '@/hooks/useApi';

export default function StructurePage() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [expandAll, setExpandAll] = useState(false);
	const { data: departments, isLoading } = useDepartments();
	const api = useApi();
	const { isLoading: fullStructureLoading, trigger } = useLazyQuery(
		async () => {
			const response = await api.get(`/structure/departments-with-positions`);
			return response.data;
		},
	);

	const toggleAllDepartments = () => {
		setExpandAll(!expandAll);
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex flex-col items-start md:flex-row md:items-center md:justify-between mb-6">
				<h1 className="text-2xl font-bold">Штатная структура компании</h1>
				<div className={'flex flex-row items-center justify-end mt-2 md:mt-0'}>
					<Button
						className={'mr-2'}
						onClick={async () => {
							const fullStructure = await trigger(['department-positions-all']);
							exportStuctureToCsv(fullStructure, 'structure.csv');
						}}
						variant={'outline'}
					>
						{fullStructureLoading ? (
							<Loader2 className="animate-spin mr-2" />
						) : (
							'Выгрузить в exel'
						)}
					</Button>

					<Button
						className={'mr-2'}
						onClick={() => toggleAllDepartments()}
						variant={'outline'}
					>
						{expandAll ? 'Свернуть все' : 'Развернуть все'}
					</Button>
					<Button onClick={() => setIsCreateModalOpen(true)}>
						<Plus className="mr-2 h-4 w-4" /> Добавить департамент
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-12">
					<Loader />
				</div>
			) : departments && departments.length > 0 ? (
				<div className="bg-white rounded-lg shadow">
					<DepartmentTree departments={departments} isAllExpanded={expandAll} />
				</div>
			) : (
				<div className="bg-white rounded-lg shadow p-8 text-center">
					<p className="text-gray-500 mb-4">
						Структура компании еще не создана
					</p>
					<Button onClick={() => setIsCreateModalOpen(true)}>
						<Plus className="mr-2 h-4 w-4" /> Создать первый департамент
					</Button>
				</div>
			)}

			<CreateDepartmentModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				parentDepartment={null}
			/>
		</div>
	);
}
