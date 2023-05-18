import { each, orderBy } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getTableCriteria } from '../../../common/utils/selectors';
import { GroupTag } from '../../../state/ducks/auth/types';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { HOME_URL } from '../../constants/urls';
import useGetHasTag from '../../hooks/useGetHasTag';
import gridConfiguration from './column.definition';
import { DocumentTypeManagementPresenter } from './presenter';

export const DocumentTypeManagementContainer: React.FunctionComponent = () => {
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeList);
  each(documentTypes, (o) => {
    if (o.hiddenForCreationForUsersWithoutTags && o.hiddenForCreationForUsersWithoutTags.length) {
      o.hiddenForCreationForUsersWithoutTagsFormatted = o.hiddenForCreationForUsersWithoutTags.sort().join(', ') || '';
    }
  });
  const canManageDocumentType = useGetHasTag(GroupTag.DOCUMENT_TYPE_MANAGEMENT);
  const tableName = 'documentTypeManage';
  const tableCriteria = useSelector(getTableCriteria(tableName));

  if (!canManageDocumentType) {
    return <Redirect to={HOME_URL} />;
  }

  const gridData = orderBy(documentTypes, ['active'], ['desc']);
  const gridConfig = gridConfiguration;

  return (
    <DocumentTypeManagementPresenter
      gridConfiguration={gridConfig}
      gridData={gridData}
      tableName={tableName}
      tableCriteria={tableCriteria}
    />
  );
};
