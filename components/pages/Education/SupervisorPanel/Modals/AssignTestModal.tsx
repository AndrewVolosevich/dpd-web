'use client';

import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/entities';

interface AssignTestModalProps {
	isOpen: boolean;
	onClose: () => void;
	testId?: string;
	testTitle?: string;
	employee?: UserData;
	supervisorPositionId?: string;
}

export function AssignTestModal({
	isOpen,
	onClose,
	testId,
	testTitle,
	employee,
}: AssignTestModalProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [selectedTestIds, setSelectedTestIds] = useState<string[]>(
		testId ? [testId] : [],
	);
	const queryClient = useQueryClient();

	// Fetch users if employee is not provided
	const { data: users = [] } = useQuery({
		queryKey: ['users-for-test-assignment'],
		queryFn: async () => {
			// In a real implementation, you would fetch from your API
			// const response = await api.post(`/auth/get-users`, {})
			// return response.data

			// Mock data for demonstration
			return [
				{
					id: '1',
					name: 'Алина',
					surname: 'Белая',
					patronymic: 'Андреевна',
					position: 'Специалист по продажам',
					department: 'Коммерция',
				},
				{
					id: '2',
					name: 'Екатерина',
					surname: 'Гижук',
					patronymic: 'Евгеньевна',
					position: 'Специалист по продажам',
					department: 'Отдел продаж',
				},
				{
					id: '3',
					name: 'Елена',
					surname: 'Гуцалова',
					patronymic: '',
					position: 'Специалист по продажам',
					department: 'Коммерция',
				},
			];
		},
		enabled: isOpen && !employee,
	});

	// Fetch tests if testId is not provided
	const { data: tests = [] } = useQuery({
		queryKey: ['tests-for-assignment'],
		queryFn: async () => {
			// In a real implementation, you would fetch from your API
			// const response = await api.get(`/surveys?surveyVariant=TEST&status=ACTIVE`)
			// return response.data

			// Mock data for demonstration
			return [
				{
					id: '1',
					title: 'Онбординг для новых сотрудников',
					description: 'Базовый тест для проверки знаний новых сотрудников',
					status: 'ACTIVE',
				},
				{
					id: '2',
					title: 'Техника безопасности',
					description: 'Обязательный ежегодный тест по технике безопасности',
					status: 'ACTIVE',
				},
				{
					id: '3',
					title: 'Работа с негативно настроенными клиентами',
					description: 'Тест для отдела продаж по работе с трудными клиентами',
					status: 'ACTIVE',
				},
			];
		},
		enabled: isOpen && !testId,
	});

	// Initialize selected users if employee is provided
	useEffect(() => {
		if (employee) {
			setSelectedUserIds([employee.id]);
		}
	}, [employee]);

	// Filter users based on search query
	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.department.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const { mutate: assignTest, isPending } = useMutation({
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		mutationFn: async (data: { testIds: string[]; userIds: string[] }) => {
			// In a real implementation, you would call your API
			// return api.post(`/surveys/assign-multiple`, data)

			// Mock success for demonstration
			return new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onError: () => {
			toast({
				title: 'Ошибка при назначении теста',
				variant: 'destructive',
				description: 'Не удалось назначить тест. Попробуйте еще раз.',
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['supervisor-tests'] });
			toast({
				title: 'Тест успешно назначен',
				variant: 'default',
			});
			onClose();
		},
	});

	const toggleSelectAllUsers = () => {
		if (selectedUserIds.length === users.length) {
			setSelectedUserIds([]);
		} else {
			setSelectedUserIds(users.map((user) => user.id));
		}
	};

	const toggleSelectAllTests = () => {
		if (selectedTestIds.length === tests.length) {
			setSelectedTestIds([]);
		} else {
			setSelectedTestIds(tests.map((test) => test.id));
		}
	};

	const toggleUser = (userId: string) => {
		if (selectedUserIds.includes(userId)) {
			setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
		} else {
			setSelectedUserIds([...selectedUserIds, userId]);
		}
	};

	const toggleTest = (testId: string) => {
		if (selectedTestIds.includes(testId)) {
			setSelectedTestIds(selectedTestIds.filter((id) => id !== testId));
		} else {
			setSelectedTestIds([...selectedTestIds, testId]);
		}
	};

	const handleSubmit = () => {
		assignTest({
			testIds: selectedTestIds,
			userIds: selectedUserIds,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{employee
							? `Назначить тест для ${employee.surname} ${employee.name}`
							: testTitle
								? `Назначить тест "${testTitle}"`
								: 'Назначить тест'}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{!employee && (
						<>
							<div className="relative">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Поиск сотрудников..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="select-all-users"
									checked={
										selectedUserIds.length === users.length && users.length > 0
									}
									onCheckedChange={toggleSelectAllUsers}
								/>
								<Label
									htmlFor="select-all-users"
									className="text-sm font-medium"
								>
									{selectedUserIds.length === users.length && users.length > 0
										? 'Снять выделение со всех'
										: 'Выбрать всех сотрудников'}
								</Label>
							</div>

							<ScrollArea className="h-[200px] pr-4">
								<div className="space-y-2">
									{filteredUsers.map((user) => (
										<div key={user.id} className="flex items-center space-x-2">
											<Checkbox
												id={`user-${user.id}`}
												checked={selectedUserIds.includes(user.id)}
												onCheckedChange={() => toggleUser(user.id)}
											/>
											<Label htmlFor={`user-${user.id}`} className="text-sm">
												{user.surname} {user.name} {user.patronymic} -{' '}
												{user.position}, {user.department}
											</Label>
										</div>
									))}
									{filteredUsers.length === 0 && (
										<p className="text-sm text-muted-foreground">
											Сотрудники не найдены
										</p>
									)}
								</div>
							</ScrollArea>
						</>
					)}

					{!testId && (
						<>
							<div className="mt-6 border-t pt-4">
								<h3 className="mb-2 font-medium">
									Выберите тесты для назначения
								</h3>

								<div className="flex items-center space-x-2 mb-2">
									<Checkbox
										id="select-all-tests"
										checked={
											selectedTestIds.length === tests.length &&
											tests.length > 0
										}
										onCheckedChange={toggleSelectAllTests}
									/>
									<Label
										htmlFor="select-all-tests"
										className="text-sm font-medium"
									>
										{selectedTestIds.length === tests.length && tests.length > 0
											? 'Снять выделение со всех'
											: 'Выбрать все тесты'}
									</Label>
								</div>

								<ScrollArea className="h-[200px] pr-4">
									<div className="space-y-2">
										{tests.map((test) => (
											<div
												key={test.id}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={`test-${test.id}`}
													checked={selectedTestIds.includes(test.id)}
													onCheckedChange={() => toggleTest(test.id)}
												/>
												<Label htmlFor={`test-${test.id}`} className="text-sm">
													{test.title}
													<p className="text-xs text-muted-foreground">
														{test.description}
													</p>
												</Label>
											</div>
										))}
										{tests.length === 0 && (
											<p className="text-sm text-muted-foreground">
												Тесты не найдены
											</p>
										)}
									</div>
								</ScrollArea>
							</div>
						</>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={
							isPending ||
							selectedUserIds.length === 0 ||
							selectedTestIds.length === 0
						}
					>
						{isPending ? 'Назначение...' : 'Назначить'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
