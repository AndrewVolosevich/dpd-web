'use client';
import React, { useEffect, useState } from 'react';
import { ContextButton, ContextIcons } from '@/components/ui/context-button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import useGetContentPage from '@/lib/api/queries/Content/useGetContentPage';
import OutputBlock from '@/components/Editor/OutputBlock';
import EditorBlock from '@/components/Editor/EditorBlock';
import { EDITOR_INITIAL_DATA } from '@/const/editor';
import { useCreateContentPage } from '@/lib/api/queries/Content/mutations/useCreateContentPage';
import { useUpdateContentPage } from '@/lib/api/queries/Content/mutations/useUpdateContentPage';

const containerClasses = 'container mx-auto p-4 h-full';

const ContentPage = ({ contentPageTitle }: { contentPageTitle?: string }) => {
	const { isAdmin } = useAuth();
	const [editMode, setEditMode] = React.useState(false);
	const [clearCounter, setClearCounter] = useState<number>(0);

	const { data: pageData, isLoading } = useGetContentPage(contentPageTitle);
	const { mutate: createPage, isPending: createPageLoading } =
		useCreateContentPage();
	const { mutate: updatePage, isPending: updatePageLoading } =
		useUpdateContentPage();
	const [editorData, setEditorData] = useState<any>(
		pageData?.content ? pageData?.content : EDITOR_INITIAL_DATA,
	);
	const handleEdit = () => {
		setEditMode(true);
	};

	const onSubmit = async () => {
		const content = editorData;
		if (pageData) {
			await updatePage({
				pageTitle: contentPageTitle,
				content,
			});
		} else {
			await createPage({
				pageTitle: contentPageTitle,
				content,
			});
		}
		setClearCounter((old) => old + 1);
		setEditMode(false);
	};

	useEffect(() => {
		if (pageData?.content) {
			setEditorData(pageData?.content);
		}
	}, [pageData?.content]);

	if (isLoading) {
		return (
			<div className={containerClasses}>
				<FullPageLoader />
			</div>
		);
	}

	if (editMode && !isLoading) {
		return (
			<div className={containerClasses}>
				{isAdmin && (
					<>
						<EditorBlock
							className={'mt-4 w-full mx-auto'}
							data={editorData}
							clearCounter={clearCounter}
							onChange={setEditorData}
							editorBlockId="editorjs-container"
						/>
						<ContextButton
							tooltip={'Сохранить'}
							iconVariant={ContextIcons.SAVE}
							onClick={onSubmit}
							disabled={createPageLoading || updatePageLoading}
						/>
					</>
				)}
			</div>
		);
	}

	return (
		<div className={containerClasses}>
			<div className={'flex flex-col'}>
				{isAdmin && (
					<ContextButton
						tooltip={pageData ? 'Изменить' : 'Создать'}
						iconVariant={pageData ? ContextIcons.EDIT : ContextIcons.CREATE}
						onClick={handleEdit}
						disabled={createPageLoading || updatePageLoading}
					/>
				)}
			</div>
			{pageData?.content && <OutputBlock content={pageData?.content} />}
		</div>
	);
};

export default ContentPage;
