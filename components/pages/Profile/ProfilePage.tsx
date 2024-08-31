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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfilePage = () => {
	return (
		<main className="flex-grow container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Профиль пользователя</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="col-span-1">
					<CardHeader>
						<CardTitle>Личная информация</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col items-center">
						<Avatar className="w-24 h-24 mb-4">
							<AvatarImage
								src="https://placehold.co/24x24"
								alt="Фото профиля"
							/>
							<AvatarFallback>ИИ</AvatarFallback>
						</Avatar>
						<h2 className="text-xl font-semibold mb-2">Иванов Иван Иванович</h2>
						<p className="text-sm text-gray-500 mb-4">Менеджер по продажам</p>
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
					<CardContent>
						<div className="space-y-4">
							{[
								{
									action: "Завершил курс 'Основы логистики'",
									date: '28.08.2024',
								},
								{
									action: "Получил награду 'Лучший сотрудник месяца'",
									date: '15.08.2024',
								},
								{
									action: 'Участвовал в корпоративном мероприятии',
									date: '05.08.2024',
								},
							].map((item, index) => (
								<div
									key={index}
									className="flex items-center justify-between border-b pb-2"
								>
									<span className="text-sm">{item.action}</span>
									<span className="text-xs text-gray-500">{item.date}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<Button variant="destructive" size="sm" className="mt-8">
				<LogOut className="mr-2 h-4 w-4" />
				Выйти из системы
			</Button>
		</main>
	);
};

export { ProfilePage };
