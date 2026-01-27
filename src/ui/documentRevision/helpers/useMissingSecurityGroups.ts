import { difference, union } from 'lodash';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { DocumentType } from '../../../state/ducks/documentRevisions/documentType/types';
import { userManagementSelectors } from '../../../state/ducks/userManagement';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import useDocTypeGroups from '../../hooks/useDocTypeGroups';
import { DocumentRevisionFormValues } from '../forms/types';

interface MissingSecurityGroups {
  missingGroups: OptionType[]
  fixedSecurityGroups: OptionType[]
  documentType: DocumentType | null
}

type MissingSecurityGroupsFunction = (values: DocumentRevisionFormValues) => MissingSecurityGroups;

const useMissingSecurityGroups = (): MissingSecurityGroupsFunction => {
  const getDocTypeGroups = useDocTypeGroups();
  const groups = useSelector(userManagementSelectors.getGroupsOptions);
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeList);

  return useCallback((
    values: DocumentRevisionFormValues,
  ) => {
    const documentType = documentTypes.find(type => type.id === values.document?.documentType?.id);

    if (!documentType) {
      return {
        missingGroups: [],
        fixedSecurityGroups: values.securityGroups,
        documentType: null,
      };
    }

    const systemSecurityGroupsIds = getDocTypeGroups(documentType).map((group) => group.value);
    const documentSecurityGroupIds = values.securityGroups?.map(group => group.value) ?? [];
    const missingSecurityGroupIds = difference(systemSecurityGroupsIds, documentSecurityGroupIds);
    const allSecurityGroupsIds = union(systemSecurityGroupsIds, documentSecurityGroupIds);

    return {
      missingGroups: groups.filter(group => missingSecurityGroupIds.includes(group.value)),
      fixedSecurityGroups: groups.filter(group => allSecurityGroupsIds.includes(group.value)),
      documentType,
    };
  }, [documentTypes, getDocTypeGroups, groups]);
};

export default useMissingSecurityGroups;
