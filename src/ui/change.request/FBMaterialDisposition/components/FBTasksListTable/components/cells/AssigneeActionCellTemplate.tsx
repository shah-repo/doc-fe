import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as CompletedIcon } from '../../../../../../../assets/images/approved_status.svg';
import { translate } from '../../../../../../../common/intl';
import {
  getFormattedDateString,
  MomentFormats,
} from '../../../../../../../common/utils/date';
import { authSelectors } from '../../../../../../../state/ducks/auth';
import { ChangeRequestStatus } from '../../../../../../../state/ducks/changeRequest/types';
import { Button } from '../../../../../../components/forms/fields-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import {
  EmployeeStatus,
  EMPLOYEE_RESPONSE_FIELD,
  EMPTY_VALUE_PLACEHOLDER,
} from '../../constants';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

export const AssigneeActionCellTemplate: React.FC<CustomTemplateProps> = (
  props,
) => {
  const classes = styles();
  const { dataItem, employeeStatusUpdates, isDisabled, currentState } = props;
  const employeeResponse = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const { taskId } = dataItem;
  const handleClick = (employeeId: string) => {
    employeeStatusUpdates?.(taskId, employeeResponse, employeeId);
  };
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const isClosedAR = currentState === ChangeRequestStatus.Closed;

  return (
    <>
      {assigneList?.map(({ employeeId, status, updatedAt }) => {
        return (
          <div className={classes.employeeResponseFields}>
            {status === EmployeeStatus.Done ? (
              <OverflowingContent>
                <div className={classes.assigneeActionStatusContainer}>
                  <CompletedIcon />
                  <span className={classes.assigneeActionStatus}>
                    {translate(
                      'approvalRequest.tasks.list.assignee.status.completed',
                    )}
                  </span>
                  <span className={classes.assigneeActionStatusDate}>
                    {getFormattedDateString(
                      new Date(updatedAt),
                      MomentFormats.DateTime,
                    )}
                  </span>
                </div>
              </OverflowingContent>
            ) : employeeId === currentUserId ? (
              isClosedAR ? EMPTY_VALUE_PLACEHOLDER : (
                <Button
                  className={classes.assigneeAction}
                  onClick={() => handleClick(employeeId)}
                  data-cy="assignee-action-button"
                  disabled={isDisabled}
                >
                  {translate('approvalRequest.tasks.list.assignee.complete')}
                </Button>
              )
            ) : isClosedAR ? EMPTY_VALUE_PLACEHOLDER : (
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
