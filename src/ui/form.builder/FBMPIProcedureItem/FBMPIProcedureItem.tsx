import { Box, IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { isEmpty } from "lodash";
import { Observer } from "mobx-react";
import moment from "moment";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  FB,
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
  FBText,
} from "..";
import { ReactComponent as WarningIcon } from "../../../assets/images/icon_warning.svg";
import { MomentFormats } from "../../../common/utils/date";
import Colors from "../../layout/theme/utils/colors";
import { FBClasses } from "../defaults/layout";
import { withFBMPIProcedureItem } from "./FBMPIProcedureItem.wrap";

const FBMPIProcedureItem: React.FunctionComponent<FBMPIProcedureItemProps> = ({
  onClick,
  handleRemove,
  handleSelect,
  handleSelectionDelete,
  getItem,
  getLot,
  getProcedureLocale,
  getProcedureValues,
  isDateOverdue,
  mpiProcedureState,
  dialogState,
  isPreview,
  disabled,
  loading,
  type,
  value = [],
  name,
  isSelectVisible,
  defaultValue,
  redlineActive,
  isReleased,
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
      <Box data-cy="mediaUploadField" mt={2}>
        <FBMediaAlbumField
          name={`${name}.attachments`}
          isTemplate={true}
          editorProperties={["copyableValue"]}
          gutter={false}
          editorConfig={defaultValue}
          autosave={false}
          fieldType="mpiprocedure"
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
                  locale={getProcedureLocale?.(item)}
                  values={getProcedureValues?.(item)}
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
                          <FBMapWrapper<Partial<FBMPIProcedureSelectValue>[]>
                            collection={mpiProcedureState?.partsSelected || []}
                          >
                            {(selection: FBMPIProcedureSelectValue, index) => {
                              const pmOverdue = isDateOverdue?.(selection?.pmDueDate);
                              const calOverdue = isDateOverdue?.(selection?.calDueDate);
                              const eqOverdue = type === "equipment" && (pmOverdue || calOverdue);

                              return (
                                <Box key={`fb-mpi-procedure-selection-${index}`}>
                                  {(selection.materialId === item.title || selection.equipmentId === item.title) && (
                                    <>
                                      <Box
                                        display="flex"
                                        flexDirection="row"
                                        bgcolor={ eqOverdue ? Colors.light_red : Colors.medium_gray}
                                        borderColor={eqOverdue ? Colors.light_red : Colors.medium_gray}
                                        borderRadius={2}
                                        border={0.5}
                                        mr={1}
                                        mb={1}
                                        p={0.5}
                                        style={{ float: "left" }}
                                      >
                                        <FBText
                                          locale={`form.builder.mpi.part.selection.${type}`}
                                          values={{
                                            docId: selection.overrideDocId || "",
                                            lotPart: selection.lotPart || "",
                                            quantity: selection.quantity || 0,
                                            unit: selection.unit || "",
                                          }}
                                          boxProps={{
                                            color: Colors.black,
                                            fontWeight: type === "equipment" ? "bold" : "regular",
                                            pr: 1,
                                          }}
                                        />
                                        {(selection.pmDueDate !== "N/A") && type === "equipment" &&
                                          <Box
                                            color={pmOverdue ? Colors.error_red : Colors.dark_gray}
                                            fontWeight={pmOverdue ? "bold" : "normal"}
                                          >
                                            <Box
                                              display="inline-block"
                                              bgcolor={Colors.black}
                                              width={4}
                                              height={4}
                                              mr={1}
                                              mb={0.25}
                                            />
                                            Next PM Due:
                                            {moment(selection.pmDueDate).format(MomentFormats.BriefDate)}
                                          </Box>
                                        }
                                        {(selection.calDueDate !== "N/A") && type === "equipment" &&
                                          <Box
                                            color={calOverdue ? Colors.error_red : Colors.dark_gray}
                                            fontWeight={calOverdue ? "bold" : "normal"}
                                            ml={1}
                                          >
                                            <Box
                                              display="inline-block"
                                              bgcolor={Colors.black}
                                              width={4}
                                              height={4}
                                              mr={1}
                                              mb={0.25}
                                            />
                                            Next Cal Due:
                                            {moment(selection.calDueDate).format(MomentFormats.BriefDate)}
                                          </Box>
                                        }
                                        <IconButton
                                          size="small"
                                          style={{ fontSize: 11 }}
                                          onClick={() => handleSelectionDelete?.(selection.refId)}
                                          disabled={isReleased}
                                        >
                                          <HighlightOffIcon fontSize="inherit" />
                                        </IconButton>

                                      </Box>
                                      {(pmOverdue || calOverdue) &&
                                    <Box
                                      color={Colors.error_red}
                                      fontWeight="bold"
                                      display="flex"
                                      alignItems="center"
                                      mt={0.5}
                                    >
                                      <WarningIcon width={14} height={14}/> &nbsp; OVERDUE
                                    </Box>
                                      }
                                    </>
                                  )}
                                </Box>
                              ); }}
                          </FBMapWrapper>
                        </Box>
                      )}
                    </>
                  )}
                </Observer>
              </Box>
              {isSelectVisible && FB.isUUID(item.title) && !redlineActive && (
                <Observer>
                  {() => {
                    const hasSelected = mpiProcedureState?.partsSelected && mpiProcedureState?.partsSelected.find(
                      (selection)  =>
                        selection.materialId === item.title || selection.equipmentId === item.title);
                    return (
                      <FBButton
                        label={hasSelected ? "form.builder.change" : "form.builder.select"}
                        style={{ margin: 0, padding: "4px" }}
                        onClick={() => handleSelect?.({
                          ...item,
                          id: item.title,
                          title: getItem?.(item.title) || "",
                        })}
                      />
                    ); }}
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
