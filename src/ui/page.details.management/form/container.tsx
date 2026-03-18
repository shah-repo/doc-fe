import { Formik, FormikProps } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { PageDetails } from '../../../state/ducks/documentRevisions/documentType/types';
import { pageDetailsActions } from '../../../state/ducks/pageDetails';
import AlertDialog from '../../app/alert.dialog/AlertDialog';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import { toPageDetailsBodyValues, toPageDetailsInitialValues } from '../transform';
import { PageDetailsCategory, PageDetailsCategoryValues } from '../types';
import { PageDetailsFormPresenter } from './presenter';

interface Props {
  pageDetails: PageDetails
}

export const PageDetailsFormContainer: React.FunctionComponent<Props> = ({ pageDetails }) => {
  const dispatch = useDispatch();
  const deleteDialog = useDialog();
  const async = useAsync({
    onError: toastError,
  });
  const { id } = pageDetails;
  const initialValues = toPageDetailsInitialValues(pageDetails);
  const transitionLabel = 'common.delete';

  const updatePageDetailsAction = useActionCreator(pageDetailsActions.updatePageDetails);

  const onSubmit = (values: PageDetailsCategoryValues) => {
    async.start(updatePageDetailsAction, id, toPageDetailsBodyValues(values), async);
  };

  const onConfirmDelete = () => {
    dispatch(pageDetailsActions.deletePageDetails(id));
    deleteDialog.close();
  };

  const render = (props: FormikProps<PageDetailsCategory>) => (
    <PageDetailsFormPresenter {...{ handleTransition: deleteDialog.open, transitionLabel }} {...props} />
  );

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
        {render}
      </Formik>
      {deleteDialog.isOpen && (
        <AlertDialog
          dialog={deleteDialog}
          confirmAction={onConfirmDelete}
          message="page.details.delete.confirm.message"
        />
      )}
    </>
  );
};
