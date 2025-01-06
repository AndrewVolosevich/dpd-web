import { useState } from 'react';
import OutputBlock from '@/components/Editor/OutputBlock';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import EditorBlock from '@/components/Editor/EditorBlock';
import { EDITOR_INITIAL_DATA } from '@/const/editor';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';
import { UserData } from '@/types/entities';

const Presentation = ({ user }: { user: UserData }) => {
	const { toast } = useToast();
	const { isAdmin } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [editorData, setEditorData] = useState<any>(
		user?.presentation ? user?.presentation : EDITOR_INITIAL_DATA,
	);
	const queryClient = useQueryClient();
	const api = useApi();

	const { mutateAsync: updateUser, isPending: updateLoading } = useMutation({
		mutationFn: async (userData: any) => {
			const resp = await api.post(`/auth/update-user`, { ...userData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное изменение пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['another-user'],
			});
			toast({
				title: 'Пользователь успешно изменен',
				variant: 'default',
			});
		},
	});

	const handleSubmit = () => {
		updateUser({
			id: user?.id,
			tel: user?.tel,
			presentation: editorData,
		}).finally(() => {
			setIsEditing(false);
		});
	};

	const getButton = () => {
		if (isAdmin) {
			if (!isEditing) {
				return (
					<Button
						className={'mt-4'}
						type={'button'}
						onClick={() => setIsEditing(true)}
					>
						Редактировать презентацию
					</Button>
				);
			}

			if (isEditing) {
				return (
					<Button
						disabled={updateLoading}
						className={'mt-4'}
						type={'button'}
						onClick={handleSubmit}
					>
						{updateLoading ? 'Сохранение' : 'Сохранить'}
					</Button>
				);
			}
		}

		return null;
	};

	if (!isAdmin && !user?.presentation) {
		return null;
	}

	return (
		<div className={'w-full mt-4'}>
			{user?.presentation && (
				<Card className="col-span-1 md:col-span-3">
					<CardContent>
						<div>
							{editorData && !isEditing && <OutputBlock content={editorData} />}
							{isEditing && (
								<EditorBlock
									className={'mt-4 w-full mx-auto'}
									data={editorData}
									onChange={setEditorData}
									editorBlockId="editorjs-container"
								/>
							)}
						</div>
					</CardContent>
				</Card>
			)}
			{getButton()}
		</div>
	);
};

export default Presentation;
