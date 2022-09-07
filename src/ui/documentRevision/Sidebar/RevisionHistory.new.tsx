import {
  Avatar,
  Box,
  LinearProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { AsyncStatus } from "../../../state/types";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { FBMapWrapper } from "../../form.builder";
import Colors from "../../layout/theme/utils/colors";
import styles from "./styles.new";

interface SidebarPresenterProps {
  documentId: string;
  changeRequests: ChangeRequest[];
}

const RevisionHistory: React.FunctionComponent<SidebarPresenterProps> = ({ documentId, changeRequests }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const loadDocumentAction = useCallback(() => {
    documentId && dispatch(documentRevisionsActions.loadDocument(documentId));
  }, [dispatch, documentId]);
  useEffect(() => {
    loadDocumentAction();
  }, [loadDocumentAction, documentId]);
  const loadAsyncState = useSelector(documentRevisionsSelectors.getLoadDocumentAsyncState);
  const loading = ![AsyncStatus.Success, AsyncStatus.Error].includes(loadAsyncState.status);
  return (
    <Box>
      {loading && <LinearProgress style={{ width: "100%" }} />}
      <FBMapWrapper collection={changeRequests || []}>
        {(changeRequest, index) => {
          if (!changeRequest) {
            return null;
          }
          return (
            <Box key={`${changeRequest.id}-${index}`} className={classes.changeContainer}>
              <ListItem
                alignItems="flex-start"
                className={classes.listItem}
              >
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    alt={changeRequest.owner.user.name}
                    src={changeRequest.owner.user.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography className={classes.generalInfo}>
                      {changeRequest.owner.user.name}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        className={classes.secondaryText}
                      >
                        <DateTime
                          value={changeRequest.createdAt as string}
                        />
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Box mt={1.875}>
                <Box color={Colors.font_gray} fontSize={12}>
                  <Text translation="common.crid" />
                </Box>
                <Link
                  to={changeRequestEditPath(changeRequest.id)}
                  target="_blank"
                  id="ChangeRequestLink-docRev-linkButton"
                  className={classes.linkButton}
                >
                  <span>{changeRequest.crId}</span>
                </Link>
              </Box>
              <Box mt={1.875}>
                <Box color={Colors.font_gray} fontSize={12}>
                  <Text translation="cr.title" />
                </Box>
                <Box color={Colors.almost_black} fontSize={14}>
                  {changeRequest.title}
                </Box>
              </Box>
              <Box mt={1.875}>
                <Box color={Colors.font_gray} fontSize={12}>
                  <Text translation="form.builder.description.of.change" />
                </Box>
                <Box color={Colors.almost_black} fontSize={14}>
                  {changeRequest.formInput.documentRevisions.map(
                    (e) => e.descriptionOfChange
                  )}
                </Box>
              </Box>
              <Box mt={1.875}>
                <Box color={Colors.font_gray} fontSize={12}>
                  <Text translation="form.builder.justification.of.change" />
                </Box>
                <Box color={Colors.almost_black} fontSize={14}>
                  {changeRequest.formInput?.documentRevisions.map(
                      (e) => e.justificationOfChange
                    )}
                </Box>
              </Box>
            </Box>
          );
        }}
      </FBMapWrapper>
    </Box>
  );
};

export default RevisionHistory;
