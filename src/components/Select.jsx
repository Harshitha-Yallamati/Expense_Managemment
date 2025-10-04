import { forwardRef } from 'react'
import clsx from 'clsx'

const Select = forwardRef(({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  selectClassName = '',
  labelClassName = '',
  size = 'md',
  multiple = false,
  searchable = false,
  clearable = false,
  loading = false,
  emptyMessage = 'No options available',
  autoFocus = false,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const hasError = !!error

  const selectClasses = clsx(
    'block w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors appearance-none bg-white',
    sizeClasses[size],
    hasError
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500',
    disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
    multiple && 'h-auto min-h-[2.5rem]',
    selectClassName
  )

  const labelClasses = clsx(
    'block text-sm font-medium text-gray-700 mb-1',
    required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
    disabled && 'text-gray-400',
    labelClassName
  )

  const handleChange = (e) => {
    if (multiple) {
      const selectedValues = Array.from(e.target.selectedOptions, option => option.value)
      onChange?.(selectedValues)
    } else {
      onChange?.(e.target.value)
    }
  }

  const handleClear = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (multiple) {
      onChange?.([])
    } else {
      onChange?.('')
    }
  }

  const renderOption = (option) => {
    if (typeof option === 'string') {
      return (
        <option key={option} value={option}>
          {option}
        </option>
      )
    }

    return (
      <option 
        key={option.value} 
        value={option.value}
        disabled={option.disabled}
      >
        {option.label}
      </option>
    )
  }

  const getSelectedText = () => {
    if (multiple) {
      const selectedOptions = options.filter(option => {
        const value = typeof option === 'string' ? option : option.value
        return Array.isArray(value) ? value.includes(value) : false
      })
      return selectedOptions.length > 0 
        ? `${selectedOptions.length} selected`
        : placeholder
    }

    const selectedOption = options.find(option => {
      const optionValue = typeof option === 'string' ? option : option.value
      return optionValue === value
    })

    if (selectedOption) {
      return typeof selectedOption === 'string' ? selectedOption : selectedOption.label
    }

    return placeholder
  }

  return (
    <div className={clsx('w-full', className)}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className={labelClasses}>
          {label}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        <select
          ref={ref}
          id={name}
          name={name}
          value={multiple ? undefined : value}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled || loading}
          multiple={multiple}
          autoFocus={autoFocus}
          className={selectClasses}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          {...props}
        >
          {/* Placeholder option for single select */}
          {!multiple && !required && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {/* Options */}
          {options.length > 0 ? (
            options.map(renderOption)
          ) : (
            <option value="" disabled>
              {emptyMessage}
            </option>
          )}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          ) : (
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          )}
        </div>

        {/* Clear button */}
        {clearable && value && !disabled && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-6 flex items-center pr-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="Clear selection"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Selected values display for multiple select */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {value.map((val) => {
            const option = options.find(opt => {
              const optionValue = typeof opt === 'string' ? opt : opt.value
              return optionValue === val
            })
            const label = typeof option === 'string' ? option : option?.label || val
            
            return (
              <span
                key={val}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
              >
                {label}
                <button
                  type="button"
                  onClick={() => {
                    const newValue = value.filter(v => v !== val)
                    onChange?.(newValue)
                  }}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={`Remove ${label}`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )
          })}
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

Select.displayName = 'Select'

export default Select
