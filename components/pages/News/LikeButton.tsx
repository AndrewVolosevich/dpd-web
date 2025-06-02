import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useState } from 'react';

interface LikeButtonProps {
	initialLikesCount: number;
	initialIsLiked?: boolean;
	onToggleLike?: (isLiked: boolean) => void;
	disabled?: boolean;
	showCount?: boolean;
	size?: 'sm' | 'default' | 'lg';
}

export function LikeButton({
	initialLikesCount,
	initialIsLiked = false,
	onToggleLike,
	disabled = false,
	showCount = true,
	size = 'sm',
}: LikeButtonProps) {
	const { user } = useAuth();
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [likesCount, setLikesCount] = useState(initialLikesCount);

	const handleToggleLike = () => {
		if (!user || disabled) return;

		const newIsLiked = !isLiked;
		setIsLiked(newIsLiked);
		setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

		onToggleLike?.(newIsLiked);
	};

	const getLikesText = (count: number) => {
		if (count === 0) return 'Нет лайков';
		if (count === 1) return '1 лайк';
		if (count < 5) return `${count} лайка`;
		return `${count} лайков`;
	};

	if (!user) {
		return showCount ? (
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Heart className="h-4 w-4" />
				<span>{getLikesText(likesCount)}</span>
			</div>
		) : null;
	}

	return (
		<div className="flex items-center gap-2 mt-8">
			{showCount && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Heart className="h-4 w-4" />
					<span>{getLikesText(likesCount)}</span>
				</div>
			)}

			<Button
				variant={isLiked ? 'default' : 'outline'}
				size={size}
				onClick={handleToggleLike}
				disabled={disabled}
				className="gap-2"
			>
				<Heart
					className={`h-4 w-4 ${isLiked ? 'fill-current' : ''} transition-all`}
				/>
				{isLiked ? 'Убрать лайк' : 'Лайк'}
			</Button>
		</div>
	);
}
