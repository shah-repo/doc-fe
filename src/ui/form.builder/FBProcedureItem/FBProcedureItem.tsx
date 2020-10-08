import { Box, IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBDialog, FBMapWrapper, FBProcedureItemActionLocale, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemProps, FBProvider, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBProcedureItem } from "./FBProcedureItem.wrap";

const FBProcedureItem: React.FunctionComponent<FBProcedureItemProps> = ({
  onClick,
  handleRemove,
  getItem,
  dialogState,
  formState,
  isPreview,
  disabled,
  loading,
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
        {...{ loading }}
        boxProps={{ flexGrow: 1, pl: 2, alignItems: "center", display: "flex", py: isPreview ? 1.5 : 0 }}
        locale={FBProcedureItemLocale[type]}
      />
      {!isPreview && (
        <FBButton
          variant="text"
          color="inherit"
          startIcon={<AddCircleIcon />}
          label={FBProcedureItemActionLocale[type]}
          {...{ onClick, disabled }}
        />
      )}
    </Box>
    {!loading && (
      <FBMapWrapper<FBProcedureItemConfig[]> collection={value}>
        {(item: FBProcedureItemConfig, index) => (
          <Box
            key={`fb-procedure-item-${type}-${index}`}
            display="flex"
            border={1}
            borderLeft={0}
            borderRight={0}
            borderTop={0}
            borderColor={Colors.hint_gray}
            p={1.5}
          >
            <FBText
              locale={`form.builder.procedure.${type}.title`}
              values={{
                title: getItem?.(item.title),
                quantity: item.quantity,
                unit: item.unit,
              }}
              boxProps={{
                flexGrow: 1,
              }}
            />
            {!isPreview && (
              <Box color={Colors.error_red}>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => handleRemove?.(item.id)}
                  {...{ disabled }}
                >
                  <RemoveCircleIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </FBMapWrapper>
    )}
  </FBProvider>
);

export default withFBProcedureItem(FBProcedureItem);
