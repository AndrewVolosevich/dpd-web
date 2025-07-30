import React, { useMemo, useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, MessageSquare } from 'lucide-react';
import { Assessment } from '@/types/assessment';
import { defaultRecommendations } from '@/const/assessment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecommendationsModal } from '@/components/pages/Education/Assessment/common/Modals/RecommendationsModal';

const RecommendationsTab = ({ assessment }: { assessment: Assessment }) => {
	const recommendations = useMemo(() => {
		return assessment?.recommendations || defaultRecommendations;
	}, [assessment?.recommendations]);
	const [isRecommendationsModalOpen, setIsRecommendationsModalOpen] =
		useState(false);

	const handleEditRecommendations = () => {
		setIsRecommendationsModalOpen(true);
	};

	return (
		<TabsContent value="recomendations" className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center justify-between space-x-2">
							<MessageSquare className="w-5 h-5" />
							<span>Рекомендации и комментарии руководителя</span>
						</CardTitle>
						<Button onClick={handleEditRecommendations}>
							<Edit className="w-4 h-4 mr-2" />
							Редактировать
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{recommendations?.map((rec) => {
						return (
							<div key={rec.id}>
								<h4 className="text-sm mb-2">{rec.title}</h4>
								<div className="p-2 text-sm text-muted-foreground">
									{rec?.recommendation || (
										<span className="italic">Не заполнено</span>
									)}
								</div>
							</div>
						);
					})}
				</CardContent>
			</Card>
			{isRecommendationsModalOpen && assessment?.id && (
				<RecommendationsModal
					assessmentId={assessment?.id}
					isOpen={isRecommendationsModalOpen}
					onClose={() => setIsRecommendationsModalOpen(false)}
					recommendations={recommendations}
					assessment={assessment}
				/>
			)}
		</TabsContent>
	);
};

export default RecommendationsTab;
