import React from 'react'

export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const PASSWORD_RULE_MESSAGE = 'At least 1 letter, a number, at least 8 characters.'
export const EMAIL_RULE_MESSAGE = 'Email is invalid.'

export const LIMIT_COMMON_FILE_SIZE = 10485760 // 10 MB, caculate by byte
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

export const fieldErrorMessage = (errors, key) => {
  if (!errors || !errors[key]) return null
  return <div className="auth__form__field-error">{errors[key]?.message}</div>
}

export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid.'
  }
  return null
}