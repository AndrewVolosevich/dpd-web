'use client';

import React from 'react';
import { NavLinks, Routes } from '@/const/routes';
import NavLink from '@/components/common/NavLink/NavLink';
import { Logo } from '@/components/Header/Logo/Logo';
import { Search } from '@/components/Header/Search/Search';
import { ProfileBtn } from '@/components/Header/ProfileBtn/ProfileBtn';
import { NavMenu } from '@/components/Header/NavMenu/NavMenu';

const Header = () => {
	const [menuOpen, setMenuOpen] = React.useState(false);
	// const { user } = useAuth();
	return (
		<>
			<header className="bg-white text-foreground shadow sticky top-0 z-50 w-full border-b">
				<div className="container mx-auto px-4 py-4 flex flex-col items-center justify-between relative">
					<div className="flex flex-col justify-between items-center w-full md:flex-row">
						<Logo />
						<div className={'flex w-full mt-2 md:mt-0 md:w-auto'}>
							<Search />
							<ProfileBtn className={'hidden md:flex ml-16'} />
						</div>
					</div>
					{/*{!!user?.id && (*/}
					<>
						<nav className={'self-start hidden md:flex'}>
							<ul className={`flex flex-row items-center`}>
								{NavLinks.map((link) => {
									if (link.href !== Routes.PROFILE) {
										return (
											<NavLink href={link.href} key={link.href}>
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
					</>
					{/*)}*/}
				</div>
			</header>
		</>
	);
};

export { Header };
