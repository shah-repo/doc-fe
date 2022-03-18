import { Chip, Grid, Link, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { companySelectors } from "../../../../state/ducks/company";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { DOCUMENT_BY_CATEGORY_ROOT_URL, DOCUMENT_REVISION_LIST_URL } from "../../../constants/urls";
import { checkIsDocumentMPIOutput } from "../../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionCanceled, isDocumentRevisionInStatus } from "../../../documentRevision/helpers/documentRevisionStatus";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentStatus, useTitle } from "../../../hooks/docCustomization/useCustomization";
import Text from "../../Text";
import { FormHeaderStatusClassMapping } from "./Header";
import { styles } from "./HeaderInfo.styles";
import { StyledBreadcrumb } from "./StyledBreadcrumb";

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
  displayRevision?: string;
  newVariant?: boolean;
}

const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  displayStatus,
  subtitle,
  displayRevision,
  newVariant = false,
}) => {
  const intl = useIntl();
  const { isVisible: isStatusVisible, tooltipConfig, label } = useDocumentStatus(documentTypeId, status);
  const { isVisible: isTitleVisible } = useTitle(documentTypeId);
  const isStatusReleased = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
    status as DocumentRevisionStatus,
  );
  const isStatusCanceled = isDocumentRevisionCanceled(status);
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ""));
  const navigationDetails = useSelector((state: ApplicationState) =>
    companySelectors.getNavigationDetails(
      state,
      documentType?.pageDetails?.category || ""
    )
  );
  const title = navigationDetails?.label || intl.formatMessage({ id: "navigation.document.list" });
  let url = `${DOCUMENT_REVISION_LIST_URL}`;
  let iconLink = "/navigation_icons/document.svg";
  if (navigationDetails.type === "CATEGORY") {
    url = `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${documentType?.pageDetails?.category}`;
    iconLink = navigationDetails?.icon || "";
  }
  const classes = styles({ iconLink });
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

  const oldHeaderRenderer = () => (
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
    history.push(url);
  };
  const newHeaderRenderer = () => (
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
                    {title}
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
    <>{newVariant ? newHeaderRenderer() : oldHeaderRenderer()}</>
  );
};

export default HeaderInfo;
