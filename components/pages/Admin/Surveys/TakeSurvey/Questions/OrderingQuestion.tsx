import React, { useState, useEffect } from 'react';
import {
	DndContext,
	useSensors,
	useSensor,
	PointerSensor,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/common/dnd/SortableItem';

interface OrderingQuestionProps {
	question: {
		options: { value: string; correctOrder?: number }[];
	};
	value?: string[]; // Текущий порядок, выбранный пользователем
	onChange: (value: string[]) => void; // Callback для обновления
}

export const OrderingQuestion: React.FC<OrderingQuestionProps> = ({
	question,
	value = [],
	onChange,
}) => {
	// Инициализация порядка:
	const [order, setOrder] = useState<string[]>([]);

	useEffect(() => {
		// Если пользователь уже выбрал порядок, используем его.
		if (value.length) {
			setOrder(value);
		} else {
			// Иначе строим порядок согласно `correctOrder`.
			const sortedOptions = [...question.options].sort(
				(a, b) => (a.correctOrder || 0) - (b.correctOrder || 0),
			);
			setOrder(sortedOptions.map((o) => o.value));
		}
	}, [value, question.options]);

	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragEnd = (event: any) => {
		const { active, over } = event;

		if (active?.id && over?.id && active.id !== over.id) {
			const oldIndex = order.findIndex((item) => item === active.id);
			const newIndex = order.findIndex((item) => item === over.id);
			const newOrder = arrayMove(order, oldIndex, newIndex);

			setOrder(newOrder);
			onChange(newOrder);
		}
	};

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			<SortableContext items={order} strategy={verticalListSortingStrategy}>
				<ul className="space-y-2">
					{order.map((item) => (
						<SortableItem key={item} id={item} label={item} />
					))}
				</ul>
			</SortableContext>
		</DndContext>
	);
};
