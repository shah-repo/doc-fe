/* eslint-disable */
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Box, FormControl, IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import cx from 'classnames';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { getApprovers, getOneBulkImport, setIsLoading } from '../../../../state/ducks/bulkImport/actions';
import { approvalFieldPrefix } from "../../../../state/ducks/bulkImport/constants";
import { getApproversSelectList, getBulkImport } from '../../../../state/ducks/bulkImport/selectors';
import { ApproverOption } from '../../../../state/ducks/bulkImport/types';
import { abandonApproval, patchDocumentRevisions, postApprovals, postDocumentRevisionsInReview, postDocumentRevisionsWithdrawn } from "../../../../state/ducks/bulkImport/utils";
import { ApprovalStatus } from "../../../../state/ducks/common/types";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
import Text from '../../../components/Text';
import { Autocomplete, Button } from '../../../components/forms/fields-next';
import { toastError } from "../../../components/notifications";
import { BULK_IMPORT_PROGRESS_URL } from '../../../constants/urls';
import { FB } from "../../../form.builder";
import StepTitle from '../StepTitle';
import useStyles from './styles';

interface ApprovalsFormProps {
  children?: ReactNode
}

const APPROVAL_FIELD_ID = `${approvalFieldPrefix}${FB.uniqid}`;

const ApprovalsForm: React.FC<ApprovalsFormProps> = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [users, setUsers] = useState<ApproverOption[]>([]);
  const classes = useStyles();
  const bulkImport = useSelector(getBulkImport);
  const approversOptionList = useSelector(getApproversSelectList);
  const availableOptions: ApproverOption[] = approversOptionList.filter(option =>
    !users.some(user => user.value === option.value),
  );
  const haveApprovers = bulkImport?.documentRevision && bulkImport?.documentRevision?.status !== DocumentRevisionStatus.Draft;
  const approvalFieldId = useRef(bulkImport?.documentRevision?.approvals?.[0]?.fieldId || APPROVAL_FIELD_ID);

  const handleSubmit = async () => {
    if (!users || users.length === 0) {
      toastError('At least you should select one approver');
      return;
    }
  
    dispatch(setIsLoading(true));
  
    try {
      // After all approvals are processed, start the final review
      await postDocumentRevisionsInReview(bulkImport?.documentRevisionId);
  
      // Navigate to the bulk import progress page
      history.push(BULK_IMPORT_PROGRESS_URL);
    } catch (error) {
      console.error('An error occurred during the document revision process:', error);
      toastError('An error occurred during the document revision process.');
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleRemoveUser = async (index: number) => {
    dispatch(setIsLoading(true));
    // Get the current user based on the index
    const currentUser = users[index];

    if (currentUser) {
      try {
        const response = await abandonApproval(currentUser.approvalId);
        if (response) {
          const newUsers = users.filter((_, i) => i !== index);
          setUsers(newUsers);
    
          // Create an array of the remaining users' values (after removal)
          const approvalIds = newUsers.map(user => user.value);
    
          // Patch the document revisions with the updated list of approvers
          await patchDocumentRevisions(approvalIds, bulkImport?.documentRevisionId, approvalFieldId.current);
          getBulkImportData();
        }
      } catch (error) {
        console.error('An error occurred while removing the user and updating the document revisions:', error);
        toastError('An error occurred during the removal process.');
      } finally {
        dispatch(setIsLoading(false)); // Stop loading
      }
    }
  };

  const addNewUser = async (selectedUser: ApproverOption) => {
    dispatch(setIsLoading(true));
  
    try {
      const newUsers = [...users, selectedUser];
      
      const approval = await postApprovals(selectedUser.value, bulkImport?.documentRevisionId, approvalFieldId.current);
      
      if (approval) {
        // Create an array of users' ids to patch the document revision
        const approvalIds = newUsers.map(val => val.value);
        
        // Patch document revisions with the updated list of approvers
        await patchDocumentRevisions(approvalIds, bulkImport?.documentRevisionId, approvalFieldId.current);
      }
      getBulkImportData();
    } catch (error) {
      console.error('An error occurred while adding a new user and updating the document revisions:', error);
      toastError('An error occurred while adding the new user.');
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleWithdrawSubmission = async () => {
      await postDocumentRevisionsWithdrawn(bulkImport?.documentRevision?.id);
      getBulkImportData();
  };

  const getBulkImportData = () => {
    if (bulkImport?.id) {
      dispatch(getOneBulkImport(bulkImport.id));
    }
  }

  const init = () => {
    dispatch(getApprovers());
  };

  useEffect(init, []);

  useEffect(() => {
    if (bulkImport?.id) {
      const matchedApprovers = bulkImport.documentRevision.approvals
        .filter(approval => approval.status === ApprovalStatus.Pending || approval.status === ApprovalStatus.Draft)
        .map(approval => {
          const approverOption = approversOptionList.find(option => option.value === approval.approverId);
  
          if (approverOption) {
            return {
              ...approverOption,
              approvalId: approval.id,
            };
          }
          return null;
        })
        .filter(Boolean) as ApproverOption[]; // Filter out any undefined values
      
      setUsers(matchedApprovers);
    }
  }, [bulkImport, approversOptionList]);

  return (
    <>
      <StepTitle title="bulkImport.approvals.title" subTitle="bulkImport.approvals.subTitle" />
      <Box className={classes.container}>
        <Formik initialValues={{}} onSubmit={handleSubmit}>
          {({ setFieldValue }) => (
            <Form>
              <Typography
                variant="h4"
                className={cx(classes.selectLabel, {
                  [classes.noMarginBottom]: haveApprovers,
                })}
              >
                <Text translation="bulkImport.approvals.approvers" />
              </Typography>
              {!haveApprovers && <FormControl className={`form-control ${classes.formControl}`} id="OwnerChangerPresenter-selectField">
                <Autocomplete
                  name="selectedUser"
                  options={availableOptions}
                  getOptionLabel={(option) => option.text}
                  placeholder={translate('bulkImport.approvals.select.placeholder')}
                  onChange={(_, option: ApproverOption) => {
                    if (option?.value) {
                      const isAlreadySelected = users.some(user => user.value === option.value);
                      if (!isAlreadySelected) {
                        const selectedUser = approversOptionList.find(user => user.value === option.value);
                        if (selectedUser) {
                          addNewUser(selectedUser);
                          setFieldValue('selectedUser', '');
                        }
                      }
                    }
                  }} />
              </FormControl>}
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
                    {!haveApprovers && <IconButton onClick={() => handleRemoveUser(index)} className={classes.removeIcon}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>}
                  </ListItem>
                ))}
              </List>}
              {!haveApprovers && children}
              {haveApprovers && (
                <Button kind="outlined" className={classes.withdrawSubmission} onClick={handleWithdrawSubmission}>
                  <Text translation="bulkImport.withdrawSubmission" />
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ApprovalsForm;
