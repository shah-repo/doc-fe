import React, { ReactNode, useMemo } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditCheckboxGroupAsync: React.FC<Props> = ({ audit, dataCy, auditValue }) => {
  const field = audit.field.split('.').at(-1) ?? '';

  const parseAuditValue = useMemo((): string | ReactNode => {
    if (audit.type === 'ARRAY_DELETED') {
      try {
        const data = JSON.parse(auditValue || '');
        return data?.text ?? getAuditDefaultValue(auditValue);
      } catch {
        return getAuditDefaultValue(auditValue);
      }
    }
    return getAuditDefaultValue(auditValue);
  }, [audit.type, auditValue]);

  const auditFields = new Set(['supplier-type', 'supplier-capabilities', 'supplier-services']);
  const value = auditFields.has(field) ? parseAuditValue : getAuditDefaultValue(auditValue);

  return <div data-cy={dataCy}>{value}</div>;
};

export default AuditCheckboxGroupAsync;
