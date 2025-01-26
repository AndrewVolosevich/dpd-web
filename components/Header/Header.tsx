'use client';

import React from 'react';
import { Logo } from '@/components/Header/Logo/Logo';
import { NavMenu } from '@/components/Header/NavMenu/NavMenu';
import { UserNav } from '@/components/common/UserNav/UserNav';
import { Navigation } from './Navigation/Navigation';

const Header = () => {
	const [menuOpen, setMenuOpen] = React.useState(false);

	return (
		<>
			<header className="bg-white text-foreground shadow sticky top-0 z-50 w-full border-b">
				<div className="mx-auto flex flex-col items-center justify-between relative">
					<div className="container flex flex-col justify-between items-center w-full md:flex-row my-4">
						<Logo />
						<div className={'flex w-full mt-2 md:mt-0 md:w-auto'}>
							<UserNav className={'hidden md:block'} />
						</div>
					</div>
					<div
						className={'bg-gray-200 w-full flex items-center justify-center'}
					>
						<Navigation className="container hidden md:flex relative w-full items-center" />
						<NavMenu
							isOpen={menuOpen}
							onChange={() => setMenuOpen((old) => !old)}
							className={'block md:hidden absolute right-4 top-4'}
						/>
					</div>
				</div>
			</header>
		</>
	);
};

export { Header };
