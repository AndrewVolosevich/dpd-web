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
import { UserData } from '@/types/entities';

export default function PersonalSlider({
	personalData,
}: {
	personalData: UserData[] | undefined;
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
	}, [sliderApi, personalData?.length]);

	return (
		<>
			<Carousel
				setApi={setSliderApi}
				opts={{
					align: 'start',
				}}
				className="w-full"
			>
				<CarouselContent>
					{personalData?.length &&
						personalData?.map((employee, index) => (
							<CarouselItem
								key={index}
								className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
							>
								<UserCard user={employee as UserData} full />
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
