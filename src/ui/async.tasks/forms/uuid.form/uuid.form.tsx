import { Box, Button, TextField } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { SQS_TYPES } from "../../types";
import { styles } from "./uuid.form.styles";

interface Props {
  handleuuidFormSubmit: (id: string) => void;
  type: string;
}
const UUIDAsyncTaskPresenter: React.FunctionComponent<Props> = ({
  handleuuidFormSubmit,
  type,
}) => {
  const classes = styles();
  const [uuid, setuuid] = React.useState("");
  const handleUserEmailsChange = (event: any) => {
    setuuid(event?.target?.value);
  };
  return (
    <Box mt={2} className={classes.root}>
      <Box display="flex" justifyContent="flex-start">
        <TextField
          id="filled-textarea"
          fullWidth
          label={
            <Text
              translation={
                type === SQS_TYPES.RECALC_COMPLIANCE_FOR_ON_EQ_RELEASE
                  ? "async.tasks.docRevId"
                  : "async.tasks.pageDetailsId"
              }
            />
          }
          multiline
          onChange={handleUserEmailsChange}
          value={uuid}
          variant="filled"
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={() => {
            handleuuidFormSubmit(uuid);
          }}
        >
          <Text translation={"common.submit"} />
        </Button>
      </Box>
    </Box>
  );
};
export default UUIDAsyncTaskPresenter;
