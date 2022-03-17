import { Chip, Grid, Link, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { StyledBreadcrumb } from "../../../../App/Shifamed/Components/forms/header/StyledBreadcrumb";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { checkIsDocumentMPIOutput } from "../../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionCanceled, isDocumentRevisionInStatus } from "../../../documentRevision/helpers/documentRevisionStatus";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentStatus, useTitle } from "../../../hooks/docCustomization/useCustomization";
import Text from "../../Text";
import { FormHeaderStatusClassMapping } from "./Header";
import { styles } from "./HeaderInfo.styles";

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
  subtitle?: any;
  navigationDetails?: NavigationDetails;
  displayRevision?: string;
  newVarient?: boolean;
}

const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  displayStatus,
  subtitle,
  navigationDetails,
  displayRevision,
  newVarient = false,
}) => {

  const { isVisible: isStatusVisible, tooltipConfig, label } = useDocumentStatus(documentTypeId, status);
  const { isVisible: isTitleVisible } = useTitle(documentTypeId);
  const classes = styles({ iconLink: navigationDetails?.icon });
  const isStatusReleased = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
    status as DocumentRevisionStatus,
  );
  const isStatusCanceled = isDocumentRevisionCanceled(status);
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ""));
  const isTypeMpiOutput = checkIsDocumentMPIOutput(documentType?.groupOptions);

  const titleRenderer = (className: string) => {
    const stepRegex = /Step #[0-9]+/;
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const mpiOutputTitle = name.match(stepRegex);

    return isTypeMpiOutput && mpiOutputTitle ?
      <Typography variant="h6" id="HeaderInfo-docId" className={className} component="span">
        {mpiOutputTitle[0]}
      </Typography> :
      <Typography variant="h6" id="HeaderInfo-docId" className={className} component="span">
        {id}
      </Typography>;
  };

  const statusIcon =
    <div className={classNames(classes.statusIconDefault, {
      [classes.statusIconReleased]: isStatusReleased,
      [classes.statusIconCanceled]: isStatusCanceled,
    })} />;

  const oldTitleRenderer = () => (
    <Grid container xs={6} className={classes.itemWrap} >
      <Grid item className={classes.statusWrap}>
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
      <Grid item>
        <Grid item xs={12}>
          {titleRenderer(classes.id)}
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
    </Grid>);

  const history = useHistory();
  const returnToList = () => {
    history.push(navigationDetails?.path);
  };
  const newTitleRenderer = () => (
    <Grid container xs={6} className={classes.itemWrap} >
      <Grid item>
        <Grid item xs={12}>
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
            <Typography id="HeaderInfo-docId" className={classes.breadcrumbId}>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.minWidthSpace}>
                  {titleRenderer(classes.breadcrumbId)}
                  {isTitleVisible && (
                    <Typography
                      variant="h6"
                      id="HeaderInfo-name"
                      component="span"
                      className={classes.breadcrumbId}
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
                      label={displayStatus || label}
                    />
                  </CustomLabelTooltip>
                </Grid>}
              </Grid>
            </Typography>
        )
          </StyledBreadcrumb>
        </Grid>
      </Grid>
    </Grid>

  );
  return (
    <>{newVarient ? newTitleRenderer() : oldTitleRenderer()}</>
  );
};

export default HeaderInfo;
