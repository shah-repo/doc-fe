import React, { ReactNode } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { Translation } from '../translations/types';
import Text from './Text';

interface ISupplierReference {
  id: string
  referenceRevId: string
  comment: string
  details: string
}

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
  previousValue?: any
}

const fieldNameLabelMapping: {[key: string]: string} = {
  referenceRevId: 'Details',
  comment: 'Comments',
};

const AuditSupplierReferences: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
  previousValue,
}) => {
  const addedOrUpdatedField = (label: string, newValue: string | undefined, prevValue: string | undefined): ReactNode => {
    if (newValue === prevValue) {
      return <></>;
    }

    if (newValue && !prevValue) {
      const fieldTranslation: Translation = 'documentRevision.audit.supplier.changes.added' as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ value: newValue, label }} /></p>
      );
    }

    if (newValue && prevValue) {
      const fieldTranslation: Translation = 'documentRevision.audit.supplier.changes.updated' as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ value: newValue, prevValue, label }} /></p>
      );
    }

    if (!newValue && prevValue) {
      const fieldTranslation: Translation = 'documentRevision.audit.supplier.changes.removed' as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ prevValue, label }} /></p>
      );
    }

    return <></>;
  };

  const auditFieldFactory = (): ReactNode => {
    const auditValueToUse = auditValue ?? '{}';
    const { referenceRevId, comment, details }
        = typeof auditValueToUse === 'string' ? JSON.parse(auditValueToUse) as ISupplierReference : auditValueToUse;

    const previousValueToUse = previousValue ?? '{}';
    const { id: prevId, comment: prevComment, details: prevDetails }
      = (typeof previousValueToUse === 'string' ? JSON.parse(previousValueToUse) : previousValueToUse) as ISupplierReference;

    if (audit.type.includes('OBJECT_DELETED')) {
      const identifyingData = prevDetails ?? prevId;
      return <p>
        <Text dataCy={dataCy} translation="documentRevision.audit.supplier.entry.removed" values={{ value: identifyingData }}
        /></p>;
    }

    if (audit.type.includes('OBJECT_NEW')) {
      return (
        <>
          <p>{referenceRevId
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: details, label: fieldNameLabelMapping.referenceRevId }} />
          }</p>
          <p>{comment
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: comment, label: fieldNameLabelMapping.comment }} />
          }</p>
        </>
      );
    }

    if (audit.type.includes('OBJECT_EDITED')) {
      const fieldsToCompare = [
        { key: 'referenceRevId', current: details, previous: prevDetails },
        { key: 'comment', current: comment, previous: prevComment },
      ];

      return (
        <>
          <p>{referenceRevId
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: details, label: fieldNameLabelMapping.referenceRevId }} />
          }</p>
          {fieldsToCompare.map(({ key, current, previous }) => (
            <p key={key}>
              {addedOrUpdatedField(fieldNameLabelMapping[key], current, previous)}
            </p>
          ))}
        </>
      );
    }
  };

  return (
    <div data-cy={dataCy}>
      {auditFieldFactory()}
    </div>
  );
};

export default AuditSupplierReferences;
