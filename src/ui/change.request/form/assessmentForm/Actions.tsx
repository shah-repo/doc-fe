import { ButtonProps, Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { authSelectors } from '../../../../state/ducks/auth';
import { ChangeRequest, ChangeRequestStatus, ChangeRequestTransition } from '../../../../state/ducks/changeRequest/types';
import { AsyncState } from '../../../../state/types';
import SubmitButton from '../../../components/forms/SubmitButton';
import { FB } from '../../../form.builder';
import { RouteParamsCreate } from '../../utils/types';
import AssessmentFormControlsContainer from './AssessmentFormControls.container';
import TransitionButton from './TransitionButton';

interface OwnProps {
  changeRequest?: ChangeRequest;
  asyncState: AsyncState;
}
type Props = OwnProps & RouteComponentProps<RouteParamsCreate>;

const formIdContext = React.createContext<string | undefined>(undefined);

const DocRevActions: React.FunctionComponent<Props> = ({
  changeRequest,
  asyncState,
  match,
}) => {
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  const formDocumentId = React.useContext(formIdContext) || match.params.formId;
  const documentTypeId = match.params.documentTypeId;
  const { workspaceState, formState } = FB.useStores();
  const formik = useFormikContext();

  function setFBValue() {
    switch (workspaceState?.getMode()) {
      case 'form':
        // formDocument and documentType fields should be set only once
        // and that is when we create CR, not on every save
        // because it sets dirty flag to true and prompts alert for unsaved changes
        !changeRequest && formik.setFieldValue('formDocument', { id: formDocumentId });
        !changeRequest && formik.setFieldValue('documentType', { id: documentTypeId });
        formik.setFieldValue('formInput', formState?.getValues());
        break;
      default:
        formik.setFieldValue('formTemplate', undefined);
    }
  }
  const onFormClick = () => {
    setFBValue();
    formik.submitForm();
  };

  const label = changeRequest ? 'common.save' : 'navigation.createChangeRequest';

  const renderTransitionButton = (
    isButtonShown: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => isButtonShown && changeRequest &&
        <TransitionButton
          changeRequestId={changeRequest.id}
          transition={transition}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
          isSubmitButtonShown
        />;

  const isCurrentUserOwner = changeRequest?.owner.user.email === currentUserEmail;

  const canSendToReview =
    isCurrentUserOwner && changeRequest?.state === ChangeRequestStatus.Draft;

  return (
    <Grid
      container
      alignItems="center"
      justify="flex-end"
      direction="row"
    >
      <SubmitButton
        id="submit"
        showNewButton={true}
        asyncState={asyncState}
        onClick={onFormClick}
        dataCy={label}
        label={label} />
      {renderTransitionButton(canSendToReview, 'in_review')}
      <AssessmentFormControlsContainer changeRequest={changeRequest} isButtonShown/>
    </Grid>
  );
};

export default withRouter(DocRevActions);
