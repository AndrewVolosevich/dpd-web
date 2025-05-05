import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

const months = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];

const years = Array.from(
	{ length: 100 },
	(_, i) => new Date().getFullYear() - i,
);

const DatePickerPopoverWithFields = ({
	value,
	onChange,
	disabled,
	// name,
	formControl = true,
}: {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	disabled?: (date: Date) => boolean;
	formControl?: boolean;
	name?: string;
}) => {
	const [date, setDate] = useState(value || new Date());
	const [month, setMonth] = useState(date.getMonth());
	const [year, setYear] = useState(date.getFullYear());

	// Проверяем, находимся ли мы в контексте формы (FormProvider)
	const formContext = useFormContext();
	const isFormContextAvailable = !!formContext;

	// const { getFieldState, formState } = formContext || {};

	// Если `name` задан и форма доступна, получаем состояние поля
	// const fieldState =
	// 	name && isFormContextAvailable
	// 		? getFieldState!(name, formState)
	// 		: undefined;

	const handleMonthChange = (newMonth: number) => {
		setMonth(newMonth);
		const newDate = new Date(year, newMonth, date.getDate());
		setDate(newDate);
		onChange(newDate);
	};

	const handleYearChange = (newYear: number) => {
		setYear(newYear);
		const newDate = new Date(newYear, month, date.getDate());
		setDate(newDate);
		onChange(newDate);
	};

	const handleDateChange = (newDate?: Date | undefined) => {
		if (newDate) {
			setDate(newDate);
			onChange(newDate);
		}
	};

	const renderButtonContent = () => {
		if (value) {
			return format(value, 'PPP', { locale: ru });
		}
		return <span>Выберите дату</span>;
	};

	return (
		<>
			<Popover modal>
				<PopoverTrigger asChild>
					{formControl && isFormContextAvailable ? (
						<FormControl>
							<Button
								variant="outline"
								className={cn(
									'w-full pl-3 text-left font-normal',
									!value && 'text-muted-foreground',
								)}
							>
								{renderButtonContent()}
								<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
							</Button>
						</FormControl>
					) : (
						<Button
							variant="outline"
							className={cn(
								'w-full pl-3 text-left font-normal',
								!value && 'text-muted-foreground',
							)}
						>
							{renderButtonContent()}
							<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
						</Button>
					)}
				</PopoverTrigger>
				<PopoverContent
					className="flex w-auto flex-col space-y-2 p-2"
					align="start"
				>
					<div className="flex flex-row justify-between gap-2">
						<Select
							value={month.toString()}
							onValueChange={(value) => handleMonthChange(Number(value))}
						>
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="Месяц" />
							</SelectTrigger>
							<SelectContent className={'max-h-[200px]'}>
								{months.map((monthName, index) => (
									<SelectItem key={index} value={index.toString()}>
										{monthName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={year.toString()}
							onValueChange={(value) => handleYearChange(Number(value))}
						>
							<SelectTrigger className="w-[100px]">
								<SelectValue className={'border-none'} placeholder="Год" />
							</SelectTrigger>
							<SelectContent className={'max-h-[200px]'}>
								{years.map((year) => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="rounded-md border">
						<Calendar
							mode="single"
							selected={date}
							onSelect={handleDateChange}
							month={new Date(year, month)}
							onMonthChange={(newMonth) => {
								setMonth(newMonth.getMonth());
								setYear(newMonth.getFullYear());
							}}
							disabled={
								disabled
									? disabled
									: (date) => date > new Date() || date < new Date('1900-01-01')
							}
						/>
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
};

export default DatePickerPopoverWithFields;
