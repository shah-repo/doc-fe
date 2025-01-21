import { Box, LinearProgress, List, Typography } from '@material-ui/core';
import { find, has, isEmpty, last, orderBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import striptags from 'striptags';
import { translate } from '../../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../../common/utils/date';
import { Audit, AuditGroupType, LifecyclePahseOptionPayload } from '../../../state/ducks/audit/types';
import { Approval, ApprovalStatus, User } from '../../../state/ducks/common/types';
import { companyActions } from '../../../state/ducks/company';
import { documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import { PO_ITEMS_COMPONENT_NAME } from '../../../state/ducks/documentRevisions/constants';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../../state/types';
import { LCPDocRevOptions } from '../../administration/general.settings/panels/LCP/components/Grid/types';
import AuditFactory from '../../components/AuditFactory';
import DateTime from '../../components/DateTime';
import Text from '../../components/Text';
import { toastError } from '../../components/notifications';
import { FBApprovalAuditState, FBFieldName, FBSchemaProps, FBText } from '../../form.builder';
import { getDisplayDocumentByDetailsObj } from '../../form.builder/FBLHRSummary/utils';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { isTranslation } from '../../translations/types';
import UserAvatarListItem from '../Sidebar/common/UserAvatarListItem';
import { RELATED_TYPE_VALUES_ENUM, getDynamicTextValue } from '../forms/presenters/related.parts/helper';
import { IRevIdMapper, revIdRelatedTypeMapper } from '../helpers/checkDocumentGroup';
import { styles } from './Audit.presenter.styles.new';

interface OwnProps {
  audit: AuditGroupType
  approvals: Approval[]
  statusLabel: string
  versionNumber: string
  isStatusVisible: boolean
  schema: FBSchemaProps[]
}

type AuditPresenterProps = OwnProps;

const SERVER_OWNED = 'Server Automation';
const CUSTOM_BOOLEAN_FIELD = 'custom_boolean_field';

const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
  approvals,
  statusLabel,
  versionNumber,
  isStatusVisible,
  schema,
}) => {
  const classes = styles();
  const intl = useIntl();
  const documentRevisions = useSelector(documentRevisionsSelectors.getDocumentRevisionsList);
  const loadAsyncState = useSelector(documentRevisionsSelectors.getLoadAuditAsyncState);
  const loading = loadAsyncState.status && ![AsyncStatus.Success, AsyncStatus.Error].includes(loadAsyncState.status);

  const revIdRelatedTypeObj = revIdRelatedTypeMapper(documentRevisions);
  const docTypeId = documentRevisions[0].document?.documentType?.id;

  // fetch lifecycle phase options
  const [lifecyclePhaseOptions, setLifecyclePhaseOptions] = useState<LifecyclePahseOptionPayload[]>([]);
  const fetchDocRevOptions = useActionCreator(companyActions.fetchDocRevOptionsByDocTypeId);

  const fetchLCPDocTypesAsync = useAsync({
    onSuccess: (data: LCPDocRevOptions[] = []) => {
      setLifecyclePhaseOptions(data.map((docType) => ({ id: docType.id, text: docType.displayLabel })));
    },
    onError: toastError,
  });

  useEffect(() => {
    fetchLCPDocTypesAsync.start(
      fetchDocRevOptions,
      docTypeId,
      fetchLCPDocTypesAsync,
    );
  }, []);

  // Added to exclude few PO line items unwanted audit recrods
  const excludeFewPOAuditRecords = (change: Audit) => (change.field.includes(PO_ITEMS_COMPONENT_NAME)
    && (change.type.includes('OBJECT_NEW')
      || change.type.includes('ARRAY_NEW')
      || change.type.includes('STRING_NEW')
      || change.type.includes('ARRAY_EDITED')
      || change.type.includes('NUMBER_NEW')
      || change.type.includes('BOOLEAN_NEW')
      || change.type.includes('BOOLEAN_EDITED')
      || change.field.includes('items.date')
      || change.field.includes('items.capitalEquipment')
      || change.field.includes('totalInUSD'))
    // Even though these are of type NUMBER_NEW - we keep them while they are being set for the 1st time
    && !(change.field.includes('items-built-in.subTotal') || change.field.includes('items-built-in.tax')
      || change.field.includes('items-built-in.taxRate') || change.field.includes('items-built-in.totalAmount'))
  );

  const renderAuditGroup = () =>
    Object.keys(audit).map((groupId, key) => {
      const change = audit[groupId][0];
      const { owner, ownerUser, ownerThirdParty, ownerName } = change;
      const isPOAutoChange
        = change.field === 'poStatus' && ownerName === SERVER_OWNED;
      const changeOwner = find([owner, ownerUser, ownerThirdParty], 'user.name');
      let finalOwner = !isPOAutoChange && changeOwner ? changeOwner.user : { name: ownerName } as User;

      if (ownerName === SERVER_OWNED) {
        finalOwner = { name: SERVER_OWNED } as User;
      }

      if (!renderChanges(audit[groupId], key)) {
        return null;
      }

      return (
        <Box key={groupId} className={classes.changeContainer}>
          <UserAvatarListItem
            name={<span data-cy={`change-key-${key}`}>{finalOwner?.name}</span>}
            user={finalOwner}
            secondaryComponent={
              <DateTime
                data-cy={`audit-time-${key}`}
                value={change.timestamp}
                format={MomentFormats.BriefDateTime}
              />
            }
          />
          {renderChanges(audit[groupId], key)}
        </Box>
      );
    });

  const renderChanges = (audits: Audit[], groupKey?: number) => {
    const newReferences: Audit[] = [];
    const deletedReferences: Audit[] = [];
    const attachments: Audit[] = [];
    const singleFields: JSX.Element[] = [];
    let key = 0;

    const sortedAudit = orderBy(audits.filter(audit => audit.field !== 'displayStatus'), ['field']);
    const statusInfo = audits.find(val => val.field === 'displayStatus');
    if (statusInfo) {
      sortedAudit.push(statusInfo);
    }
    sortedAudit.forEach((change: Audit, index, array) => {
      change.groupKey = groupKey;
      const isFBField = has(change, 'fbSchemaItem');
      const isSmartRef = change.field.split('.').includes('smartRefs');
      const {
        label,
        placeholder = '',
        type: fbType,
        stepIndex:
        number = 1,
      } = change.fbSchemaItem || {};
      let fbLabel = label || placeholder;
      const isOmittedFB = (
        isFBField
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        && !FBApprovalAuditState.docAudit.includes(change.fbSchemaItem?.type!)
      );
      if (isOmittedFB) { return; }

      if (isFBField) {
        const { nextValue, previousValue } = change;
        let auditValue: any = nextValue;
        if (nextValue === 'undefined' || nextValue === '[]' || nextValue === '{}') {
          auditValue = previousValue;
        }
        if (auditValue === 'undefined' || auditValue === '[]' || auditValue === '{}') {
          return;
        }
        if (nextValue === 'null' && fbType === 'numeric') {
          auditValue = previousValue;
          change = {
            ...change,
            type: 'NUMBER_DELETED',
            nextValue: previousValue as string,
          };
        }
      }
      // PROCEDURE
      if (fbType === 'procedure') {
        let valueKey = last(change.field.split('.'));
        let valueKeyType = '';
        if (valueKey === 'id' && !change.field.includes('attachments')) { return; }
        if (valueKey === 'title') {
          valueKey = change.field.split('.')[2].split('[')[0];
        }
        if (valueKey !== 'materials' && change.field.includes('materials')) {
          valueKeyType = 'materials';
        } else if (valueKey !== 'equipment' && change.field.includes('equipment')) {
          valueKeyType = 'equipment';
        }
        if (change.field.includes('attachments')) {
          valueKey = 'attachments';
        }
        const stepLabel = intl.formatMessage({ id: 'form.builder.step.number' }, { number });
        let keyLabel = '';
        if (isTranslation(`form.builder.${valueKeyType}`)) {
          keyLabel = intl.formatMessage({ id: `form.builder.${valueKeyType}` }) + ': ';
        }
        if (isTranslation(`form.builder.${valueKey}`)) {
          keyLabel += intl.formatMessage({ id: `form.builder.${valueKey}` });
        }
        fbLabel = `${stepLabel} ${keyLabel}`;
      }
      // LHRSTEP
      if (fbType === 'lhrstep') {
        const valueKey = change.field.split('.')[1].split('-');
        let label = '';
        const stepLabel = intl.formatMessage({ id: 'form.builder.step.number' }, { number });
        if (!valueKey.includes('quantity')) {
          return;
        }
        if (valueKey.includes('quantity')) {
          label = intl.formatMessage({ id: `form.builder.${valueKey[2]}.quantity` });
        }
        fbLabel = `${label} for ${stepLabel}`;
      }
      // LOT QUANTITY
      if (fbType === 'lotQuantity' && change.field.endsWith('_unit')) {
        fbLabel = `${fbLabel as string} ${translate('form.builder.field.units')}`;
      }
      // PART VENDORS
      if (fbType === 'partVendors') {
        const fieldParts = change.field.split('.');
        const field = fieldParts.at(-1) as string;
        const parentField = fieldParts.at(-2) as string;
        if (['id', 'currency', 'primary'].includes(field)) {
          return;
        }
        if (!['ARRAY_DELETED', 'ARRAY_NEW'].includes(change.type)) {
          const fieldFullName = ['docId', 'value', 'name'].includes(field) ? parentField : field;
          const fieldName = translate(`form.builder.part.vendors.${fieldFullName}`);
          fbLabel = translate('form.builder.part.vendors.audit.item', {
            label: fbLabel as string,
            field: fieldName,
          });
        }
      }
      // SITE INFOMRATION
      if (fbType === 'siteInformations') {
        const changeField = change.field.split('.');
        const field = changeField.at(-1) as string;
        const parentField = changeField.at(-2) as string;
        if (['id', 'primary'].includes(field)) {
          return;
        }
        if (!['ARRAY_DELETED', 'ARRAY_NEW'].includes(change.type)) {
          if (parentField.startsWith('siteContact')) {
            let fieldFullName = ['docId', 'value'].includes(field) ? parentField : field;
            fieldFullName = getSiteInformationsFieldName(fieldFullName, 'contact');
            const fieldName = translate(`form.builder.contact.grid.heading.${fieldFullName}`);
            fbLabel = translate('form.builder.contact.grid.heading.audit.item', {
              label: `${fbLabel as string} Contact`,
              field: fieldName,
            });
          } else {
            let fieldFullName = ['docId', 'value', 'name'].includes(field) ? parentField : field;
            fieldFullName = getSiteInformationsFieldName(fieldFullName, 'site');
            const fieldName = translate(`form.builder.site.inforation.grid.heading.${fieldFullName}`);
            fbLabel = translate('form.builder.site.inforation.grid.heading.audit.item', {
              label: fbLabel as string,
              field: fieldName,
            });
          }
        }
        if (change.type === 'BOOLEAN_NEW' || change.type === 'BOOLEAN_EDITED') {
          change = {
            ...change,
            field: CUSTOM_BOOLEAN_FIELD,
          };
        }
      }
      // SITE ADDRESS
      if (fbType === 'headquarterAddress') {
        if (change.field.endsWith('_city')) {
          fbLabel = `${fbLabel as string} ${translate('form.builder.site.inforation.grid.heading.city')}`;
        } else if (change.field.endsWith('_country')) {
          fbLabel = `${fbLabel as string} ${translate('form.builder.site.inforation.grid.heading.country')}`;
        } else if (change.field.endsWith('_zip_code')) {
          fbLabel = `${fbLabel as string} ${translate('form.builder.site.inforation.grid.heading.zip.code')}`;
        }
      }
      // SHIPPING ADDRESS
      if (fbType === 'shippingAddress') {
        const changeField = change.field.split('.');
        const field = changeField.at(-1) as string;
        if (['id'].includes(field)) {
          return;
        }
        if (changeField.includes('shipping_address_attention') || changeField.includes('shipping_address_contact')) {
          return;
        }
      }
      // SHIPPING ITEMS
      if (fbType === 'shippingItems') {
        const changeField = change.field.split('.');
        const field = changeField.at(-1) as string;
        const parentField = changeField.at(-2) as string;
        if (['id', 'documentId'].includes(field)) {
          return;
        }
        if (!['ARRAY_DELETED', 'ARRAY_NEW'].includes(change.type)) {
          const fieldFullName = ['docId', 'value', 'name'].includes(field) ? parentField : field;
          const fieldName = translate(`form.builder.shipping.items.${fieldFullName}`);
          if (change.type === 'OBJECT_DELETED') {
            if (change.field.endsWith('part') || change.field.endsWith('lot')) {
              const value = JSON.parse(change.previousValue as string) as DocumentRevision;
              const fieldLabel = change.field.endsWith('part') ? translate('Part') : translate('Lot');
              fbLabel = `${fbLabel as string} ${fieldLabel}`;
              change = {
                ...change,
                previousValue: value?.name,
              };
            }
          } else {
            fbLabel = translate('form.builder.shipping.items.audit.item', {
              label: fbLabel as string,
              field: fieldName,
            });
          }
        }
      }
      // LOT TRANSFERS
      if (fbType === 'lotTransfers') {
        const fieldParts = change.field.split('.');
        const field = fieldParts.at(-1) as string;
        const parentField = fieldParts.at(-2) as string;
        if (field === 'id') {
          return;
        }
        if (change.type !== 'ARRAY_DELETED') {
          const fieldFullName = ['docId'].includes(field) ? parentField : field;
          const fieldName = translate(`form.builder.lot.transfers.${fieldFullName}`);
          fbLabel = `${fbLabel as string} ${fieldName}`;
        }
      }
      // CYCLE COUNT
      if (fbType === 'cycleCount') {
        const fieldParts = change.field.split('.');
        const field = fieldParts.at(-1) as string;
        if (field === 'id') {
          return;
        }
        if (change.type !== 'ARRAY_DELETED') {
          const fieldName = translate(`form.builder.cycle.count.${field}`);
          fbLabel = `${fbLabel as string} ${fieldName}`;
        }
      }
      // TRAINEE LIST
      if (fbType === 'traineeList') {
        const fieldParts = change.field.split('.');
        const field = fieldParts.at(-1) as string;
        if (['id', 'createdAt', 'documentId', 'docRevId'].includes(field)) {
          return;
        }
        if (field !== FBFieldName.GRPTTraineeList) {
          const fieldName = translate(`form.builder.trainee.list.${field}`);
          fbLabel = `${fbLabel as string} ${fieldName}`;
        }
      }
      // MPIPROCEDURE
      const valueKey = change.field.split('.');
      if (fbType === 'mpiprocedure') {
        if (!change.field.split('.').includes('editorConfig')) {
          return;
        }
        const stepLabel = intl.formatMessage({ id: 'form.builder.step.number' }, { number });
        const regex = /materials/g;
        const isMaterial = !isEmpty(change.field.match(regex));
        const isAttachment = !isEmpty(change.field.match(/attachments/g));
        const fieldType = isMaterial ? intl.formatMessage({ id: 'form.builder.materials|s' })
          : intl.formatMessage({ id: 'form.builder.equipment|s' });
        // skip audit values
        if (
          (last(valueKey) === 'id'
            || last(valueKey) === 'attachments' || last(valueKey) === 'quantity') && (
            (change.type === 'STRING_NEW' && !isAttachment)
            || change.type === 'NUMBER_DELETED')) {
          return;
        }
        // changes on description step field
        if (last(valueKey) === 'description') {
          fbLabel = `${intl.formatMessage({ id: 'form.builder.step.description' })} for ${stepLabel}`;
          const value = change.nextValue as string;
          const formattedValue = striptags(value);
          change = {
            ...change,
            nextValue: formattedValue,
          };
        }
        // adding more equipment or material to the list
        if (change.type === 'STRING_NEW' || change.type === 'NUMBER_NEW') {
          if (last(valueKey) === 'title') {
            const value = documentRevisions.find((e) => e.id === change.nextValue);
            fbLabel = intl.formatMessage({ id: 'form.builder.audit.field.step' },
              {
                fieldType,
                stepLabel,
              });
            change = {
              ...change,
              nextValue: `${value?.document.docId} - ${value?.name} - rev
                      ${value?.displayRevision}`,
            };
          }
          if (last(valueKey) === 'unit' || last(valueKey) === 'quantity') {
            const { document, name, displayRevision } = change.relatedEntity as DocumentRevision || {};
            const material = `${document?.docId} - ${name} - rev ${displayRevision}`;
            fbLabel = intl.formatMessage({ id: 'form.builder.audit.field.step' },
              {
                fieldType: intl.formatMessage({ id: `form.builder.${last(valueKey)}` }),
                stepLabel: material,
              });
          }
        }
        // editing material or equipment
        if (change.type === 'STRING_EDITED' || change.type === 'NUMBER_EDITED') {
          let nextMaterial;
          let previousMaterial;

          if (last(valueKey) === 'title') {
            nextMaterial = documentRevisions.find((e) => e.id === change.nextValue);
            previousMaterial = documentRevisions.find((e) => e.id === change.previousValue);
            change = {
              ...change,
              nextValue: `${nextMaterial?.document.docId} - ${nextMaterial?.name} - rev ${nextMaterial?.displayRevision}`,
            };
            fbLabel = intl.formatMessage({ id: 'form.builder.audit.value' },
              {
                field: fieldType,
                docId: previousMaterial?.document.docId,
                name: previousMaterial?.name,
                displayRevision: previousMaterial?.displayRevision,
                stepLabel,
              });
          }
          if (last(valueKey) === 'unit' || last(valueKey) === 'quantity') {
            const { document, name, displayRevision } = change.relatedEntity as DocumentRevision || {};
            const material = `${document?.docId} - ${name} - rev ${displayRevision}`;
            fbLabel = intl.formatMessage({ id: 'form.builder.audit.relations' },
              {
                fieldType: intl.formatMessage({ id: `form.builder.${last(valueKey)}` }),
                previousValue: change.previousValue as string,
                relation: material,
              });
          }
        }
        // delete equipment or material or add/delete attachments
        if (change.type === 'STRING_DELETED' || (change.type === 'STRING_NEW' && isAttachment)) {
          if (last(valueKey) !== 'title' && !isAttachment) {
            return;
          }
          fbLabel = intl.formatMessage({ id: 'form.builder.audit.field.step' },
            {
              fieldType: isAttachment ? intl.formatMessage({ id: 'common.attachment' }) : fieldType,
              stepLabel,
            });
        }
      }

      if (!isFBField && change.field.includes('attachments')) {
        if (change.field.endsWith('s3link') && (change.type === 'STRING_EDITED' || change.type === 'STRING_NEW')) {
          return;
        }
        attachments.push(change);
      } else if (change.field.includes('referenceTo') && change.type === 'ARRAY_NEW') {
        newReferences.push(change);
      } else if (change.field.includes('referenceTo') && change.type === 'ARRAY_DELETED') {
        deletedReferences.push(change);
      } else if (change.field === 'approvals.status' && change.nextValue === ApprovalStatus.Abandoned) {
        // TODO: (in BE) since BE cannot make correct data for removing approvers.
        change = {
          ...change,
          approvalStatus: change.nextValue as string,
          type: 'ARRAY_DELETED',
          nextValue: (change.relatedEntity as Approval)?.approver,
        };
        deletedReferences.push(change);
      } else if (change.field === 'schema' && change.type === 'ARRAY_NEW') {

      } else {
        // HACK for ENC-7509
        const regex = new RegExp(`^formInput\\.(?:${change.fbSchemaItem?.name})\\[[a-zA-Z0-z-]+\\]\\.id$`);
        if (change.fbSchemaItem?.type === 'fileupload' && !regex.test(change.field)) {
          try {
            const previousValue = JSON.parse(change.previousValue as string);
            if (typeof previousValue !== 'object' || !('id' in previousValue)) {
              return;
            }
            change = {
              ...change,
              previousValue: previousValue.id,
            };
          } catch (e) {
            return;
          }
        }
        if (change.field === 'redline') {
          if (change.type === 'BOOLEAN_NEW' && change.nextValue === 'false') { return; }
          change = {
            ...change,
            nextValue: `${getFormattedDateString(change.timestamp, MomentFormats.DateTime)} - ${change.owner.user.name}`,
          };
        }
        if (change.field.split('.').includes('smartRefs')) {
          if (change.type === 'STRING_NEW' || change.type === 'NUMBER_NEW') {
            return;
          }
          if (change.type === 'BOOLEAN_NEW' || change.type === 'BOOLEAN_EDITED') {
            const stepIndex = schema?.find((e) => e.name === change.reference?.metadata.fieldId)?.stepIndex;
            const { quantity, unit, lotPart, lotDocId, materialId } = change.reference?.metadata || {};
            const value = documentRevisions.find((e) => {
              if (change.reference?.metadata.materialId) {
                return e.id === change.reference?.metadata?.materialId;
              }
              return e.id === change.reference?.metadata?.equipmentId;
            },
            );
            const nextValue = materialId ? `${lotDocId} | ${lotPart} | ${quantity} ${unit}`
              : `${change.reference?.toDocRev?.document.docId}`;
            change = {
              ...change,
              field: 'smartRefs',
              type: `${change.reference?.type}.${change.type}` as unknown as Audit['type'],
              nextValue,
            };
            fbLabel = intl.formatMessage({ id: 'form.builder.audit.replacement' },
              {
                type: (change.type === 'LOT_USAGE.BOOLEAN_NEW' as unknown as Audit['type']
                  || change.type === 'LOT_USAGE.BOOLEAN_EDITED' as unknown as Audit['type'])
                  ? intl.formatMessage({ id: 'form.builder.materials|s' })
                  : intl.formatMessage({ id: 'form.builder.equipment|s' }),
                value: value?.document.docId,
                step: stepIndex,
              });
          }
        }

        if (change.field.includes(PO_ITEMS_COMPONENT_NAME)) {
          if (excludeFewPOAuditRecords(change)) {
            return null;
          }
          if (change.field.includes('items')) {
            change.field = change.field.replace(/\[(.+?)\]/g, '');
          }
        }

        // For inputs where the selected value is - Other, it shows an additional input field with a label of Note.
        // However there is no entry for this in the schema, & the incoming audit log still maps it to the original input,
        if (change.field.includes('input-context') && change.fbSchemaItem) {
          fbLabel = 'Note';
        }

        if (change.field.includes('lifecyclePhaseId') && change.type === 'OBJECT_NEW') {
          return;
        }

        // for site contact info delete chage FbLable
        if (change.field.includes('siteContact') && change.type === 'ARRAY_DELETED') {
          fbLabel = `${fbLabel} Contact`;
        }

        const isArrayEdited = change.type.includes('ARRAY_EDITED');
        const isCustomBooleanField = change.field === CUSTOM_BOOLEAN_FIELD;

        const isDocIdORDescriptionChanged = isArrayEdited && change.nextValue !== change.previousValue;

        singleFields.push(
          <Box
            mb={1}
            key={`${change.groupId}-${index}`}
            data-cy="no-padding-margin"
            className={
              index === array.length - 1
                ? classes.noPaddingMargin
                : classes.auditListItem
            }
          >
            <>
              {!isFBField && !isSmartRef && isArrayEdited && isDocIdORDescriptionChanged && (
                <Typography
                  variant="subtitle1"
                  className={classes.auditKey}
                >
                  <Text
                    dataCy={`change-key-${groupKey}-docId-${key}`}
                    message={`documentRevision.audit.${change.field}.${change.type}`}
                    values={{
                      nextStatus: change.nextValue,
                      relatedType: getDynamicTextValue(
                        revIdRelatedTypeObj[change.documentRevisionId ?? '']?.relatedType, RELATED_TYPE_VALUES_ENUM.SUB_PART_CAPS, RELATED_TYPE_VALUES_ENUM.SUB_DOCUMENT_CAPS),
                      rowDetails: getLhrSummaryRowIdentifier(change),
                    }}
                  />
                </Typography>
              )}
              {!isFBField && !isSmartRef && !isArrayEdited && (
                <Typography
                  variant="subtitle1"
                  className={classes.auditKey}
                >
                  {labelToShow(change, groupKey, key, revIdRelatedTypeObj)}
                </Typography>
              )}
              {isCustomBooleanField && (
                <Typography className={classes.auditKey}>
                  <span data-cy={`change-key-${groupKey}-${key}`}>
                    {fbLabel}
                  </span>
                </Typography>
              )}
              {(isFBField || isSmartRef) && !isCustomBooleanField && (
                <Typography
                  className={classes.auditKey}
                >
                  <FBText
                    locale={`form.builder.audit.${change.type}`}
                    values={{ label: fbLabel }}
                  />
                </Typography>
              )}
            </>
            {((isArrayEdited && isDocIdORDescriptionChanged) || !isArrayEdited) && (
              <div className={classes.auditValue}>
                <AuditFactory
                  audit={change}
                  dataCy={`change-value-${groupKey}-${key}`}
                  revIdRelatedTypeObj={revIdRelatedTypeObj}
                  lifecyclePhaseOptions={lifecyclePhaseOptions}
                />
              </div>
            )}
          </Box>,
        );
        key++;
      }
    });

    // This key is added to keep sequential data-cy identifier in the history
    attachments.forEach((change) => {
      change.index = key++;
    });
    newReferences.forEach((change) => {
      change.index = key++;
    });
    deletedReferences.forEach((change) => {
      change.index = key++;
    });

    if (!singleFields.length && !attachments.length && !newReferences.length && !deletedReferences.length) {
      return null;
    }
    return (
      <>
        {singleFields}
        {attachments.length > 0 && renderGroupChanges(attachments)}
        {newReferences.length > 0 && renderGroupChanges(newReferences)}
        {deletedReferences.length > 0 && renderGroupChanges(deletedReferences)}
      </>
    );
  };

  const renderGroupChanges = (auditGroup: Audit[]) => {
    const field = auditGroup[0].field;
    const type = auditGroup[0].type;
    const parentGroupKey = auditGroup[0].groupKey;
    const parentIndex = auditGroup[0].index;

    const isRemovingApproverAction = (
      auditGroup[0].field === 'approvals.status' && auditGroup[0].nextValue === ApprovalStatus.Abandoned
    );
    const isWorkOrder = revIdRelatedTypeObj[auditGroup[0].documentRevisionId ?? '']?.isWorkOrder;

    return (
      <Box mb={1} key={`${auditGroup[0].groupId}`}>
        <Typography variant="subtitle1" className={classes.auditKey}>
          <Text dataCy={`change-key-${parentGroupKey}-${parentIndex}`}
            message={
              isRemovingApproverAction
                ? `documentRevision.audit.${field}.ARRAY_DELETED`
                : `documentRevision.audit.${field}.${type}`}
            values={{
              approverText: isWorkOrder ? 'User' : 'Approver',
            }}
          />
        </Typography>
        {auditGroup.map((change, index) => (
          <div
            key={change.groupId + `-${index}`}
            className={classes.auditValue}
          >
            <AuditFactory
              audit={change}
              dataCy={`change-value-${change.groupKey}-${change.index}`}
              revIdRelatedTypeObj={revIdRelatedTypeObj}
              lifecyclePhaseOptions={lifecyclePhaseOptions}
            />
          </div>
        ))}
      </Box>
    );
  };

  return (
    <div>
      {loading && <LinearProgress style={{ width: '100%' }} />}
      {!audit && <Box className={classes.revisionContainer}>
        <Typography variant="subtitle1" className={classes.title}>
          <Text message="common.revision" />
          &nbsp;
          {versionNumber}
          {
            isStatusVisible
            && <>
              &nbsp; - <Text message={statusLabel} />
            </>
          }
        </Typography>
      </Box>}
      <List disablePadding>{audit && renderAuditGroup()}</List>
    </div>
  );
};

const labelToShow = (change: Audit,
  groupKey: number | undefined,
  key: number | undefined,
  revIdRelatedTypeObj: { [key: string]: IRevIdMapper }) => {
  const { relatedType, isWorkOrder } = revIdRelatedTypeObj[change.documentRevisionId ?? ''] ?? {};
  return (
    <>
      {change.field === 'relatedPartsStatus' && <Text
        dataCy={`change-key-${groupKey}-${key}`}
        message={`documentRevision.audit.${change.field}.${change.type}`}
        values={{
          relatedType: getDynamicTextValue(
            relatedType, RELATED_TYPE_VALUES_ENUM.BASE_PART, RELATED_TYPE_VALUES_ENUM.BASE_DOCUMENT),
        }}
      />}
      {change.field !== 'relatedPartsStatus' && <Text
        dataCy={`change-key-${groupKey}-${key}`}
        message={`documentRevision.audit.${change.field}.${change.type}`}
        values={{
          nextStatus: change.nextValue,
          approverText: isWorkOrder ? 'User' : 'Approver',
          relatedType: getDynamicTextValue(
            relatedType, RELATED_TYPE_VALUES_ENUM.SUB_PART_CAPS, RELATED_TYPE_VALUES_ENUM.SUB_DOCUMENT_CAPS),
        }}
      />}
    </>
  );
};

const getLhrSummaryRowIdentifier = (change: Audit): string => {
  const prevVal: string = change.previousValue as string;
  const nextVal: string = change.nextValue as string;

  try {
    const { step: prevStep, stepOrMpiDetails: prevDetails } = JSON.parse(prevVal);
    const { step: nextStep, stepOrMpiDetails: nextDetails } = JSON.parse(nextVal);
    // modify here
    const prevStepValue = prevDetails?.isExternalItem ? prevDetails.value : prevDetails?.docId;
    const nextStepValue = nextDetails?.isExternalItem ? nextDetails.value : nextDetails?.docId;

    let stepNumber = '';
    if (prevStep !== nextStep && nextStep !== undefined) {
      if (prevStep === undefined) {
        stepNumber = nextStep;
      } else {
        stepNumber = `${prevStep} To ${nextStep}`;
      }
    } else {
      stepNumber = prevStep;
    }

    let stepDetails = '';
    const prevStepValueWithRev = getDisplayDocumentByDetailsObj(prevDetails);
    const nextStepValueWithRev = getDisplayDocumentByDetailsObj(nextDetails);

    if (prevStepValue !== nextStepValue && nextStepValue !== undefined) {
      if (prevStepValue === undefined) {
        stepDetails = nextStepValueWithRev;
      } else {
        stepDetails = `${prevStepValueWithRev} To ${nextStepValueWithRev}`;
      }
    } else {
      stepDetails = prevStepValueWithRev;
    }

    return `${stepNumber} / ${stepDetails}`;
  } catch (error) {
    return '';
  }
};

const getSiteInformationsFieldName = (field: string, type: string): string => {
  if (type === 'site') {
    const fields = {
      siteName: 'site.name',
      siteAddress: 'site.address',
      zipCode: 'zip.code',
      approvedToReceive: 'approved.to.receive',
      sameAsHQ: 'same.as.hq',
    };
    return fields[field] || field;
  } else if (type === 'contact') {
    const fields = {
      phoneNumber: 'phone.number',
    };
    return fields[field] || field;
  }
  return field;
};

export default AuditPresenter;
