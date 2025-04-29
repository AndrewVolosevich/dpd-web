'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssignedTests from './AssignedTests';
import CompletedTests from './CompletedTests';
import LearningMaterials from './LearningMaterials';
import { useAuth } from '@/components/providers/global/AuthProvider';
import useUserMaterialAssignments from '@/lib/api/queries/Education/useUserMaterialAssignments';

export default function MyTrainingPage() {
	const [activeTab, setActiveTab] = useState('assigned');
	const { user } = useAuth();
	const { data: materialAssignments } = useUserMaterialAssignments(
		user?.userPanelId,
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Моё обучение</h1>

			<Tabs
				defaultValue="assigned"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="grid grid-cols-3 mb-6 w-full max-w-2xl">
					<TabsTrigger value="assigned">Назначенные тесты</TabsTrigger>
					<TabsTrigger value="completed">Пройденные тесты</TabsTrigger>
					<TabsTrigger value="materials">Материалы для изучения</TabsTrigger>
				</TabsList>

				<TabsContent value="assigned" className="mt-4">
					<AssignedTests />
				</TabsContent>

				<TabsContent value="completed" className="mt-4">
					<CompletedTests />
				</TabsContent>

				<TabsContent value="materials" className="mt-4">
					<LearningMaterials materialAssignments={materialAssignments} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
