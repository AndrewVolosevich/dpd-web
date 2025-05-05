import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

const DatePickerPopover = ({
	value,
	onChange,
	disabled,
	title,
}: {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	disabled?: (date: Date) => boolean;
	title?: string;
}) => {
	const [date, setDate] = useState(value || new Date());

	const handleDateChange = (newDate?: Date | undefined) => {
		if (newDate) {
			setDate(newDate);
			onChange(newDate);
		}
	};

	return (
		<>
			<Popover modal>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'w-full pl-3 text-left font-normal',
							!value && 'text-muted-foreground',
						)}
					>
						{value ? (
							format(value, 'PPP', { locale: ru })
						) : (
							<span>{title ? title : 'Выберите дату'}</span>
						)}
						<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="flex w-auto flex-col space-y-2 p-2"
					align="start"
				>
					<div className="rounded-md border">
						<Calendar
							mode="single"
							selected={date}
							onSelect={handleDateChange}
							disabled={
								disabled ? disabled : (date) => date < new Date('1900-01-01')
							}
						/>
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
};

export default DatePickerPopover;
