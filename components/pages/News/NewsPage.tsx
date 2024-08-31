import React from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

// Mock news data
const newsItems = [
	{
		id: 1,
		title: 'Открытие нового логистического центра',
		date: '01.09.2024',
		image: 'https://placehold.co/100x100',
		content:
			'Компания DPD открыла новый логистический центр в Москве, что позволит улучшить качество обслуживания клиентов в столичном регионе.',
	},
	{
		id: 2,
		title: 'Запуск экспресс-доставки для интернет-магазинов',
		date: '28.08.2024',
		image: 'https://placehold.co/100x100',
		content:
			'DPD представляет новую услугу экспресс-доставки для партнеров из сферы электронной коммерции, гарантирующую доставку в течение суток.',
	},
	{
		id: 3,
		title: 'Обновление мобильного приложения',
		date: '20.08.2024',
		image: 'https://placehold.co/100x100',
		content:
			'Вышло обновление мобильного приложения DPD с новым интерфейсом и расширенным функционалом для отслеживания посылок.',
	},
	{
		id: 4,
		title: 'Экологическая инициатива: переход на электромобили',
		date: '15.08.2024',
		image: 'https://placehold.co/100x100',
		content:
			'DPD объявляет о постепенном переходе на использование электромобилей для доставки в крупных городах в рамках программы по снижению углеродного следа.',
	},
	{
		id: 5,
		title: 'Партнерство с крупной сетью постаматов',
		date: '10.08.2024',
		image: 'https://placehold.co/100x100',
		content:
			'DPD заключила соглашение о сотрудничестве с крупнейшей сетью постаматов, что позволит расширить географию пунктов выдачи заказов.',
	},
];

const NewsPage = () => {
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Новости компании</h1>

			<div className="space-y-6">
				{newsItems.map((item) => (
					<article
						key={item.id}
						className="bg-white rounded-lg shadow overflow-hidden"
					>
						<div className="md:flex">
							<div className="md:flex-shrink-0">
								<img
									className="w-full h-full object-cover md:w-48 "
									src={item.image}
									alt={item.title}
								/>
							</div>
							<div className="p-8">
								<div className="uppercase tracking-wide text-sm text-red-600 font-semibold">
									{item.date}
								</div>
								<a
									href="#"
									className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
								>
									{item.title}
								</a>
								<p className="mt-2 text-gray-500">{item.content}</p>
								<Button className="mt-4" variant="outline" size="sm">
									Читать далее
								</Button>
							</div>
						</div>
					</article>
				))}
			</div>

			<Pagination className="mt-8">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" isActive>
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">3</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};

export { NewsPage };
