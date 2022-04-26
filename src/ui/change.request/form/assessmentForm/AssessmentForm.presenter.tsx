import { Box, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import React, { useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { SessionTimeoutService } from "../../../../common/utils/sessionTimeout";
import { ChangeRequest } from "../../../../state/ducks/changeRequest/types";
import { AsyncState } from "../../../../state/types";
import InputField from "../../../components/forms/fields/Input";
import TextEditorField from "../../../components/forms/fields/RichTextEditor";
import { required, validator } from "../../../components/forms/fields/validators";
import { useFormContext } from "../../../components/forms/FormContext";
import FormWrapper from "../../../components/forms/FormWrapper";
import PromptIfDirty from "../../../components/forms/PromptIfDirty";
import ScrollToError from "../../../components/forms/ScrollToError";
import SessionTimer from "../../../components/forms/SessionTimer";
import useDialog from "../../../hooks/useDialog";
import useDidMount from "../../../hooks/useDidMount";
import FormHeader from "../../form/assessmentForm/FormHeader";
import { ChangeRequestFormValues } from "../types";
import styles from "./AssessmentForm.styles";

interface Props
  extends WithStyles<typeof styles>,
  FormikProps<ChangeRequestFormValues>,
  RouteComponentProps {
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  FBContainer?: React.MutableRefObject<HTMLDivElement | null>;
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
  history,
}) => {
  const formContext = useFormContext();
  const didMount = useDidMount();
  const sessionDialog = useDialog();
  const sessionService = SessionTimeoutService.getInstance();

  formIdContext = React.createContext<string | undefined>(
    values.formDocument?.id,
  );
  const timeoutCallback = () => {
    sessionDialog.open();
  };

  useEffect(() => {
    if (didMount) {
      formContext.submitForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sessionService.setTimeoutCallback(timeoutCallback);
    return () => {
      sessionService.stopSessionTimer();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      <SessionTimer sessionDialog={sessionDialog} isFormDirty={dirty} isAR/>
      <FormHeader {...{ changeRequest, asyncState }}/>
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
          when={dirty}
          navigate={(path) => {
            history.push(path);
          }}
          shouldBlockNavigation={() => {
            if (dirty && changeRequest) {
              return true;
            }
            return false;
          }}
          isAR
        />
        <Box>
          <InputField
            name="title"
            label="common.title"
            inputProps={{ id: "title", multiline: true, rows: "2" }}
            validate={validator(required)}
          />
          <TextEditorField
            data-testid="description"
            name="description"
            label="common.description"
            validate={validator(required)}
          />
          <div ref={FBContainer} />
        </Box>
      </FormWrapper>
    </div>
  );
};

export default withRouter(withStyles(styles)(AssessmentFormPresenter));
