import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, FormikProps } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { pageDetailsActions } from '../../../state/ducks/pageDetails';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { toastError } from '../../components/notifications';
import Text from '../../components/Text';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { PageDetailsFormPresenter } from '../form/presenter';
import { toPageDetailsBodyValues } from '../transform';
import { PageDetailsCategory, PageDetailsCategoryValues } from '../types';

interface Props {
  dialog: DialogHandler
}

export const PageDetailsForm: React.FunctionComponent<Props> = ({
  dialog,
}) => {
  const initialValues = {
    category: '',
    addNewBtnLabel: '',
    columns: null,
    config: null,
    helpModule: null,
  };

  const addPageDetailsAction = useActionCreator(pageDetailsActions.addPageDetails);
  const dispatch = useDispatch();

  const async = useAsync({
    onSuccess: () => {
      dispatch(tableSearchActions.clearAllTables());
      dialog.close();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });

  const onSubmit = (values: PageDetailsCategoryValues) => {
    async.start(
      addPageDetailsAction,
      toPageDetailsBodyValues(values),
      async,
    );
  };

  const render = (props: FormikProps<PageDetailsCategory>) => (
    <PageDetailsFormPresenter
      handleTransition={dialog.close}
      transitionLabel="common.close"
      {...props}
    />
  );

  return (
    <Dialog
      open={dialog.isOpen}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>
        <Text translation="common.add.document.type" />
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {render}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
