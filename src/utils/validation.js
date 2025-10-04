// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateName = (name) => {
  return name.trim().length >= 2
}

export const validateCompanyName = (companyName) => {
  return companyName.trim().length >= 2
}

// Validation error messages
export const validationMessages = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters'
  },
  name: {
    required: 'Name is required',
    minLength: 'Name must be at least 2 characters'
  },
  companyName: {
    required: 'Company name is required',
    minLength: 'Company name must be at least 2 characters'
  },
  confirmPassword: {
    required: 'Please confirm your password',
    mismatch: 'Passwords do not match'
  }
}

// Form validation functions
export const validateLoginForm = (formData) => {
  const errors = {}

  if (!formData.email) {
    errors.email = validationMessages.email.required
  } else if (!validateEmail(formData.email)) {
    errors.email = validationMessages.email.invalid
  }

  if (!formData.password) {
    errors.password = validationMessages.password.required
  } else if (!validatePassword(formData.password)) {
    errors.password = validationMessages.password.minLength
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateSignupForm = (formData) => {
  const errors = {}

  if (!formData.companyName) {
    errors.companyName = validationMessages.companyName.required
  } else if (!validateCompanyName(formData.companyName)) {
    errors.companyName = validationMessages.companyName.minLength
  }

  if (!formData.name) {
    errors.name = validationMessages.name.required
  } else if (!validateName(formData.name)) {
    errors.name = validationMessages.name.minLength
  }

  if (!formData.email) {
    errors.email = validationMessages.email.required
  } else if (!validateEmail(formData.email)) {
    errors.email = validationMessages.email.invalid
  }

  if (!formData.password) {
    errors.password = validationMessages.password.required
  } else if (!validatePassword(formData.password)) {
    errors.password = validationMessages.password.minLength
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = validationMessages.confirmPassword.required
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = validationMessages.confirmPassword.mismatch
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
