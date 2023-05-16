import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import { UseAutocompleteProps } from '@material-ui/lab/useAutocomplete';
import { FBAutocompleteAsyncConfig, FBInputProps } from '..';

export type FBAutocompleteProps =
 & FBInputProps
 & Pick<Partial<AutocompleteProps>, 'renderOption'>
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
   onInputChange?: (ev: React.FocusEvent<HTMLInputElement>) => any;
   refresh?: () => any;
   autoCompleteClasses?: AutocompleteProps['classes'];
   disabledOptions?: string[];
   customStyles?: {};
   groupByKey?: string;
   inputStyle?: any;
   modifiedOptions?: any[];
   debounceFilterInput?: (event: React.ChangeEvent<{}>, value: any) => void;
   inputPropStyle?: React.CSSProperties;
   inputPropStyleSize?: any;
   isDocumentLHRT?: boolean;
   /**
    * @cfg {Boolean} Option to disable deletion of rendered chips using Backspace key.
    */
   disableBackspace?: boolean;
   disableChipDelete?: boolean;
 };
