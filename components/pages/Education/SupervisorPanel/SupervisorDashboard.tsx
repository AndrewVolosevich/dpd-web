'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeesTab from './Tabs/EmployeesTab';
import TestsTab from './Tabs/TestsTab';
import AdaptationTab from './Tabs/AdaptationTab';
import ReportsTab from './Tabs/ReportsTab';
import { useAuth } from '@/components/providers/global/AuthProvider';
import useSupervisorPanelByPosition from '@/lib/api/queries/Education/useSupervisorPanelByPosition';
import MaterialsTab from '@/components/pages/Education/SupervisorPanel/Tabs/MaterialsTab';

export default function SupervisorDashboard() {
	const [activeTab, setActiveTab] = useState('employees');
	const { user } = useAuth();
	const { data: departmentUsers, isLoading } = useSupervisorPanelByPosition(
		user?.positionId || '',
	);

	return (
		<div className="w-full">
			<div className="flex-1 p-6">
				<h1 className="text-2xl font-bold mb-6">Панель руководителя</h1>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="mb-6 w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
						<TabsTrigger
							value="employees"
							className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
						>
							Сотрудники
						</TabsTrigger>
						<TabsTrigger
							value="tests"
							className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
						>
							Тесты
						</TabsTrigger>
						<TabsTrigger
							value="materials"
							className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
						>
							Материалы
						</TabsTrigger>
						<TabsTrigger
							value="adaptation"
							className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
						>
							Адаптация
						</TabsTrigger>
						<TabsTrigger
							value="reports"
							className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
						>
							Отчеты
						</TabsTrigger>
					</TabsList>

					<TabsContent value="employees" className="mt-6">
						<EmployeesTab
							isLoading={isLoading}
							departmentUsers={departmentUsers}
						/>
					</TabsContent>

					<TabsContent value="tests" className="mt-6">
						<TestsTab isLoading={isLoading} departmentUsers={departmentUsers} />
					</TabsContent>

					<TabsContent value="materials" className="mt-6">
						<MaterialsTab
							isLoading={isLoading}
							departmentUsers={departmentUsers}
						/>
					</TabsContent>

					<TabsContent value="adaptation" className="mt-6">
						<AdaptationTab
							isLoading={isLoading}
							departmentUsers={departmentUsers}
						/>
					</TabsContent>

					<TabsContent value="reports" className="mt-6">
						<ReportsTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
