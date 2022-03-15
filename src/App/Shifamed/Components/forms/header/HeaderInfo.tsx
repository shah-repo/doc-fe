import { Chip, Grid, Link, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { documentTypeSelectors } from "../../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupOptionsType } from "../../../../../state/ducks/documentRevisions/documentType/types";
import { RevisionChangeType } from "../../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../../state/reducers";
import { FormHeaderStatusClassMapping } from "../../../../../ui/components/common/kendo/helpers";
import Text from "../../../../../ui/components/Text";
import { checkIsDocumentMPIOutput } from "../../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { useDocumentStatus } from "../../../../../ui/hooks/docCustomization/useCustomization";
import Colors from "../../../../../ui/layout/theme/utils/colors";
// import Colors from "../../../../../ui/layout/theme/utils/colors";
import { styles } from "./HeaderInfo.styles";
import { StyledBreadcrumb } from "./StyledBreadcrumb";
// import { ReactComponent as DocumentListIconIcon } from "../../../../../assets/images/document.svg";
// import { ReactComponent as EBIcon } from "../../../../../assets/images/eb.svg";
// import { ReactComponent as EquipmentIcon } from "../../../../../assets/images/equipment.svg";
// import { ReactComponent as LHRIcon } from "../../../../../assets/images/lhr.svg";
// import { ReactComponent as LOTIcon } from "../../../../../assets/images/lot.svg";
// import { ReactComponent as PartsIcon } from "../../../../../assets/images/parts.svg";
// import { ReactComponent as PurchaseOrderIcon } from "../../../../../assets/images/purchase_order.svg";
// import { ReactComponent as ReceiveIcon } from "../../../../../assets/images/receive.svg";
// import { ReactComponent as RecordIcon } from "../../../../../assets/images/record.svg";
// import { ReactComponent as SupplierIcon } from "../../../../../assets/images/supplier.svg";

interface NavigationDetails {
  label: string;
  path: string;
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

// type Pages = "Documents List" | "Record" | "Equipment" | "Supplier" | "Purchase Order" | "Receive" |
// "Equipment Specifications" | "Parts" | "EB" | "Lhr" | "Lot" | "Training Curriculums";

// enum PageTypes {
//   DOCUMENTS_LIST= "Documents List",
//   RECORD= "Record",
//   EQUIPMENT= "Equipment",
//   EQUIPMENT_SPECICATIONS= "Equipment Specifications",
//   SUPPLIER= "Supplier",
//   PO= "Purchase Order",
//   RECEIVE= "Receive",
//   PARTS= "Parts",
//   EB= "EB",
//   LHR= "Lhr",
//   LOT= "Lot",
//   TRAINING_CURRICULUMS= "Training Curriculums"
// }

const NewHeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  displayStatus,
  navigationDetails,
  subtitle,
  displayRevision,
  groupOptions,
}) => {
  const history = useHistory();
  const { label } = useDocumentStatus(documentTypeId, status);
  const classes = styles();
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ""));
  const isTypeMpiOutput = checkIsDocumentMPIOutput(documentType?.groupOptions);
  const returnToList = () => {
    history.push(navigationDetails?.path);
  };

  // const getIconAndTitle = (page: Pages) => {
  //   switch (page) {
  //     case PageTypes.DOCUMENTS_LIST:
  //       return {
  //         icon: <DocumentListIconIcon className={classes.icon}/>,
  //       };
  //     case PageTypes.RECORD:
  //       return {
  //         // TODO: Update once all headers done
  //         title: "Records",
  //         icon: <RecordIcon className={classes.icon}/>,
  //       };
  //     case PageTypes.EQUIPMENT:
  //     case PageTypes.EQUIPMENT_SPECICATIONS:
  //       return {
  //         icon: <EquipmentIcon className={classes.icon}/>,
  //       };
  //     case PageTypes.SUPPLIER:
  //       return {
  //         icon: <SupplierIcon className={classes.icon}/>,
  //       };
  //     case PageTypes.PO:
  //     case PageTypes.TRAINING_CURRICULUMS:
  //       return { icon: <PurchaseOrderIcon className={classes.icon}/> };
  //     case PageTypes.RECEIVE:
  //       return { icon: <ReceiveIcon className={classes.icon}/> };
  //     case PageTypes.PARTS:
  //       return { icon: <PartsIcon className={classes.icon}/> };
  //     case PageTypes.EB:
  //       return { icon: <EBIcon className={classes.icon}/> };
  //     case PageTypes.LHR:
  //       return { icon: <LHRIcon className={classes.icon}/> };
  //     case PageTypes.LOT:
  //       return { icon: <LOTIcon className={classes.icon}/> };
  //     default:
  //       return { icon: <RecordIcon className={classes.icon}/> };
  //   }
  // };

  const titleRenderer = () => {
    const stepRegex = /Step #[0-9]+/;
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const mpiOutputTitle = name.match(stepRegex);
    return (
      <StyledBreadcrumb separator="›">
        <Typography
          className={classes.groupSection}
          style={{ marginLeft: "5px" }}
        >
          <Grid
            container={true}
            wrap="nowrap"
            justify="flex-start"
            alignItems="center"
          >
            {/* {getIconAndTitle(group?.lable as Pages).icon} */}
            <Link
              underline="hover"
              onClick={returnToList}
              style={{ color: Colors.white, cursor: "Pointer" }}
            >
              <Grid item={true} className={classes.title}>
                {navigationDetails?.label}
              </Grid>
            </Link>
          </Grid>
        </Typography>
        {isTypeMpiOutput && mpiOutputTitle ? (
          <Typography id="HeaderInfo-docId" className={classes.id}>
            {mpiOutputTitle[0]}
          </Typography>
        ) : (
          <Typography id="HeaderInfo-docId" className={classes.id}>
            <Grid
              container={true}
              wrap="nowrap"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item={true} style={{ minWidth: "50px" }}>
                {" "}
                {id}
              </Grid>
              &nbsp;
              <Grid item={true} className={classes.whiteDot}></Grid>&nbsp;
              <Grid item={true}>
                <Text
                  translation="form.builder.header.rev"
                  values={{ revision: displayRevision }}
                />
              </Grid>
              <Grid item={true}>
                <Chip
                  size="small"
                  className={`${classes.chip} ${
                    classes[
                      FormHeaderStatusClassMapping[displayStatus || label || ""]
                    ]
                  }`}
                  label={displayStatus || label}
                />
              </Grid>
            </Grid>
          </Typography>
        )}
      </StyledBreadcrumb>
    );
  };

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

