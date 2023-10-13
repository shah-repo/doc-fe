// import { useFormikContext } from 'formik';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../common/intl';
import { Button } from '../../../../../../components/forms/fields-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { ASSIGNED_TO_FIELD, ASSIGNEE_ACTIONS_FIELD } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import { styles } from './styles';

export const AssigneeActionCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem } = props;
  const { setFieldValue, submitForm } = useFormikContext();
  const assigneeActionsList = get(dataItem, ASSIGNEE_ACTIONS_FIELD, []);
  const handleClick = ({ value: id }) => {
    setFieldValue(`${dataItem.id}.${ASSIGNEE_ACTIONS_FIELD}`, [id]);
    submitForm();
  };

  const assigneList = get(dataItem, ASSIGNED_TO_FIELD, []);
  return (<>
    {assigneList?.map(assignee => {
      return <>{
        !assigneeActionsList.includes(assignee.value) ? <Button
          className={classes.assigneeAction}
          onClick={() => handleClick(assignee)}
          data-cy="assignee-action-button"
        >
          {translate('approvalRequest.tasks.list.assignee.complete')}
        </Button>
          : <OverflowingContent><div className={classes.assigneeAction}>{translate('approvalRequest.tasks.list.assignee.complete')}</div></OverflowingContent>
      }</>;
    })}
  </>);
};
