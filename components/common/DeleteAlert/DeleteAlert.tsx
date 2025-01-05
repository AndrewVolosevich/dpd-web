import React from 'react';
import {
	AlertDialogTrigger,
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type DeleteAlertProps = {
	onProceed: () => void;
};

const DeleteAlert = ({ onProceed }: DeleteAlertProps) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Trash2 className="h-4 w-4 text-destructive" />
					<span className="sr-only">Удалить</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
					<AlertDialogDescription>
						Это действие нельзя отменить. Вы полностью удалите данные с сервера.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отменить</AlertDialogCancel>
					<AlertDialogAction onClick={onProceed}>Продолжить</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteAlert;
