import { Box, CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import { FBButton, FBDialog, FBMapWrapper, FBProvider, FBSection, FBTaskField, FBTaskItem, FBTaskProps } from "..";
import Text from "../../components/Text";
import { withFBTask } from "./FBTask.wrap";


const FBTask: React.FunctionComponent<FBTaskProps> = ({
  onClick,
  taskState,
  dialogState,
  disabled,
  tasks = [],
  loading,
  label,
  name,
  canAddTask,
}) => (
  <FBProvider {...{ dialogState, taskState }}>
    <FBDialog />
    <Box mb={3}>
      <FBSection {...{ label }} name={`fb-task-section-${name}`} />
      <FBMapWrapper<FBTaskItem[]> collection={tasks}>
        {(task: FBTaskItem, index) => (
          <FBTaskField key={`fb-task-${task.id}-${index}`} {...{ task, onClick }} />
        )}
      </FBMapWrapper>
      <FBButton
        fullWidth={true}
        label="form.builder.add.implementation.task"
        onClick={() => onClick?.()}
        variant="outlined"
        style={{ margin: 0 }}
        endIcon={loading && <CircularProgress size={16} />}
        {...{ disabled }}
      />
      {!canAddTask && <Typography style={{ marginBottom: 32, marginTop: 32 }} variant="body2" color="error">
        <Text translation="form.builder.warning.tasks"/>
      </Typography>
      }
    </Box>
  </FBProvider>
);

export default withFBTask(FBTask);
