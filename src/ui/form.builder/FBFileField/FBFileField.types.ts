import { FBInputProps, FBProviderProps } from '..';

export interface FBFile {
  file: File
}

export type FBFileFieldProps =
& Pick<FBInputProps, 'name' | 'multiple' | 'disabled' | 'gutter'>
& Pick<FBProviderProps, 'formState'>
& {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => any
  onUploadClick?: () => void
  isLoading?: boolean
  typeToAccept?: string
  className?: string
  labelClassName?: string
  iconClassName?: string
};
