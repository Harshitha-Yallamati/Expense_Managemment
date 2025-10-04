import { forwardRef } from 'react'
import clsx from 'clsx'

const FormInput = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  size = 'md',
  icon,
  iconPosition = 'left',
  showCharacterCount = false,
  maxLength,
  min,
  max,
  step,
  pattern,
  autoComplete,
  autoFocus = false,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const hasError = !!error
  const characterCount = value ? value.length : 0

  const inputClasses = clsx(
    'block w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
    sizeClasses[size],
    hasError
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500',
    disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
    readOnly && 'bg-gray-50 text-gray-900 cursor-default',
    icon && iconPosition === 'left' && 'pl-10',
    icon && iconPosition === 'right' && 'pr-10',
    inputClassName
  )

  const labelClasses = clsx(
    'block text-sm font-medium text-gray-700 mb-1',
    required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
    disabled && 'text-gray-400',
    labelClassName
  )

  return (
    <div className={clsx('w-full', className)}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className={labelClasses}>
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={clsx('text-gray-400', iconSizeClasses[size])}>
              {icon}
            </div>
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          {...props}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className={clsx('text-gray-400', iconSizeClasses[size])}>
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Character Count */}
      {showCharacterCount && maxLength && (
        <div className="mt-1 text-right text-xs text-gray-500">
          {characterCount}/{maxLength}
        </div>
      )}

      {/* Helper Text */}
      {helperText && !hasError && (
        <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {hasError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

FormInput.displayName = 'FormInput'

export default FormInput
