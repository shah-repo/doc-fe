import { Box, IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { isEmpty } from "lodash";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBDialog, FBFilesPresenter, FBFormMode, FBMapWrapper, FBMediaAlbumField, FBPartItemStatusBg, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemOmitAction, FBProcedureItemProps, FBProcedureItemType, FBProvider, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBProcedureItem } from "./FBProcedureItem.wrap";

const FBProcedureItem: React.FunctionComponent<FBProcedureItemProps> = ({
  onClick,
  handleRemove,
  getItem,
  getLot,
  dialogState,
  isPreview,
  disabled,
  loading,
  type,
  value = [],
  name,
}) => (
  <FBProvider {...{ dialogState }}>
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
      {!isPreview && !FBProcedureItemOmitAction.includes(type) && (
        <FBButton
          variant="text"
          color="inherit"
          dataCy= {`${FBProcedureItemLocale[type]}.btn`}
          startIcon={<AddCircleIcon />}
          label={{
            locale: "form.builder.action.mode",
            values: {
              mode: FBFormMode.add,
              title: `${FBProcedureItemLocale[type]}|s`,
            },
          }}
          onClick={() => onClick?.()}
          {...{ disabled }}
        />
      )}
    </Box>
    {type === FBProcedureItemType.attachments && (
      <Box mt={2}>
        <FBMediaAlbumField
          name={`${name}.attachments`}
          isTemplate={false}
          editorProperties={["copyableValue"]}
          gutter={false}
        />
      </Box>
    )}
    {type !== FBProcedureItemType.attachments && !loading && (
      <FBMapWrapper<FBProcedureItemConfig[]> collection={value}>
        {(item: FBProcedureItemConfig, index) => (
          <Box
            border={1}
            borderLeft={0}
            borderRight={0}
            borderTop={0}
            borderColor={Colors.hint_gray}
            key={`fb-procedure-item-${type}-${index}`}
          >
            <Box
              display="flex"
              bgcolor={(item.status || "none") === "none" ? "white" : FBPartItemStatusBg[item.status || ""]}
              p={1.5}
            >
              <FBText
                locale={`form.builder.procedure.${type}.title`}
                values={{
                  title: getItem?.(item.title),
                  lot: getLot?.(item.partLot),
                  quantity: item.quantity || "form.builder.none",
                  unit: item.unit,
                }}
                boxProps={{
                  color: Colors.black,
                  flexGrow: 1,
                }}
              />
              {!isPreview && (
                <>
                  <Box>
                    <IconButton
                      color="inherit"
                      size="small"
                      onClick={() => onClick?.(item)}
                      {...{ disabled }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
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
                </>
              )}
            </Box>
            <Box
              key="id"
              display={isEmpty(item.attachments) ? "none" : "flex"}
              bgcolor={(item.status || "none") === "none" ? "white" : FBPartItemStatusBg[item.status || ""]}
              p={1.5}
              pt={0}
              pb={0}
            >
              <FBFilesPresenter files={item.attachments} mode="raw"/>
            </Box>
          </Box>
        )}
      </FBMapWrapper>
    )}
  </FBProvider>
);

export default withFBProcedureItem(FBProcedureItem);
