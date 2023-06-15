export interface LoginFormValues {
  email: string
  password: string
}

export interface PasswordEmail {
  email: string
}

export interface PasswordValues {
  email: string
  confirmPass: string
  password: string
}

export interface ResetPasswordValues {
  email: string
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}
