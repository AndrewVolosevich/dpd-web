import { useState } from 'react';
import OutputBlock from '@/components/Editor/OutputBlock';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import EditorBlock from '@/components/Editor/EditorBlock';
import {
	EDITOR_INITIAL_DATA,
	EDITOR_NEW_DATA,
	EDITOR_TRANSFER_DATA,
} from '@/const/editor';
import { Card, CardContent } from '@/components/ui/card';
import { UserData } from '@/types/entities';
import { useUpdateUser } from '@/lib/api/queries/Users/mutations/useUpdateUser';

const Presentation = ({ user }: { user: UserData }) => {
	const { isAdmin } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [editorData, setEditorData] = useState<any>(
		user?.presentation ? user?.presentation : EDITOR_INITIAL_DATA,
	);
	const [editorRenderData, setEditorRenderData] = useState<any>(null);
	const [clearCounter, setClearCounter] = useState<number>(0);
	const [renderCounter, setRenderCounter] = useState<number>(0);

	const { mutateAsync: updateUser, isPending: updateLoading } = useUpdateUser();

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

	const handleSample = (sample: any) => {
		setClearCounter((old) => old + 1);
		setTimeout(() => {
			setEditorRenderData(sample);
			setRenderCounter((old) => old + 1);
		}, 0);
	};

	return (
		<div className={'w-full mt-4'}>
			{isEditing && (
				<div className={'mb-4'}>
					<Button
						className={'mr-2'}
						variant={'outline'}
						onClick={() => handleSample(EDITOR_NEW_DATA)}
					>
						При приеме
					</Button>
					<Button
						variant={'outline'}
						onClick={() => handleSample(EDITOR_TRANSFER_DATA)}
					>
						При преводе
					</Button>
				</div>
			)}
			{(!!user?.presentation?.blocks?.length || isEditing) && (
				<Card className="col-span-1 md:col-span-3">
					<CardContent
						className={'flex flex-col w-full justify-center items-center'}
					>
						<div className={'w-full md:w-[70%]'}>
							{editorData && !isEditing && <OutputBlock content={editorData} />}
							{isEditing && (
								<EditorBlock
									className={'mt-4 w-full mx-auto'}
									data={editorData}
									clearCounter={clearCounter}
									renderCounter={renderCounter}
									renderData={editorRenderData}
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
