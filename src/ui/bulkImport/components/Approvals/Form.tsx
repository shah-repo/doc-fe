/* eslint-disable */
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Box, FormControl, IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import cx from 'classnames';
import { Form, Formik } from 'formik';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { getApprovers, getOneBulkImport, setIsLoading } from '../../../../state/ducks/bulkImport/actions';
import { baseApprovalFieldId } from "../../../../state/ducks/bulkImport/constants";
import { getApproversSelectList, getBulkImport } from '../../../../state/ducks/bulkImport/selectors';
import { ApproverOption } from '../../../../state/ducks/bulkImport/types';
import { abandonApproval, patchDocumentRevisions, postApprovals, postDocumentRevisionsInReview, postDocumentRevisionsWithdrawn } from "../../../../state/ducks/bulkImport/utils";
import { ApprovalStatus } from "../../../../state/ducks/common/types";
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
  const haveApprovers = bulkImport?.documentRevision?.approvals
    && bulkImport.documentRevision.approvals.some(approval => approval.status === ApprovalStatus.Pending);

  const handleSubmit = async () => {
    if (!users || users.length === 0) return;
  
    dispatch(setIsLoading(true));
    let hasError = false;
  
    try {
      // Process each user sequentially
      for (const user of users) {
        const approvalFieldId = `${baseApprovalFieldId}${FB.uniqid}`
        const approval = await postApprovals(user.value, bulkImport?.documentRevisionId, approvalFieldId);
        if (approval) {
          const documentRevision = await patchDocumentRevisions(approval.id, bulkImport?.documentRevisionId, approvalFieldId);
          if (!documentRevision) {
            hasError = true;
            await abandonApproval(approval.id)
            break;
          }
        } else {
          hasError = true;
          break;
        }
      }

      if (hasError) {
        toastError('An error occurred during the approval process.');
        return;
      }
  
      // After all approvals are processed, start the final review
      await postDocumentRevisionsInReview(bulkImport?.documentRevisionId);
  
      // Navigate to the bulk import progress page
      history.push(BULK_IMPORT_PROGRESS_URL);
    } catch (error) {
      console.error('An error occurred during the document revision process:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleRemoveUser = (index: number) => {
    setUsers(currentUsers => currentUsers.filter((_, i) => i !== index));
  };

  const handleWithdrawSubmission = async () => {
    if (bulkImport?.documentRevision?.approvals) {
      const pendingApprovals = bulkImport.documentRevision.approvals.filter(
        approval => approval.status === ApprovalStatus.Pending
      );
  
      const results = await Promise.all(
        pendingApprovals.map(approval => abandonApproval(approval.id))
      );
  
      const allSuccessful = results.every(result => result === true);
  
      if (allSuccessful) {
        await postDocumentRevisionsWithdrawn(bulkImport?.documentRevision?.id);
      } else {
        toastError('One or more approvals could not be abandoned.');
      }
      dispatch(getOneBulkImport(bulkImport.id));
    }
  };

  const init = () => {
    dispatch(getApprovers());
  };

  useEffect(init, []);

  useEffect(() => {
    if (haveApprovers) {
      const matchedApprovers = bulkImport.documentRevision.approvals
        .filter(approval => approval.status === ApprovalStatus.Pending)
        .map(approval => approversOptionList.find(option => option.value === approval.approverId))
        .filter(Boolean) as ApproverOption[]; // Filter out any undefined values
      
      setUsers(matchedApprovers);
    }
  }, [haveApprovers, bulkImport, approversOptionList]);

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
                      const selectedUser = approversOptionList.find(user => user.value === option.value);
                      if (selectedUser) {
                        setUsers([...users, selectedUser]);
                        setFieldValue('selectedUser', '');
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
