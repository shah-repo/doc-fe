import { Box, List, Typography } from '@material-ui/core';
import { orderBy } from 'lodash';
import React from 'react';
import { translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import { Audit, AuditGroupType } from '../../../state/ducks/audit/types';
import { Approval, ApprovalStatus } from '../../../state/ducks/common/types';
import AuditFactory from '../../components/AuditFactory';
import DateTime from '../../components/DateTime';
import Text from '../../components/Text';
import UserAvatarListItem from '../../documentRevision/Sidebar/common/UserAvatarListItem';
import { styles } from './Audit.presenter.styles';

interface OwnProps {
  audit: AuditGroupType
  approvals: Approval[]
  isDrawerOpen: boolean
}

type AuditPresenterProps = OwnProps;

const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
  approvals,
  isDrawerOpen,
}) => {
  const classes = styles();

  const excludeFewAuditRecords = (change: Audit): boolean => {
    const fieldName = change.field.replace(/\[(.+?)\]/g, '');
    return fieldName.includes('proposedDocumentRevision.id')
    || fieldName.includes('documentRevisions.id')
    || fieldName.includes('approver.id')
    || fieldName.includes('signatureGroupId.id')
    || fieldName.includes('formInput.approvers');
  };

  const getMessage = (change: Audit, isRemovingApproverAction: boolean): string => {
    if (isRemovingApproverAction) {
      return 'changeRequest.audit.approvers.ARRAY_DELETED';
    }
    if (change?.fbSchemaItem?.label) {
      const label = change.fbSchemaItem.label;

      let messageType: string;
      switch (change.type) {
        case 'ARRAY_DELETED': {
          messageType = translate('form.builder.audit.deleted');
          break;
        }
        case 'STRING_EDITED': {
          messageType = translate('form.builder.audit.updated');
          break;
        }
        default: {
          messageType = translate('form.builder.audit.added');
          break;
        }
      }
      return `${label} ${messageType}`;
    }

    if (change.fbSchemaItem?.name === 'documentRevisions') {
      const fieldName = change.field.replace(/\[(.+?)\]/g, '');
      return `changeRequest.audit.${fieldName}.${change.type}`;
    }

    return `changeRequest.audit.${change.field}.${change.type}`;
  };

  const renderAuditGroup = () =>
    Object.keys(audit).map((groupId, key) => {
      const change = audit[groupId][0];
      const { owner, ownerUser, ownerThirdParty, ownerName } = change;
      const name = ((owner && owner.user) || ownerUser || ownerThirdParty)?.name ?? ownerName;

      return (
        <Box key={groupId} className={isDrawerOpen ? classes.changeContainer : classes.container}>
          <UserAvatarListItem
            data-cy={`audit-${key}`}
            name={<div data-cy={`audit-owner-${key}`}>{name}</div>}
            user={(owner && owner.user) || ownerUser || ownerThirdParty || { name }}
            secondaryComponent={
              <DateTime
                data-cy={`audit-${key}`}
                value={change.timestamp}
                format={MomentFormats.BriefDateTime}
              />
            }
          />
          {renderChanges(audit[groupId])}
        </Box>
      );
    });

  const renderChanges = (audits: Audit[]) => {
    const references: Audit[] = [];
    const attachments: Audit[] = [];
    const singleFields: JSX.Element[] = [];

    orderBy(audits, ['field']).forEach((change, index) => {
      if (change.field.includes('attachments')) {
        attachments.push(change);
      } else if (change.field.includes('referenceTo')) {
        references.push(change);
        // } else if (change.field.includes("approvals")) {
        //   // This is a hack to not display approvers twice in history
        //   // Until BE removes field approvals
        //   return;
      } else if (change.field !== 'effectiveDate' || change.nextValue !== 'null') {
        const isRemovingApproverAction = (
          change.field === 'approvals.status' && change.nextValue === ApprovalStatus.Abandoned
        );
        if (isRemovingApproverAction) {
          const removedApproverById = approvals.find(({ id }) => id === change.relatedEntity?.id);
          if (removedApproverById) {
            change = {
              ...change,
              approvalStatus: change.nextValue as string,
              nextValue: {
                ...removedApproverById.approver,
              },
            };
          }
        }

        if (excludeFewAuditRecords(change)) {
          return null;
        }

        singleFields.push(
          <Box
            mb={1}
            key={`${change.groupId}-${index}`}
            data-cy="no-padding-margin"
            className={
              index === audits.length - 1
                ? classes.noPaddingMargin
                : classes.auditListItem
            }
          >
            <Typography
              variant="subtitle1"
              className={classes.auditKey}
            >
              <Text
                message={getMessage(change, isRemovingApproverAction)}
              />
            </Typography>
            <div className={classes.auditValue}>
              <AuditFactory audit={change} />
            </div>
          </Box>,
        );
      }
    });

    return (
      <Box>
        {singleFields}
        {attachments.length > 0 && renderGroupChanges(attachments)}
        {references.length > 0 && renderGroupChanges(references)}
      </Box>
    );
  };

  const renderGroupChanges = (auditGroup: Audit[]) => {
    const field = auditGroup[0].field;
    const type = auditGroup[0].type;

    return (
      <Box mb={1} key={`${auditGroup[0].groupId}`}>
        <Box>
          <Text message={`changeRequest.audit.${field}.${type}`} />
        </Box>
        {auditGroup.map((change, index) => (
          <div
            key={change.groupId + `-${index}`}
            className={classes.auditValue}
          >
            <AuditFactory audit={change} />
          </div>
        ))}
      </Box>
    );
  };

  return (
    <List disablePadding>{audit && renderAuditGroup()}</List>
  );
};

export default AuditPresenter;
