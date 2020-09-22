import { Box } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBDialog, FBMapWrapper, FBProcedureItemActionLocale, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemProps, FBProvider, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBProcedureItem } from "./FBProcedureItem.wrap";

const FBProcedureItem: React.FunctionComponent<FBProcedureItemProps> = ({
  onClick,
  dialogState,
  formState,
  type,
  value = [],
}) => (
  <FBProvider {...{ dialogState, formState }}>
    <FBDialog />
    <Box
      bgcolor={Colors.gray}
      color="white"
      style={{ borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }}
      fontWeight="fontWeightBold"
      display="flex"
    >
      <FBText
        boxProps={{ flexGrow: 1, pt: 2, pl: 2 }}
        locale={FBProcedureItemLocale[type]}
      />
      <FBButton
        variant="text"
        color="inherit"
        startIcon={<AddCircleIcon />}
        label={FBProcedureItemActionLocale[type]}
        {...{ onClick }}
      />
    </Box>
    <FBMapWrapper<FBProcedureItemConfig[]> collection={value}>
      {(item: FBProcedureItemConfig, index) => (
        <Box key={`fb-procedure-item-${type}-${index}`} p={2}>
          {item.title}
        </Box>
      )}
    </FBMapWrapper>
  </FBProvider>
);

export default withFBProcedureItem(FBProcedureItem);
