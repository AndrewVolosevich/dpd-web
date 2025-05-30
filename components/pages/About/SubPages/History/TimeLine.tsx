'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import type { TimeLine } from '@/types/content';
import { useAuth } from '@/components/providers/global/AuthProvider';

const TimeLine = ({
	timelineData,
	onEdit,
	onDelete,
}: {
	timelineData: TimeLine[];
	onEdit?: (data: TimeLine) => void;
	onDelete?: (year: number) => void;
}) => {
	const { isAdmin } = useAuth();
	const [selectedYear, setSelectedYear] = useState(2023);
	const years = timelineData.map((data) => data?.year);

	const currentItem =
		timelineData.find((item) => item.year === selectedYear) || timelineData[0];

	const handlePrevious = () => {
		const currentIdx = timelineData.findIndex(
			(item) => item.year === selectedYear,
		);
		if (currentIdx > 0) {
			setSelectedYear(timelineData[currentIdx - 1].year);
		}
	};

	const handleNext = () => {
		const currentIdx = timelineData.findIndex(
			(item) => item.year === selectedYear,
		);
		if (currentIdx < timelineData.length - 1) {
			setSelectedYear(timelineData[currentIdx + 1].year);
		}
	};

	const canGoPrevious =
		timelineData.findIndex((item) => item.year === selectedYear) > 0;
	const canGoNext =
		timelineData.findIndex((item) => item.year === selectedYear) <
		timelineData.length - 1;

	return (
		<div className="w-full mx-auto p-8">
			{/* Timeline Years */}
			<div className="mb-12">
				{/* First row of years */}
				<div className="flex flex-wrap gap-8 mb-4 justify-start">
					{years.slice(0, 9).map((year) => (
						<button
							key={year}
							onClick={() => setSelectedYear(year)}
							className={`text-2xl font-light transition-all duration-200 ${
								selectedYear === year
									? 'text-gray-800 font-normal border-b-2 border-primary pb-1'
									: 'text-gray-400 hover:text-gray-600'
							}`}
						>
							{year}
						</button>
					))}
				</div>

				{/* Second row of years */}
				<div className="flex flex-wrap gap-8 justify-start">
					{years.slice(9).map((year) => (
						<button
							key={year}
							onClick={() => setSelectedYear(year)}
							className={`text-2xl font-light transition-all duration-200 ${
								selectedYear === year
									? 'text-gray-800 font-normal border-b-2 border-primary pb-1'
									: 'text-gray-400 hover:text-gray-600'
							}`}
						>
							{year}
						</button>
					))}
				</div>
			</div>

			{/* Content */}
			<div className="mb-16 space-y-6 relative">
				{currentItem.content.map((text, index) => (
					<div key={index} className="flex items-start gap-4">
						<div className="w-8 h-0.5 bg-primary mt-3 flex-shrink-0"></div>
						<p className="text-gray-600 text-lg leading-relaxed">{text}</p>
					</div>
				))}
				{isAdmin && currentItem && (
					<div className="flex lg:flex-col gap-2 justify-center lg:justify-start absolute top-0 right-0">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onEdit?.(currentItem)}
							className="flex items-center gap-2 bg-transparent"
						>
							<Edit className="w-4 h-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onDelete?.(currentItem.year)}
							className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300 bg-transparent"
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				)}
			</div>

			{/* Navigation */}
			<div className="flex gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={handlePrevious}
					disabled={!canGoPrevious}
					className="w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
				>
					<ChevronLeft className="w-5 h-5" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleNext}
					disabled={!canGoNext}
					className="w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
				>
					<ChevronRight className="w-5 h-5" />
				</Button>
			</div>
		</div>
	);
};
export default TimeLine;
