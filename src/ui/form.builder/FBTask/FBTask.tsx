import { Box } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import moment from "moment";
import React from "react";
import { FB, FBButton, FBDialog, FBMapWrapper, FBProvider, FBTaskItem, FBTaskProps } from "..";
import { TIME_ZONE } from "../../../common/utils/date";
import Colors from "../../layout/theme/utils/colors";
import { withFBTask } from "./FBTask.wrap";

const FBTask: React.FunctionComponent<FBTaskProps> = ({
  onClick,
  getApprover,
  taskState,
  dialogState,
  disabled,
  tasks = [],
}) => (
  <FBProvider {...{ dialogState, taskState }}>
    <>
      <FBDialog />
      <FBMapWrapper<FBTaskItem[]> collection={tasks}>
        {(task: FBTaskItem, index) => (
          <Box
            key={`fb-task-${task.id}-${index}`}
            borderColor={Colors.hint_gray}
            borderRadius={3}
            border={1}
            p={2}
            my={2}
          >
            <Box display="flex" flexDirection="row-reverse" mb={-3}>
              <Box color={Colors.medium_red}>
                <RemoveCircleOutlineIcon color="inherit"  />
              </Box>
              <Box color={Colors.medium_blue}>
                <EditIcon color="inherit"  />
              </Box>
            </Box>
            <Box fontSize="body1.fontSize" fontWeight="fontWeightBold">{task.title}</Box>
            <Box fontSize="body1.fontSize" mb={3}>{FB.stripTags(task.description)}</Box>
            <Box display="flex" flexDirection="row" fontSize="body2.fontSize" color={Colors.gray}>
              {getApprover?.(task.assignedTo) && (
                <Box mr={3}>
                  Assigned to: {getApprover?.(task.assignedTo)?.user?.name}
                </Box>
              )}
              <Box>
                Due by: {moment(task.dueDate).tz(TIME_ZONE, true).format("MMMM D, YYYY")}
              </Box>
            </Box>
          </Box>
        )}
      </FBMapWrapper>
      <FBButton
        fullWidth={true}
        label="form.builder.add.implementation.task"
        onClick={() => onClick?.()}
        variant="outlined"
        style={{ margin: 0 }}
        {...{ disabled }}
      />
    </>
  </FBProvider>
);

export default withFBTask(FBTask);
