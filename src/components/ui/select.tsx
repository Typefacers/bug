import * as React from "react";

interface SelectContextType<T extends string> {
	value: T;
	onValueChange: (value: T) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType<any> | undefined>(undefined);

export interface SelectProps<T extends string> {
	value: T;
	onValueChange: (value: T) => void;
	children: React.ReactNode;
}

export function Select<T extends string>({ children, value, onValueChange }: SelectProps<T>) {
	const [open, setOpen] = React.useState(false);

	return <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>{children}</SelectContext.Provider>;
}

export interface SelectTriggerProps {
	className?: string;
	children: React.ReactNode;
}

export function SelectTrigger({ className, children }: SelectTriggerProps) {
	const context = React.useContext(SelectContext);
	if (!context) {
		throw new Error("SelectTrigger must be used within a Select");
	}

	return (
		<div className="relative w-full">
			<div onClick={() => context.setOpen(!context.open)} className={`flex h-10 w-full items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer ${className}`}>
				{children}
			</div>
			{context.open && <div className="fixed inset-0 z-50" onClick={() => context.setOpen(false)} />}
		</div>
	);
}

export interface SelectValueProps {
	placeholder: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
	const context = React.useContext(SelectContext);
	if (!context) {
		throw new Error("SelectValue must be used within a Select");
	}

	return <span>{context.value || placeholder}</span>;
}

export interface SelectContentProps {
	className?: string;
	children: React.ReactNode;
}

export function SelectContent({ className, children }: SelectContentProps) {
	const context = React.useContext(SelectContext);
	if (!context) {
		throw new Error("SelectContent must be used within a Select");
	}

	if (!context.open) {
		return null;
	}

	return (
		<div className="relative">
			<div className={`absolute z-50 mt-1 left-0 right-0 max-h-60 overflow-auto rounded-md py-1 ${className}`}>{children}</div>
		</div>
	);
}

export interface SelectItemProps<T extends string> {
	value: T;
	children: React.ReactNode;
}

export function SelectItem<T extends string>({ value, children }: SelectItemProps<T>) {
	const context = React.useContext(SelectContext);
	if (!context) {
		throw new Error("SelectItem must be used within a Select");
	}

	const isSelected = context.value === value;

	return (
		<div
			className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
				isSelected ? "bg-accent" : ""
			}`}
			onClick={() => {
				context.onValueChange(value);
				context.setOpen(false);
			}}
		>
			{children}
		</div>
	);
}
