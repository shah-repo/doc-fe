import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { FBAutocompleteProps } from '../FBAutocomplete/FBAutocomplete.types';

export type FBShippingCustomerProps = FBAutocompleteProps &
Pick<
Partial<AutocompleteProps>,
'renderInput' | 'loading' | 'defaultValue' | 'renderTags'
> & {
  name: string
  disabled: boolean
  updateLatestAvailableRevision: () => void
  resetOBSCustomerSelection: () => void
  latestRevisionSummary: CustomerRevisionInfo
};

export interface CustomerRevisionInfo {
  hasObsoleteRevision: boolean
  hasReleasedRevision: boolean
  revisionDetails: Partial<DocumentRevision>
  // {revId, documentId, docId, name/title, status, revision} used this for display purpose
}
