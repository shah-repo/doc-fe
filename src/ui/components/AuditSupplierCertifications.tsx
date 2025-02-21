import React, { ReactNode } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';
import { Translation } from '../translations/types';
import Text from './Text';

interface ISupplierCertification {
  certificateId: string
  type: string
  expiryDate: string
  uploadedByName: string
  attachments: string[]
}

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: ISupplierCertification
  previousValue?: any
}

const AuditSupplierCertifications: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
  previousValue,
}) => {
  const { certificateId, type, expiryDate, uploadedByName, attachments } = auditValue ?? {};
  const {
    certificateId: prevCertificateId, type: prevType, expiryDate: prevExpiryDate,
    uploadedByName: prevUploadedByName, attachments: prevAttachments,
  } = (previousValue ?? {}) as ISupplierCertification;

  const addedOrUpdatedField = (fieldName: string, newValue: string | undefined, prevValue: string | undefined): ReactNode => {
    if (newValue && !prevValue) {
      const fieldTranslation: Translation = `documentRevision.audit.supplier.${fieldName}` as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ value: newValue }} /></p>
      );
    } else if (newValue && prevValue) {
      const fieldTranslation: Translation = `documentRevision.audit.supplier.${fieldName}.updated` as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ value: newValue, prevValue }} /></p>
      );
    } else if (!newValue && prevValue) {
      const fieldTranslation: Translation = `documentRevision.audit.supplier.${fieldName}.removed` as unknown as Translation;
      return (
        <p><Text dataCy={dataCy} translation={fieldTranslation} values={{ prevValue }} /></p>
      );
    } else {
      return <></>;
    }
  };

  const auditFieldFactory = (): ReactNode => {
    const attachmentNameArr: string[] = attachments?.length
      ? attachments.map((attachmentName) => attachmentName.split('/').pop() ?? '') : [];
    const previousAttachmentNameArr: string[] = prevAttachments?.length
      ? prevAttachments.map((attachmentName) => attachmentName.split('/').pop() ?? '') : [];

    if (audit.type.includes('OBJECT_NEW')) {
      return (
        <>
          <p>{certificateId
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.certificate" values={{ value: certificateId }} />
          }</p>
          <p>{type
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.type" values={{ value: type }} />
          }</p>
          <p>{expiryDate
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.expiryDate" values={{ value: expiryDate }} />
          }</p>
          <p>{uploadedByName
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.uploadedBy" values={{ value: uploadedByName }} />
          }</p>
          <p>{attachmentNameArr.length > 0
            && <Text dataCy={dataCy} translation="documentRevision.audit.supplier.attachments" values={{ value: attachmentNameArr.join(', ') }} />
          }</p>
        </>
      );
    }

    if (audit.type.includes('OBJECT_EDITED')) {
      return (
        <>
          <p>{addedOrUpdatedField('certificateId', certificateId, prevCertificateId)}</p>
          <p>{addedOrUpdatedField('type', type, prevType)}</p>
          <p>{addedOrUpdatedField('expiryDate', expiryDate, prevExpiryDate)}</p>
          <p>{addedOrUpdatedField('uploadedBy', uploadedByName, prevUploadedByName)}</p>
          <p>{addedOrUpdatedField('attachments', attachmentNameArr.length ? attachmentNameArr.join(', ') : undefined,
            previousAttachmentNameArr.length ? previousAttachmentNameArr.join(', ') : undefined)}</p>
        </>
      );
    }

    if (audit.type === 'OBJECT_DELETED') {
      return getAuditDefaultValue(auditValue);
    }
  };

  return (
    <div data-cy={dataCy}>
      {auditFieldFactory()}
    </div>
  );
};

export default AuditSupplierCertifications;
