'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, FileText, BookOpen, User } from 'lucide-react';
import { Loader } from '@/components/common/Loader/Loader';
import { AssignTestModal } from '../Modals/AssignTestModal';
import { AssignMaterialModal } from '../Modals/AssignMaterialModal';
import { ViewEmployeeModal } from '../Modals/ViewEmployeeModal';
import { ExtendedUserData, UserData } from '@/types/entities';
import { useAuth } from '@/components/providers/global/AuthProvider';

export default function EmployeesTab({
	departmentUsers,
	isLoading,
}: {
	departmentUsers: ExtendedUserData[] | undefined;
	isLoading: boolean;
}) {
	const { user } = useAuth();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedEmployee, setSelectedEmployee] = useState<
		UserData | undefined
	>(undefined);
	const [isAssignTestModalOpen, setIsAssignTestModalOpen] = useState(false);
	const [isAssignMaterialModalOpen, setIsAssignMaterialModalOpen] =
		useState(false);
	const [isViewEmployeeModalOpen, setIsViewEmployeeModalOpen] = useState(false);

	const handleAssignTest = (employee: any) => {
		setSelectedEmployee(employee);
		setIsAssignTestModalOpen(true);
	};

	const handleAssignMaterial = (employee: any) => {
		setSelectedEmployee(employee);
		setIsAssignMaterialModalOpen(true);
	};

	const handleViewEmployee = (employee: any) => {
		setSelectedEmployee(employee);
		setIsViewEmployeeModalOpen(true);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader />
			</div>
		);
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<div className="text-xl font-medium">Подчиненные сотрудники</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Поиск сотрудников..."
							className="pl-8 w-[250px]"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">ФИО</TableHead>
							<TableHead>Подразделение</TableHead>
							<TableHead>Должность</TableHead>
							<TableHead className="text-right">Действия</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{departmentUsers?.map((employee) => (
							<TableRow key={employee.id}>
								<TableCell className="font-medium">
									{employee.surname} {employee.name} {employee.patronymic}
								</TableCell>
								<TableCell>{employee?.department?.title}</TableCell>
								<TableCell>{employee?.position?.title}</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleAssignTest(employee)}
											title="Назначить тест"
										>
											<FileText className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleAssignMaterial(employee)}
											title="Назначить материал"
										>
											<BookOpen className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleViewEmployee(employee)}
											title="Посмотреть профиль"
										>
											<User className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}

						{departmentUsers?.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={4}
									className="text-center py-8 text-muted-foreground"
								>
									{searchQuery
										? 'Сотрудники не найдены'
										: 'У вас нет подчиненных сотрудников'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Card>

			{selectedEmployee && (
				<>
					<AssignTestModal
						isOpen={isAssignTestModalOpen}
						onClose={() => setIsAssignTestModalOpen(false)}
						employee={selectedEmployee}
						supervisorPositionId={user?.positionId}
					/>
					<AssignMaterialModal
						isOpen={isAssignMaterialModalOpen}
						onClose={() => setIsAssignMaterialModalOpen(false)}
						employee={selectedEmployee}
						supervisorPositionId={user?.positionId}
					/>
					<ViewEmployeeModal
						isOpen={isViewEmployeeModalOpen}
						onClose={() => setIsViewEmployeeModalOpen(false)}
						employee={selectedEmployee}
						supervisorPositionId={user?.positionId}
					/>
				</>
			)}
		</div>
	);
}
