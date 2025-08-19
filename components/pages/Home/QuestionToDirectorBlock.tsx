'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import useQuestionsToDirector from '@/lib/api/queries/Content/useQuestionsToDirector';
import { formatMonthYearDate } from '@/lib/date/helpers';
import { getStatusBadge } from '@/lib/socials';
import { QuestionToDirectorStatus } from '@/types/content';
import { Routes } from '@/const/routes';

const QuestionToDirectorBlock = () => {
	const { data: questions } = useQuestionsToDirector();

	const filteredQuestions = questions
		?.filter(
			(q) =>
				q?.status === QuestionToDirectorStatus.ANSWERED ||
				q?.status === QuestionToDirectorStatus.APPROVED,
		)
		?.slice(0, 5);

	if (!filteredQuestions?.length) {
		return null;
	}

	return (
		<section className="w-full mt-4 container mx-auto">
			<Card className={` shadow-md`}>
				<CardHeader className="pb-3 mb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl font-bold flex items-center">
							<MessageCircle className="mr-2 h-5 w-5" />
							Вопросы директору
						</CardTitle>
						<Link
							href={`${Routes.CORPORATE_LIFE}/question-to-director`}
							passHref
							className="w-auto"
						>
							<Button className="w-full">Проголосовать</Button>
						</Link>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{filteredQuestions?.map((q) => (
							<div key={q.id} className="border-b pb-3 last:border-0">
								<div className="flex justify-between items-start mb-1">
									<p className="font-medium text-sm">{q?.title}</p>
									{getStatusBadge(q.status)}
								</div>
								<p className="text-xs text-muted-foreground">
									{formatMonthYearDate(q.createdAt)}
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

export default QuestionToDirectorBlock;
