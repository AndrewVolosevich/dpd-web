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
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { UserData } from '@/types/entities';

const handleSendEmail = (email: string, name: string) => {
	const subject = encodeURIComponent(`С Днем Рождения, ${name}!`);
	const body = encodeURIComponent(
		`Дорогой(ая) ${name},\n\nПоздравляю тебя с Днем Рождения! Желаю счастья, здоровья и успехов.\n\nС наилучшими пожеланиями.`,
	);
	window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};

export default function BirthdaySlider({
	groupedUsers,
	number,
}: {
	groupedUsers: Record<string, UserData[]>;
	number?: number;
}) {
	// api init
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);
	const [sliderApi, setSliderApi] = React.useState<CarouselApi>();

	useEffect(() => {
		if (!sliderApi) {
			return;
		}

		setCount(sliderApi.scrollSnapList().length);
		setCurrent(sliderApi.selectedScrollSnap() + 1);

		sliderApi.on('select', () => {
			setCurrent(sliderApi.selectedScrollSnap() + 1);
		});
	}, [sliderApi, number]);

	return (
		<>
			<Carousel
				setApi={setSliderApi}
				opts={{
					align: 'start',
				}}
				className="w-full h-full"
				orientation="vertical"
			>
				<CarouselContent className="-mt-1 h-[300px] lg:h-[500px]">
					{Object.entries(groupedUsers).map(([date, users]) => (
						<CarouselItem key={date} className="pt-1 basis-1/3 lg:basis-1/5">
							<div>
								<p className="font-semibold text-sm mb-4">{date}</p>
								<div className="flex flex-col space-y-4">
									{users?.map((user) => (
										<div
											key={user.id}
											className="flex flex-row justify-between w-full items-center"
										>
											<UserCard user={user} />
											<Button
												className="mr-2"
												variant="outline"
												onClick={() =>
													handleSendEmail('test@gmail.com', user?.name || '')
												}
											>
												<Gift className="text-primary" />
											</Button>
										</div>
									))}
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<div className="flex justify-center mt-6">
				{Array.from({ length: count }).map((_, index) => (
					<div
						key={index}
						onClick={() => sliderApi && sliderApi.scrollTo(index)}
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
