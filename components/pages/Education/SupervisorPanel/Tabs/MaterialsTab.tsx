'use client';

import { Fragment, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight, CircleSlash } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ExtendedUserData, UserData } from '@/types/entities';
import { Loader } from '@/components/common/Loader/Loader';
import { Assignment } from '@/types/education';

export default function MaterialsTab({
	departmentUsers,
	isLoading,
}: {
	departmentUsers: ExtendedUserData[] | undefined;
	isLoading: boolean;
}) {
	const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
		{},
	);
	// Format user full name
	const formatUserName = (user: UserData) => {
		if (!user) return '';
		return `${user?.surname} ${user?.name} ${user?.patronymic || ''}`.trim();
	};

	// Format date
	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return '';
		return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
	};

	// Toggle user expansion
	const toggleUserExpansion = (userId: string) => {
		setExpandedUsers((prev) => ({
			...prev,
			[userId]: !prev[userId],
		}));
	};

	// Get status text and color
	const getStatusInfo = (assignment: Assignment) => {
		if (assignment?.completedAt) {
			return {
				text: 'Изучен',
				color: 'text-green-600',
			};
		} else {
			return {
				text: 'Не изучен',
				color: 'text-primary',
			};
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader />
			</div>
		);
	}

	return (
		<div>
			<Card>
				<Table className="border">
					<TableHeader>
						<TableRow>
							<TableHead className="w-[400px]">ФИО</TableHead>
							<TableHead>Название</TableHead>
							<TableHead>Статус</TableHead>
							<TableHead>Выполнено</TableHead>
							<TableHead>Срок выполнения</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{departmentUsers?.map((user) => {
							const isExpanded = expandedUsers[user.id] || false;
							const hasAssignments =
								user.userPanel?.assignments?.filter((a) => !!a?.material)
									?.length > 0;

							return (
								<Fragment key={user.id}>
									<TableRow
										className={`cursor-pointer ${hasAssignments ? 'bg-gray-100' : ''}`}
										onClick={() =>
											hasAssignments && toggleUserExpansion(user.id)
										}
									>
										<TableCell className="font-medium flex items-center">
											{hasAssignments && (
												<span className="mr-2">
													{isExpanded ? (
														<ChevronDown className="h-4 w-4" />
													) : (
														<ChevronRight className="h-4 w-4" />
													)}
												</span>
											)}
											{!hasAssignments && (
												<span className="mr-2">
													<CircleSlash className="h-4 w-4" />
												</span>
											)}
											<span>{formatUserName(user)}</span>
										</TableCell>
										<TableCell></TableCell>
										<TableCell></TableCell>
										<TableCell></TableCell>
										<TableCell></TableCell>
									</TableRow>

									{isExpanded &&
										user.userPanel?.assignments
											?.filter((a) => !!a?.material)
											?.map((assignment) => {
												const statusInfo = getStatusInfo(assignment);
												return (
													<TableRow key={assignment.id}>
														<TableCell></TableCell>
														<TableCell className="font-medium flex items-center">
															{assignment.material?.title}
														</TableCell>
														<TableCell className={statusInfo.color}>
															{statusInfo.text}
														</TableCell>
														<TableCell>
															{formatDate(assignment?.completedAt)}
														</TableCell>
														<TableCell>
															{formatDate(assignment?.dueDate)}
														</TableCell>
													</TableRow>
												);
											})}
								</Fragment>
							);
						})}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
