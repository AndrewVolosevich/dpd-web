'use client';

import { cn } from '@/lib/utils';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { ru } from 'date-fns/locale';

export function DateRangePicker({
	className,
	state,
}: React.HTMLAttributes<HTMLDivElement> & {
	state: [
		DateRange | undefined,
		React.Dispatch<React.SetStateAction<DateRange | undefined>>,
	];
}) {
	const [date, setDate] = state;
	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={cn(
							'w-[300px] justify-start text-left font-normal',
							!date && 'text-muted-foreground',
						)}
					>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y', { locale: ru })} -{' '}
									{format(date.to, 'LLL dd, y', { locale: ru })}
								</>
							) : (
								format(date.from, 'LLL dd, y', { locale: ru })
							)
						) : (
							<span>Выберите дату</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
