'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Routes } from '@/const/routes';

export function TestResultsTable() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTest, setSelectedTest] = useState<string>('all');
	const router = useRouter();
	const api = useApi();

	// Fetch tests
	const { data: tests = [] } = useQuery({
		queryKey: ['supervisor-tests'],
		queryFn: async () => {
			const resp = await api.get(`/surveys?surveyVariant=TEST`);
			return resp?.data || [];
		},
	});

	// Fetch all responses
	const { data: responses = [] } = useQuery({
		queryKey: ['test-responses'],
		queryFn: async () => {
			// In a real implementation, you would fetch all responses or paginate them
			// For simplicity, we'll use the tests data and extract responses
			const allResponses = [];
			for (const test of tests) {
				if (test.responses) {
					for (const response of test.responses) {
						allResponses.push({
							...response,
							testTitle: test.title,
							testId: test.id,
							userName: 'Loading...', // This would be populated from the user data
						});
					}
				}
			}
			return allResponses;
		},
		enabled: tests.length > 0,
	});

	// Fetch user details for each response
	const { data: users = [] } = useQuery({
		queryKey: ['supervisor-users'],
		queryFn: async () => {
			const resp = await api.post(`/auth/get-users`, {});
			return resp?.data || [];
		},
	});

	// Combine responses with user data
	const enrichedResponses = responses.map((response) => {
		const user = users.find((u: any) => u.id === response.userId);
		return {
			...response,
			userName: user ? `${user.surname} ${user.name}` : 'Unknown User',
			userPosition: user?.position || 'No position',
		};
	});

	// Filter responses based on search and selected test
	const filteredResponses = enrichedResponses.filter((response) => {
		const matchesSearch =
			response.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			response.testTitle.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesTest =
			selectedTest === 'all' || response.testId === selectedTest;
		return matchesSearch && matchesTest;
	});

	const handleViewDetails = (testId: string, userId: string) => {
		router.push(`${Routes.ADMIN}/results/${testId}/user-results/${userId}`);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Результаты тестов</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex flex-col md:flex-row gap-4 justify-between">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Поиск по имени или названию теста..."
								className="pl-8 w-full md:w-[300px]"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<Select value={selectedTest} onValueChange={setSelectedTest}>
							<SelectTrigger className="w-full md:w-[200px]">
								<SelectValue placeholder="Выберите тест" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Все тесты</SelectItem>
								{tests.map((test: any) => (
									<SelectItem key={test.id} value={test.id}>
										{test.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Сотрудник</TableHead>
									<TableHead>Тест</TableHead>
									<TableHead>Дата</TableHead>
									<TableHead>Результат</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredResponses.length > 0 ? (
									filteredResponses.map((response) => (
										<TableRow key={response.id}>
											<TableCell>
												<div>
													<div className="font-medium">{response.userName}</div>
													<div className="text-sm text-muted-foreground">
														{response.userPosition}
													</div>
												</div>
											</TableCell>
											<TableCell>{response.testTitle}</TableCell>
											<TableCell>
												{format(new Date(response.createdAt), 'dd MMMM yyyy', {
													locale: ru,
												})}
											</TableCell>
											<TableCell>
												<Badge className="bg-amber-500">Просмотр</Badge>
											</TableCell>
											<TableCell>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handleViewDetails(response.testId, response.userId)
													}
												>
													Детали
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-8 text-muted-foreground"
										>
											{searchQuery || selectedTest !== 'all'
												? 'Нет результатов, соответствующих критериям поиска'
												: 'Нет доступных результатов тестов'}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
