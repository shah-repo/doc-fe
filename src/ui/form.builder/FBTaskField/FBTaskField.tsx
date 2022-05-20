import { Box, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { get, isEmpty } from "lodash";
import React from "react";
import { FB, FBButton, FBFileUpload, FBMapWrapper, FBSchemaProps, FBTaskFieldProps, FBText } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import Colors from "../../layout/theme/utils/colors";
import { withFBTaskField } from "./FBTaskField.wrap";

const FBTaskField: React.FunctionComponent<FBTaskFieldProps> = ({
  onClick,
  onMouseOver,
  onMouseLeave,
  handleRemoveTask,
  handleClosingNote,
  canBeDone,
  visibility,
  task,
}) => (
  <Box
    borderColor={Colors.hint_gray}
    {...{ onMouseOver, onMouseLeave }}
    bgcolor="white"
    borderRadius={3}
    border={1}
    px={2.5}
    py={1.5}
    my={4}
  >
    <FBMapWrapper<FBSchemaProps[]> collection={task.descriptionSchema}>
      {(schemaItem: FBSchemaProps, index) => (
        <Box key={`fb-task-field-${schemaItem.name}-${index}`}>
          {index === 0 && (
            <Box display="flex" mb={-1}>
              <Box
                fontSize="subtitle2.fontSize"
                flexGrow={1}
                fontWeight="fontWeightBold"
              >
                {FB.stripTags(get(task, `descriptionInput.${schemaItem.name}`))}
              </Box>
              <Box
                display="flex"
                flexDirection="row-reverse"
                {...{ visibility }}
              >
                <Box color={Colors.medium_red}>
                  <IconButton
                    color="inherit"
                    edge={false}
                    size="small"
                    onClick={() => handleRemoveTask?.(task)}
                  >
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box color={Colors.medium_blue}>
                  <IconButton
                    color="inherit"
                    edge={false}
                    size="small"
                    onClick={() => onClick?.(task.id)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}
          {index > 0 && (
            <Box fontSize="body2.fontSize" fontWeight="fontWeightNormal">
              {FB.stripTags(get(task, `descriptionInput.${schemaItem.name}`))}
            </Box>
          )}
        </Box>
      )}
    </FBMapWrapper>
    <Box
      mt={2.5}
      display="flex"
      flexDirection="row"
      fontSize="caption.fontSize"
      color={Colors.gray}
    >
      <FBText
        boxProps={{ mr: 3 }}
        locale="form.builder.assigned.to"
        values={{
          user: `: ${task?.assigned.user?.name}`,
        }}
      />
      <FBText
        boxProps={{ mr: 3 }}
        locale="form.builder.due.by"
        values={{
          date: `: ${getFormattedDateString(task.dueDate, MomentFormats.MonthDateYearAlt)}`,
        }}
      />
      <FBText
        boxProps={{ mr: 3 }}
        locale="form.builder.status"
        values={{
          status: `: ${task.status || "DRAFT"}`,
        }}
      />
    </Box>
    {canBeDone && (
      <Box mt={2.5}>
        <FBButton
          label="Done"
          onClick={handleClosingNote}
          variant="outlined"
          size="small"
          style={{ margin: 0 }}
        />
      </Box>
    )}
    {!isEmpty(task.closingNoteInput) && (
      <Box mt={3}>
        <FBMapWrapper<FBSchemaProps[]> collection={task.closingNoteSchema}>
          {(schemaItem: FBSchemaProps, index) => (
            <Box key={`fb-task-field-${schemaItem.name}-${index}`}>
              {index === 0 && (
                <Box display="flex">
                  <Box
                    fontSize="subtitle2.fontSize"
                    flexGrow={1}
                    fontWeight="fontWeightBold"
                  >
                    {FB.stripTags(get(task, `closingNoteInput.${schemaItem.name}`))}
                  </Box>
                </Box>
              )}
              {index > 0 && (
                <Box fontSize="body2.fontSize" fontWeight="fontWeightNormal">
                  {FB.stripTags(get(task, `closingNoteInput.${schemaItem.name}`))}
                </Box>
              )}
            </Box>
          )}
        </FBMapWrapper>
        <FBFileUpload
          gutter={false}
          readonly={true}
          disabled={true}
          defaultValue={get(task, "closingNoteInput.attachments", [])}
        />
      </Box>
    )}
  </Box>
);

export default withFBTaskField(FBTaskField);
