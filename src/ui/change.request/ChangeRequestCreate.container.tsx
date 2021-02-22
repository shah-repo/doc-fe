import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ChangeRequest, changeRequestsActions } from "../../state/ducks/changeRequest";
import { documentTypeActions, DocumentTypeById } from "../../state/ducks/documentRevisions/documentType";
import { FormContext } from "../components/forms/FormContext";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import ChangeRequestFormContainer from "./form/ChangeRequestForm.container";
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from "./form/transform";
import { ChangeRequestFormValues } from "./form/types";
import { changeRequestEditPath } from "./utils/paths";
import { RouteParamsCreate } from "./utils/types";

interface OwnProps extends RouteComponentProps {
  changeRequest?: ChangeRequest;
}

type ChangeRequestCreateContainerProps = OwnProps & RouteComponentProps<RouteParamsCreate>;

const DEFAULT_INITIAL_VALUES = (): ChangeRequest => ({
  title: "",
  description: "",
} as unknown as ChangeRequest);

const ChangeRequestCreateContainer: React.FunctionComponent<ChangeRequestCreateContainerProps> =
  ({ history, match }) => {
    const documentTypeId = match.params.documentTypeId;
    const formId = match.params.formId;
    const create = useActionCreator(changeRequestsActions.create);
    const [templateOptions, setTemplateOptions] = useState<DocumentTypeById[]>([]);
    const [doNotPrompt, setDoNotPrompt] = React.useState(false);
    const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);
    const chosenForm = templateOptions
      .find((template) => template.documentType.id === documentTypeId)
      ?.forms
      .find((form) => form.id === formId);

    const asyncGetDocTypeByGroup = useAsync({
      onSuccess: (data: DocumentTypeById[] = []) => {
        setTemplateOptions(data);
      },
    });

    const async = useAsync<ChangeRequest>({
      onSuccess: (createdChangeRequest?) => {
        setDoNotPrompt(true);
        createdChangeRequest && history.push(changeRequestEditPath(createdChangeRequest.id));
      },
    });

    useEffect(() => {
      asyncGetDocTypeByGroup.start(
        getDocTypeByGroupAction,
        { docTypeGroupOption: "CHANGE_REQUEST" },
        asyncGetDocTypeByGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onSubmitAssessment = (values: ChangeRequestFormValues) => {
      async.start(create, toChangeRequestEditRequestBody(values), async);
    };

    return (
      <FormContext.Provider value={{ submitOnChange: false }}>
        <ChangeRequestFormContainer
          initialValues={toChangeRequestFormValues(DEFAULT_INITIAL_VALUES())}
          asyncState={async.asyncState}
          onSubmit={onSubmitAssessment}
          doNotPrompt={doNotPrompt}
          chosenForm={chosenForm}
        />
      </FormContext.Provider>
    );
  };

export default ChangeRequestCreateContainer;
