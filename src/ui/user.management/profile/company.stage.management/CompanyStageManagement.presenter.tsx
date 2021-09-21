import { Box, Button, createStyles, InputLabel, makeStyles, RadioGroup, Theme } from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React from "react";
import { AsyncState } from "../../../../state/types";
import RadioButton from "../../../components/forms/fields/RadioButton";
import FormProgress from "../../../components/forms/FormProgress";
import FormWrapper from "../../../components/forms/FormWrapper";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";

interface Props extends FormikProps<any> {
  asyncState: AsyncState;
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      margin: theme.spacing(3, 0, 3, 0),
      fontWeight: "bold",
      color: Colors.dark_gray,
      fontFamily: "Open Sans, sans-serif",
    },
  },
  ));

const CompanyStageManagementPresenter: React.FunctionComponent<Props> = ({
  dirty,
  resetForm,
  initialValues,
  asyncState,
}) => {
  const classes = styles();

  return (
    <FormWrapper
      {...{ dirty, initialValues, resetForm }}
    >
      <Field name={"numOfRevStages"}>
        {({
          field,
        }) => (
          <>
            <InputLabel className={classes.label}>
                Number of revision stages
            </InputLabel>
            <RadioGroup {...field}>
              <RadioButton
                // has to be string
                // if value is number, cheking radio buttons doesn't work correctly
                label={"2"}
                value={"2"}
              />
              <RadioButton
                // has to be string
                // if value is number, cheking radio buttons doesn't work correctly
                label={"3"}
                value={"3"}
              />
            </RadioGroup>
          </>
        )}
      </Field>
      <Box display="flex" justifyContent="flex-end">
        <FormProgress asyncState={asyncState} />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button type="submit" variant="outlined">
          <Text translation={"common.save"} />
        </Button>
      </Box>
    </FormWrapper>
  ); };

export default CompanyStageManagementPresenter;
