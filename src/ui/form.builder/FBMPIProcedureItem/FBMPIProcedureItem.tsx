import { Box, IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { isEmpty } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  FBButton,
  FBDialog,
  FBFilesPresenter,
  FBFormMode,
  FBMapWrapper,
  FBMediaAlbumField,
  FBMPIProcedureItemProps,
  FBMPIProcedureSelectValue,
  FBPartItemStatusBg,
  FBProcedureItemConfig,
  FBProcedureItemLocale,
  FBProcedureItemOmitAction,
  FBProcedureItemType,
  FBProvider,
  FBText
} from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBMPIProcedureItem } from "./FBMPIProcedureItem.wrap";

const FBMPIProcedureItem: React.FunctionComponent<FBMPIProcedureItemProps> = ({
  onClick,
  handleRemove,
  handleSelect,
  handleSelectionDelete,
  getItem,
  getLot,
  mpiProcedureState,
  dialogState,
  isPreview,
  disabled,
  loading,
  multiplier = 1,
  type,
  value = [],
  name,
}) => (
  <FBProvider {...{ dialogState, mpiProcedureState }}>
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
          isTemplate={true}
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
            onMouseEnter={() => mpiProcedureState?.setSelectState(index)}
            onMouseLeave={() => mpiProcedureState?.setSelectState(index)}
          >
            <Box
              display="flex"
              bgcolor={(item.status || "none") === "none" ? "white" : FBPartItemStatusBg[item.status || ""]}
              alignItems="center"
              p={1.5}
            >
              <Box flexGrow={1}>
                <FBText
                  locale={`form.builder.procedure.${type}.title`}
                  values={{
                    title: getItem?.(item.title),
                    lot: getLot?.(item.partLot),
                    quantity: item.quantity ? (item.quantity * multiplier) : "form.builder.none",
                    unit: item.unit,
                  }}
                  boxProps={{
                    color: Colors.black,
                    flexGrow: 1,
                  }}
                />
                <Observer>
                  {() => (
                    <>
                      {!isEmpty(mpiProcedureState?.partsSelected) && (
                        <Box mt={1} display="flex" flexWrap="wrap">
                          <FBMapWrapper<FBMPIProcedureSelectValue[]>
                            collection={mpiProcedureState?.partsSelected || []}
                          >
                            {(selection: FBMPIProcedureSelectValue, index) => (
                              <Box key={`fb-mpi-procedure-selection-${index}`}>
                                {selection.materialId === item.title && (
                                  <Box
                                    display="flex"
                                    flexDirection="row"
                                    bgcolor={Colors.light_blue}
                                    borderColor={Colors.light_blue}
                                    borderRadius={2}
                                    border={0.5}
                                    mr={1}
                                    mb={1}
                                    p={0.5}
                                  >
                                    <FBText
                                      locale="form.builder.mpi.part.selection"
                                      values={{
                                        lotDocId: selection.lotDocId || "",
                                        quantity: selection.quantity || 0,
                                        unit: selection.unit || "",
                                      }}
                                      boxProps={{
                                        color: Colors.black,
                                        pr: 1,
                                      }}
                                    />
                                    <IconButton
                                      size="small"
                                      style={{ fontSize: 11, marginTop: "-5px", marginRight: "-2px" }}
                                      onClick={() => handleSelectionDelete?.(selection.refId)}
                                    >
                                      <HighlightOffIcon fontSize="inherit" />
                                    </IconButton>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </FBMapWrapper>
                        </Box>
                      )}
                    </>
                  )}
                </Observer>
              </Box>
              {isPreview && (
                <Observer>
                  {() => (
                    <FBButton
                      label="form.builder.select"
                      hidden={!mpiProcedureState?.selectState.get(index)}
                      onClick={() => handleSelect?.({
                        ...item,
                        id: item.title,
                        title: getItem?.(item.title) || "",
                      })}
                    />
                  )}
                </Observer>
              )}
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

export default withFBMPIProcedureItem(FBMPIProcedureItem);
