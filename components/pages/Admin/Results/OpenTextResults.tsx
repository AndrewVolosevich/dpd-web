import { Card, CardContent } from '@/components/ui/card';

interface OpenTextResultsProps {
	question: {
		id: string;
		text: string;
		answers: Array<{
			id: string;
			value: string;
			comment?: string;
		}>;
	};
}

export function OpenTextResults({ question }: OpenTextResultsProps) {
	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground">
				Всего ответов: {question.answers.length}
			</p>

			<div className="space-y-2 max-h-96 overflow-y-auto">
				{question.answers.map((answer) => (
					<Card key={answer.id}>
						<CardContent className="p-3">
							<p>{answer.value}</p>
							{answer.comment && (
								<p className="text-sm text-muted-foreground mt-2">
									Комментарий: {answer.comment}
								</p>
							)}
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
