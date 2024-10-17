export interface LoginFormValues {
  email: string
  password: string
}

export interface PasswordValues {
  email: string
  confirmPass: string
  password: string
}

export interface ResetPasswordValues {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}
