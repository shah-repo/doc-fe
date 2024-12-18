import { ChangeEvent } from 'react';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';

export interface FBShippingAddresProps {
  name?: string
  loading: boolean
  disabled: boolean
  value: CustomOptionType
  options: CustomOptionType[]
  shippingAddresses: ShippingAddress[]
  handleChange: (event: ChangeEvent<{}>, value?: CustomOptionType) => void
}

export interface ShippingAddress {
  id: string
  city: string
  country: string
  primary: boolean
  zipCode: number
  siteName: string
  siteAddress: string
  siteContact: Contact[]
}

export interface Contact {
  id: string
  name: string
  email: string
  other: string
  primary: boolean
  shipping: boolean
  attention: boolean
  phoneNumber: string
}

export interface ContactValue {
  id: string
  name: string
}

export interface CustomOptionType extends OptionType {
  siteContact: Contact[]
}
