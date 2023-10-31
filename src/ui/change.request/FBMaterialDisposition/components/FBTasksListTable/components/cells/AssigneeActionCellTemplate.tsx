// import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { ReactComponent as CompletedIcon } from '../../../../../../../assets/images/approved_status.svg';
import { translate } from '../../../../../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../../../../../common/utils/date';
import { Button } from '../../../../../../components/forms/fields-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { EmployeeStatus, EMPLOYEE_RESPONSE_FIELD } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import { styles } from './styles';

export const AssigneeActionCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, employeeStatusUpdates, disabled } = props;
  const employeeResponse = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const { taskId } = dataItem;
  const handleClick = (employeeId: string) => {
    employeeStatusUpdates?.(taskId, employeeResponse, employeeId);
  };

  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);

  const getAssigneeActionButton = (status, employeeId) => {
    if (status !== EmployeeStatus.Done && disabled) {
      return (<span className={classes.assigneeActionStatus}>
        {translate('approvalRequest.tasks.list.assignee.status.notCompleted')}
      </span>);
    }
    return (<>
      <Button
        className={classes.assigneeAction}
        onClick={() => handleClick(employeeId)}
        data-cy="assignee-action-button"
        disabled={disabled}
      >
        {translate('approvalRequest.tasks.list.assignee.complete')}
      </Button>
    </>);
  };
  return (<>
    {assigneList?.map(({ employeeId, status, updatedAt }) => {
      return (<div className={classes.employeeResponseFields}>
        {!(status === EmployeeStatus.Done) ? getAssigneeActionButton(status, employeeId)
          : <OverflowingContent>
            <div className={classes.assigneeActionStatusContainer}>
              <CompletedIcon />
              <span className={classes.assigneeActionStatus}>
                {translate('approvalRequest.tasks.list.assignee.status.completed')}
              </span>
              <span className={classes.assigneeActionStatusDate}>
                {getFormattedDateString(new Date(updatedAt), MomentFormats.DateTimeWithoutZone)}
              </span>
            </div>
          </OverflowingContent>
        }
      </div>);
    })}
  </>);
};
