import { Box, Button, Grid, InputLabel, TextareaAutosize } from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React from "react";
import InputField from "../../components/forms/fields/Input";
import FormWrapper from "../../components/forms/FormWrapper";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";
import { PageDetailsCategory } from "../types";
import styles from "./styles";

interface Props extends FormikProps<PageDetailsCategory> {
  handleTransition: () => void;
  transitionLabel: Translation;
}

export const PageDetailsFormPresenter: React.FunctionComponent<Props> = ({
  dirty,
  resetForm,
  initialValues,
  handleTransition,
  transitionLabel,
  ...props
}) => {
  const classes = styles();
  const autoSizerRenderer = (props) =>
    <Field name={props.name}>
      {({
        field,
      }) => (
        <>
          <InputLabel className={classes.label}>{props.label}</InputLabel>
          <TextareaAutosize
            rows={5}
            className={classes.textautosizer}
            {...field}
          />
        </>
      )}
    </Field>;

  return (
    <Grid container className={classes.gridWrapper}>
      <FormWrapper
        dirty={dirty}
        resetForm={resetForm}
        initialValues={initialValues}
      >
        <Box minWidth={700}>
          <InputField
            name="category"
            label="Category"
            inputProps={{ id: "category" }}
          />
          <InputField
            name="addNewBtnLabel"
            label="Add New Button Label"
            inputProps={{ id: "addNewBtnLabel" }}
          />
          {autoSizerRenderer({ label: "Columns", name: "columns" })}
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={6}>
          <Button type="submit" variant="outlined">
            <Text translation={"common.save"} />
          </Button>
          <Button onClick={handleTransition} variant="outlined">
            <Text translation={transitionLabel} />
          </Button>
        </Box>
      </FormWrapper>
    </Grid>

  ); };
