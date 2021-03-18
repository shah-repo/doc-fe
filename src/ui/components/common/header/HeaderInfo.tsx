import { Chip, Grid, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { checkIsTypeMpiOutput } from "../../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionCanceled, isDocumentRevisionInStatus } from "../../../documentRevision/helpers/documentRevisionStatus";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentStatus, useTitle } from "../../../hooks/docCustomization/useCustomization";
import Text from "../../Text";
import { styles } from "./HeaderInfo.styles";

interface Props {
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
  subtitle?: any;
}

const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  displayStatus,
  subtitle,
}) => {

  const { isVisible: isStatusVisible, tooltipConfig, label } = useDocumentStatus(documentTypeId, status);
  const { isVisible: isTitleVisible } = useTitle(documentTypeId);
  const classes = styles();
  const isStatusReleased = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
    status as DocumentRevisionStatus,
  );
  const isStatusCanceled = isDocumentRevisionCanceled(status);
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ""));
  const isTypeMpiOutput = checkIsTypeMpiOutput(documentType.groupOptions);

  const titleRenderer = () => {
    const stepRegex = /(?<=,)(.*?)(?=\()/;
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const mpiOutputTitle = name.match(stepRegex);

    return isTypeMpiOutput && mpiOutputTitle ?
      <Typography variant="h6" id="HeaderInfo-docId" className={classes.id} component="span">
        {mpiOutputTitle[0]}
      </Typography> :
      <Typography variant="h6" id="HeaderInfo-docId" className={classes.id} component="span">
        {id}
      </Typography>;
  };

  const statusIcon =
    <div className={classNames(classes.statusIconDefault, {
      [classes.statusIconReleased]: isStatusReleased,
      [classes.statusIconCanceled]: isStatusCanceled,
    })} />;


  return (
    <Grid container xs={6} className={classes.itemWrap} >
      <Grid item xs={2} className={classes.statusWrap}>
        {
          isStatusVisible &&
          <CustomLabelTooltip {...{ tooltipConfig }}>
            <Chip
              label={<Text message={displayStatus || label} />}
              id="HeaderInfo-status"
              data-cy="HeaderInfo-status"
              className={classNames(classes.statusDefault)}
              icon={statusIcon}
            />
          </CustomLabelTooltip>
        }
      </Grid>
      <Grid item xs={10}>
        <Grid item xs={12}>
          {titleRenderer()}
          {
            isTitleVisible &&
            <Typography variant="h6" id="HeaderInfo-name" component="span">
              {name}
            </Typography>
          }
        </Grid>
        <Grid item xs={12}>
          {
            subtitle &&
            <Typography variant="subtitle1" id="HeaderInfo-subtitle" component="p">
              {subtitle}
            </Typography>
          }
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HeaderInfo;
