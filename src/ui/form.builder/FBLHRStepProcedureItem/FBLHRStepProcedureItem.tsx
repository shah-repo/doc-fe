import { Box, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  FBDialog,
  FBMapWrapper,
  FBPartItemStatusBg,
  FBProcedureItemConfig,

  FBProcedureItemLocale,

  FBText,
} from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBClasses } from "../defaults/layout";
import FBProvider from "../FBProvider/FBProvider";
import { FBLHRStepProcedureItemProps } from "./FBLHRStepProcedureItem.types";
import { withFBLHRStepProcedureItem } from "./FBLHRStepProcedureItem.wrap";

const FBLHRStepProcedureItem: React.FunctionComponent<FBLHRStepProcedureItemProps> = ({
  onClick,
  getItem,
  dialogState,
  isPreview,
  loading,
  multiplier = 1,
  type,
  value = [],
}) => (
  <FBProvider {...{ dialogState }}>
    <Box mt={2}>
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
          boxProps={{
            flexGrow: 1,
            display: "flex",
            py: 1.7,
            pl: 2,
          }}
          locale={FBProcedureItemLocale[type]}
        />
      </Box>
      {!loading && (
        <FBMapWrapper<FBProcedureItemConfig[]> collection={value}>
          {(item: FBProcedureItemConfig, index) => (
            <Box
              border={1}
              borderLeft={0}
              borderRight={0}
              borderTop={0}
              borderColor={Colors.hint_gray}
              key={`fb-procedure-item-${type}-${index}`}
              className={FBClasses.hoverVisibility}
            >
              <Box
                display="flex"
                bgcolor={(item.status || "none") === "none" ? "white" : FBPartItemStatusBg[item.status || ""]}
                alignItems="center"
                p={1.5}
                minHeight={55}
              >
                <Box flexGrow={1}>
                  <FBText
                    locale={item.type ?
                      `form.builder.mpi.procedure.${type}.title.id` :
                      `form.builder.mpi.procedure.${type}.title`
                    }
                    values={item.type ?
                      {
                        id: item.id,
                        title: getItem?.(item.title),
                        quantity: item.quantity ? (item.quantity * multiplier) : "form.builder.none",
                        unit: item.unit,
                      } :
                      {
                        title: getItem?.(item.title),
                        quantity: item.quantity ? (item.quantity * multiplier) : "form.builder.none",
                        unit: item.unit,
                      }
                    }
                    boxProps={{
                      color: Colors.black,
                      flexGrow: 1,
                    }}
                  />
                </Box>
                {!isPreview && item.type && (
                  <>
                    <Box>
                      <IconButton
                        color="inherit"
                        size="small"
                        onClick={() => onClick?.(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          )}
        </FBMapWrapper>
      )}
    </Box>
  </FBProvider>
);

export default withFBLHRStepProcedureItem(FBLHRStepProcedureItem);
