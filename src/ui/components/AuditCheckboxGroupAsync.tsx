import React, { ReactNode, useMemo } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';

interface AuditCheckboxGroupAsyncProps {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

export const SUPPLIER_ASSESSMENT_FIELDS = ['supplier-type', 'supplier-capabilities', 'supplier-services'];

const AuditCheckboxGroupAsync: React.FC<AuditCheckboxGroupAsyncProps> = ({ audit, dataCy, auditValue }) => {
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

  const auditFields = new Set(SUPPLIER_ASSESSMENT_FIELDS);
  const value = auditFields.has(field) ? parseAuditValue : getAuditDefaultValue(auditValue);

  return <div data-cy={dataCy}>{value}</div>;
};

export default AuditCheckboxGroupAsync;
