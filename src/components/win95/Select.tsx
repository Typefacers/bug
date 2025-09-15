import {
  Children,
  forwardRef,
  isValidElement,
  type ChangeEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import {
  SelectNative,
  type SelectNativeProps,
  type SelectOption,
} from 'react95'

type NativeChangeHandler = NonNullable<SelectNativeProps['onChange']>
type LegacyChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => void

type Props = Omit<SelectNativeProps, 'options' | 'onChange'> & {
  options?: SelectOption<string>[]
  children?: ReactNode
  onChange?: LegacyChangeHandler | NativeChangeHandler
}

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { options, children, onChange, ...props },
  ref
) {
  const derivedOptions: SelectOption<string>[] =
    options ??
    Children.toArray(children)
      .filter(
        (child): child is ReactElement<{ value?: string }> =>
          isValidElement(child) && child.type === 'option'
      )
      .map(child => ({
        value:
          child.props.value ??
          (typeof child.props.children === 'string'
            ? child.props.children
            : ''),
        label:
          typeof child.props.children === 'string'
            ? child.props.children
            : (child.props.value ?? ''),
      }))

  const handleChange: NativeChangeHandler = (selected, details) => {
    if (!onChange) return

    if (onChange.length >= 2) {
      ;(onChange as NativeChangeHandler)(selected, details)
      return
    }

    ;(onChange as LegacyChangeHandler)(
      details.fromEvent as ChangeEvent<HTMLSelectElement>
    )
  }

  return (
    <SelectNative
      ref={ref}
      options={derivedOptions}
      onChange={onChange ? handleChange : undefined}
      {...props}
    />
  )
})

export default Select
