import React, { ReactNode } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: any
  previousValue?: any
}

const AuditSupplierContacts: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
  previousValue,
}) => {
  const auditFieldFactory = (): ReactNode => {
    return <div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue ?? audit.previousValue)}</div>;
  };

  return (
    <div data-cy={dataCy}>
      {auditFieldFactory()}
    </div>
  );
};

export default AuditSupplierContacts;
