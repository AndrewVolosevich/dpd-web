import { LikeModel } from '@/types/entities';
import { QuestionToDirectorStatus } from '@/types/content';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import React from 'react';

export const getLikesCount = (likes?: LikeModel[]) => {
	if (!likes?.length) {
		return 0;
	}
	return likes.filter((like) => like.isLike === true).length;
};

export const getDislikesCount = (likes?: LikeModel[]) => {
	if (!likes?.length) {
		return 0;
	}
	return likes.filter((like) => like.isLike === false).length;
};

export const getStatusBadge = (status?: QuestionToDirectorStatus) => {
	switch (status) {
		case QuestionToDirectorStatus.ANSWERED:
			return (
				<Badge className="bg-green-100 text-green-800">
					<CheckCircle className="w-3 h-3 mr-1" />
					Отвечен
				</Badge>
			);
		case QuestionToDirectorStatus.MODERATION:
			return (
				<Badge className="bg-yellow-100 text-yellow-800">
					<Clock className="w-3 h-3 mr-1" />
					На рассмотрении
				</Badge>
			);
		case QuestionToDirectorStatus.APPROVED:
			return <Badge className="bg-blue-100 text-blue-800">Опубликован</Badge>;
		default:
			return null;
	}
};
