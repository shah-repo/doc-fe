import {
  Box,
  Grid,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as FMIcon } from "../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../assets/images/MPI.svg";
import { ReactComponent as ApprovalIcon } from "../../../assets/images/pending_approval.svg";
import { ReactComponent as POIcon } from "../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../assets/images/SOP.svg";
import { ReactComponent as TrainingIcon } from "../../../assets/images/training.svg";
import {
  RecentItems,
} from "../../../state/ducks/dashboard.new/recents/types";
import { changeRequestEditPath } from "../../../ui/change.request/utils/paths";
import { documentVersionPath } from "../../../ui/document.revision/utils/paths";
import ApprovalTitle from "../line.items/common/ApprovalTitle/presenter";
import DocId from "../line.items/common/DocId/presenter";
import { StyledListItem } from "../line.items/common/StyledListItem";
import {
  DocTypeGroups,
} from "../line.items/common/types";
import { styles } from "./Recents.item.styles";

const RecentsLineItem: React.FunctionComponent<RecentItems> = ({
  itemId,
  docId,
  docRevId,
  itemType,
  docTypeGroup,
  docTitle,
  accessedAt,
}) => {
  const classes = styles();
  const getIcon = (docTypeGroup: DocTypeGroups) => {
    switch (docTypeGroup) {
      case DocTypeGroups.CHANGE_REQUEST:
        return <ApprovalIcon height={30} width={30} />;
      case DocTypeGroups.PO:
        return <POIcon height={30} width={30} />;
      case DocTypeGroups.PI:
        return <MPIIcon height={30} width={30} />;
      case DocTypeGroups.FORM:
        return <FMIcon height={30} width={30} />;
      case DocTypeGroups.SUPPLIER:
        return <SOPIcon height={30} width={30} />;
      case DocTypeGroups.TRAINING_CURRICULUM:
        return <TrainingIcon height={30} width={30} />;
      default:
        return <SOPIcon height={30} width={30} />;
    }
  };
  return (
    <StyledListItem
      button
      divider
      disableRipple
      className={classes.buttoncursor}
    >
      <ListItemIcon>
        <>{getIcon(docTypeGroup)}</>
      </ListItemIcon>
      <ListItemText
        primary={
          <Grid
            container={true}
            wrap="nowrap"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item={true}>
              {docTypeGroup === DocTypeGroups.CHANGE_REQUEST && (
                <DocId url={changeRequestEditPath(itemId)}  docId={docId}/>
              )}
              {docTypeGroup !== DocTypeGroups.CHANGE_REQUEST && (
                <DocId url={documentVersionPath(docRevId || "", itemId)}  docId={docId}/>
              )}
            </Grid>
            <Grid zeroMinWidth item={true} className={classes.truncateText}>
              {docTypeGroup === DocTypeGroups.CHANGE_REQUEST && (
                <ApprovalTitle url={changeRequestEditPath(itemId)} title={docTitle}/>
              )}
              {docTypeGroup !== DocTypeGroups.CHANGE_REQUEST && (
                <ApprovalTitle url={documentVersionPath(docRevId || "", itemId)} title={docTitle}/>
              )}
            </Grid>
            <Grid
              item={true}
              className={`${classes.ml5}`}
            >
              <Box
                className={`${classes.blackDot}`}>
              </Box>
            </Grid>
            <Grid item={true}>
              <Typography
                component="span"
                variant="caption"
                className={`${classes.timestampContainer} ${classes.ml5}`}
                color="textSecondary"
                noWrap
              >
                {accessedAt}
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </StyledListItem>
  );
};

export default RecentsLineItem;
