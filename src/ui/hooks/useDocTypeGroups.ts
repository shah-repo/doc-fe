import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { userManagementSelectors } from '../../state/ducks/userManagement';
import { OptionType } from '../components/forms/fields/Autocomplete/types';
import { filterSecurityGroupsForQms } from '../documentType/list/helpers';

interface DocTypeWithIsQms {
  isQms?: boolean
}
type DocTypeGroupsHelper = (docType?: DocTypeWithIsQms) => OptionType[];

const useDocTypeGroups = (): DocTypeGroupsHelper => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  return useCallback((docType?: DocTypeWithIsQms) => filterSecurityGroupsForQms(groupOptions, docType?.isQms), [groupOptions]);
};

export default useDocTypeGroups;
