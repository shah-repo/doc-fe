import { Box } from '@material-ui/core';
import { get, has } from 'lodash';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { getFormattedDateString, MomentFormats } from '../../common/utils/date';
import { convertHtmlEntities } from '../../common/utils/helpers';
import { Attachment } from '../../state/ducks/attachments/types';
import { Audit, POLineItem } from '../../state/ducks/audit/types';
import { Group } from '../../state/ducks/auth/types';
import { ChangeRequest } from '../../state/ducks/changeRequest/types';
import { Approval, ApprovalStatus, Owner } from '../../state/ducks/common/types';
import { Employee } from '../../state/ducks/company/types';
import { STATUS_TYPES_LABEL } from '../../state/ducks/dashboard.new/my.feeds/types';
import { DocumentType } from '../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, Reference, RevisionChangeType } from '../../state/ducks/documentRevisions/types';
import { RELATED_PARTS_STATUS } from '../../state/ducks/relatedParts/types';
import { getAuditDefaultValue } from '../common/utils/audit';
import Text from '../components/Text';
import { FBPurchaseOrderItemType } from '../form.builder';
import { Translation } from '../translations/types';
import AuditAttachment from './AuditAttachment';
import AuditAutocomplete from './AuditAutocomplete';
import AuditDownloadS3link from './AuditDownloadS3link';
import AuditProcedure from './AuditProcedure';
import DateTime from './DateTime';
import DialogOpener from './textDiff/DialogOpener';

interface OwnProps {
  audit: Audit
  dataCy?: string
}

type Props = OwnProps;

const AuditFactory: React.FunctionComponent<Props> = ({
  audit, dataCy,
}) => {
  let returnValue;
  const intl = useIntl();
  const isFBField = has(audit, 'fbSchemaItem');
  const { nextValue, previousValue } = audit;
  const { type = '' } = audit.fbSchemaItem || {};
  let auditValue: any = nextValue;

  if (!auditValue || auditValue === 'undefined') {
    auditValue = previousValue;
  }

  if (auditValue === 'includeNone') {
    auditValue = intl.formatMessage({ id: 'form.builder.none' });
  }

  if (`${auditValue}`.includes('includeContext')) {
    auditValue = intl.formatMessage({ id: 'form.builder.other' });
  }

  if (!auditValue || auditValue === 'undefined' || auditValue === '{}') {
    return <Fragment>N/A</Fragment>;
  }

  const poDefinePartNumberText = (data: POLineItem) => {
    const { type, partNumberDocId, supplierPartNumber, serviceId, description } = data;
    let partNumberText = '';
    if (type === FBPurchaseOrderItemType.PRODUCT) {
      partNumberText = partNumberDocId ?? supplierPartNumber;
    } else if (type === FBPurchaseOrderItemType.SERVICE) {
      partNumberText = serviceId !== ''
        ? serviceId
        : intl.formatMessage({ id: 'documentRevision.audit.formInput.lineItems.message.description.smallText' }, { description });
    }

    return partNumberText;
  };

  if (isFBField) {
    const fbValue = {
      texteditor () {
        return (
          <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: auditValue as string }} />
        );
      },
      datepicker () {
        return (
          <Box>
            {getFormattedDateString(auditValue as string, MomentFormats.MonthDateYear)}
          </Box>
        );
      },
      autocomplete () {
        return <AuditAutocomplete audit={audit} />;
      },
      fileupload () { return (<AuditAttachment audit={audit} />); },
      checkboxgroup () {
        const arrayValue: string[] = [];
        try {
          arrayValue.push(JSON.parse(auditValue));
        } catch {
          arrayValue.push(auditValue);
        }
        return (<div>{arrayValue?.join(', ')}</div>);
      },
      procedure () {
        if (audit.field === 'fileUploadCandidate') {
          return <div data-cy={dataCy}>{get(auditValue, 'name')}</div>;
        }
        return <AuditProcedure {...{ audit, dataCy, auditValue }} />;
      },
      mpiprocedure () {
        return <AuditProcedure {...{ audit, dataCy, auditValue }} />;
      },
      quantity () {
        return auditValue === 'null' ? '' : auditValue;
      },
      default () { return (<div data-cy={dataCy}>{getAuditDefaultValue(auditValue)}</div>); },
    };
    returnValue = (fbValue[type] || fbValue.default)();
  } else {
    switch (audit.field) {
      case 'attachments':
      case 'justifications.attachments':
      case 'assessments.process.attachments':
      case 'assessments.design.attachments':
      case 'assessments.regulatory.attachments': {
        const { name, type } = audit.nextValue as Attachment;
        returnValue = (<div data-cy={dataCy}>{`${name}.${type}`}</div>);
        break;
      }
      case 'approvals':
        returnValue = (audit.nextValue as Approval).approver.user.name;
        break;
      case 'approvals.approver':
        returnValue = (<div data-cy={dataCy}>{(audit.nextValue as Employee).user?.name} - {(audit.nextValue as Employee).user?.email}</div>);
        break;
      case 'tasks.assigned':
      case 'owner':
      case 'operators':
      case 'securityEmployees':
        returnValue = (<div data-cy={dataCy}>{(audit.nextValue as Owner).user.name}</div>);
        break;
      case 'documentRevisions':
        returnValue = (audit.nextValue as DocumentRevision).name;
        break;
      case 'tasks.dueDate':
      case 'effectiveDate':
        returnValue = getFormattedDateString(audit.nextValue as string, MomentFormats.MonthDateYear);
        break;
      case 'justifications.description':
      case 'tasks.description':
      case 'description':
        returnValue = <DialogOpener
          id={audit.id}
          text={convertHtmlEntities(audit.nextValue as string)}
          dataCy={dataCy}
        />;
        break;
      case 'referenceTo':
        returnValue = (<div data-cy={dataCy}>{(audit.nextValue as Reference).docId}</div>);
        break;
      case 'changeRequest':
        returnValue = (audit.nextValue as ChangeRequest).crId;
        break;
      case 'documentType':
        returnValue = (audit.nextValue as DocumentType).documentTypeName;
        break;
      case 'approvals.status':
        if (audit?.approvalStatus === ApprovalStatus.Abandoned) {
          returnValue = (audit.nextValue as Employee).user?.name;
          break;
        }
        // falls through intentionally
      case 'status':
        if (audit?.approvalStatus === ApprovalStatus.Abandoned) {
          returnValue = (audit.nextValue as Employee).user?.name;
          break;
        }
        returnValue = (
          <Text
            dataCy={dataCy}
            translation="changeRequest.audit.status.updated.by"
            values={{
              status: <Text translation={audit.nextValue as Translation} />,
              name: audit.owner?.user.name,
            }}
          />
        );
        break;
      case 'poStatus':
        returnValue = (
          <>
            <Text
              dataCy={dataCy}
              translation="documentRevision.audit.poStatus.updated.by"
              values={{
                status: <Text translation={audit.nextValue as Translation} />,
                name: audit.ownerName,
                timestamp: (
                  <DateTime
                    data-cy={`${dataCy}-date-time`}
                    value={audit.timestamp}
                    format={MomentFormats.BriefDateTime}
                  />
                ),
              }}
            />
            {audit?.hasPoReceivedQtyFlag && (
              <Text
                dataCy={`${dataCy}-quantity-discrepancies`}
                translation="documentRevision.audit.poStatus.quantity.discrepancies"
              />
            )}
          </>
        );
        break;
      case 'EMAIL_SENT':
        returnValue = (
          <>
            <Text
              dataCy={dataCy}
              translation="documentRevision.audit.send.to.email"
              values={{
                name: audit.ownerName,
                docId: audit?.docId,
              }}
            />
          </>
        );
        break;
      case 'VIEW_PDF':
        returnValue = (
          <>
            <Text
              dataCy={dataCy}
              translation="documentRevision.audit.view.pdf"
              values={{
                name: audit.ownerName,
              }}
            />
          </>
        );
        break;
      case 'securityGroups':
        returnValue = (<div data-cy={dataCy}>{(audit.nextValue as Group).name}</div>);
        break;
      case 'state':
        // Added for closing AR in the future because there is no owner
        if (audit.nextValue === 'CLOSED' && !audit.owner) {
          returnValue = (<div data-cy={dataCy}>
            {(audit.nextValue as string)}{'-'}
            <Text translation="common.server.automation" />
          </div>);
          break;
        }
        returnValue = (<div data-cy={dataCy}>{(STATUS_TYPES_LABEL[audit.nextValue as string])}</div>);
        break;
      case 's3link':
        returnValue = <AuditDownloadS3link s3link={audit.nextValue as string} />;
        break;
      case 'childrenParts':
      case 'formDocument': {
        const { name, displayRevision, document } = audit.nextValue as DocumentRevision;
        returnValue = (<div data-cy={dataCy}>{`${document.docId} - revision ${displayRevision} - ${name}`}</div>);
        break;
      }
      case 'relatedPartsStatus':
        if (audit.nextValue === RELATED_PARTS_STATUS.PARENT_TOGETHER) {
          returnValue = (
            <Text
              dataCy={`${dataCy}-basepart-status`}
              translation="relatedParts.parentPart.answer.yes.together"
            />
          );
        } else if (audit.nextValue === RELATED_PARTS_STATUS.PARENT_SEPARATE) {
          returnValue = (
            <Text
              dataCy={`${dataCy}-basepart-status`}
              translation="relatedParts.parentPart.answer.yes.separate"
            />
          );
        }
        break;
      case 'subParts':
        returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue ?? audit.previousValue)}</div>);
        break;
      case 'subPartObsolete':
        try {
          const { docId, value } = JSON.parse(auditValue) as {docId: string, value: string};
          if (value) {
            const text = value === RevisionChangeType.Obsolete
              ? intl.formatMessage({ id: 'documentRevision.audit.relatedParts.subPart.obsolete.checked' }, { docId })
              : intl.formatMessage({ id: 'documentRevision.audit.relatedParts.subPart.obsolete.unchecked' }, { docId });
            returnValue = (<div data-cy={dataCy}>{text}</div>);
          } else {
            returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
          }
        } catch (err) {
          // Not valid JSON, so older data and is string
          returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
        }
        break;
      case 'formInput.lineItems':
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const value: POLineItem = JSON.parse(auditValue);
          const { order, unitPrice } = value;
          const partNumberText = poDefinePartNumberText(value);

          const text
            = intl.formatMessage(
              { id: 'documentRevision.audit.formInput.lineItems.MESSAGE' },
              { partNumber: partNumberText, order, unitPrice });

          returnValue = (
            <div data-cy={dataCy} dangerouslySetInnerHTML={{ __html: text }} />
          );
        } catch (err) {
          // do nothing
        }
        break;
      case 'formInput.po-items-built-in.items.order':
      case 'formInput.po-items-built-in.items.totalAmount':
      case 'formInput.po-items-built-in.items.supplierPartNumber':
      case 'formInput.po-items-built-in.items.glCode':
      case 'formInput.po-items-built-in.items.unitPrice':
      case 'formInput.po-items-built-in.items.units':
      case 'formInput.po-items-built-in.items.received':
      case 'formInput.po-items-built-in.items.serviceId':
      case 'formInput.po-items-built-in.items.formattedDate':
      case 'formInput.po-items-built-in.items.description':
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const entry: POLineItem & { value: string } = JSON.parse(auditValue);
          const partNumberText = poDefinePartNumberText(entry);
          if (entry.value) {
            returnValue = (<div data-cy={dataCy}>{`${partNumberText} - updated to ${entry.value}`}</div>);
          } else {
            returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
          }
        } catch (err) {
          // Not valid JSON, so older data and is string
          returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
        }
        break;
      default:
        returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
    }
  }

  return (
    <Fragment>
      {returnValue}
    </Fragment>
  );
};

export default AuditFactory;
