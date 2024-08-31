'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const slides = [
		'https://placehold.co/400x800',
		'https://placehold.co/400x800',
		'https://placehold.co/400x800',
	];

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	return (
		<div className="bg-white p-2 sm:p-2 rounded-lg shadow mb-4 sm:mb-8 min-h-64 sm:min-h-96">
			<div className="relative">
				<img
					src={slides[currentSlide]}
					alt={`Slide ${currentSlide + 1}`}
					className="w-full h-64 sm:h-96 object-cover rounded"
				/>
				<Button
					variant="outline"
					size="icon"
					className="absolute top-1/2 left-1 sm:left-2 transform -translate-y-1/2 bg-white/50 hover:bg-white/75"
					onClick={prevSlide}
				>
					<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="absolute top-1/2 right-1 sm:right-2 transform -translate-y-1/2 bg-white/50 hover:bg-white/75"
					onClick={nextSlide}
				>
					<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
				</Button>
				<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
					{slides.map((_, index) => (
						<div
							key={index}
							className={`h-1 w-1 sm:h-2 sm:w-2 rounded-full ${
								index === currentSlide ? 'bg-white' : 'bg-white/50'
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export { Slider };
