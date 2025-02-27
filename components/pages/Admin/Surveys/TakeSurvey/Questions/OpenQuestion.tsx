import { Textarea } from '@/components/ui/textarea';

interface OpenQuestionProps {
	value: string;
	onChange: (value: string) => void;
}

export function OpenQuestion({ value, onChange }: OpenQuestionProps) {
	return (
		<Textarea
			placeholder="Введите ваш ответ..."
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
