import { useFormikContext } from 'formik';
import { find, get, isEmpty } from 'lodash';
import React from 'react';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { COMMENTS_FIELD, EmployeeStatus, EMPLOYEE_RESPONSE_FIELD, EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  employeeId: string
}

const Editor: React.FC<Props> = ({ field, dataItem, employeeCommentUpdates, employeeId, disabled }) => {
  const { values, getFieldProps } = useFormikContext();
  const classes = styles();
  const employeeResponse = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const { taskId } = dataItem;
  const onBlur = () => {
    const value = get(values, field, '');
    !isEmpty(value) && employeeCommentUpdates?.(taskId, employeeResponse);
  };

  const employee = find(employeeResponse, { employeeId });
  const value = get(values, field, undefined) ?? employee.comment;

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
        disabled={disabled}
      />
    </FormikField>
  );
};

export const CommentCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem } = props;
  const { taskId } = dataItem;
  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const assigneeComments = dataItem.employeeResponse?.reduce((empObj, emp) => ({
    ...empObj,
    [emp.employeeId]: emp.comment,
  }), {});

  return (<>
    <OverflowingContent>
      {assigneList?.map(({ employeeId, status }) => {
        return <div className={classes.commentCell} >
          {!(status === EmployeeStatus.Done) && <Editor {...props} {...{ field: `${taskId}.${COMMENTS_FIELD}.${employeeId}`, employeeId }} /> }
          {(status === EmployeeStatus.Done) && (assigneeComments[employeeId] ?? EMPTY_VALUE_PLACEHOLDER)}
        </div>;
      })}
    </OverflowingContent>
  </>);
};
