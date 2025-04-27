import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
	return <input className={`flex h-10 w-full rounded-md px-3 py-2 text-sm ${className}`} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
