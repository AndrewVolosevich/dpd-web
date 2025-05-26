import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
	id: string;
	label: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, label }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<li
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="p-3 border bg-white rounded-md flex items-center space-x-2"
		>
			<GripVertical className="w-4 h-4" />
			<span>{label}</span>
		</li>
	);
};
