'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/common/Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
	Mail,
	Phone,
	Calendar,
	Building,
	Briefcase,
	Clock,
} from 'lucide-react';
import { UserData } from '@/types/entities';

interface ViewEmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee: UserData;
	supervisorPositionId?: string;
}

export function ViewEmployeeModal({
	isOpen,
	onClose,
	employee,
}: ViewEmployeeModalProps) {
	// Fetch employee details
	const { data: employeeDetails, isLoading: isLoadingDetails } = useQuery({
		queryKey: ['employee-details', employee?.id],
		queryFn: async () => {
			// In a real implementation, you would fetch from your API
			// const response = await api.get(`/api/employees/${employee.id}`)
			// return response.data

			// Mock data for demonstration
			return {
				...employee,
				email:
					employee?.email ||
					`${employee.name.toLowerCase()}.${employee.surname.toLowerCase()}@example.com`,
				phone: employee?.tel || '+375291234567',
				startDate: employee.startDate || '2023-01-15',
				birthDate: '1990-05-20',
				education: 'Высшее, БГУ',
				skills: ['Продажи', 'Переговоры', 'CRM', 'Excel'],
				languages: ['Русский (родной)', 'Английский (B2)'],
			};
		},
		enabled: isOpen && !!employee?.id,
	});

	// Fetch employee training history
	const { data: trainingHistory = [], isLoading: isLoadingHistory } = useQuery({
		queryKey: ['employee-training', employee?.id],
		queryFn: async () => {
			// In a real implementation, you would fetch from your API
			// const response = await api.get(`/api/employees/${employee.id}/training`)
			// return response.data

			// Mock data for demonstration
			return [
				{
					id: '1',
					type: 'TEST',
					title: 'Онбординг для новых сотрудников',
					status: 'COMPLETED',
					score: '85%',
					completedAt: '2023-02-10T14:30:00Z',
				},
				{
					id: '2',
					type: 'MATERIAL',
					title: 'Введение в компанию',
					status: 'COMPLETED',
					completedAt: '2023-01-20T10:15:00Z',
				},
				{
					id: '3',
					type: 'TEST',
					title: 'Техника безопасности',
					status: 'COMPLETED',
					score: '100%',
					completedAt: '2023-03-05T16:45:00Z',
				},
				{
					id: '4',
					type: 'MATERIAL',
					title: 'Техника продаж',
					status: 'IN_PROGRESS',
					assignedAt: '2023-04-12T09:30:00Z',
				},
				{
					id: '5',
					type: 'TEST',
					title: 'Работа с негативно настроенными клиентами',
					status: 'IN_PROGRESS',
					assignedAt: '2023-04-15T11:20:00Z',
				},
			];
		},
		enabled: isOpen && !!employee?.id,
	});

	const getInitials = (name: string, surname: string) => {
		return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'COMPLETED':
				return <Badge className="bg-green-500">Завершено</Badge>;
			case 'IN_PROGRESS':
				return <Badge className="bg-blue-500">В процессе</Badge>;
			case 'FAILED':
				return <Badge variant="destructive">Не пройдено</Badge>;
			default:
				return <Badge variant="outline">Назначено</Badge>;
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>Информация о сотруднике</DialogTitle>
				</DialogHeader>

				{isLoadingDetails ? (
					<div className="flex justify-center items-center h-[300px]">
						<Loader />
					</div>
				) : (
					<Tabs defaultValue="profile">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="profile">Профиль</TabsTrigger>
							<TabsTrigger value="training">Обучение</TabsTrigger>
						</TabsList>

						<TabsContent value="profile" className="mt-4">
							<div className="flex flex-col md:flex-row gap-6">
								<div className="flex flex-col items-center">
									<Avatar className="h-24 w-24">
										<AvatarImage
											src={`/placeholder.svg?height=96&width=96`}
											alt={employeeDetails?.name}
										/>
										<AvatarFallback>
											{getInitials(
												employeeDetails?.name || '',
												employeeDetails?.surname || '',
											)}
										</AvatarFallback>
									</Avatar>
								</div>

								<div className="flex-1 space-y-4">
									<div>
										<h3 className="text-xl font-semibold">
											{employeeDetails?.surname} {employeeDetails?.name}{' '}
											{employeeDetails?.patronymic}
										</h3>
										<p className="text-muted-foreground">
											{employeeDetails?.position?.title}
										</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-muted-foreground" />
											<span>{employeeDetails?.email}</span>
										</div>
										<div className="flex items-center gap-2">
											<Phone className="h-4 w-4 text-muted-foreground" />
											<span>{employeeDetails?.phone}</span>
										</div>
										<div className="flex items-center gap-2">
											<Building className="h-4 w-4 text-muted-foreground" />
											<span>{employeeDetails?.department?.title}</span>
										</div>
										<div className="flex items-center gap-2">
											<Briefcase className="h-4 w-4 text-muted-foreground" />
											<span>{employeeDetails?.position?.title}</span>
										</div>
										{employeeDetails?.birthDate && (
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												<span>
													Дата рождения:{' '}
													{formatDate(employeeDetails?.birthDate)}
												</span>
											</div>
										)}
										{employeeDetails?.startDate && (
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span>
													Работает с: {formatDate(employeeDetails?.startDate)}
												</span>
											</div>
										)}
									</div>

									<div className="pt-2">
										<h4 className="font-medium mb-2">Образование</h4>
										<p>{employeeDetails?.education}</p>
									</div>

									<div>
										<h4 className="font-medium mb-2">Навыки</h4>
										<div className="flex flex-wrap gap-2">
											{employeeDetails?.skills.map(
												(skill: string, index: number) => (
													<Badge key={index} variant="outline">
														{skill}
													</Badge>
												),
											)}
										</div>
									</div>

									<div>
										<h4 className="font-medium mb-2">Языки</h4>
										<div className="flex flex-wrap gap-2">
											{employeeDetails?.languages.map(
												(language: string, index: number) => (
													<Badge key={index} variant="outline">
														{language}
													</Badge>
												),
											)}
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="training" className="mt-4">
							{isLoadingHistory ? (
								<div className="flex justify-center items-center h-[300px]">
									<Loader />
								</div>
							) : (
								<div className="space-y-4">
									<Card>
										<CardHeader>
											<CardTitle>История обучения</CardTitle>
											<CardDescription>
												Тесты и материалы, назначенные сотруднику
											</CardDescription>
										</CardHeader>
										<CardContent>
											{trainingHistory.length > 0 ? (
												<div className="space-y-4">
													{trainingHistory.map((item) => (
														<div
															key={item.id}
															className="flex items-start justify-between p-3 border rounded-md"
														>
															<div>
																<div className="font-medium">{item.title}</div>
																<div className="text-sm text-muted-foreground">
																	Тип:{' '}
																	{item.type === 'TEST'
																		? 'Тест'
																		: 'Учебный материал'}
																</div>
																{item.score && (
																	<div className="text-sm">
																		Результат: {item.score}
																	</div>
																)}
																<div className="text-sm text-muted-foreground">
																	{item.completedAt
																		? `Завершено: ${formatDate(item?.completedAt)}`
																		: `Назначено: ${formatDate(item?.assignedAt || '')}`}
																</div>
															</div>
															<div>{getStatusBadge(item.status)}</div>
														</div>
													))}
												</div>
											) : (
												<div className="text-center py-8 text-muted-foreground">
													У сотрудника нет истории обучения
												</div>
											)}
										</CardContent>
									</Card>
								</div>
							)}
						</TabsContent>
					</Tabs>
				)}

				<DialogFooter>
					<Button onClick={onClose}>Закрыть</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
