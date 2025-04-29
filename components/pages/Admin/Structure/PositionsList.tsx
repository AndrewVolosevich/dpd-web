'use client';

import { Loader } from '@/components/common/Loader/Loader';
import { useDepartmentPositions } from '@/lib/api/queries/structure/useDepartmentPositions';
import PositionItem from '@/components/pages/Admin/Structure/PositionItem';

interface PositionsListProps {
	departmentId: string;
}

export default function PositionsList({ departmentId }: PositionsListProps) {
	const { data: positions, isLoading } = useDepartmentPositions(departmentId);

	if (isLoading) {
		return (
			<div className="ml-10 my-2 p-4 bg-white rounded-md">
				<Loader />
			</div>
		);
	}

	if (!positions || positions.length === 0) {
		return (
			<div className="ml-10 my-2 p-4 bg-white rounded-md text-center text-gray-500">
				В этом отделе нет должностей
			</div>
		);
	}

	return (
		<div className="ml-10 my-2 pr-2">
			{positions.map((position) => (
				<PositionItem position={position} key={position.id} />
			))}
		</div>
	);
}
