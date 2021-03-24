import { Button, Grid } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { GroupRequestBody } from "../../../../state/ducks/groupManagement/types";
import Text from "../../../components/Text";

interface Props {
  handleReset: () => void;
  handleSubmit: () => void;
  isCreateMode?: boolean;
  group: GroupRequestBody;
}

const ActionButtons: React.FunctionComponent<Props> = ({
  handleReset,
  handleSubmit,
  isCreateMode,
  group,
}) => {

  const resetButtonRenderer = () => (
    <Button variant="outlined" onClick={handleReset} id="Group-reset">
      <Text translation="common.reset" />
    </Button>
  );

  const submitButtonRenderer = () => (
    <Button
      id="Group-createGroup"
      data-cy="Group-createGroup"
      variant="contained"
      onClick={handleSubmit}
      disabled={isEmpty(group.name)}
    >
      <Text translation="common.save" />
    </Button>
  );
  return (
    <Grid item={true} style={{ textAlign: "right" }}>
      {isCreateMode && resetButtonRenderer()}
      {submitButtonRenderer()}
    </Grid>
  );
};

export default ActionButtons;
