import { Box, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import React, { ReactNode, useEffect } from "react";
import { ChangeRequest } from "../../../../state/ducks/changeRequest/types";
import { FBDocumentRevisionProps } from "../../../../state/ducks/documentRevisions/types";
import { AsyncState } from "../../../../state/types";
import InputField from "../../../components/forms/fields/Input";
import TextEditorField from "../../../components/forms/fields/RichTextEditor";
import { required, validator } from "../../../components/forms/fields/validators";
import { useFormContext } from "../../../components/forms/FormContext";
import FormWrapper from "../../../components/forms/FormWrapper";
import PromptIfDirty from "../../../components/forms/PromptIfDirty";
import ScrollToError from "../../../components/forms/ScrollToError";
import { styles as AutoCompleteStyles } from "../../../form.builder/styles/FBAutocomplete.styles";
import useDidMount from "../../../hooks/useDidMount";
import { ChangeRequestFormValues } from "../types";
import styles from "./AssessmentForm.styles";
import FormHeader from "./FormHeader";

interface Props
  extends WithStyles<typeof styles>,
  FormikProps<ChangeRequestFormValues> {
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  FBContainer?: React.MutableRefObject<HTMLDivElement | null>;
  sidebar?: ReactNode;
  chosenForm?: FBDocumentRevisionProps;
}

export let formIdContext = React.createContext<string | undefined>(undefined);

const AssessmentFormPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  classes,
  changeRequest,
  dirty,
  isSubmitting,
  isValidating,
  initialValues,
  resetForm,
  errors,
  values,
  FBContainer,
  doNotPrompt,
  chosenForm,
  sidebar,
}) => {
  const formContext = useFormContext();
  const didMount = useDidMount();

  formIdContext = React.createContext<string | undefined>(
    values.formDocument?.id,
  );

  useEffect(() => {
    if (didMount) {
      formContext.submitForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      <FormHeader {...{ changeRequest, asyncState }}/>
      <Box width="100%" height="100%" display="flex" marginTop={1.25}>
        <Box width="100%" px="34px" height="calc(100vh - 132px)" overflow="auto" className="hide-scroll">
          <FormWrapper
            dirty={dirty}
            resetForm={resetForm}
            initialValues={initialValues}
          >
            <ScrollToError
              isSubmitting={isSubmitting}
              isValidating={isValidating}
              errors={errors}
            />
            <PromptIfDirty
              dirty={dirty}
              doNotPrompt={doNotPrompt}
            />
            <Box>
              <InputField
                name="title"
                label="common.title"
                inputProps={{ id: "title", multiline: true, rows: "2" }}
                validate={validator(required)}
                labelProps={AutoCompleteStyles.labelStyle}
              />
              <TextEditorField
                data-testid="description"
                name="description"
                label="common.description"
                validate={validator(required)}
                labelProps={AutoCompleteStyles.labelStyle}
              />
              <div ref={FBContainer} />
            </Box>
          </FormWrapper>
        </Box>
        <Box height="80vh">
          {sidebar}
        </Box>
      </Box>
    </div>
  );
};

export default withStyles(styles)(AssessmentFormPresenter);
