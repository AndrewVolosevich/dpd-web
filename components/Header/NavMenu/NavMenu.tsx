'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignJustify } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { NavLinks, Routes } from '@/const/routes';
import NavLink from '@/components/common/NavLink/NavLink';
import { useAuth } from '@/components/providers/global/AuthProvider';
import Link from 'next/link';

type NavMenuProps = React.HTMLAttributes<HTMLDivElement> & {
	isOpen: boolean;
	onChange: (_?: boolean) => void;
};

const NavMenu = ({ className, isOpen, onChange }: NavMenuProps) => {
	const { logout, isAdmin } = useAuth();
	return (
		<Sheet open={isOpen} onOpenChange={onChange}>
			<SheetTrigger asChild>
				<div className={className}>
					<Button variant="outline" className={'p-2'}>
						<AlignJustify className="h-5 w-5" />
					</Button>
				</div>
			</SheetTrigger>
			<SheetContent className={'block visible md:hidden md:invisible'}>
				<SheetHeader>
					<SheetTitle className={'hidden'}>Мобильное меню</SheetTitle>
				</SheetHeader>
				<ul className={`flex flex-col items-center p-2`}>
					{NavLinks.map((link, index) => {
						if (link.title === 'Администратор' && !isAdmin) {
							return null;
						}

						return (
							<React.Fragment key={`${link?.title}-${index}`}>
								<NavLink
									href={link.href}
									className={'mb-2 w-full py-4 text-xl'}
									onClick={() => {
										onChange(false);
									}}
								>
									{link.title}
								</NavLink>
								{link?.items &&
									link?.items?.length > 0 &&
									link?.items?.map((item) => (
										<Link
											key={item?.title}
											href={item?.href}
											className={
												'self-start ml-5 mb-1 hover:text-primary text-base'
											}
											onClick={() => {
												onChange();
											}}
										>
											{item?.title}
										</Link>
									))}
							</React.Fragment>
						);
					})}
					<NavLink href={Routes.PROFILE} className={'mb-2 w-full'}>
						Профиль
					</NavLink>
					<div
						onClick={() => {
							logout();
							onChange(false);
						}}
						className={
							'text-gray-600 hover:text-primary px-2 block py-6 text-base transition-colors cursor-pointer mb-2 w-full'
						}
						key={Routes.PROFILE}
					>
						Выйти
					</div>
				</ul>
			</SheetContent>
		</Sheet>
	);
};

export { NavMenu };
