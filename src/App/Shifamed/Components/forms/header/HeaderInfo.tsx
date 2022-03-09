import { Chip, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { ReactComponent as MPIIcon } from "../../../../../assets/images/mpi_white.svg";
import { documentTypeSelectors } from "../../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupOptionsType } from "../../../../../state/ducks/documentRevisions/documentType/types";
import { RevisionChangeType } from "../../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../../state/reducers";
import { FormHeaderStatusClassMapping } from "../../../../../ui/components/common/kendo/helpers";
import Text from "../../../../../ui/components/Text";
import { checkIsDocumentMPIOutput } from "../../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { useDocumentStatus } from "../../../../../ui/hooks/docCustomization/useCustomization";
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
  displayRevision?: string;
  group?: string;
  subtitle?: any;
}

const NewHeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  displayStatus,
  group,
  subtitle,
  displayRevision,
}) => {

  const { label } = useDocumentStatus(documentTypeId, status);
  // const { isVisible: isStatusVisible, tooltipConfig, label } = useDocumentStatus(documentTypeId, status);
  // const { isVisible: isTitleVisible } = useTitle(documentTypeId);
  const classes = styles();
  // const isStatusReleased = isDocumentRevisionInStatus(
  //   [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
  //   status as DocumentRevisionStatus,
  // );
  // const isStatusCanceled = isDocumentRevisionCanceled(status);
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ""));
  const isTypeMpiOutput = checkIsDocumentMPIOutput(documentType?.groupOptions);

  const titleRenderer = () => {
    const stepRegex = /Step #[0-9]+/;
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const mpiOutputTitle = name.match(stepRegex);
    // return isTypeMpiOutput && mpiOutputTitle ?
    //   <Typography variant="h6" id="HeaderInfo-docId" className={classes.id} component="span">
    //     {mpiOutputTitle[0]}
    //   </Typography> :
    //   <Typography variant="h6" id="HeaderInfo-docId" className={classes.id} component="span">
    //     {id}
    //   </Typography>;
    console.log("displayStatus || label ::", displayStatus, label);
    return <StyledBreadcrumb separator="›" >
      <Typography className={classes.groupSection} style={{ marginLeft: "5px" }}>
        <Grid
          container={true}
          wrap="nowrap"
          justify="flex-start"
          alignItems="center"
        >
          <MPIIcon className={classes.icon}/>
          <Grid item={true}>{group}</Grid>
        </Grid>
      </Typography>
      {isTypeMpiOutput && mpiOutputTitle ?
        <Typography  id="HeaderInfo-docId" className={classes.id}>
          {mpiOutputTitle[0]}
        </Typography> :
        <Typography  id="HeaderInfo-docId" className={classes.id}>
          <Grid
            container={true}
            wrap="nowrap"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item={true} style={{ minWidth: "50px" }}> {id}</Grid>&nbsp;
            <Grid item={true} className={classes.whiteDot}></Grid>&nbsp;
            <Grid item={true}>
              <Text translation="form.builder.header.rev" values={{ revision: displayRevision }}/>
            </Grid>
            <Grid item={true}>
              <Chip
                size="small"
                className={`${classes.chip} ${
                  classes[FormHeaderStatusClassMapping[displayStatus || label || ""]]
                }`}
                label={displayStatus || label}
              />
              {/* <Chip
                label={<Text message={displayStatus || label} />}
                id="HeaderInfo-status"
                data-cy="HeaderInfo-status"
                className={classNames(classes.statusDefault)}
              /> */}
            </Grid>
          </Grid>
        </Typography>}
    </StyledBreadcrumb>;
  };

  // const statusIcon =
  //   <div className={classNames(classes.statusIconDefault, {
  //     [classes.statusIconReleased]: isStatusReleased,
  //     [classes.statusIconCanceled]: isStatusCanceled,
  //   })} />;


  return (
    <Grid container xs={6} className={classes.itemWrap} >
      {/* <Grid item className={classes.statusWrap}>
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
      </Grid> */}
      <Grid item>
        <Grid item xs={12}>
          {titleRenderer()}
          {/* {
            isTitleVisible &&
            <Typography variant="h6" id="HeaderInfo-name" component="span">
              {name}
            </Typography>
          } */}
        </Grid>
        {/* <Grid item xs={12}>
          {
            subtitle &&
            <Typography variant="subtitle1" id="HeaderInfo-subtitle" component="p">
              {subtitle}
            </Typography>
          }
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default NewHeaderInfo;

