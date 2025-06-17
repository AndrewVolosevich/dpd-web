'use client';

import type React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import QuestionToDirectorForm from '@/components/pages/CorporateLife/AskDirector/QuestionToDirectorForm';
import { QuestionToDirector } from '@/types/content';

interface AskQuestionModalProps {
	isOpen: boolean;
	onClose: () => void;
	question: QuestionToDirector | null;
}

export function EditQuestionToDirectorModal({
	isOpen,
	onClose,
	question,
}: AskQuestionModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Задать вопрос директору</DialogTitle>
				</DialogHeader>

				<QuestionToDirectorForm onClose={onClose} question={question} />
			</DialogContent>
		</Dialog>
	);
}
