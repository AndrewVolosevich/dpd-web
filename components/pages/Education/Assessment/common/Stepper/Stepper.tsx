'use client';

import { Check, Circle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AssessmentStatus } from '@/types/assessment';

interface Step {
	id: number;
	title: string;
	description: string;
	status: AssessmentStatus;
}

interface StepperProps {
	steps: Step[];
	currentStep: number;
	onStepChange?: (step: number) => void;
	isLoading?: boolean;
	isNextDisabled?: boolean;
}

export function Stepper({
	steps,
	currentStep,
	onStepChange,
	isLoading,
	isNextDisabled,
}: StepperProps) {
	const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

	return (
		<div className="w-full max-w-4xl mx-auto p-6">
			{/* Steps */}
			<div className="relative">
				{/* Connection Line */}
				<div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
					<div
						className="h-full bg-primary transition-all duration-500 ease-out"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Step Items */}
				<div className="relative flex justify-between">
					{steps.map((step, index) => {
						const isCurrentStep = index === currentStep - 1;
						const isUpcomingStep = index > currentStep - 1;
						const isCompletedStep = index < currentStep - 1;

						return (
							<div key={step.id} className="flex flex-col items-center">
								{/* Step Circle */}
								<div
									className={cn(
										'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer',
										isCompletedStep &&
											'bg-green-600 border-green-600 text-white',
										isCurrentStep && 'bg-primary border-primary text-white',
										isUpcomingStep && 'bg-white border-gray-300 text-gray-400',
									)}
									onClick={() => onStepChange?.(step.id)}
								>
									{isCompletedStep ? (
										<Check className="w-5 h-5" />
									) : (
										<Circle className="w-5 h-5 fill-current" />
									)}
								</div>

								{/* Step Label */}
								<div className="mt-3 text-center max-w-24">
									<div
										className={cn(
											'text-sm font-medium',
											isCurrentStep && 'text-primary',
											isCompletedStep && 'text-green-600',
											isUpcomingStep && 'text-gray-400',
										)}
									>
										{step.title}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Current Step Details */}
			<div className="mt-8">
				<div className="flex justify-between">
					<Button
						variant="outline"
						onClick={() => onStepChange?.(currentStep - 1)}
						disabled={currentStep === 1 || isLoading}
					>
						Назад
					</Button>
					<Button
						onClick={() => onStepChange?.(currentStep + 1)}
						disabled={
							currentStep === steps.length || isLoading || isNextDisabled
						}
						className="flex items-center gap-2"
					>
						{currentStep === steps.length ? 'Завершено' : 'Далее'}
						{currentStep < steps.length && <ArrowRight className="w-4 h-4" />}
					</Button>
				</div>
			</div>
		</div>
	);
}
