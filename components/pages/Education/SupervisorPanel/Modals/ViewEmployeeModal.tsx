'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Mail,
	Phone,
	Calendar,
	Building,
	Briefcase,
	Clock,
} from 'lucide-react';
import { UserData } from '@/types/entities';
import { formatBornDate } from '@/lib/date/helpers';
import { formatPhoneNumber } from '@/lib/phone';

interface ViewEmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee: UserData;
	supervisorPositionId?: string;
}

export function ViewEmployeeModal({
	isOpen,
	onClose,
	employee,
}: ViewEmployeeModalProps) {
	const getInitials = (name: string, surname: string) => {
		return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>Информация о сотруднике</DialogTitle>
				</DialogHeader>

				{
					<div className="flex flex-col md:flex-row gap-6">
						<div className="flex flex-col items-center">
							<Avatar className="h-24 w-24">
								<AvatarImage
									src={`/placeholder.svg?height=96&width=96`}
									alt={employee?.name}
								/>
								<AvatarFallback>
									{getInitials(employee?.name || '', employee?.surname || '')}
								</AvatarFallback>
							</Avatar>
						</div>

						<div className="flex-1 space-y-4">
							<div>
								<h3 className="text-xl font-semibold">
									{employee?.surname} {employee?.name} {employee?.patronymic}
								</h3>
								<p className="text-muted-foreground">
									{employee?.position?.title}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span>{employee?.email || 'example@gmail.com'}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span>{formatPhoneNumber(employee?.tel)}</span>
								</div>
								<div className="flex items-center gap-2">
									<Building className="h-4 w-4 text-muted-foreground" />
									<span>{employee?.department?.title}</span>
								</div>
								<div className="flex items-center gap-2">
									<Briefcase className="h-4 w-4 text-muted-foreground" />
									<span>{employee?.position?.title}</span>
								</div>
								{employee?.bornDate && (
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<span>
											Дата рождения: {formatBornDate(employee?.bornDate)}
										</span>
									</div>
								)}
								{employee?.startDate && (
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span>
											Работает с: {formatBornDate(employee?.startDate)}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				}

				<DialogFooter>
					<Button onClick={onClose}>Закрыть</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
