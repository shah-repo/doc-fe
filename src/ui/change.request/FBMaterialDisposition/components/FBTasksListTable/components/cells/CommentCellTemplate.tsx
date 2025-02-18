import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../../../../state/ducks/auth';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../../components/KendoDataGrid/constants';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { COMMENTS_FIELD, EMPLOYEE_RESPONSE_FIELD, EmployeeStatus } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  employeeId: string
}

const Editor: React.FC<Props> = ({ field, dataItem, employeeId, isDisabled }) => {
  const { values, getFieldProps } = useFormikContext();
  const classes = styles();
  const employeeResponse = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
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
        disabled={isDisabled}
      />
    </FormikField>
  );
};

export const CommentCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, isClosed } = props;
  const { taskId } = dataItem;
  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const assigneeComments = dataItem.employeeResponse?.reduce((empObj, emp) => ({
    ...empObj,
    [emp.employeeId]: emp.comment,
  }), {});
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const showEditor = (employeeId, status) => currentUserId === employeeId && !isClosed && status !== EmployeeStatus.Done;

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
