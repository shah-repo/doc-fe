import { Box, Button, createStyles, InputLabel, Link, makeStyles, TextareaAutosize, Theme } from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React from "react";
import { Nullable } from "../../../../state/ducks/common/types";
import { AsyncState } from "../../../../state/types";
import FormProgress from "../../../components/forms/FormProgress";
import FormWrapper from "../../../components/forms/FormWrapper";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";

interface Props extends FormikProps<any>{
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  s3link: Nullable<string>;
  asyncState: AsyncState;
}

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

export const WhiteLabelingManagementPresenter: React.FunctionComponent<Props> = ({
  dirty,
  resetForm,
  initialValues,
  onChange,
  s3link,
  asyncState,
}) => {
  const classes = styles();

  return (
    <Box>
      <InputLabel className={classes.label}>White Labeling</InputLabel>
      <Box mb={2}>
        <input
          id={"whiteLabelingLogo"}
          accept="image/png, image/jpeg"
          type="file"
          style={{ display: "none" }}
          onChange={onChange}
        />
        <label htmlFor={"whiteLabelingLogo"}>
          <Link variant="button" id="whiteLabelingLogo-uploadPhoto">
            Click here to upload photo to generate logo link
          </Link>
        </label>
      </Box>
      {
        s3link && <Box maxWidth={500}>
          {s3link}
        </Box>
      }
      <FormWrapper
        {...{ dirty, initialValues, resetForm }}
      >
        <Field name={"whiteLabeling"}>
          {({
            field,
          }) => (
            <>
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
          <FormProgress asyncState={asyncState} />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="outlined">
            <Text translation={"common.save"} />
          </Button>
        </Box>
      </FormWrapper>
    </Box>
  );
};

export default WhiteLabelingManagementPresenter;
