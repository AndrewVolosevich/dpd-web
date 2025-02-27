import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Question } from '@/types/entities';

interface ChoiceQuestionProps {
	question: Question;
	value: string | string[];
	onChange: (value: string | string[]) => void;
}

export function ChoiceQuestion({
	question,
	value,
	onChange,
}: ChoiceQuestionProps) {
	console.log();
	if (question.type === 'SINGLE_CHOICE') {
		return (
			<RadioGroup
				value={value as string}
				onValueChange={onChange}
				className="space-y-2"
			>
				{question.options.map((option, index) => (
					<div key={index} className="flex items-center space-x-2">
						<RadioGroupItem value={option.value} id={`option-${index}`} />
						<Label htmlFor={`option-${index}`}>{option.value}</Label>
					</div>
				))}
			</RadioGroup>
		);
	}

	return (
		<div className="space-y-2">
			{question.options.map((option, index) => (
				<div key={index} className="flex items-center space-x-2">
					<Checkbox
						id={`option-${index}`}
						checked={(value as string[])?.includes(option.value)}
						onCheckedChange={(checked) => {
							if (checked) {
								onChange([...(value as string[]), option.value]);
							} else {
								onChange((value as string[]).filter((v) => v !== option.value));
							}
						}}
					/>
					<Label htmlFor={`option-${index}`}>{option.value}</Label>
				</div>
			))}
		</div>
	);
}
