import { Badge } from '@/components/ui/badge';

export const getRatingBadge = (
	type: 'employee' | 'supervisor',
	rating?: number,
) => {
	const colorClass =
		type === 'employee'
			? 'bg-gray-500 hover:bg-gray-600'
			: 'bg-primary hover:bg-primary';
	return (
		<Badge className={`${colorClass} text-white min-w-[40px] justify-center`}>
			{rating !== undefined && rating !== null ? rating : '-'}
		</Badge>
	);
};
