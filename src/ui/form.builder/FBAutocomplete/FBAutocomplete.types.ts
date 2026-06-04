import { FormControlProps } from '@material-ui/core';
import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import { UseAutocompleteProps } from '@material-ui/lab/useAutocomplete';
import { FBAutocompleteAsyncConfig, FBInputProps } from '..';

export type FBAutocompleteProps =
 & FBInputProps
 & Pick<Partial<AutocompleteProps>, 'renderOption' | 'onBlur'>
 & Pick<FBAutocompleteAsyncConfig, 'labelPrefixRoot' | 'includeRevision'>
 & Pick<UseAutocompleteProps,
 | 'getOptionLabel'
 | 'filterOptions'
 | 'getOptionDisabled'
 | 'freeSolo'
 | 'filterSelectedOptions'
 | 'groupBy'
 | 'disableClearable'
 > & {
   getTagLabel?: (option: any) => React.ReactNode
   onInputChange?: (ev: React.FocusEvent<HTMLInputElement>) => unknown
   onOpen?: () => unknown
   refresh?: () => unknown
   isCustomEndAdornment?: boolean
   renderEndAdornment?: (value: any) => React.ReactNode
   isCustomStartAdornment?: boolean
   renderStartAdornment?: (value: any) => React.ReactNode
   autoCompleteClasses?: AutocompleteProps['classes']
   disabledOptions?: string[]
   customStyles?: React.CSSProperties
   groupByKey?: string
   inputStyle?: React.CSSProperties
   modifiedOptions?: any[]
   debounceFilterInput?: (event: React.ChangeEvent<{}>, value: any) => void
   inputPropStyle?: React.CSSProperties
   inputPropStyleSize?: FormControlProps['size']
   isDocumentLHRT?: boolean
   getOptionSelected?: AutocompleteProps['getOptionSelected']
   /**
    * @cfg {Boolean} Option to disable deletion of rendered chips using Backspace key.
    */
   disableBackspace?: boolean
   disableChipDelete?: boolean
   isTypeLhrBuild?: boolean
 };
