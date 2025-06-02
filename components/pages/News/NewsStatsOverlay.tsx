import { Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsStatsOverlayProps {
	likesCount: number;
	commentsCount: number;
	className?: string;
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function NewsStatsOverlay({
	likesCount,
	commentsCount,
	className,
	position = 'bottom-right',
}: NewsStatsOverlayProps) {
	const positionClasses = {
		'top-left': 'top-2 left-2',
		'top-right': 'top-2 right-2',
		'bottom-left': 'bottom-2 left-2',
		'bottom-right': 'bottom-2 right-2',
	};

	return (
		<div
			className={cn(
				'absolute z-10 flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm',
				positionClasses[position],
				className,
			)}
		>
			{/* Лайки */}
			<div className="flex items-center gap-1">
				<Heart className="h-4 w-4 fill-white" />
				<span className="font-medium">{likesCount}</span>
			</div>

			{/* Разделитель */}
			<div className="w-px h-4 bg-white/30" />

			{/* Комментарии */}
			<div className="flex items-center gap-1">
				<MessageCircle className="h-4 w-4" />
				<span className="font-medium">{commentsCount}</span>
			</div>
		</div>
	);
}
