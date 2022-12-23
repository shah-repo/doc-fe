import { Box, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  FBDialog,
  FBMapWrapper,
  FBProcedureItemConfig,
  FBProcedureItemLocale,
  FBText,
} from "..";
import { toFixed } from "../../dashboard.new/line.items/common/Utils";
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
  isPendingChange,
}) => (
  <FBProvider {...{ dialogState }}>
    <Box mt={4} borderRadius="3px 3px 4px 4px" boxShadow={`0px 0px 1px 1px ${Colors.gray_goose}`}>
      <FBDialog />
      <Box
        bgcolor={Colors.athens_gray}
        color={Colors.almost_black}
        height="40px"
        fontSize="12px"
        boxShadow={`inset 0px 1px 1px -1px ${Colors.gray_goose}, inset 0px -1px 1px 0px ${Colors.gray_goose}`}
        fontWeight="600"
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
              borderColor={item.type ? Colors.medium_red : Colors.gray_goose}
              key={`fb-procedure-item-${type}-${index}`}
              lineHeight="18px"
              className={FBClasses.hoverVisibility}
            >
              <Box
                display="flex"
                bgcolor={item.type ? Colors.light_red : Colors.white}
                alignItems="center"
                p={1.5}
                minHeight={42}
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
                        quantity: item.quantity ? toFixed(item.quantity * multiplier) : "form.builder.none",
                        unit: item.unit,
                      } :
                      {
                        title: getItem?.(item.title),
                        quantity: item.quantity ? toFixed(item.quantity * multiplier) : "form.builder.none",
                        unit: item.unit,
                      }
                    }
                    boxProps={{
                      color: Colors.almost_black,
                      flexGrow: 1,
                    }}
                  />
                </Box>
                {(!isPreview || isPendingChange ) && (item.type || item.paramsId) && (
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
