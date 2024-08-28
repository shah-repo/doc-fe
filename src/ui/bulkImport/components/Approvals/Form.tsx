/* eslint-disable */
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Box, FormControl, IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { getApprovers, setIsLoading } from '../../../../state/ducks/bulkImport/actions';
import { baseApprovalFieldId } from "../../../../state/ducks/bulkImport/constants";
import { getApproversSelectList, getBulkImport } from '../../../../state/ducks/bulkImport/selectors';
import { ApproverOption } from '../../../../state/ducks/bulkImport/types';
import { patchDocumentRevisions, postApprovals, postDocumentRevisionsInReview } from "../../../../state/ducks/bulkImport/utils";
import Text from '../../../components/Text';
import { Autocomplete } from '../../../components/forms/fields-next';
import { BULK_IMPORT_PROGRESS_URL } from '../../../constants/urls';
import { FB } from "../../../form.builder";
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
  const availableOptions: ApproverOption[] = approversOptionList.filter(option =>
    !users.some(user => user.value === option.value),
  );

  const handleSubmit = async () => {
    if (!users || users.length === 0) return;
  
    dispatch(setIsLoading(true));
  
    try {
      // Process each user sequentially
      for (const user of users) {
        const approvalFieldId = `${baseApprovalFieldId}${FB.uniqid}`
        const approval = await processUserApproval(user.value, bulkImport?.documentRevisionId, approvalFieldId);
        if (approval) {
          await updateDocumentRevision(approval.id, bulkImport?.documentRevisionId, approvalFieldId);
        }
      }
  
      // After all approvals are processed, start the final review
      await submitDocumentForReview(bulkImport?.documentRevisionId);
  
      // Navigate to the bulk import progress page
      history.push(BULK_IMPORT_PROGRESS_URL);
    } catch (error) {
      console.error('An error occurred during the document revision process:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  
  // Function to handle user approval and return the approval result
  const processUserApproval = async (approvalId, documentRevisionId, approvalFieldId) => {
    try {
      return await postApprovals(approvalId, documentRevisionId, approvalFieldId);
    } catch (error) {
      console.error(`Failed to post approval for user with approval ID ${approvalId}:`, error);
      return null;
    }
  };
  
  // Function to update document revision with the approval ID
  const updateDocumentRevision = async (approvalId, documentRevisionId, approvalFieldId) => {
    try {
      await patchDocumentRevisions(approvalId, documentRevisionId, approvalFieldId);
    } catch (error) {
      console.error(`Failed to update document revision for approval ID ${approvalId}:`, error);
    }
  };
  
  // Function to submit the document for final review
  const submitDocumentForReview = async (documentRevisionId) => {
    try {
      await postDocumentRevisionsInReview(documentRevisionId);
    } catch (error) {
      console.error(`Failed to submit document revision ID ${documentRevisionId} for review:`, error);
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
                  options={availableOptions}
                  getOptionLabel={(option) => option.text}
                  placeholder={translate('bulkImport.approvals.select.placeholder')}
                  onChange={(_, option: ApproverOption) => {
                    if (option?.value) {
                      const selectedUser = approversOptionList.find(user => user.value === option.value);
                      if (selectedUser) {
                        setUsers([...users, selectedUser]);
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
