import React, { ReactNode } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { Translation } from '../translations/types';
import Text from './Text';

interface ISupplierContact {
  id: string
  isPrimary: string
  name: string
  title: string
  email: string
  phoneNumber: string
  address: string
  comments: string
}

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
  previousValue?: any
}

const fieldNameLabelMapping: {[key: string]: string} = {
  isPrimary: 'Primary Contact',
  name: 'Name',
  title: 'Title',
  email: 'Email',
  phoneNumber: 'Phone Number',
  address: 'Address',
  comments: 'Comments',
};

const AuditSupplierContacts: React.FC<Props> = ({
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
    const { isPrimary, name, title, email, phoneNumber, address, comments }
      = typeof auditValueToUse === 'string' ? JSON.parse(auditValueToUse) as ISupplierContact : auditValueToUse;

    const previousValueToUse = previousValue ?? '{}';
    const {
      id: prevId, isPrimary: prevIsPrimary, name: prevName, title: prevTitle,
      email: prevEmail, phoneNumber: prevPhoneNumber, address: prevAddress, comments: prevComments,
    } = (typeof previousValueToUse === 'string' ? JSON.parse(previousValueToUse) : previousValueToUse) as ISupplierContact;

    if (audit.type.includes('OBJECT_DELETED')) {
      const identifyingData = prevName ?? prevTitle ?? prevEmail ?? prevId;
      return <p>
        <Text dataCy={dataCy} translation="documentRevision.audit.supplier.entry.removed" values={{ value: identifyingData }}
        /></p>;
    }

    if (audit.type.includes('OBJECT_NEW')) {
      return (
        <>
          <p>{isPrimary
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: isPrimary, label: fieldNameLabelMapping.isPrimary }} />
          }</p>
          <p>{name
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: name, label: fieldNameLabelMapping.name }} />
          }</p>
          <p>{title
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: title, label: fieldNameLabelMapping.title }} />
          }</p>
          <p>{email
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: email, label: fieldNameLabelMapping.email }} />
          }</p>
          <p>{phoneNumber
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: phoneNumber, label: fieldNameLabelMapping.phoneNumber }} />
          }</p>
          <p>{address
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: address, label: fieldNameLabelMapping.address }} />
          }</p>
          <p>{comments
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: comments, label: fieldNameLabelMapping.comments }} />
          }</p>
        </>
      );
    }

    if (audit.type.includes('OBJECT_EDITED')) {
      const fieldsToCompare = [
        { key: 'isPrimary', current: Boolean(isPrimary).toString(), previous: Boolean(prevIsPrimary).toString() },
        { key: 'name', current: name, previous: prevName },
        { key: 'title', current: title, previous: prevTitle },
        { key: 'email', current: email, previous: prevEmail },
        { key: 'phoneNumber', current: phoneNumber, previous: prevPhoneNumber },
        { key: 'address', current: address, previous: prevAddress },
        { key: 'comments', current: comments, previous: prevComments },
      ];

      return (
        <>
          <p>{name
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: name, label: fieldNameLabelMapping.name }} />
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

export default AuditSupplierContacts;
