'use client';

import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare } from 'lucide-react';
import { AssessmentRecommendation } from '@/types/assessment';

import { useUpdateRecommendations } from '@/lib/api/queries/Assessment/mutations/useUpdateRecommendations';

interface RecommendationsModalProps {
	assessmentId: string;
	isOpen: boolean;
	onClose: () => void;
	recommendations: AssessmentRecommendation[];
}

export const RecommendationsModal = ({
	isOpen,
	assessmentId,
	onClose,
	recommendations,
}: RecommendationsModalProps) => {
	const [formData, setFormData] = useState<AssessmentRecommendation[]>([]);
	const { mutate: updateRecommendations, isPending: isLoading } =
		useUpdateRecommendations();

	useEffect(() => {
		if (recommendations && recommendations.length > 0) {
			setFormData([...recommendations]);
		}
	}, [recommendations, isOpen]);

	const handleSubmit = () => {
		if (formData.length > 0) {
			updateRecommendations(
				{ recommendations: formData, assessmentId },
				{
					onSuccess: () => {
						onClose();
					},
				},
			);
		}
	};

	const handleFieldChange = (id: string, value: string) => {
		setFormData((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, recommendation: value } : item,
			),
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<MessageSquare className="w-5 h-5" />
						<span>Рекомендации и комментарии руководителя</span>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{formData.map((item) => (
						<div key={item.id} className="space-y-3">
							<Label
								htmlFor={`recommendation-${item.id}`}
								className="text-sm font-medium"
							>
								{item.title}
							</Label>
							<Textarea
								id={`recommendation-${item.id}`}
								placeholder={item?.description || ''}
								value={item.recommendation}
								onChange={(e) => handleFieldChange(item.id, e.target.value)}
								className="min-h-[90px] resize-none"
							/>
						</div>
					))}
				</div>

				{/* Actions */}
				<div className="flex justify-end space-x-2 pt-4">
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button type={'button'} disabled={isLoading} onClick={handleSubmit}>
						{isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
						Сохранить рекомендации
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
