import { Box, Button, createStyles, InputLabel, makeStyles, TextareaAutosize, Theme } from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React from "react";
import FormWrapper from "../../../components/forms/FormWrapper";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";

type Props = FormikProps<DocumentType>;

const styles = makeStyles((theme: Theme) =>
  createStyles({
    textautosizer: {
      width: "-webkit-fill-available",
      borderRadius: theme.spacing(0.5),
      borderColor: Colors.hint_gray,
      color: Colors.dark_gray,
    },
    label: {
      margin: theme.spacing(3, 0, 3, 0),
      fontWeight: "bold",
      color: Colors.dark_gray,
      fontFamily: "Open Sans, sans-serif",
    },
  },
  ));

export const NavigationManagementPresenter: React.FunctionComponent<Props> = ({
  dirty,
  resetForm,
  initialValues,
}) => {
  const classes = styles();

  return (
    <Box>
      <FormWrapper
        {...{ dirty, initialValues, resetForm }}
      >
        <Field name={"navigation"}>
          {({
            field,
          }) => (
            <>
              <InputLabel className={classes.label}>Navigation</InputLabel>
              <TextareaAutosize
                rowsMin={10}
                rowsMax={20}
                className={classes.textautosizer}
                {...field}
              />
            </>
          )}
        </Field>
        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="outlined">
            <Text translation={"common.save"} />
          </Button>
        </Box>
      </FormWrapper>
    </Box>
  );
};

export default NavigationManagementPresenter;
