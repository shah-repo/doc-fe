import { Box, IconButton } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditIcon from "@material-ui/icons/Edit";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { isEmpty } from "lodash";
import { Observer } from "mobx-react";
import moment from "moment";
import React, { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  FB,
  FBButton,
  FBDialog,
  FBFilesPresenter, FBMapWrapper,
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
import { StyledTooltip } from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.new";
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
}) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <FBProvider {...{ dialogState, mpiProcedureState }}>
      <FBDialog />
      <Box
        bgcolor={Colors.athens_gray}
        color= {Colors.almost_black}
        fontWeight={600}
        fontSize= "12px"
        display="flex"
        lineHeight= "15px"
        height="44px"
        boxShadow= {`0 1px 0 ${Colors.chinese_silver}`}
        borderRadius="3px 3px 0 0"
        border = {`1px solid ${Colors.chinese_silver}`}
      >
        <FBText
          {...{ loading }}
          boxProps={{
            flexGrow: 1,
            display: "flex",
            p: 1.5,
          }}
          locale={FBProcedureItemLocale[type]}
        />
        {!isPreview && !FBProcedureItemOmitAction.includes(type) && (
          <Box pt={1.6} pr={2}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}>
            <StyledTooltip placement="top" title="form.builder.add">
              { isHover ?
                <AddCircleIcon style={{ color: Colors.almost_black, width: "17px", height: "17px" }}
                  data-cy= {`${FBProcedureItemLocale[type]}.btn`}
                  onClick={() => onClick?.()}
                  {...{ disabled }}
                />
                :
                <AddCircleOutlineOutlinedIcon  style={{ color: Colors.font_gray, width: "17px", height: "17px" }}
                  data-cy= {`${FBProcedureItemLocale[type]}.btn`}
                  onClick={() => onClick?.()}
                  {...{ disabled }}
                />
              }
            </StyledTooltip>
          </Box>
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
                border={1}
                borderRadius= "0 0 3px 3px"
              >
                <Box flexGrow={1}>
                  <FBText
                    locale={getProcedureLocale?.(item)}
                    values={getProcedureValues?.(item)}
                    boxProps={{
                      color: Colors.raven,
                      flexGrow: 1,
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "18px",
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
                                          bgcolor={ eqOverdue ? Colors.light_red : Colors.bright_gray}
                                          borderColor={eqOverdue ? Colors.light_red : Colors.bright_gray}
                                          borderRadius={2}
                                          border={0.5}
                                          mr={1}
                                          mb={1}
                                          p={0.5}
                                          style={{
                                            float: "left",
                                          }}
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
                                              color: Colors.almost_black,
                                              pr: 1,
                                            }}
                                          />
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
                                            Next Cal Due: &nbsp;
                                            {moment(selection.calDueDate).format(MomentFormats.BriefDate)}
                                          </Box>
                                          }
                                          {(selection.pmDueDate !== "N/A") && type === "equipment" &&
                                          <Box
                                            color={pmOverdue ? Colors.error_red : Colors.dark_gray}
                                            fontWeight={pmOverdue ? "bold" : "normal"}
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
                                            Next PM Due: &nbsp;
                                            {moment(selection.pmDueDate).format(MomentFormats.BriefDate)}
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
                                      <WarningIcon width={14} height={14}/> &nbsp; OVERDUE &nbsp; &nbsp;
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
  ); };

export default withFBMPIProcedureItem(FBMPIProcedureItem);
