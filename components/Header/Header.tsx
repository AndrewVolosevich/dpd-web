'use client';

import React from 'react';
import { NavLinks, Routes } from '@/const/routes';
import NavLink from '@/components/common/NavLink/NavLink';
import { Logo } from '@/components/Header/Logo/Logo';
import { NavMenu } from '@/components/Header/NavMenu/NavMenu';
import { UserNav } from '@/components/common/UserNav/UserNav';

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
						<nav
							className={
								'container hidden md:flex relative w-full items-center'
							}
						>
							<ul className={`flex flex-row items-center list-none p-0 m-0`}>
								{NavLinks.map((link, index) => {
									if (link.href !== Routes.PROFILE) {
										return (
											<NavLink href={link.href} key={`${link.href}-${index}`}>
												{link.title}
											</NavLink>
										);
									}
								})}
							</ul>
						</nav>
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
