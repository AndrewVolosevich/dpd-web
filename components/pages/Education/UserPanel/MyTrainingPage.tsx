'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssignedTests from './AssignedTests';
import CompletedTests from './CompletedTests';
import LearningMaterials from './LearningMaterials';
import { useAuth } from '@/components/providers/global/AuthProvider';
import useUserAssignments from '@/lib/api/queries/Education/useUserAssignments';

export default function MyTrainingPage() {
	const [activeTab, setActiveTab] = useState('assigned');
	const { user } = useAuth();
	const { data: assignments } = useUserAssignments(user?.userPanelId);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Моё обучение</h1>

			<Tabs
				defaultValue="assigned"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="grid grid-cols-1 sm:grid-cols-3 mb-6 w-full max-w-2xl h-auto">
					<TabsTrigger value="assigned">Назначенные тесты</TabsTrigger>
					<TabsTrigger value="completed">Пройденные тесты</TabsTrigger>
					<TabsTrigger value="materials">Материалы для изучения</TabsTrigger>
				</TabsList>

				<TabsContent value="assigned" className="mt-4">
					<AssignedTests surveyAssignments={assignments} />
				</TabsContent>

				<TabsContent value="completed" className="mt-4">
					<CompletedTests surveyAssignments={assignments} />
				</TabsContent>

				<TabsContent value="materials" className="mt-4">
					<LearningMaterials materialAssignments={assignments} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
