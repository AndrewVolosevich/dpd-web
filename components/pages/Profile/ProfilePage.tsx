'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Building,
	Calendar,
	Edit2,
	LogOut,
	Mail,
	Phone,
	Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import UserCard from '@/components/pages/Home/UserCard';
const testUser = {
	name: 'Роман',
	surname: 'Петров',
	position: 'Менеджер по продажам',
};

const ProfilePage = () => {
	const { logout } = useAuth();
	return (
		<main className="flex-grow container mx-auto px-4 py-8">
			<div className={'flex flex-row justify-between self-start mb-6'}>
				<h1 className="text-2xl font-bold">Профиль пользователя</h1>
				<Button variant="default" onClick={logout}>
					<LogOut className="mr-2 h-4 w-4" />
					Выйти из системы
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="col-span-1">
					<CardHeader>
						<CardTitle>Личная информация</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col items-center">
						<UserCard className={'mb-4'} user={testUser} full />
						<Button variant="outline" size="sm">
							<Edit2 className="mr-2 h-4 w-4" />
							Редактировать профиль
						</Button>
					</CardContent>
				</Card>

				<Card className="col-span-1 md:col-span-2">
					<CardHeader>
						<CardTitle>Детали профиля</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="info" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="info">Информация</TabsTrigger>
								<TabsTrigger value="security">Безопасность</TabsTrigger>
								<TabsTrigger value="notifications">Уведомления</TabsTrigger>
							</TabsList>
							<TabsContent value="info">
								<div className="space-y-4">
									<div className="flex items-center">
										<Mail className="mr-2 h-4 w-4 text-gray-400" />
										<span className="text-sm">ivanov@example.com</span>
									</div>
									<div className="flex items-center">
										<Phone className="mr-2 h-4 w-4 text-gray-400" />
										<span className="text-sm">+7 (123) 456-7890</span>
									</div>
									<div className="flex items-center">
										<Building className="mr-2 h-4 w-4 text-gray-400" />
										<span className="text-sm">Отдел продаж</span>
									</div>
									<div className="flex items-center">
										<Calendar className="mr-2 h-4 w-4 text-gray-400" />
										<span className="text-sm">
											Дата начала работы: 01.01.2020
										</span>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="security">
								<div className="space-y-4">
									<Button variant="outline" size="sm">
										<Lock className="mr-2 h-4 w-4" />
										Изменить пароль
									</Button>
									<p className="text-sm text-gray-500">
										Последний вход: 01.09.2024 10:30
									</p>
								</div>
							</TabsContent>
							<TabsContent value="notifications">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm">Email-уведомления</span>
										<input
											type="checkbox"
											className="toggle toggle-primary"
											checked
										/>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Push-уведомления</span>
										<input type="checkbox" className="toggle toggle-primary" />
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">SMS-уведомления</span>
										<input type="checkbox" className="toggle toggle-primary" />
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				<Card className="col-span-1 md:col-span-3">
					<CardHeader>
						<CardTitle>Активность</CardTitle>
					</CardHeader>
					<CardContent></CardContent>
				</Card>
			</div>
		</main>
	);
};

export { ProfilePage };
