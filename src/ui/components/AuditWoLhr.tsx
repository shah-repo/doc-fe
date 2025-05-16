import React, { ReactNode, useEffect, useState } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { documentRevisionsActions } from '../../state/ducks/documentRevisions';
import { getAuditDefaultValue } from '../common/utils/audit';
import { ILHRTableItem } from '../form.builder/FBWorkOrderLHRTable/types';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditWoLhr: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue: initialAuditValue,
}) => {
  const [localAuditValue, setLocalAuditValue] = useState<string | undefined>(initialAuditValue);
  const field = audit.field.split('.').at(-1) as string;

  try {
    const auditNextValue = JSON.parse(localAuditValue as string);
    if (Array.isArray(auditNextValue)) {
      setLocalAuditValue(auditNextValue[0]);
    }
  } catch (error) {
    // handle same value
    console.log('Failed to parse localAuditValue:', error);
  }
  const fetchLhrsDetailsAction = useActionCreator(documentRevisionsActions.fetchSelectedLHR);
  const fetchSelectedLhrAsync = useAsync<ILHRTableItem>({
    onSuccess: (data) => {
      if (!Array.isArray(data) || !data.length) return;
      const { lotId, displayRevision, lhrDetails: { label } } = data[0];
      setLocalAuditValue(`${label} Rev ${displayRevision} - ${lotId}`); // Update state here
    },
  });

  useEffect(() => {
    // Only call this once (or when dependencies change)
    fetchSelectedLhrAsync.start(
      fetchLhrsDetailsAction,
      [localAuditValue],
      fetchSelectedLhrAsync,
    );
  }, []); // You can add more dependencies if needed

  const auditFieldFactory: Record<string, () => ReactNode> = {
    workOrderLhrTable: () => {
      return localAuditValue;
    },
    default: () => getAuditDefaultValue(localAuditValue),
  };

  const value = (auditFieldFactory[field] ?? auditFieldFactory.default)();

  return (
    <div data-cy={dataCy}>
      {value}
    </div>
  );
};

export default AuditWoLhr;
