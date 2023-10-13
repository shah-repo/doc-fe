import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { FormikField, TextField } from '../../../../../../components/forms/fields-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { ASSIGNED_TO_FIELD, ASSIGNEE_ACTIONS_FIELD, COMMENTS_FIELD } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  const classes = styles();

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
      />
    </FormikField>
  );
};

export const CommentCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem } = props;

  const assigneList = get(dataItem, ASSIGNED_TO_FIELD, []);
  const assigneeActions = get(dataItem, ASSIGNEE_ACTIONS_FIELD, []);
  const assigneeComments = get(dataItem, COMMENTS_FIELD, {});

  return (<>
    {assigneList?.map(({ value: id }) => {
      return <>
        {(!assigneeActions.includes(id))
          ? <Editor {...props} {...{ field: `${dataItem.id}.${COMMENTS_FIELD}.${id}` }} />
          : <OverflowingContent> <div className={classes.commentCell} >{assigneeComments[id]}</div></OverflowingContent>}
      </>;
    })}
  </>);
};
