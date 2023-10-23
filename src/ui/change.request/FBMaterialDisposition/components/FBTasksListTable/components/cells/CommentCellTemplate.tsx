import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { COMMENTS_FIELD, EMPLOYEE_RESPONSE_FIELD } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem, employeeCommentUpdates }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps } = useFormikContext();
  const classes = styles();
  const employeeResponse = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const { taskId } = dataItem;
  const onBlur = () => {
    const value = get(values, field, '');
    !isEmpty(value) && employeeCommentUpdates?.(taskId, employeeResponse);
  };
  return (
    <FormikField
      name={field}
      className={classes.commentCell}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        type="text"
        size="small"
        onBlur={onBlur}
      />
    </FormikField>
  );
};

export const CommentCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem } = props;

  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const assigneeComments = dataItem.employeeResponse?.reduce((empObj, emp) => ({
    ...empObj,
    [emp.employeeId]: emp.comment,
  }), {});

  return (<>
    <OverflowingContent>
      {assigneList?.map(({ employeeId }) => {
        return <div className={classes.commentCell} >
          {(isEmpty(assigneeComments[employeeId])) && <Editor {...props} {...{ field: `${COMMENTS_FIELD}.${employeeId}` }} /> }
          {(!isEmpty(assigneeComments[employeeId])) && assigneeComments[employeeId]}
        </div>;
      })}
    </OverflowingContent>
  </>);
};
