import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserData } from '@/types/entities';

type UserCardProps = React.HTMLAttributes<HTMLDivElement> & {
	user: UserData;
	full?: boolean;
};

const UserCard = ({ className, user, full }: UserCardProps) => {
	if (full) {
		return (
			<div className={cn('w-full', className)}>
				<Avatar className="w-24 h-24 mx-auto mb-4">
					<AvatarImage src={user?.image} alt={user?.name} />
					<AvatarFallback className="bg-muted text-2xl">
						{user?.name?.[0]?.toUpperCase() + user?.surname?.[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className={'flex flex-col'}>
					<h3 className="font-medium text-base mb-1 truncate self-center text-red-600">
						{user?.name + ' ' + user?.surname}
					</h3>
					<p className="text-sm text-muted-foreground truncate self-center">
						{user?.position}
					</p>
				</div>
			</div>
		);
	}
	return (
		<div className={cn('w-full flex flex-row justify-start mb-4', className)}>
			<Avatar className="w-12 h-12 mr-4">
				<AvatarImage src={user?.image} alt={user?.name} />
				<AvatarFallback className="bg-muted">
					{user?.name?.[0]?.toUpperCase() + user?.surname?.[0]?.toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div
				className={cn(
					'flex flex-col items-center justify-start',
					!user?.position && 'justify-center',
				)}
			>
				<p className="text-sm block self-start font-bold text-red-600">
					{user?.name + ' ' + user?.surname}
				</p>
				<p className="line-clamp-2 text-xs sm:text-sm text-gray-600 block">
					{user?.position}
				</p>
			</div>
		</div>
	);
};

export default UserCard;
