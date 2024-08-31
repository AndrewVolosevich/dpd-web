import React from 'react';
import { Button } from '@/components/ui/button';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { BarChart, Download, Play } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const CorporateLifePage = () => {
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Корпоративная жизнь</h1>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Корпоративный журнал</h2>
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-center justify-between border-b pb-2"
						>
							<div>
								<h3 className="font-semibold">Выпуск {i}</h3>
								<p className="text-sm text-gray-600">
									Дата публикации: 01.0{i}.2024
								</p>
							</div>
							<Button variant="outline" size="sm">
								<Download className="mr-2 h-4 w-4" />
								Скачать PDF
							</Button>
						</div>
					))}
				</div>
			</section>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Галерея</h2>
				<div className="mb-4">
					<h3 className="font-semibold mb-2">Фотоотчеты с мероприятий</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<img
								key={i}
								src={`https://placehold.co/150x150`}
								alt={`Мероприятие ${i}`}
								className="w-full h-32 object-cover rounded"
							/>
						))}
					</div>
				</div>
				<div>
					<h3 className="font-semibold mb-2">Видеоролики о жизни в компании</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="relative">
								<img
									src={`https://placehold.co/200x300`}
									alt={`Видео ${i}`}
									className="w-full h-40 object-cover rounded"
								/>
								<Button
									variant="secondary"
									size="icon"
									className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
								>
									<Play className="h-6 w-6" />
								</Button>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">
					Профессиональные конкурсы
				</h2>
				<Accordion type="single" collapsible className="mb-4">
					<AccordionItem value="item-1">
						<AccordionTrigger>Текущие конкурсы</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-4">
								{[
									'Лучший менеджер года',
									'Инновационный проект',
									'Лидер продаж',
								].map((contest, index) => (
									<div key={index} className="border-b pb-2">
										<h3 className="font-semibold">{contest}</h3>
										<p className="text-sm text-gray-600 mb-2">
											Описание и условия конкурса {contest}.
										</p>
										<Button size="sm">Подать заявку</Button>
									</div>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<div>
					<h3 className="font-semibold mb-2">Результаты прошедших конкурсов</h3>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Конкурс</TableHead>
								<TableHead>Победитель</TableHead>
								<TableHead>Номинация</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[
								{
									contest: 'Лучший сотрудник 2023',
									winner: 'Иванов Иван',
									nomination: 'Профессионализм',
								},
								{
									contest: 'Инновации в логистике',
									winner: 'Петрова Анна',
									nomination: 'Оригинальное решение',
								},
								{
									contest: 'Клиентоориентированность',
									winner: 'Сидоров Петр',
									nomination: 'Высший сервис',
								},
							].map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item.contest}</TableCell>
									<TableCell>{item.winner}</TableCell>
									<TableCell>{item.nomination}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</section>

			<section className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-4">Опросы мнений</h2>
				<div className="space-y-6">
					<div>
						<h3 className="font-semibold mb-2">Текущий опрос</h3>
						<p className="text-sm text-gray-600 mb-2">
							Как вы оцениваете новую систему учета рабочего времени?
						</p>
						<div className="space-y-2">
							{[
								'Отлично',
								'Хорошо',
								'Удовлетворительно',
								'Требует доработки',
							].map((option, index) => (
								<div key={index} className="flex items-center">
									<input
										type="radio"
										id={`option-${index}`}
										name="current-poll"
										className="mr-2"
									/>
									<label htmlFor={`option-${index}`} className="text-sm">
										{option}
									</label>
								</div>
							))}
						</div>
						<Button className="mt-4">Отправить ответ</Button>
					</div>
					<div>
						<h3 className="font-semibold mb-2">Результаты прошлых опросов</h3>
						<Accordion type="single" collapsible>
							<AccordionItem value="item-1">
								<AccordionTrigger>
									Удовлетворенность работой в компании
								</AccordionTrigger>
								<AccordionContent>
									<div className="flex items-center justify-between">
										<div className="space-y-2">
											<p className="text-sm">Очень доволен: 45%</p>
											<p className="text-sm">Доволен: 30%</p>
											<p className="text-sm">Нейтрально: 15%</p>
											<p className="text-sm">Не доволен: 10%</p>
										</div>
										<BarChart className="h-24 w-24 text-gray-400" />
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</section>
		</div>
	);
};

export { CorporateLifePage };
