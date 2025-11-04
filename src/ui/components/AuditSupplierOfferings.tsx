import React, { ReactNode } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { Translation } from '../translations/types';
import Text from './Text';

interface ISupplierOffering {
  id: string
  revId: string
  title: string
  supplierPartNumber: string
  aslStatus: string
  aslStatusId: string
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
  revId: 'Details',
  title: 'Title',
  supplierPartNumber: 'Supplier Part Number',
  aslStatus: 'ASL Status',
  comment: 'Comments',
};

const AuditSupplierOfferings: React.FC<Props> = ({
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
    const auditValueToUse = (audit.nextValue as unknown as string) ?? '{}';
    const { revId, title, supplierPartNumber, aslStatus, comment, details }
        = typeof auditValueToUse === 'string' ? JSON.parse(auditValueToUse) as ISupplierOffering : auditValueToUse;

    const previousValueToUse = previousValue ?? '{}';
    const {
      id: prevId, title: prevTitle, supplierPartNumber: prevSupplierPartNumber,
      aslStatus: prevAslStatus, comment: prevComment, details: prevDetails,
    } = (typeof previousValueToUse === 'string' ? JSON.parse(previousValueToUse) : previousValueToUse) as ISupplierOffering;

    if (audit.type.includes('OBJECT_DELETED')) {
      const identifyingData = prevDetails ?? title ?? prevId;
      return <p>
        <Text dataCy={dataCy} translation="documentRevision.audit.supplier.entry.removed" values={{ value: identifyingData }}
        /></p>;
    }

    if (audit.type.includes('OBJECT_NEW')) {
      return (
        <>
          <p>{revId
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: details, label: fieldNameLabelMapping.revId }} />
          }</p>
          <p>{title
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: title, label: fieldNameLabelMapping.title }} />
          }</p>
          <p>{supplierPartNumber
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: supplierPartNumber, label: fieldNameLabelMapping.supplierPartNumber }} />
          }</p>
          <p>{aslStatus
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: aslStatus, label: fieldNameLabelMapping.aslStatus }} />
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
        { key: 'revId', current: details, previous: prevDetails },
        { key: 'title', current: title, previous: prevTitle },
        { key: 'supplierPartNumber', current: supplierPartNumber, previous: prevSupplierPartNumber },
        { key: 'aslStatus', current: aslStatus, previous: prevAslStatus },
        { key: 'comment', current: comment, previous: prevComment },
      ];

      return (
        <>
          <p>{revId
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: details, label: fieldNameLabelMapping.revId }} />
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

export default AuditSupplierOfferings;
