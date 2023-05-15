import { Chip, Grid, Link, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SM from "../../../../App/Shifamed/Utils/SM/SM";
import { ReactComponent as ArrowIcon } from "../../../../assets/images/breadcrumb_arrow.svg";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { companySelectors } from "../../../../state/ducks/company";
import { STATUS_TYPES_LABEL } from "../../../../state/ducks/dashboard.new/my.feeds/types";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus, RelatedParentPartDetails, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { CHANGE_REQUEST_LIST_URL, DOCUMENT_BY_CATEGORY_ROOT_URL, DOCUMENT_REVISION_LIST_URL } from "../../../constants/urls";
import { DocCategories, DocTypeGroups } from "../../../dashboard.new/line.items/common/types";
import { documentPreviewPath } from "../../../document.revision/utils/paths";
import { checkIsDocumentEquipment, checkIsDocumentMPIOutput, checkIsDocumentPO } from "../../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionCanceled, isDocumentRevisionInStatus } from "../../../documentRevision/helpers/documentRevisionStatus";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentStatus, useTitle } from "../../../hooks/docCustomization/useCustomization";
import useGetHasTag from "../../../hooks/useGetHasTag";
import Text from "../../Text";
import { styles } from "./HeaderInfo.styles";
import { FormHeaderStatusClassMapping } from "./Helpers";
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
  relatedParentPartDetails?: RelatedParentPartDetails;
  documentTypeAcronym?: string;
}

const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  displayStatus,
  subtitle,
  displayRevision,
  relatedParentPartDetails,
  documentTypeAcronym,
}) => {

  const intl = useIntl();
  const { _documentRevisionFormState } = SM.useStores();
  const { isVisible: isStatusVisible, tooltipConfig, label } = useDocumentStatus(documentTypeId, status);
  const { isVisible: isTitleVisible } = useTitle(documentTypeId);
  const isStatusReleased = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
    status as DocumentRevisionStatus,
  );
  const isStatusCanceled = isDocumentRevisionCanceled(status);
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ""));
  const isPO = checkIsDocumentPO(documentType?.groupOptions);
  const isTypeMpiOutput = checkIsDocumentMPIOutput(documentType?.groupOptions);
  const navigationDetails = useSelector((state: ApplicationState) =>
    companySelectors.getNavigationDetails(
      state,
      documentType?.pageDetails?.category || ""
    )
  );
  const isEquipmentDocument = checkIsDocumentEquipment(documentType?.groupOptions);
  const getRoute = () => {
    let title;
    if (SM.isNewCRLayout) {
      title = intl.formatMessage({ id: "page.table.title.changeRequest" });
    } else if (isTypeMpiOutput) {
      title = DocTypeGroups.LHR;
    } else if (isEquipmentDocument) {
      title = intl.formatMessage({ id: "form.builder.equipment" });
    } else if (documentTypeAcronym) {
      title = documentTypeAcronym;
    }
    else if (SM.isNewLayout) {
      title = intl.formatMessage({ id: "navigation.document.list" });
    }
    return title;
  };
  const title = navigationDetails?.label || getRoute();
  let url = `${DOCUMENT_REVISION_LIST_URL}`;
  let iconLink = "/navigation_icons/document.svg";
  if (navigationDetails.type === "CATEGORY") {
    url = `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${documentType?.pageDetails?.category}`;
    iconLink = navigationDetails?.icon || "";
  }
  if (isEquipmentDocument) {
    url = `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${documentType?.pageDetails?.category}`;
    iconLink = "/navigation_icons/microscope.svg";
  }
  if (SM.isNewCRLayout || documentTypeAcronym) {
    url = `${CHANGE_REQUEST_LIST_URL}`;
    iconLink = "/navigation_icons/change-order.svg";
  } else if (isTypeMpiOutput) {
    url = `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${DocCategories.LHR}`;
    iconLink = "/navigation_icons/lhr_icon.svg";
  }
  const classes = styles({ iconLink });

  const titleRenderer = (className: string) => {
    const stepRegex = /Step #[0-9]+/;
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const mpiOutputTitle = name.match(stepRegex);

    return isTypeMpiOutput && mpiOutputTitle ?
      <Typography variant="h6" data-cy="HeaderInfo-docId" className={className} component="span">
        {mpiOutputTitle[0]}
      </Typography> :
      <Typography variant="h6" data-cy="HeaderInfo-docId" className={className} component="span">
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
            <Typography variant="h6" id="HeaderInfo-name" component="span" data-cy="HeaderInfoName">
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

  const viewDocument = () => {
    if (!relatedParentPartDetails?.docRevId || !relatedParentPartDetails?.documentId) {
      return;
    }

    const urlPath = documentPreviewPath(
      relatedParentPartDetails?.docRevId, relatedParentPartDetails?.documentId);
    history.push(urlPath);
  };

  const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);
  let headerInfoStatus = (displayStatus || STATUS_TYPES_LABEL[status] || label).toUpperCase();
  if (isPO && isStatusReleased) {
    if (isUserAdminEnforce && SM.isNewVersion) {
      headerInfoStatus = STATUS_TYPES_LABEL.EDIT;
      _documentRevisionFormState?.setDirty(true);
    } else {
      headerInfoStatus = STATUS_TYPES_LABEL.APPROVED;
    }
  }


  const newHeaderRenderer = () => (
    <Grid item xs={6} className={classes.itemWrap}>
      <Grid item>
        <Grid item xs={12}>
          <StyledBreadcrumb separator={<ArrowIcon />}>
            <Typography className={classes.groupSection} component="div">
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.itemIcon}>
                  <div data-cy="Header-listIcon" className={classes.icon} />
                </Grid>
                {
                  !isTypeMpiOutput && !relatedParentPartDetails && <Link
                    underline="hover"
                    onClick={returnToList}
                    className={classes.link}
                  >
                    <Grid item={true} data-cy="Header-listTitle" className={classes.title}>
                      {title}
                    </Grid>
                  </Link>   // need to remove this link for Approval Request modal
                }
                {
                  isTypeMpiOutput &&
                  <Link
                    underline="hover"
                    onClick={returnToList}
                    className={classes.link}
                  >
                    <Grid item={true} data-cy="Header-listTitle" className={classes.mpiTitle}>
                      {title}
                    </Grid>
                  </Link>
                }
                {
                  relatedParentPartDetails && relatedParentPartDetails.parentDocId && <Link
                    underline="hover"
                    onClick={viewDocument}
                    className={classes.link}
                  >
                    <Grid item={true} className={classes.title}>
                      {relatedParentPartDetails.parentDocId}
                    </Grid>
                  </Link>
                }
              </Grid>
            </Typography>
            <Typography data-cy="HeaderInfo" className={classes.breadcrumbId} component="div">
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.minWidthSpace}>
                  { !isTypeMpiOutput && titleRenderer(classes.breadcrumbId)}
                  {subtitle && (
                    <Typography
                      variant="subtitle1"
                      id="HeaderInfo-subtitle"
                      component="p"
                      className={classes.subTitleLink}
                      style={{ display: "inline-flex" }}
                    >
                      {!isTypeMpiOutput && <span className={classes.spaceLinePadding}> - </span>}
                      {subtitle}
                    </Typography>
                  )}
                </Grid>
                &nbsp;
                {displayRevision && <> <Grid item={true} className={classes.whiteDot}></Grid>&nbsp;
                  <Grid item={true}>
                    <Text
                      translation="form.builder.header.rev"
                      values={{ revision: displayRevision }}
                      dataCy="HeaderInfo-Rev"
                    />
                  </Grid> </>}
                { isTypeMpiOutput &&
                  <>
                    <Grid item={true} className={classes.arrowPadding}>
                      <ArrowIcon />
                    </Grid>&nbsp;
                    <Typography className={classes.breadcrumbId}>
                      { isTypeMpiOutput && titleRenderer(classes.breadcrumbId)}
                    </Typography>
                  </>
                }
                {isStatusVisible && <Grid item={true}>
                  <CustomLabelTooltip {...{ tooltipConfig }}>
                    <Chip
                      size="small"
                      className={`${classes.chip} ${
                        classes[
                          FormHeaderStatusClassMapping[displayStatus || status || label || ""]
                        ]
                      }`}
                      label={headerInfoStatus}
                      data-cy="HeaderInfo-status"
                    />
                  </CustomLabelTooltip>
                </Grid>}
              </Grid>
            </Typography>
          </StyledBreadcrumb>
        </Grid>
      </Grid>
    </Grid>
  );
  return (
    <>{(SM.isNewCRLayout || SM.isNewLayout) ? newHeaderRenderer() : oldHeaderRenderer()}</>
  );
};

export default HeaderInfo;
