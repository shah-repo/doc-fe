import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../../../../state/ducks/auth';
import { ChangeRequestStatus } from '../../../../../../../state/ducks/changeRequest/types';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { COMMENTS_FIELD, EmployeeStatus, EMPLOYEE_RESPONSE_FIELD, EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  employeeId: string
}

const Editor: React.FC<Props> = ({ field, dataItem, employeeCommentUpdates, employeeId, isDisabled }) => {
  const { values, getFieldProps } = useFormikContext();
  const classes = styles();
  const employeeResponse = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const { taskId } = dataItem;
  const onBlur = () => {
    const value = get(values, field, '');
    !isEmpty(value) && employeeCommentUpdates?.(taskId, employeeResponse);
  };

  const employee = employeeResponse?.find((data) => data.employeeId === employeeId);
  const value = get(values, field, undefined) ?? employee?.comment;

  return (
    <FormikField
      name={field}
      className={classes.commentCell}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        value={value}
        type="text"
        size="small"
        onBlur={onBlur}
        disabled={isDisabled}
      />
    </FormikField>
  );
};

export const CommentCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, currentState } = props;
  const { taskId } = dataItem;
  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const assigneeComments = dataItem.employeeResponse?.reduce((empObj, emp) => ({
    ...empObj,
    [emp.employeeId]: emp.comment,
  }), {});
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const isClosedAR = currentState === ChangeRequestStatus.Closed;
  const showEditor = (employeeId, status) => currentUserId === employeeId && !isClosedAR && status !== EmployeeStatus.Done;

  return (<>
    <OverflowingContent>
      {assigneList?.map(({ employeeId, status }) => {
        return <div className={classes.commentCell} >
          {showEditor(employeeId, status) && <Editor {...props} {...{ field: `${taskId}.${COMMENTS_FIELD}.${employeeId}`, employeeId }} /> }
          {!showEditor(employeeId, status) && (assigneeComments[employeeId] ?? EMPTY_VALUE_PLACEHOLDER)}
        </div>;
      })}
    </OverflowingContent>
  </>);
};
