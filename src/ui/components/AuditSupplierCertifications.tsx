import React, { ReactNode } from 'react';
import { MomentFormats, useDate } from '../../common/utils/date';
import { Attachment } from '../../state/ducks/attachments/types';
import { Audit } from '../../state/ducks/audit/types';
import { Translation } from '../translations/types';
import Text from './Text';

interface ISupplierCertification {
  id: string
  certificateId: string
  type: string
  expiryDate: string
  uploadedByName: string
  attachments: Attachment[]
}

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
  previousValue?: any
}

const fieldNameLabelMapping: {[key: string]: string} = {
  certificateId: 'Name',
  type: 'Type',
  expiryDate: 'Expiry Date',
  uploadedBy: 'Uploaded By',
  attachments: 'Attachments',
};

const AuditSupplierCertifications: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
  previousValue,
}) => {
  const { getFormattedDateString } = useDate();

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
    const { certificateId, type, expiryDate, uploadedByName, attachments }
      = typeof auditValueToUse === 'string' ? JSON.parse(auditValueToUse) as ISupplierCertification : auditValueToUse;

    const previousValueToUse = previousValue ?? '{}';
    const {
      id: prevId, certificateId: prevCertificateId, type: prevType, expiryDate: prevExpiryDate,
      uploadedByName: prevUploadedByName, attachments: prevAttachments,
    } = (typeof previousValueToUse === 'string' ? JSON.parse(previousValueToUse) : previousValueToUse) as ISupplierCertification;

    if (audit.type.includes('OBJECT_DELETED')) {
      const identifyingData = prevCertificateId ?? prevId;
      return <p>
        <Text dataCy={dataCy} translation="documentRevision.audit.supplier.entry.removed" values={{ value: identifyingData }}
        /></p>;
    }

    const attachmentNameArr: string[] = attachments?.length
      ? attachments.map((attachment) => attachment.s3link?.split('/').pop() ?? '') : [];
    const previousAttachmentNameArr: string[] = prevAttachments?.length
      ? prevAttachments.map((attachment) => attachment.s3link?.split('/').pop() ?? '') : [];

    if (audit.type.includes('OBJECT_NEW')) {
      return (
        <>
          <p>{certificateId
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: certificateId, label: fieldNameLabelMapping.certificateId }} />
          }</p>
          <p>{type
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: type, label: fieldNameLabelMapping.type }} />
          }</p>
          <p>{expiryDate
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: getFormattedDateString(expiryDate, MomentFormats.MonthDateYearTwoDigit), label: fieldNameLabelMapping.expiryDate }} />
          }</p>
          <p>{uploadedByName
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: uploadedByName, label: fieldNameLabelMapping.uploadedBy }} />
          }</p>
          <p>{attachmentNameArr.length > 0
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: attachmentNameArr.join(', '), label: fieldNameLabelMapping.attachments }} />
          }</p>
        </>
      );
    }

    if (audit.type.includes('OBJECT_EDITED')) {
      let expiryDateToUse = expiryDate;
      if (expiryDateToUse) {
        expiryDateToUse = getFormattedDateString(expiryDateToUse, MomentFormats.MonthDateYearTwoDigit);
      }

      let prevExpiryDateToUse = prevExpiryDate;
      if (prevExpiryDateToUse) {
        prevExpiryDateToUse = getFormattedDateString(prevExpiryDateToUse, MomentFormats.MonthDateYearTwoDigit);
      }

      const fieldsToCompare = [
        { key: 'certificateId', current: certificateId, previous: prevCertificateId },
        { key: 'type', current: type, previous: prevType },
        { key: 'expiryDate', current: expiryDateToUse, previous: prevExpiryDateToUse },
        { key: 'uploadedBy', current: uploadedByName, previous: prevUploadedByName },
        {
          key: 'attachments',
          current: attachmentNameArr.length ? attachmentNameArr.join(', ') : undefined,
          previous: previousAttachmentNameArr.length ? previousAttachmentNameArr.join(', ') : undefined,
        },
      ];

      return (
        <>
          <p>{certificateId
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.changes.added"
              values={{ value: certificateId, label: fieldNameLabelMapping.certificateId }} />
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

export default AuditSupplierCertifications;
