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
import { ChevronDown, ChevronRight, ScanEye, TextSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ExtendedUserData, UserData } from '@/types/entities';
import { Loader } from '@/components/common/Loader/Loader';
import { useRouter } from 'next/navigation';

export default function TestsTab({
	departmentUsers,
	isLoading,
}: {
	departmentUsers: ExtendedUserData[] | undefined;
	isLoading: boolean;
}) {
	const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
		{},
	);
	const router = useRouter();

	// Format user full name
	const formatUserName = (user: UserData) => {
		if (!user) return '';
		return `${user?.surname} ${user?.name} ${user?.patronymic || ''}`.trim();
	};

	// Format date
	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
	};

	// Get test status
	const getTestStatus = (assignment: any) => {
		if (assignment?.survey?.testResults?.passed) {
			return (
				<Badge className="bg-green-500 pointer-events-none">Пройден</Badge>
			);
		}
		return <Badge className="bg-red-500 pointer-events-none">Не пройден</Badge>;
	};

	// Toggle user expansion
	const toggleUserExpansion = (userId: string) => {
		setExpandedUsers((prev) => ({
			...prev,
			[userId]: !prev[userId],
		}));
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
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[300px]">ФИО</TableHead>
							<TableHead>Название</TableHead>
							<TableHead>Статус</TableHead>
							<TableHead>Выполнено</TableHead>
							<TableHead>Баллы</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{departmentUsers?.length &&
							departmentUsers?.length > 0 &&
							departmentUsers.map((user) => {
								const isExpanded = expandedUsers[user.id] || false;

								return (
									<Fragment key={`user-${user.id}`}>
										<TableRow
											className="bg-muted/50 cursor-pointer hover:bg-muted/70"
											onClick={() => toggleUserExpansion(user.id)}
										>
											<TableCell colSpan={5} className="font-medium">
												<div className="flex items-center">
													{isExpanded ? (
														<ChevronDown className="h-4 w-4 mr-2" />
													) : (
														<ChevronRight className="h-4 w-4 mr-2" />
													)}
													{formatUserName(user)}
												</div>
											</TableCell>
										</TableRow>

										{isExpanded &&
											user?.userPanel?.assignments
												?.filter((assignment) => !!assignment?.survey)
												?.map((assignment) => (
													<TableRow
														key={`assignment-${assignment.id}`}
														className="cursor-pointer hover:bg-muted/30"
														onClick={() => {
															if (
																assignment?.completedAt &&
																assignment?.survey?.surveyVariant === 'TEST'
															) {
																router.push(
																	`/admin/results/${assignment?.survey?.id}/user-test-results/${user?.id}`,
																);
															}
														}}
													>
														<TableCell></TableCell>
														<TableCell>
															<div className="flex items-center">
																{assignment?.survey?.surveyVariant ===
																'TEST' ? (
																	<TextSearch className={'h-4 w-4 mr-2'} />
																) : (
																	<ScanEye className={'h-4 w-4 mr-2'} />
																)}
																{assignment.survey?.title || 'Неизвестный тест'}
															</div>
														</TableCell>
														<TableCell>{getTestStatus(assignment)}</TableCell>
														<TableCell>
															{assignment.completedAt
																? formatDate(assignment?.completedAt)
																: '-'}
														</TableCell>
														<TableCell>
															{assignment?.survey?.testResults?.score}
														</TableCell>
													</TableRow>
												))}
									</Fragment>
								);
							})}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
