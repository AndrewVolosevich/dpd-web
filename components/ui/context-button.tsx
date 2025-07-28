'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Activity, ArrowDownToLine, Loader2, Pencil, Plus } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const contextButtonVariants = cva(
	`fixed flex bottom-40 right-12 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium 
	ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
	focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 z-50`,
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:brightness-90',
				destructive:
					'bg-destructive text-destructive-foreground hover:brightness-90',
				outline:
					'border border-input bg-background hover:bg-accent hover:brightness-90',
				secondary: 'bg-secondary text-secondary-foreground hover:brightness-90',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'w-14 h-14',
				sm: 'w-12 h-12',
				lg: 'w-24 h-24',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export enum ContextIcons {
	CREATE,
	SAVE,
	EDIT,
	MOOD,
}

export interface ContextButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof contextButtonVariants> {
	iconVariant?: ContextIcons;
	tooltip?: string;
	asChild?: boolean;
	href?: string;
	disabled?: boolean;
}

const ContextButton = React.forwardRef<HTMLButtonElement, ContextButtonProps>(
	(
		{
			className,
			variant,
			size,
			iconVariant = ContextIcons.CREATE,
			disabled,
			tooltip,
			asChild = false,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'button';
		const ContextContent = (
			<Comp
				className={cn(contextButtonVariants({ variant, size, className }))}
				ref={ref}
				disabled={disabled}
				{...props}
			>
				{disabled ? (
					<Loader2 className="animate-spin" />
				) : (
					<>
						{iconVariant === ContextIcons.CREATE && (
							<Plus className={'w-[60%] h-[60%]'} />
						)}
						{iconVariant === ContextIcons.SAVE && (
							<ArrowDownToLine className={'w-[60%] h-[60%]'} />
						)}
						{iconVariant === ContextIcons.EDIT && (
							<Pencil className={'w-[50%] h-[50%]'} />
						)}
						{iconVariant === ContextIcons.MOOD && (
							<Activity className={'w-[50%] h-[50%]'} />
						)}
					</>
				)}
			</Comp>
		);
		return tooltip ? (
			<TooltipProvider delayDuration={500}>
				<Tooltip>
					<TooltipTrigger asChild>{ContextContent}</TooltipTrigger>
					<TooltipContent collisionPadding={20} sideOffset={10}>
						<p>{tooltip}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		) : (
			ContextContent
		);
	},
);
ContextButton.displayName = 'Button';

export { ContextButton, contextButtonVariants };
