import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Box, FormControl, IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { getApprovers, saveApprovals, saveDocumentRevisions, saveDocumentRevisionsInReview, setIsLoading } from '../../../../state/ducks/bulkImport/actions';
import { getApproversSelectList, getBulkImport } from '../../../../state/ducks/bulkImport/selectors';
import { ApproverOption } from '../../../../state/ducks/bulkImport/types';
import { Approval } from '../../../../state/ducks/common/types';
import Text from '../../../components/Text';
import { Autocomplete } from '../../../components/forms/fields-next';
import { BULK_IMPORT_PROGRESS_URL } from '../../../constants/urls';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import StepTitle from '../StepTitle';
import useStyles from './styles';

interface UploadDataProps {
  children?: ReactNode
}

const UploadData: React.FC<UploadDataProps> = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [users, setUsers] = useState<ApproverOption[]>([]);
  const classes = useStyles();
  const bulkImport = useSelector(getBulkImport);
  const approversOptionList = useSelector(getApproversSelectList);
  const saveApprovalsAction = useActionCreator(saveApprovals);
  const saveDocumentRevisionsAction = useActionCreator(saveDocumentRevisions);
  const saveDocumentRevisionsInReviewAction = useActionCreator(saveDocumentRevisionsInReview);
  const asyncDocumentRevisionInReview = useAsync({
    onSuccess: () => {
      history.push({
        pathname: BULK_IMPORT_PROGRESS_URL,
      });
    },
  });
  const asyncDocumentRevision = useAsync({
    onSuccess: () => {
      dispatch(setIsLoading(true));
      asyncDocumentRevisionInReview.start(saveDocumentRevisionsInReviewAction, { documentRevisionId: bulkImport?.documentRevisionId }, asyncDocumentRevisionInReview);
    },
  });
  const asyncApprovals = useAsync({
    onSuccess: (approval?: Approval) => {
      if (approval) {
        dispatch(setIsLoading(true));
        asyncDocumentRevision.start(saveDocumentRevisionsAction, { approvalId: approval.id, documentRevisionId: bulkImport?.documentRevisionId }, asyncDocumentRevision);
      }
    },
  });

  const handleSubmit = () => {
    // Handle form submission and file processing
    if (users && users.length > 0) {
      dispatch(setIsLoading(true));
      asyncApprovals.start(saveApprovalsAction, { approval: users[0].value, documentRevisionId: bulkImport?.documentRevisionId }, asyncApprovals);
    }
  };

  const handleRemoveUser = (index: number) => {
    setUsers(currentUsers => currentUsers.filter((_, i) => i !== index));
  };

  const init = () => {
    dispatch(getApprovers());
  };

  useEffect(init, []);

  return (
    <>
      <StepTitle title="bulkImport.approvals.title" subTitle="bulkImport.approvals.subTitle" />
      <Box className={classes.container}>
        <Formik initialValues={{}} onSubmit={handleSubmit}>
          {({ setFieldValue }) => (
            <Form>
              <Typography variant="h4" className={classes.selectLabel}>
                <Text translation="bulkImport.approvals.approvers" />
              </Typography>
              <FormControl className={`form-control ${classes.formControl}`} id="OwnerChangerPresenter-selectField">
                <Autocomplete
                  name="selectedUser"
                  options={approversOptionList}
                  getOptionLabel={(option) => option.text}
                  placeholder={translate('bulkImport.approvals.select.placeholder')}
                  onChange={(_, option: ApproverOption) => {
                    if (option?.value) {
                      const selectedUser = approversOptionList.find(user => user.value === option.value);
                      if (selectedUser) {
                        setUsers([selectedUser]);
                        setFieldValue('selectedUser', '');
                      }
                    }
                  }} />
              </FormControl>
              {users && <List className={classes.listContainer}>
                {users.map((user, index) => (
                  <ListItem key={index} className={classes.listItem}>
                    <Box className={classes.fileInfo}>
                      {user.avatar ? <Avatar
                        className={classes.avatar}
                        src={user.avatar}
                        alt={user.text}
                      /> : <FontAwesomeIcon
                        className={classes.fileIcon}
                        icon={solid('circle-user')}
                      />}
                      <ListItemText primary={user.text} secondary={user.email} />
                    </Box>
                    <IconButton onClick={() => handleRemoveUser(index)} className={classes.removeIcon}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>}
              {children}
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default UploadData;
