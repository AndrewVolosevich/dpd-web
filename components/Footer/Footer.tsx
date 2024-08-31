import React from 'react';
import { cn } from '@/lib/utils';

type FooterProps = React.HTMLAttributes<HTMLElement>;

const Footer = ({ className }: FooterProps) => {
	return (
		<footer className={cn('bg-primary text-white py-2 shadow', className)}>
			<div className="container mx-auto px-4">
				<h2 className="font-bold mb-2 text-sm sm:text-base">
					Контакты компании
				</h2>
				<p className="text-xs sm:text-sm">
					Адрес: ул. Примерная, 123, г. Минск
				</p>
				<p className="text-xs sm:text-sm">Телефон: +375 (29) 3334455</p>
				<p className="text-xs sm:text-sm">Email: info@example.com</p>
			</div>
		</footer>
	);
};

export { Footer };
