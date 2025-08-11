import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as CompletedIcon } from '../../../../../../../assets/images/approved_status.svg';
import { translate } from '../../../../../../../common/intl';
import {
  MomentFormats,
  useDate,
} from '../../../../../../../common/utils/date';
import { authSelectors } from '../../../../../../../state/ducks/auth';
import { Button } from '../../../../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../../components/KendoDataGrid/constants';
import {
  EmployeeStatus,
} from '../../constants';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

export const AssigneeActionCellTemplate: React.FC<CustomTemplateProps> = (
  props,
) => {
  const classes = styles();
  const { dataItem, employeeStatusUpdates, isDisabled } = props;
  const assignees = dataItem?.employeeResponse ?? [];
  const { taskId } = dataItem;
  const handleClick = (employeeId: string) => {
    employeeStatusUpdates?.(taskId, assignees, employeeId);
  };
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const { getFormattedDateString } = useDate();

  return (
    <>
      {assignees?.map(({ employeeId, status, completedAt }) => {
        return (
          <div className={classes.employeeResponseFields}>
            {status === EmployeeStatus.Done ? (
              <div className={classes.assigneeActionStatusContainer}>
                <CompletedIcon />
                <span className={classes.assigneeActionStatus}>
                  {translate(
                    'approvalRequest.tasks.list.assignee.status.completed',
                  )}
                </span>
                <span className={classes.assigneeActionStatusDate}>
                  {getFormattedDateString(
                    new Date(completedAt),
                    MomentFormats.DateTime,
                  )}
                </span>
              </div>
            ) : employeeId === currentUserId ? (
              isDisabled ? EMPTY_VALUE_PLACEHOLDER : (
                <Button
                  className={classes.assigneeAction}
                  onClick={() => handleClick(employeeId)}
                  data-cy="assignee-action-button"
                  disabled={isDisabled}
                >
                  {translate('approvalRequest.tasks.list.assignee.complete')}
                </Button>
              )
            ) : isDisabled ? EMPTY_VALUE_PLACEHOLDER : (
              <div className={classes.assigneeActionStatusContainer}>
                <FontAwesomeIcon
                  icon={solid('circle-check')}
                  className={classes.pendingIcon}
                />
                <span className={classes.assigneeActionStatus}>
                  {translate(
                    'approvalRequest.tasks.list.assignee.status.pending',
                  )}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
