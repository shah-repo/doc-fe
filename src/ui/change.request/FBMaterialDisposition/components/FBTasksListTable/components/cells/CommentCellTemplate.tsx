import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../../../../state/ducks/auth';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../../components/KendoDataGrid/constants';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { COMMENTS_FIELD, EmployeeStatus } from '../../constants';
import { CustomTemplateProps, EmployeeResponse } from '../../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  employeeId: string
}

const Editor: React.FC<Props> = ({ field, dataItem, employeeId, isDisabled }) => {
  const { values, getFieldProps } = useFormikContext();
  const classes = styles();
  const employeeResponse = dataItem?.employeeResponse ?? [];
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
  const { dataItem, isDisabled } = props;
  const { taskId } = dataItem;
  const assignees = dataItem?.employeeResponse ?? [];
  const assigneeComments = dataItem.employeeResponse?.reduce((empObj, emp) => ({
    ...empObj,
    [emp.employeeId]: emp.comment,
  }), {});
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const showEditor = (employeeId: string, status: string) => currentUserId === employeeId && !isDisabled && status !== EmployeeStatus.Done;

  return (<>
    <OverflowingContent>
      {assignees?.map(({ employeeId, status }: EmployeeResponse) => {
        const canEdit = showEditor(employeeId, status);

        return <div className={classes.commentCell} >
          {canEdit && <Editor {...props} {...{ field: `${taskId}.${COMMENTS_FIELD}.${employeeId}`, employeeId }} /> }
          {!canEdit && (assigneeComments[employeeId] ?? EMPTY_VALUE_PLACEHOLDER)}
        </div>;
      })}
    </OverflowingContent>
  </>);
};
