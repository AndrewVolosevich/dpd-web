import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface OrderingOption {
	value: string;
	correctOrder?: number;
}

interface OrderingQuestionCreateProps {
	initialOptions?: OrderingOption[];
	onSave: (options: OrderingOption[]) => void;
}

const OrderingQuestionCreate: React.FC<OrderingQuestionCreateProps> = ({
	initialOptions = [],
	onSave,
}) => {
	const [options, setOptions] = useState<OrderingOption[]>(initialOptions);

	const addOption = () => {
		const newOption: OrderingOption = { value: '' };
		const updatedOptions = [...options, newOption];
		setOptions(updatedOptions);
		onSave(updatedOptions); // Сразу сохраняем изменения
	};

	const updateOption = (
		index: number,
		field: keyof OrderingOption,
		value: any,
	) => {
		const updatedOptions = options.map((option, idx) =>
			idx === index ? { ...option, [field]: value } : option,
		);
		setOptions(updatedOptions);
		onSave(updatedOptions); // Сразу сохраняем изменения
	};

	const removeOption = (index: number) => {
		const updatedOptions = options.filter((_, idx) => idx !== index);
		setOptions(updatedOptions);
		onSave(updatedOptions); // Сразу сохраняем изменения
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				{options.map((option, index) => (
					<div key={index} className="flex items-center gap-2">
						<Input
							value={option.value}
							onChange={(e) => updateOption(index, 'value', e.target.value)}
							placeholder={`Вариант ответа ${index + 1}`}
							className="flex-1"
						/>
						<Input
							type="number"
							value={option.correctOrder || ''}
							onChange={(e) => {
								const correctOrder = parseInt(e.target.value, 10) || undefined;
								updateOption(index, 'correctOrder', correctOrder);
							}}
							placeholder="Порядок"
							className="w-20"
						/>
						<Button
							variant="ghost"
							className="text-red-500"
							onClick={() => removeOption(index)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
			<div className="space-y-2">
				<Button variant="outline" onClick={addOption} size="sm">
					<PlusCircle className="h-4 w-4 mr-2" />
					Добавить вариант
				</Button>
			</div>
		</div>
	);
};

export default OrderingQuestionCreate;
