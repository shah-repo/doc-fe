import { Chip, Grid, Link, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { documentTypeSelectors } from "../../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupOptionsType } from "../../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus, RevisionChangeType } from "../../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../../state/reducers";
import { FormHeaderStatusClassMapping } from "../../../../../ui/components/common/kendo/helpers";
import Text from "../../../../../ui/components/Text";
import { checkIsDocumentMPIOutput } from "../../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionCanceled, isDocumentRevisionInStatus } from "../../../../../ui/documentRevision/helpers/documentRevisionStatus";
import CustomLabelTooltip from "../../../../../ui/hooks/docCustomization/CustomLabelTooltip";
import { useDocumentStatus, useTitle } from "../../../../../ui/hooks/docCustomization/useCustomization";
import { styles } from "./HeaderInfo.styles";
import { StyledBreadcrumb } from "./StyledBreadcrumb";

interface NavigationDetails {
  label: string;
  path: string;
  icon: string;
}

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
  displayRevision?: string;
  navigationDetails?: NavigationDetails;
  subtitle?: any;
}

const NewHeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  displayStatus,
  navigationDetails,
  displayRevision,
  subtitle,
}) => {

  const classes = styles({ iconLink: navigationDetails?.icon });
  const { isVisible: isStatusVisible, tooltipConfig, label } = useDocumentStatus(documentTypeId, status);
  const { isVisible: isTitleVisible } = useTitle(documentTypeId);
  const isStatusReleased = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
    status as DocumentRevisionStatus,
  );
  const isStatusCanceled = isDocumentRevisionCanceled(status);
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ""));
  const isTypeMpiOutput = checkIsDocumentMPIOutput(documentType?.groupOptions);

  const titleRendererOld = () => {
    const stepRegex = /Step #[0-9]+/;
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

  const history = useHistory();
  const returnToList = () => {
    history.push(navigationDetails?.path);
  };

  const titleRenderer = () => (
    <StyledBreadcrumb separator="›">
      <Typography className={classes.groupSection}>
        <Grid
          container={true}
          wrap="nowrap"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item={true} className={classes.itemIcon}>
            <div className={classes.icon} />
          </Grid>
          <Link
            underline="hover"
            onClick={returnToList}
            className={classes.link}
          >
            <Grid item={true} className={classes.title}>
              {navigationDetails?.label}
            </Grid>
          </Link>
        </Grid>
      </Typography>
      <Typography id="HeaderInfo-docId" className={classes.id}>
        <Grid
          container={true}
          wrap="nowrap"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item={true} className={classes.minWidthSpace}>
            {titleRendererOld()}
            {isTitleVisible && (
              <Typography
                variant="h6"
                id="HeaderInfo-name"
                component="span"
                className={classes.id}
              >  &nbsp;
                {name}
                 &nbsp;
              </Typography>)}
            {subtitle && (
              <Typography
                variant="subtitle1"
                id="HeaderInfo-subtitle"
                component="p"
                className={classes.subTitleLink}
              >
                {subtitle}
              </Typography>
            )}
          </Grid>
          &nbsp;
          <Grid item={true} className={classes.whiteDot}></Grid>&nbsp;
          <Grid item={true}>
            <Text
              translation="form.builder.header.rev"
              values={{ revision: displayRevision }}
            />
          </Grid>
          {isStatusVisible && <Grid item={true}>
            <CustomLabelTooltip {...{ tooltipConfig }}>
              <Chip
                size="small"
                className={`${classes.chip} ${
                  classes[
                    FormHeaderStatusClassMapping[displayStatus || label || ""]
                  ]
                }`}
                icon={statusIcon}
                label={displayStatus || label}
              />
            </CustomLabelTooltip>
          </Grid>}
        </Grid>
      </Typography>
      )
    </StyledBreadcrumb>
  );

  return (
    <Grid container xs={6} className={classes.itemWrap} >
      <Grid item>
        <Grid item xs={12}>
          {titleRenderer()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewHeaderInfo;

