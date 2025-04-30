'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Loader } from '@/components/common/Loader/Loader';
import DepartmentTree from '@/components/pages/Admin/Structure/DepartmentTree';
import CreateDepartmentModal from '@/components/pages/Admin/Structure/CreateDepartmentModal';
import { useDepartments } from '@/lib/api/queries/Structure/useDepartments';

export default function StructurePage() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { data: departments, isLoading } = useDepartments();

	return (
		<div className="container mx-auto py-6">
			<div className="flex flex-col items-start md:flex-row md:items-center md:justify-between mb-6">
				<h1 className="text-2xl font-bold">Штатная структура компании</h1>
				<Button
					className={'mt-2 md:mt-0'}
					onClick={() => setIsCreateModalOpen(true)}
				>
					<Plus className="mr-2 h-4 w-4" /> Добавить департамент
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-12">
					<Loader />
				</div>
			) : departments && departments.length > 0 ? (
				<div className="bg-white rounded-lg shadow">
					<DepartmentTree departments={departments} />
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
