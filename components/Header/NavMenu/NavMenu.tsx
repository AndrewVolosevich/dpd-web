import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignJustify } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavLinks } from '@/const/routes';
import NavLink from '@/components/common/NavLink/NavLink';

type NavMenuProps = React.HTMLAttributes<HTMLDivElement> & {
	isOpen: boolean;
	onChange: (_?: boolean) => void;
};

const NavMenu = ({ className, isOpen, onChange }: NavMenuProps) => {
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
				<ul className={`flex flex-col items-center p-2`}>
					{NavLinks.map((link) => (
						<NavLink href={link.href} key={link.href} className={'mb-2 w-full'}>
							{link.title}
						</NavLink>
					))}
				</ul>
			</SheetContent>
		</Sheet>
	);
};

export { NavMenu };
