import { Box, LinearProgress, List, Typography } from '@material-ui/core';
import { find, has, isEmpty, last, orderBy } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import striptags from 'striptags';
import { translate } from '../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { Audit, AuditGroupType } from '../../../state/ducks/audit/types';
import { Approval, ApprovalStatus, User } from '../../../state/ducks/common/types';
import { documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import { PO_ITEMS_COMPONENT_NAME } from '../../../state/ducks/documentRevisions/constants';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../../state/types';
import AuditFactory from '../../components/AuditFactory';
import DateTime from '../../components/DateTime';
import Text from '../../components/Text';
import { FBApprovalAuditState, FBSchemaProps, FBText } from '../../form.builder';
import { isTranslation } from '../../translations/types';
import UserAvatarListItem from '../Sidebar/common/UserAvatarListItem';
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
  const loading = ![AsyncStatus.Success, AsyncStatus.Error].includes(loadAsyncState.status);

  // Added to exclude few PO line items unwanted audit recrods
  const excludeFewPOAuditRecords = (change: Audit) => (change.field.includes(PO_ITEMS_COMPONENT_NAME)
   && (change.type.includes('OBJECT_NEW')
  || change.type.includes('ARRAY_NEW')
  || change.type.includes('STRING_NEW')
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
        = change.field === 'poStatus' && ownerName === 'Server Automation';
      const changeOwner = find([owner, ownerUser, ownerThirdParty], 'user.name');
      const finalOwner = !isPOAutoChange && changeOwner ? changeOwner.user : { name: ownerName } as User;

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
      // LOT TRANSFERS
      if (fbType === 'lotTransfers') {
        const fieldParts = change.field.split('.');
        const field = fieldParts.at(-1) as string;
        const parentField = fieldParts.at(-2) as string;
        if (field === 'id') {
          return;
        }
        if (change.type !== 'ARRAY_DELETED') {
          const fieldFullName = field === 'docId' ? parentField : field;
          const fieldName = translate(`form.builder.lot.transfers.${fieldFullName}`);
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
              {!isFBField && !isSmartRef && (
                <Typography
                  variant="subtitle1"
                  className={classes.auditKey}
                >
                  <Text
                    dataCy={`change-key-${groupKey}-${key}`}
                    message={`documentRevision.audit.${change.field}.${change.type}`}
                  />
                </Typography>
              )}
              {(isFBField || isSmartRef) && (
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
            <div className={classes.auditValue}>
              <AuditFactory
                audit={change}
                dataCy={`change-value-${groupKey}-${key}`}
              />
            </div>
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
    return (
      <Box mb={1} key={`${auditGroup[0].groupId}`}>
        <Typography variant="subtitle1" className={classes.auditKey}>
          <Text dataCy={`change-key-${parentGroupKey}-${parentIndex}`}
            message={
              isRemovingApproverAction
                ? `documentRevision.audit.${field}.ARRAY_DELETED`
                : `documentRevision.audit.${field}.${type}`}
          />
        </Typography>
        {auditGroup.map((change, index) => (
          <div
            key={change.groupId + `-${index}`}
            className={classes.auditValue}
          >
            <AuditFactory audit={change} dataCy={`change-value-${change.groupKey}-${change.index}`} />
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

export default AuditPresenter;
