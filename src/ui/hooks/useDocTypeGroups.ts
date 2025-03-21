import { useSelector } from 'react-redux';
import { DocumentType } from '../../state/ducks/documentRevisions/documentType/types';
import { userManagementSelectors } from '../../state/ducks/userManagement';
import { OptionType } from '../components/forms/fields/Autocomplete/types';
import { filterSecurityGroupsForQms } from '../documentType/list/helpers';

type DocTypeGroupsHelper = (docType: DocumentType) => OptionType[];

const useDocTypeGroups = (): DocTypeGroupsHelper => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  return (docType: DocumentType) =>
    filterSecurityGroupsForQms(groupOptions, docType.isQms);
};

export default useDocTypeGroups;
