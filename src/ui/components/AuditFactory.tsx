import { Box } from '@material-ui/core';
import { get, has } from 'lodash';
import React, { Fragment, ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { translate } from '../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../common/utils/date';
import { convertHtmlEntities } from '../../common/utils/helpers';
import { Attachment } from '../../state/ducks/attachments/types';
import { Audit, POLineItem } from '../../state/ducks/audit/types';
import { Group } from '../../state/ducks/auth/types';
import { ChangeRequest } from '../../state/ducks/changeRequest/types';
import { Approval, ApprovalStatus, Owner } from '../../state/ducks/common/types';
import { Employee } from '../../state/ducks/company/types';
import { STATUS_TYPES_LABEL } from '../../state/ducks/dashboard.new/my.feeds/types';
import { documentTypeSelectors } from '../../state/ducks/documentRevisions/documentType';
import { DocumentType } from '../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, LotStatus, Reference, RevisionChangeType } from '../../state/ducks/documentRevisions/types';
import { BOMTreeData, RELATED_PARTS_STATUS } from '../../state/ducks/relatedParts/types';
import { getMDOptionLabels } from '../change.request/FBMaterialDisposition/components/FBMaterialDispositionTable/constants';
import { getAuditDefaultValue, getWOAuditDefaultValue } from '../common/utils/audit';
import Text from '../components/Text';
import { RELATED_TYPE_VALUES_ENUM, getDynamicTextValue } from '../documentRevision/forms/presenters/related.parts/helper';
import { IRevIdMapper, checkIsDocumentWO } from '../documentRevision/helpers/checkDocumentGroup';
import { FBPurchaseOrderItemType } from '../form.builder';
import { Translation } from '../translations/types';
import AuditAttachment from './AuditAttachment';
import AuditAutocomplete from './AuditAutocomplete';
import AuditCycleCount from './AuditCycleCount';
import AuditDownloadS3link from './AuditDownloadS3link';
import AuditLotTransfer from './AuditLotTransfer';
import AuditPartVendors from './AuditPartVendors';
import AuditProcedure from './AuditProcedure';
import DateTime from './DateTime';
import { getLotStatusLabel } from './common/header/HeaderLotStatus';
import DialogOpener from './textDiff/DialogOpener';

interface OwnProps {
  audit: Audit
  dataCy?: string
  revIdRelatedTypeObj: {[key: string]: IRevIdMapper}
}

type Props = OwnProps;

const AuditFactory: React.FunctionComponent<Props> = ({
  audit, dataCy, revIdRelatedTypeObj,
}) => {
  let returnValue;
  const intl = useIntl();
  const isFBField = has(audit, 'fbSchemaItem');
  const { nextValue, previousValue } = audit;
  const { type = '' } = audit.fbSchemaItem || {};
  let auditValue: any = nextValue;

  const relatedType = revIdRelatedTypeObj?.[audit.documentRevisionId]?.relatedType;

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

  const generateAuditLogForDisplayStatus = (auditValue: any, dataCy: string | undefined): JSX.Element => {
    try {
      const { displayRevision, changeRequestId, status, isRestrictedEdit } = JSON.parse(auditValue) as IDisplayStatusAuditEntry;
      if (isRestrictedEdit) {
        const displayText = changeRequestId
          ? intl.formatMessage({ id: 'documentRevision.audit.restrictedEdit.display.released.text' },
            { status, name: audit.owner?.user.name, changeRequestId, displayRevision })
          : intl.formatMessage({ id: 'documentRevision.audit.restrictedEdit.display.draft.text' },
            { status, displayRevision });
        return (<div data-cy={dataCy}>{displayText}</div>);
      } else {
        return (
          <Text
            dataCy={dataCy}
            translation="changeRequest.audit.status.updated.by.withChangeRequest"
            values={{
              status,
              name: audit.owner?.user.name,
              changeRequestId,
            }}
          />
        );
      }
    } catch (err) {
      // Not valid JSON, so older data and is string
      return (
        <Text
          dataCy={dataCy}
          translation="changeRequest.audit.status.updated.by"
          values={{
            status: audit.nextValue,
            name: audit.owner?.user.name,
          }}
        />
      );
    }
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
      supplier () {
        if (audit.fbSchemaItem) {
          audit.fbSchemaItem.optionId = '5';
        }
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
      lotTransfers () {
        return <AuditLotTransfer {...{ audit, dataCy, auditValue }} />;
      },
      cycleCount () {
        return <AuditCycleCount {...{ audit, dataCy, auditValue }} />;
      },
      partVendors () {
        return <AuditPartVendors {...{ audit, dataCy, auditValue }} />;
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
      case 'documentRevisions': {
        const { displayRevision, document, name } = audit.nextValue as DocumentRevision;
        const displayName = name ? ` - ${name}` : '';
        returnValue = (<div data-cy={dataCy}>{document?.docId} - Rev {displayRevision}{displayName}</div>);
        break;
      }
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
          returnValue = (<div data-cy={dataCy}>{(audit.nextValue as Employee).user?.name}</div>);
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
      case 'displayStatus':
        if (audit?.approvalStatus === ApprovalStatus.Abandoned) {
          returnValue = (audit.nextValue as Employee).user?.name;
          break;
        }
        return generateAuditLogForDisplayStatus(auditValue, dataCy);
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
      case 'lotStatus':
        try {
          const obj = JSON.parse(audit.nextValue as string);
          returnValue = <Text
            dataCy={dataCy}
            translation={obj.comments ? 'changeRequest.audit.lotStatus.update.with.comments' : 'changeRequest.audit.lotStatus.update.with.out.comments'}
            values={{ ...obj, ...{ ownerName: audit.ownerName } } }
          />;
        } catch (e) {
          returnValue = (<div data-cy={dataCy}>{getLotStatusLabel(audit.nextValue as LotStatus)}</div>);
        }
        break;
      case 'EMAIL_SENT':
        returnValue = (
          <>
            <Text
              dataCy={dataCy}
              translation="documentRevision.audit.send.to.email"
              values={{
                name: audit.ownerName,
                docId: audit?.docId ?? audit?.crId,
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
      case 'bomParts':
        if (audit.type.includes('ARRAY_EDITED')) {
          const { docId, quantity, unit, refDesignator, comment } = JSON.parse(auditValue) as BOMTreeData;

          returnValue = (
            <>
              { docId && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.docId.updated"
                values={{
                  docId,
                }}
              />
              }
              { (quantity !== undefined) && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.quantity.updated"
                values={{ quantity }}
              />
              }
              { unit && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.unit.updated"
                values={{ unit }}
              />
              }
              { refDesignator && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.refDesignator.updated"
                values={{ refDesignator }}
              />
              }
              { comment && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.comment.updated"
                values={{ comment }}
              />
              }
            </>
          );
        } else if (audit.type.includes('ARRAY_NEW')) {
          const { docId, quantity, unit, refDesignator, comment } = JSON.parse(auditValue) as BOMTreeData;

          returnValue = (
            <>
              { docId && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.docId.added"
                values={{
                  docId,
                }}
              />
              }
              { (quantity !== undefined) && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.quantity.added"
                values={{ quantity }}
              />
              }
              { unit && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.unit.added"
                values={{ unit }}
              />
              }
              { refDesignator && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.refDesignator.added"
                values={{ refDesignator }}
              />
              }
              { comment && <Text
                dataCy={dataCy}
                translation="documentRevision.audit.bomParts.comment.added"
                values={{ comment }}
              />
              }
            </>
          );
        } else {
          returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue ?? audit.previousValue)}</div>);
        }
        break;
      case 'bomAlternateParts':
        returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue ?? audit.previousValue)}</div>);
        break;
      case 'bomItemUpgraded':
        try {
          const prevValue: string = audit.previousValue as string;
          const { displayRevision: oldDisplayRevision, docId: oldDocId } = JSON.parse(prevValue);

          const nextValue: string = audit.nextValue as string;
          const { displayRevision: newDisplayRevision, docId: newDocId, arId } = JSON.parse(nextValue);

          const values = {
            oldDisplayRevision, oldDocId, newDisplayRevision, newDocId,
          };

          const text = arId
            ? intl.formatMessage({ id: 'documentRevision.audit.bomItemUpgraded.lineItem.upgraded.arId' }, { ...values, arId })
            : intl.formatMessage({ id: 'documentRevision.audit.bomItemUpgraded.lineItem.upgraded' }, { ...values });
          returnValue = (<div data-cy={`${dataCy}-bom-item-upgraded`}>{text}</div>);
        } catch (err) {
          // do nothing
        }
        break;
      case 'inventoryTask':

        try {
          const nextVal: string = audit.nextValue as string;
          const documentTypesAll = useSelector(documentTypeSelectors.getDocumentTypeList);
          const documentType = documentTypesAll.find(item => checkIsDocumentWO(item.groupOptions));
          const relatedAcronym = documentType?.documentTypeAcronym ?? '';

          const auditDocId = audit.docId ?? '';
          const docLabel = relatedAcronym && auditDocId.startsWith(relatedAcronym) ? 'documentRevision' : 'changeRequest';

          const {
            instruction,
            assignedAdded,
            assigneeDeleted,
            status,
            assignedTo,
            comment,
            attachmentLinks,
          } = JSON.parse(nextVal);

          if (audit.type.includes('ARRAY_ADDED')) {
              const { instruction, assignedTo } = JSON.parse(nextVal);

              returnValue = (
                <>
                  {instruction
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.instruction.added`,
                      { instruction },
                    )}
                  {assignedTo
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.assignee.to`,
                      { assignedTo },
                    )}
                </>
              );
          } else if (audit.type.includes('ARRAY_EDITED')) {
            const attachmentNameArr = attachmentLinks?.map((attachmentName) => attachmentName.split('/').pop()) ?? [];
            const attachmentNameList = attachmentNameArr.join(', ');

              returnValue = (
                <>
                  {instruction
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.instruction.updated`,
                      { instruction },
                    )}
                  {assignedAdded
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.assignee.added`,
                      { assignedAdded },
                    )}
                  {status === FBInvTaskState.DONE
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.completed`,
                      { assignedTo },
                    )}
                  {status === FBInvTaskState.DRAFT
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.draft`,
                      { assignedTo },
                    )}
                  {assigneeDeleted
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.assignee.deleted`,
                      { assigneeDeleted },
                    )}
                  {comment
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.comment`,
                      { comment },
                    )}
                  {( attachmentNameArr.length > 0 )
                    && getNewLineItemAuditValue(
                      dataCy,
                      `${docLabel}.audit.inventoryTask.attachments`,
                      { attachmentNameList },
                    )}
                </>
              );
          }
        } catch (error) {
          returnValue = (
            <div data-cy={dataCy}>
              {getAuditDefaultValue(audit.nextValue)}
            </div>
          );
        }

        if (!audit.type.includes('ARRAY_ADDED') && !audit.type.includes('ARRAY_EDITED')) {
          const prevVal: string = audit.previousValue as string;
          try {
            const { instruction } = JSON.parse(prevVal);
            returnValue = (
              <div data-cy={dataCy}>{getAuditDefaultValue(instruction)}</div>
            );
          } catch (error) {
            returnValue = (
              <div data-cy={dataCy}>
                {getAuditDefaultValue(audit.previousValue)}
              </div>
            );
          }
        }
        break;
      case 'materialDisposition':
        if (audit.type.includes('ARRAY_ADDED')) {
          const nextVal: string = audit.nextValue as string;
          try {
            const { partDocId, lotDocId } = JSON.parse(nextVal);
            returnValue = (
              <>
                { (partDocId && !lotDocId) && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.added', { partDocId }) }
                { (partDocId && lotDocId) && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.partLot.added', { partDocId, lotDocId }) }
              </>
            );
          } catch (error) {
            returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
          }
        } else if (audit.type.includes('ARRAY_EDITED')) {
          const nextVal: string = audit.nextValue as string;
          try {
            const { onOrderPOAction, inInspectionAction, inInventoryAction, inWipAction, asFinishedGoodsAction, usedLocation, comment, lotDocId, partDocId } = JSON.parse(nextVal);
            const mdDocRow = lotDocId || partDocId;
            returnValue = (
              <>
                { onOrderPOAction && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.onOrderPOAction.updated', { mdDocRow, onOrderPOAction: getMDOptionLabels(onOrderPOAction) }) }
                { inInspectionAction && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.inInspectionAction.updated', { mdDocRow, inInspectionAction: getMDOptionLabels(inInspectionAction) }) }
                { inInventoryAction && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.inInventoryAction.updated', { mdDocRow, inInventoryAction: getMDOptionLabels(inInventoryAction) }) }
                { inWipAction && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.inWipAction.updated', { mdDocRow, inWipAction: getMDOptionLabels(inWipAction) }) }
                { asFinishedGoodsAction && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.asFinishedGoodsAction.updated', { mdDocRow, asFinishedGoodsAction: getMDOptionLabels(asFinishedGoodsAction) }) }
                { usedLocation && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.usedLocation.updated', { mdDocRow, usedLocation: getMDOptionLabels(usedLocation) }) }
                { comment && getNewLineItemAuditValue(dataCy, 'changeRequest.audit.materialDisposition.comment.updated', { mdDocRow, comment }) }
              </>
            );
          } catch (error) {
            returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
          }
        } else {
          const prevVal: string = audit.previousValue as string;
          try {
            const { partDocId, lotDocId } = JSON.parse(prevVal);
            if (lotDocId) {
              returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(lotDocId)}</div>);
            } else {
              returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(partDocId)}</div>);
            }
          } catch (error) {
            returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.previousValue)}</div>);
          }
        }
        break;
      case 'relatedPartsStatus':
        if (audit.nextValue === RELATED_PARTS_STATUS.PARENT_TOGETHER) {
          returnValue = (
            <Text
              dataCy={`${dataCy}-basepart-status`}
              translation="relatedParts.parentPart.answer.yes.together"
              values = {{
                relatedType: getDynamicTextValue(
                  relatedType, RELATED_TYPE_VALUES_ENUM.SUB_PART, RELATED_TYPE_VALUES_ENUM.RELATED_DOCUMENTS),
              }}
            />
          );
        } else if (audit.nextValue === RELATED_PARTS_STATUS.PARENT_SEPARATE) {
          returnValue = (
            <Text
              dataCy={`${dataCy}-basepart-status`}
              translation="relatedParts.parentPart.answer.yes.separate"
              values = {{
                relatedType: getDynamicTextValue(
                  relatedType, RELATED_TYPE_VALUES_ENUM.SUB_PART, RELATED_TYPE_VALUES_ENUM.RELATED_DOCUMENTS),
              }}
            />
          );
        } else if (audit.nextValue === RELATED_PARTS_STATUS.PARENT_NO) {
          returnValue = (
            <Text
              dataCy={`${dataCy}-basepart-status`}
              translation="relatedParts.parentPart.answer.no"
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
      case 'relatedEquipment':
        returnValue = (
          <div data-cy={dataCy}>
            {getAuditDefaultValue(audit.type === 'OBJECT_DELETED' ? previousValue : nextValue)}
          </div>
        );
        break;
      case 'formInput.lineItems':
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const value: POLineItem = JSON.parse(auditValue);
          const { capitalEquipment, partNumber, serviceId, supplierPartNumber, order, unitPrice, description, partNumberTitle, units, glCode, tax, formattedDate } = value;
          const partNumberText = poDefinePartNumberText(value);
          const values = {
            ...value,
            partNumber: partNumberText,
            capitalEquipment: `${Boolean(capitalEquipment)}`,
            supplierPartNumber: supplierPartNumber ?? '',
            order: order ?? '',
            unitPrice: unitPrice ?? '',
            description: description ?? '',
            partNumberTitle: partNumberTitle ?? '',
            units: units ?? '',
            glCode: glCode ?? '',
            tax: `${Boolean(tax)}`,
            formattedDate: formattedDate ?? '',
          };
          const text
            = !serviceId
              ? intl.formatMessage(
                { id: partNumber ? 'documentRevision.audit.formInput.lineItems.MESSAGE' : 'documentRevision.audit.formInput.lineItems.SUPPLIER_PART.MESSAGE' },
                { ...values })
              : intl.formatMessage({ id: 'documentRevision.audit.formInput.lineItems.MESSAGE.NonEnlil' }, { ...values });

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
      case 'formInput.po-items-built-in.items.partNumberTitle':
      case 'formInput.po-items-built-in.items.description':
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const entry: POLineItem & { value: string } = JSON.parse(auditValue);
          const partNumberText = poDefinePartNumberText(entry);
          if (typeof entry.value !== undefined) {
            returnValue = (<div data-cy={dataCy}>{`${partNumberText} - updated to ${entry.value}`}</div>);
          } else {
            returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
          }
        } catch (err) {
          // Not valid JSON, so older data and is string
          returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
        }
        break;
      case 'formInput.work_order_type':
      case 'formInput.wo_part_unit':
      case 'formInput.wo_part_quantity':
      case 'formInput.wo_part.id':
        returnValue = (<div data-cy={dataCy}>{getWOAuditDefaultValue(audit)}</div>);
        break;
      case 'formInput.autoTransact':
      case 'formInput.autoAssign':
        returnValue = (<div data-cy={dataCy}>{translate(audit.nextValue === 'true' ? 'common.true' : 'common.false')}</div>);
        break;
      case 'workOrder':
        try {
          const nextVal = audit.nextValue as string;

          const {
            partDocId,
            partQuantityNeeded,
            partVariance,
            lotDocId,
            lotQuantityNeeded,
            lotVariance,
          } = JSON.parse(nextVal);

          const partVarianceVal = partVariance || 0;
          const lotVarianceVal = lotVariance || 0;
          const issuedQty = parseInt(partQuantityNeeded, 10) + parseInt(partVarianceVal, 10);

          if (audit.type.includes('ARRAY_ADDED')) {
            returnValue = (
              <>
                {lotDocId
                && lotQuantityNeeded
                && getNewLineItemAuditValue(
                  dataCy,
                  'documentRevision.audit.workOrder.lot_info.added',
                  { lotDocId, lotQuantityNeeded, lotVarianceVal },
                )}
                {lotDocId
                  && !lotQuantityNeeded
                  && getNewLineItemAuditValue(
                    dataCy,
                    'documentRevision.audit.workOrder.lot.added',
                    { lotDocId },
                  )}
                {!lotDocId
                  && partQuantityNeeded
                  && getNewLineItemAuditValue(
                    dataCy,
                    'documentRevision.audit.workOrder.part_info.added',
                    { partDocId, partQuantityNeeded, partVarianceVal, issuedQty },
                  )}
                {!lotDocId
                  && !partQuantityNeeded
                  && getNewLineItemAuditValue(
                    dataCy,
                    'documentRevision.audit.workOrder.part.added',
                    { partDocId },
                  )}
              </>
            );
          } else if (audit.type.includes('ARRAY_EDITED')) {
            returnValue = (
              <>
                {lotDocId
                  && getNewLineItemAuditValue(
                    dataCy,
                    'documentRevision.audit.workOrder.lot_info.updated',
                    { lotDocId, lotQuantityNeeded, lotVarianceVal },
                  )}
                {!lotDocId
                  && getNewLineItemAuditValue(
                    dataCy,
                    'documentRevision.audit.workOrder.part_info.updated',
                    { partDocId, partQuantityNeeded, partVarianceVal, issuedQty },
                  )}
              </>
            );
          }
        } catch (error) {
          returnValue = (<div data-cy={dataCy}>{getAuditDefaultValue(audit.nextValue)}</div>);
        }

        if (!audit.type.includes('ARRAY_ADDED') && !audit.type.includes('ARRAY_EDITED')) {
          const prevVal: string = audit.previousValue as string;

          try {
            const { lotDocId, partDocId } = JSON.parse(prevVal);
            returnValue = (
              <div data-cy={dataCy}>
                {getAuditDefaultValue(lotDocId || partDocId)}
              </div>
            );
          } catch (error) {
            returnValue = (
              <div data-cy={dataCy}>
                {getAuditDefaultValue(audit.previousValue)}
              </div>
            );
          }
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
const FBInvTaskState = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  DONE: 'DONE',
  ABANDONED: 'ABANDONED',
};
const getNewLineItemAuditValue = (
  dataCy: string | undefined,
  translation: Translation,
  values: Record<string, ReactNode>,
) => {
  return (
    <>
      <Text dataCy={dataCy} translation={translation} values={values} />
      <br />
    </>
  );
};
interface IDisplayStatusAuditEntry {
  displayRevision: string
  changeRequestId: string
  status: string
  isRestrictedEdit: boolean
}

export default AuditFactory;
