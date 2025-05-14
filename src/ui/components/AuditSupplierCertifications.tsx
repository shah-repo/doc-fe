import React, { ReactNode } from 'react';
import { getFormattedDateString, MomentFormats } from '../../common/utils/date';
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

const AuditSupplierCertifications: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
  previousValue,
}) => {
  const addedOrUpdatedField = (fieldName: string, newValue: string | undefined, prevValue: string | undefined): ReactNode => {
    if (newValue === prevValue) {
      return <></>;
    }

    if (newValue && !prevValue) {
      const fieldTranslation: Translation = `documentRevision.audit.supplier.certifications.${fieldName}` as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ value: newValue }} /></p>
      );
    }

    if (newValue && prevValue) {
      const fieldTranslation: Translation = `documentRevision.audit.supplier.certifications.${fieldName}.updated` as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ value: newValue, prevValue }} /></p>
      );
    }

    if (!newValue && prevValue) {
      const fieldTranslation: Translation = `documentRevision.audit.supplier.certifications.${fieldName}.removed` as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ prevValue }} /></p>
      );
    }

    return <></>;
  };

  const auditFieldFactory = (): ReactNode => {
    const { certificateId, type, expiryDate, uploadedByName, attachments }
        = JSON.parse(auditValue ?? '{}') as ISupplierCertification;
    const {
      id: prevId, certificateId: prevCertificateId, type: prevType, expiryDate: prevExpiryDate,
      uploadedByName: prevUploadedByName, attachments: prevAttachments,
    } = JSON.parse(previousValue ?? '{}') as ISupplierCertification;

    if (audit.type.includes('OBJECT_DELETED')) {
      const identifyingData = prevCertificateId ?? prevId;
      return <p>
        <Text dataCy={dataCy} translation="documentRevision.audit.supplier.certifications.entry.removed" values={{ value: identifyingData }}
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
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.certifications.certificate" values={{ value: certificateId }} />
          }</p>
          <p>{type
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.certifications.type" values={{ value: type }} />
          }</p>
          <p>{expiryDate
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.certifications.expiryDate"
              values={{ value: getFormattedDateString(expiryDate, MomentFormats.MonthDateYearTwoDigit) }} />
          }</p>
          <p>{uploadedByName
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.certifications.uploadedBy" values={{ value: uploadedByName }} />
          }</p>
          <p>{attachmentNameArr.length > 0
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.certifications.attachments" values={{ value: attachmentNameArr.join(', ') }} />
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
      return (
        <>
          <p>{certificateId
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.certifications.certificate" values={{ value: certificateId }} />
          }</p>
          <p>{addedOrUpdatedField('certificateId', certificateId, prevCertificateId)}</p>
          <p>{addedOrUpdatedField('type', type, prevType)}</p>
          <p>{addedOrUpdatedField('expiryDate', expiryDateToUse, prevExpiryDateToUse)}</p>
          <p>{addedOrUpdatedField('uploadedBy', uploadedByName, prevUploadedByName)}</p>
          <p>{addedOrUpdatedField('attachments', attachmentNameArr.length ? attachmentNameArr.join(', ') : undefined,
            previousAttachmentNameArr.length ? previousAttachmentNameArr.join(', ') : undefined)}</p>
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
