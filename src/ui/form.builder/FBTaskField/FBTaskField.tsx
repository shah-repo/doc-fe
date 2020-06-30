import { Box, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { get } from "lodash";
import moment from "moment";
import React from "react";
import { FB, FBMapWrapper, FBSchemaProps, FBTaskFieldProps } from "..";
import { TIME_ZONE } from "../../../common/utils/date";
import Colors from "../../layout/theme/utils/colors";
import { withFBTaskField } from "./FBTaskField.wrap";

const FBTaskField: React.FunctionComponent<FBTaskFieldProps> = ({
  onClick,
  handleRemoveTask,
  getApprover,
  onMouseOver,
  onMouseLeave,
  visibility,
  task,
}) => (
  <Box
    borderColor={Colors.hint_gray}
    {...{ onMouseOver, onMouseLeave }}
    bgcolor="white"
    borderRadius={3}
    border={1}
    px={2}
    py={1.5}
    my={4}
  >
    <FBMapWrapper<FBSchemaProps[]> collection={task.descriptionSchema}>
      {(schemaItem: FBSchemaProps, index) => (
        <>
          {index === 0 && (
            <Box display="flex" mb={-1}>
              <Box
                fontSize="subtitle2.fontSize"
                flexGrow={1}
                fontWeight="fontWeightBold"
              >
                {FB.stripTags(get(task, schemaItem.name || ""))}
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
              {FB.stripTags(get(task, schemaItem.name || ""))}
            </Box>
          )}
        </>
      )}
    </FBMapWrapper>
    <Box
      mt={3}
      display="flex"
      flexDirection="row"
      fontSize="caption.fontSize"
      color={Colors.gray}
    >
      <Box mr={3}>
        Assigned to: {getApprover?.(task)}
      </Box>
      <Box mr={3}>
        Due by: {moment(task.dueDate).tz(TIME_ZONE, true).format("MMMM D, YYYY")}
      </Box>
      <Box mr={3}>
        Status: {task.status || "DRAFT"}
      </Box>
    </Box>
  </Box>
);

export default withFBTaskField(FBTaskField);
