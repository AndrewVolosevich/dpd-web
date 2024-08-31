import React from 'react';
import { LogoIcon } from '@/components/pages/Home/LogoIcon';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Routes } from '@/const/routes';

type LogoProps = React.HTMLAttributes<HTMLElement>;

const Logo = ({ className }: LogoProps) => {
	return (
		<Link
			href={Routes.HOME}
			className={cn('flex items-center self-start', className)}
		>
			<LogoIcon className="h-10 w-10 md:h-16 md:w-16 mr-2" />
			<span className="text-xl md:text-3xl font-bold text-primary">dpd</span>
		</Link>
	);
};

export { Logo };
