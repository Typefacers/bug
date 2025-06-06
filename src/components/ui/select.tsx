import * as React from 'react'
import type {
  SelectContextType,
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
} from '../../types/select-props'

const SelectContext = React.createContext<
  SelectContextType<string> | undefined
>(undefined)

export function Select<T extends string>({
  children,
  value,
  onValueChange,
}: SelectProps<T>) {
  const [open, setOpen] = React.useState(false)

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: onValueChange as unknown as (value: string) => void,
        open,
        setOpen,
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('SelectTrigger must be used within a Select')
  }

  return (
    <div className="relative w-full">
      <div
        onClick={() => context.setOpen(!context.open)}
        className={`flex h-10 w-full items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer ${className}`}
      >
        {children}
      </div>
      {context.open && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => context.setOpen(false)}
        />
      )}
    </div>
  )
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('SelectValue must be used within a Select')
  }

  return <span>{context.value || placeholder}</span>
}

export function SelectContent({ className, children }: SelectContentProps) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('SelectContent must be used within a Select')
  }

  if (!context.open) {
    return null
  }

  return (
    <div className="relative">
      <div
        className={`absolute z-50 mt-1 left-0 right-0 max-h-60 overflow-auto rounded-md py-1 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

export function SelectItem<T extends string>({
  value,
  children,
}: SelectItemProps<T>) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('SelectItem must be used within a Select')
  }

  const isSelected = context.value === value

  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
        isSelected ? 'bg-accent' : ''
      }`}
      onClick={() => {
        context.onValueChange(value)
        context.setOpen(false)
      }}
    >
      {children}
    </div>
  )
}
