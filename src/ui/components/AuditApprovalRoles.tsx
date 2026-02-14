import { last } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Audit } from '../../state/ducks/audit/types';
import { userManagementSelectors } from '../../state/ducks/userManagement';
import { getAuditDefaultValue } from '../common/utils/audit';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditApprovalRoles: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const field = last(audit.field.split('.'));
  const groups = useSelector(userManagementSelectors.getOfficialGroups).map((group) => ({
    id: group.value,
    name: group.label,
  }));

  const getGroupName = (value: string): string => {
    const group = groups.find(item => item.id === value);
    return group ? group.name : value;
  };

  let value = getAuditDefaultValue(auditValue);
  if (audit.type === 'ARRAY_DELETED') {
    console.log('delete value', auditValue);
    try {
      const data = JSON.parse(auditValue as string);
      if (data) {
        if (field === 'groups') {
          value = getGroupName(data.id);
        } else {
          value = data.name || 'N/A';
        }
      }
    } catch (err) {
      value = getAuditDefaultValue(auditValue);
    }
  } else if (audit.field.includes('groups') && audit.field.endsWith('id')) {
    value = getGroupName(auditValue as string);
  }

  return (
    <div data-cy={dataCy}>
      {value}
    </div>
  );
};

export default AuditApprovalRoles;
