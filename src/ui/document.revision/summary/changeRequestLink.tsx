import { Box, ListItem, Tooltip, Typography } from '@material-ui/core';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { stripTags } from '../../../common/utils/helpers';
import { DataProps } from '../../../state/ducks/common/types';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevision, IAssociatedChangeRequest } from '../../../state/ducks/documentRevisions/types';
import ChangeRequestEditDialog from '../../change.request/dialogs/ChangeRequestEditDialog';
import { changeRequestEditPath } from '../../change.request/utils/paths';
import Text from '../../components/Text';
import { FormHeaderContext } from '../../documentRevision/forms/DocumentRevisionForm.container';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import AllApprovalRequestsButton from './allApprovalRequestsButton';
import useStyles from './changeRequestLink.styles';

type Props = DataProps<DocumentRevision>;

const ChangeRequestLink: React.FunctionComponent<Props> = ({ dataProp }) => {
  const [associatedChangeRequests, setAssociatedChangeRequests] = useState<IAssociatedChangeRequest[]>([]);

  const getAllApprovalRequestsAsync = useAsync({
    onSuccess: (data: IAssociatedChangeRequest[] | undefined) => {
      if (data && data.length > 0) {
        setAssociatedChangeRequests(data);
        if (!dataProp.changeRequest || !dataProp.changeRequest.id) {
          dispatch(documentRevisionsActions.reload(dataProp?.id));
        }
      }
    },
  });
  const getAllApprovalRequests = useActionCreator(
    documentRevisionsActions.getAllApprovalRequests,
  );

  useEffect(() => {
    if (dataProp?.id) {
      getAllApprovalRequestsAsync.start(
        getAllApprovalRequests,
        dataProp.id,
        getAllApprovalRequestsAsync,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProp?.id]);

  const { documentRevision } = React.useContext(FormHeaderContext) ?? {};
  let changeRequest = dataProp.changeRequest;
  if (documentRevision && !changeRequest) {
    changeRequest = documentRevision.changeRequest;
  }

  const classes = useStyles();

  const approvalRequestDialog = useDialog();
  const dispatch = useDispatch();

  if (!changeRequest) {
    return null;
  }

  const openChangeRequestDialog = () => {
    approvalRequestDialog.open();
  };

  const closeCRDialog = () => {
    approvalRequestDialog.close();
    dispatch(documentRevisionsActions.reload(dataProp?.id));
  };

  return (
    <ListItem className={classes.listItemPadding}>
      <Typography variant="h6">
        <Box className={classes.arLinkContainer}>
          <Text translation="common.crid" />:&nbsp;
          <span className={classes.linkContainer}>
            <Link
              to={changeRequestEditPath(changeRequest.id)}
              target="_blank"
              id="ChangeRequestLink-linkButton"
              className={classes.link}
            >
              <Tooltip title={stripTags(changeRequest.description)} id="ChangeRequestLink-tootlip" >
                <span>{changeRequest.crId}</span>
              </Tooltip>
            </Link>
            <VisibilityOutlinedIcon
              className={classes.viewIcon}
              onClick={openChangeRequestDialog} />
            {
              associatedChangeRequests.length > 0
                && <AllApprovalRequestsButton associatedChangeRequests={associatedChangeRequests} />
            }
          </span>
        </Box>
      </Typography>
      {
        approvalRequestDialog.isOpen
        && <ChangeRequestEditDialog
          changeRequestId={changeRequest?.id}
          approvalRequestDialog={approvalRequestDialog}
          closeDialog = {closeCRDialog}
        />
      }
    </ListItem>
  );
};

export default ChangeRequestLink;
