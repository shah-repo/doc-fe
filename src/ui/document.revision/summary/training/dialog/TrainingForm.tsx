import { Box, Button, Grid, Typography } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../../../state/types";
import InputField from "../../../../components/forms/fields/Input";
import { required, validator } from "../../../../components/forms/fields/validators";
import FormMessage from "../../../../components/forms/FormMessage";
import FormProgress from "../../../../components/forms/FormProgress";
import SubmitButton from "../../../../components/forms/SubmitButton";
import Text from "../../../../components/Text";

interface PasswordFormProps {
  asyncState: AsyncState;
  cancel: () => void;
}

const TrainingForm: React.FunctionComponent<PasswordFormProps> = ({
  cancel,
  asyncState,
}) => (
  <Form>
    <FormMessage asyncState={asyncState} />
    <Grid container>
      <Grid item  xs={6}>
        <Grid item xs={12}>
          <Typography variant="h6">
            <Text translation="training.trn.id" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            <Text translation="training.doc.id.rev" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            <Text translation="common.title" />
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={6} >
        <Grid item xs={12}>
          <Text translation="training.acknowledge.statement" values={{ name: "Maja" }}/>
        </Grid>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
          <InputField
            name="password"
            label="training.acknowladge.password"
            dataCy="training.acknowladge.password"
            inputProps={{ type: "password" }}
            validate={validator(required)}
          />
          <FormProgress asyncState={asyncState} />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="text"
              color="secondary"
              data-cy="reject.request"
              disabled={asyncState.status === AsyncStatus.Active}
              onClick={cancel}
            >
              <Text translation="transition.action.cancel" />
            </Button>
            <SubmitButton
              id="passwordConfirm"
              dataCy="passwordConfirm"
              asyncState={asyncState}
              label="transition.action.confirm"
              fullWidth={false}
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  </Form>
);

export default TrainingForm;
