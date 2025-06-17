export interface TimezoneOption {
  value: string
  label: string
  offset: number
  abbrev: string
  altName: string
}

export interface TimezoneSelectProps {
  value: string | undefined
  onChange: (value: TimezoneOption | null) => void
  label?: string
  placeholder?: string
  disabled?: boolean
}
