'use client';

import * as React from 'react';
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { useEffect } from 'react';
import UserCard from '@/components/pages/Home/UserCard';
import { userData } from '@/types/userData';

const employees: userData[] = [
	{ name: 'Юлия', surname: 'Марчукова', position: 'Старший специалист' },
	{ name: 'Александр', surname: 'Халеев', position: 'Специалист' },
	{ name: 'Лада', surname: 'Чистякова', position: 'Менеджер по продажам' },
	{ name: 'Иван', surname: 'Петров', position: 'Специалист' },
	{ name: 'Юлия', surname: 'Марчукова', position: 'Старший специалист' },
	{ name: 'Александр', surname: 'Халеев', position: 'Специалист' },
	{ name: 'Лада', surname: 'Чистякова', position: 'Менеджер по продажам' },
	{ name: 'Иван', surname: 'Петров', position: 'Специалист' },
	{ name: 'Юлия', surname: 'Марчукова', position: 'Старший специалист' },
	{ name: 'Александр', surname: 'Халеев', position: 'Специалист' },
	{ name: 'Лада', surname: 'Чистякова', position: 'Менеджер по продажам' },
	{ name: 'Иван', surname: 'Петров', position: 'Специалист' },
];

export default function PersonalSlider() {
	// api init
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);
	const [api, setApi] = React.useState<CarouselApi>();
	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<>
			<Carousel
				setApi={setApi}
				opts={{
					align: 'start',
				}}
				className="w-full"
			>
				<CarouselContent>
					{employees.map((employee, index) => (
						<CarouselItem
							key={index}
							className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
						>
							<UserCard user={employee} full />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			<div className="flex justify-center mt-6">
				{Array.from({ length: count }).map((_, index) => (
					<div
						key={index}
						onClick={() => api && api.scrollTo(index)}
						className={'p-1 cursor-pointer'}
					>
						<span
							className={`w-2 h-2 rounded-full transition-colors block ${
								index === current - 1 ? 'bg-primary' : 'bg-muted'
							}`}
						/>
					</div>
				))}
			</div>
		</>
	);
}
