import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Routes } from '@/const/routes';

type ProfileBtnProps = React.HTMLAttributes<HTMLElement>;

const ProfileBtn = ({ className }: ProfileBtnProps) => {
	return (
		<Button
			variant={'buttonLink'}
			href={`${Routes.PROFILE}`}
			className={className}
		>
			<User className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
			Профиль
		</Button>
	);
};

export { ProfileBtn };
