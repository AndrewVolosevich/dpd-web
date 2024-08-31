import React from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const AboutPage = () => {
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">О компании</h1>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">История</h2>
				<div className="space-y-4">
					{[2000, 2010, 2020].map((year) => (
						<div key={year} className="flex items-start">
							<img
								src={`https://placehold.co/100x100`}
								alt={`Year ${year}`}
								className="w-24 h-24 object-cover rounded mr-4"
							/>
							<div>
								<h3 className="font-semibold">{year}</h3>
								<p className="text-sm text-gray-600">
									Описание важных событий компании в {year} году.
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Миссия и ценности</h2>
				<div className="flex flex-col md:flex-row items-center md:items-start gap-4">
					<img
						src="https://placehold.co/200x300"
						alt="Миссия компании"
						className="w-full md:w-1/3 h-40 object-cover rounded"
					/>
					<div className="md:w-2/3">
						<p className="text-sm text-gray-600 mb-4">
							Расшифровка миссии компании и ее значение для нашей деятельности.
						</p>
						<h3 className="font-semibold mb-2">Наши ценности:</h3>
						<ul className="list-disc list-inside text-sm text-gray-600">
							<li>Качество обслуживания</li>
							<li>Инновации</li>
							<li>Командная работа</li>
							<li>Ответственность перед обществом</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Орг.структура</h2>
				<div className="mb-4">
					<img
						src="https://placehold.co/600x300"
						alt="Организационная структура"
						className="w-full h-60 object-contain rounded"
					/>
				</div>
				<Accordion type="single" collapsible>
					<AccordionItem value="item-1">
						<AccordionTrigger>Детальная информация</AccordionTrigger>
						<AccordionContent>
							<p className="text-sm text-gray-600">
								Здесь представлена детальная информация об организационной
								структуре компании, включая описание отделов и их функций.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<h3 className="font-semibold mt-4 mb-2">Руководство компании</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="text-center">
							<img
								src={`https://placehold.co/100x100`}
								alt={`Руководитель ${i}`}
								className="w-24 h-24 rounded-full mx-auto mb-2"
							/>
							<p className="text-sm font-semibold">ФИО Руководителя {i}</p>
							<p className="text-xs text-gray-600">Должность</p>
						</div>
					))}
				</div>
			</section>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Вакансии</h2>
				<Accordion type="multiple">
					{[
						'Менеджер по продажам',
						'Водитель-курьер',
						'Специалист по логистике',
					].map((position, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger>{position}</AccordionTrigger>
							<AccordionContent>
								<p className="text-sm text-gray-600 mb-2">
									Описание вакансии {position}. Требования, обязанности и
									условия работы.
								</p>
								<Button size="sm">Откликнуться</Button>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>

			<section className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Реквизиты</h2>
				<p className="text-sm text-gray-600">
					ООО DPD Беларусь
					<br />
					ИНН: 1234567890
					<br />
					КПП: 123456789
					<br />
					ОГРН: 1234567890123
					<br />
					Юридический адрес: 123456, г. Минск, ул. Примерная, д. 1
				</p>
			</section>

			<section className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-4">Телефонный справочник</h2>
				<div className="flex justify-between items-center mb-4">
					<Input
						type="search"
						placeholder="Поиск по справочнику"
						className="max-w-sm"
					/>
					<Button variant="outline" size="sm">
						<Download className="mr-2 h-4 w-4" />
						Скачать справочник
					</Button>
				</div>
				<table className="w-full text-sm">
					<thead>
						<tr className="bg-gray-100">
							<th className="p-2 text-left">ФИО</th>
							<th className="p-2 text-left">Должность</th>
							<th className="p-2 text-left">Телефон</th>
						</tr>
					</thead>
					<tbody>
						{[1, 2, 3].map((i) => (
							<tr key={i} className="border-b">
								<td className="p-2">Иванов Иван Иванович</td>
								<td className="p-2">Менеджер</td>
								<td className="p-2">+7 (123) 456-78-90</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
};

export default AboutPage;
