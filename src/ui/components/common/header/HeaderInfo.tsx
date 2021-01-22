import { Chip, Grid, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType";
import { isDocumentRevisionCanceled, isDocumentRevisionInStatus } from "../../../documentRevision/helpers/documentRevisionStatus";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentStatus, useTitle } from "../../../hooks/docCustomization/useCustomization";
import Text from "../../Text";
import { styles } from "./HeaderInfo.styles";

export interface Props {
  status: string;
  id: string;
  name: string;
  revisionChangeType?: RevisionChangeType;
  subRevision?: number;
  documentTypeId?: string;
  revisionStage?: number;
  groupOptions?: DocumentGroupOptionsType[];
  isInlineApproval?: boolean;
  displayStatus?: string;
}

export const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  displayStatus,
}) => {

  const [isStatusVisible,, tooltipConfig] = useDocumentStatus(documentTypeId, status);
  const [isTitleVisible] = useTitle(documentTypeId);
  const classes = styles();
  const isStatusReleased = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
    status as DocumentRevisionStatus,
  );
  const isStatusCanceled = isDocumentRevisionCanceled(status);

  const statusIcon =
    <div className={classNames(classes.statusIconDefault, {
      [classes.statusIconReleased]: isStatusReleased,
      [classes.statusIconCanceled]: isStatusCanceled,
    })} />;

  return (
    <Grid item xs={6} className={classes.itemWrap} >
      {
        isStatusVisible &&
          <CustomLabelTooltip {...{ tooltipConfig }}>
            <Chip
              label={<Text message={displayStatus} />}
              id="HeaderInfo-status"
              data-cy="HeaderInfo-status"
              className={classNames(classes.statusDefault)}
              icon={statusIcon}
            />
          </CustomLabelTooltip>
      }
      <Typography variant="h6" id="HeaderInfo-docId" className={classes.id} component="span">
        {id}
      </Typography>
      {
        isTitleVisible &&
        <Typography variant="h6" id="HeaderInfo-name" component="span">
          {name}
        </Typography>
      }
    </Grid>
  );
};

export default HeaderInfo;
