import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Play } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const KnowledgeBasePage = () => {
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">База знаний</h1>

			<Tabs defaultValue="learning-materials" className="space-y-4">
				<TabsList>
					<TabsTrigger value="learning-materials">
						Обучающие материалы
					</TabsTrigger>
					<TabsTrigger value="knowledge-check">Проверка знаний</TabsTrigger>
					<TabsTrigger value="new-employee">Новому сотруднику</TabsTrigger>
				</TabsList>

				<TabsContent value="learning-materials" className="space-y-4">
					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">
							Корпоративный словарь терминов
						</h2>
						<Input type="search" placeholder="Поиск термина" className="mb-4" />
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Термин</TableHead>
									<TableHead>Определение</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{['Логистика', 'Экспедирование', 'Таможенное оформление'].map(
									(term, index) => (
										<TableRow key={index}>
											<TableCell className="font-medium">{term}</TableCell>
											<TableCell>Определение термина - {term}</TableCell>
										</TableRow>
									),
								)}
							</TableBody>
						</Table>
					</section>

					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">
							Нормативные документы
						</h2>
						<div className="space-y-2">
							{[
								'Устав компании',
								'Правила внутреннего трудового распорядка',
								'Политика конфиденциальности',
							].map((doc, index) => (
								<div key={index} className="flex justify-between items-center">
									<span className="flex items-center">
										<FileText className="mr-2 h-4 w-4 text-gray-400" />
										{doc}
									</span>
									<Button variant="outline" size="sm">
										<Download className="mr-2 h-4 w-4" />
										Скачать
									</Button>
								</div>
							))}
						</div>
					</section>

					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Электронные курсы</h2>
						<div className="space-y-4">
							{[
								'Основы логистики',
								'Клиентоориентированность',
								'Эффективные продажи',
							].map((course, index) => (
								<div key={index} className="border-b pb-4">
									<h3 className="font-semibold">{course}</h3>
									<p className="text-sm text-gray-600 mb-2">
										Краткое описание курса {course}
									</p>
									<Button size="sm">Начать обучение</Button>
								</div>
							))}
						</div>
					</section>

					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Видеокурсы, вебинары</h2>
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
									<p className="mt-2 font-semibold">Название видеокурса {i}</p>
								</div>
							))}
						</div>
					</section>

					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Книги</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="text-center">
									<img
										src={`https://placehold.co/200x150`}
										alt={`Книга ${i}`}
										className="w-full h-48 object-cover rounded"
									/>
									<p className="mt-2 font-semibold">Название книги {i}</p>
									<Button variant="link" size="sm">
										Читать онлайн
									</Button>
								</div>
							))}
						</div>
					</section>
				</TabsContent>

				<TabsContent value="knowledge-check" className="space-y-4">
					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Тесты и опросы</h2>
						<div className="space-y-4">
							{[
								'Основы логистики',
								'Клиентоориентированность',
								'Техника безопасности',
							].map((test, index) => (
								<div key={index} className="border-b pb-4">
									<h3 className="font-semibold">{test}</h3>
									<p className="text-sm text-gray-600 mb-2">
										Проверка знаний по теме: {test}
									</p>
									<div className="flex space-x-2">
										<Button size="sm">Начать тест</Button>
										<Button variant="outline" size="sm">
											<Download className="mr-2 h-4 w-4" />
											Результаты
										</Button>
									</div>
								</div>
							))}
						</div>
					</section>

					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">
							Назначенные курсы и тесты
						</h2>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Курс/Тест</TableHead>
									<TableHead>Назначил</TableHead>
									<TableHead>Срок</TableHead>
									<TableHead>Статус</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[
									{
										name: 'Техника продаж',
										assignedBy: 'Иванов И.И.',
										deadline: '15.09.2024',
										status: 'В процессе',
									},
									{
										name: 'Охрана труда',
										assignedBy: 'Петров П.П.',
										deadline: '20.09.2024',
										status: 'Не начат',
									},
									{
										name: 'Информационная безопасность',
										assignedBy: 'Сидоров С.С.',
										deadline: '10.09.2024',
										status: 'Завершен',
									},
								].map((item, index) => (
									<TableRow key={index}>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.assignedBy}</TableCell>
										<TableCell>{item.deadline}</TableCell>
										<TableCell>{item.status}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</section>
				</TabsContent>

				<TabsContent value="new-employee" className="space-y-4">
					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">
							Добро пожаловать в команду!
						</h2>
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold mb-2">Презентация о компании</h3>
								<Button variant="outline" size="sm">
									<Download className="mr-2 h-4 w-4" />
									Скачать презентацию
								</Button>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Видеоролик о компании</h3>
								<div className="relative">
									<img
										src="https://placehold.co/600x300"
										alt="Видео о компании"
										className="w-full h-48 object-cover rounded"
									/>
									<Button
										variant="secondary"
										size="icon"
										className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
									>
										<Play className="h-6 w-6" />
									</Button>
								</div>
							</div>
						</div>
					</section>

					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Структура компании</h2>
						<img
							src="https://placehold.co/600x200"
							alt="Структура компании"
							className="w-full h-60 object-contain rounded mb-4"
						/>
						<Button variant="outline" size="sm">
							<Download className="mr-2 h-4 w-4" />
							Скачать схему
						</Button>
					</section>

					<section className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">
							План обучения/стажировки
						</h2>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Этап</TableHead>
									<TableHead>Описание</TableHead>
									<TableHead>Сроки</TableHead>
									<TableHead>Статус</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[
									{
										stage: 'Знакомство с компанией',
										description: 'Изучение истории и структуры',
										duration: '1-2 дня',
										status: 'Завершен',
									},
									{
										stage: 'Обучение продукту',
										description: 'Изучение основных услуг и продуктов',
										duration: '3-5 дней',
										status: 'В процессе',
									},
									{
										stage: 'Практика',
										description: 'Работа под руководством наставника',
										duration: '1-2 недели',
										status: 'Не начат',
									},
								].map((item, index) => (
									<TableRow key={index}>
										<TableCell>{item.stage}</TableCell>
										<TableCell>{item.description}</TableCell>
										<TableCell>{item.duration}</TableCell>
										<TableCell>{item.status}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</section>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export { KnowledgeBasePage };
