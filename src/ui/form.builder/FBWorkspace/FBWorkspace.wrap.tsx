import { differenceBy, filter, isEmpty, map } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FB, FBDialogState, FBInlineApprovalBody, FBSchemaProps, FBSectionTypes, FBSnackbarState, FBWorkspaceMode, FBWorkspaceProps, FBWorkspaceState, FBWorkspaceModeOptions } from '..';
import { SM } from '../../../App';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { store } from '../../../state/store';
import { checkIsDocumentEquipment, checkIsDocumentForm } from '../../documentRevision/helpers/checkDocumentGroup';

// Disable missing translation message for the non translation cases.
const consoleError = console.error.bind(console);
console.error = (message, ...args) => {
  if (
    typeof message === 'string'
    && (message.startsWith('[React Intl] Cannot format message:') || message.startsWith('[React Intl] Missing message:'))
  ) {
    return;
  }
  consoleError(message, ...args);
};

export const withFBWorkspace = <T extends FBWorkspaceProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    workspaceState,
    dialogState,
    snackbarState,
    mode,
    document,
    changeRequest,
    autosave = false,
    schema,
    withoutBottomBar,
    ...props
  }: T) => {
    const dispatch = useDispatch();
    const { _formState, _documentRevisionFormState, _tabsState } = SM.useStores();
    const { bookmarkState } = FB.useStores();
    const groupOptions = workspaceState?.document?.document?.documentType?.groupOptions;
    const isStarterRequired = () => {
      const isEquipmentDoc = checkIsDocumentEquipment(groupOptions);
      return ['design', 'formDesign'].includes(workspaceState?.mode as string)
        && !_tabsState?.isTabActive('calpmhistory')
        && !(isEquipmentDoc && _tabsState?.isTabActive('overview'));
    };
    autosave = _formState?.autosave ?? false;

    if (isEmpty(workspaceState)) {
      workspaceState = FB.useRef<FBWorkspaceState>(FBWorkspaceState, {
        schema,
        mode,
        autosave,
      });
    }

    useObserver(() => {
      if (!isEmpty(workspaceState?.schema) && isEmpty(workspaceState?.document?.schema)) {
        schema = workspaceState?.schema;
      }
    });

    // Bridging to new context

    SM.reaction(
      () => workspaceState?.schema,
      (schema: FBSchemaProps[] | undefined) => {
        _documentRevisionFormState?.setFBSchema(schema);
      },
    );

    SM.reaction(
      () => workspaceState?.mode,
      (mode: FBWorkspaceMode | undefined) => {
        _formState?.setMode(mode ?? 'none');
      },
    );

    SM.reaction(
      () => _formState?.mode,
      (mode?: FBWorkspaceMode) => {
        workspaceState?.setMode(mode ?? 'none');
      },
    );

    SM.reaction(
      () => _formState?.autosave,
      (autosave?: boolean) => {
        workspaceState?.setAutosave(autosave ?? false);
      },
    );

    SM.reaction(
      () => workspaceState?.isDirty,
      (isDirty: boolean | undefined) => {
        _formState?.setDirty(isDirty ?? false);
      },
    );

    SM.reaction(
      () => workspaceState?.loading,
      (loading: boolean | undefined) => {
        _formState?.setLoading(loading);
      },
    );

    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    snackbarState = FB.useRef<FBSnackbarState>(FBSnackbarState);
    workspaceState && (workspaceState.document = document);
    const { formInput = {} } = document ?? {};
    workspaceState && (workspaceState.formInput = formInput);

    // Form options should remain disabled in output doc types, regardless of their state.
    withoutBottomBar = ![
      FBWorkspaceModeOptions.DESIGN,
      FBWorkspaceModeOptions.FORMPREVIEW,
    ].includes(workspaceState?.mode as FBWorkspaceModeOptions)
      && !checkIsDocumentForm(groupOptions);

    React.useEffect(() => {
      map(formInput, (value, key) => {
        if (!workspaceState?.formInputSync.get(key)) {
          workspaceState?.setFormInputSync(key, value);
        }
      });
    }, [formInput, workspaceState]);

    React.useEffect(() => {
      reaction(
        () => workspaceState?.loadAudit,
        (state) => {
          if (!state) { return; }
          const { id } = workspaceState ?? {};
          if (!id) { return; }
          dispatch(documentRevisionsActions.loadAudit(id));
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      const schemaDiff = differenceBy(workspaceState?.schema, schema ?? [], 'name');
      const sections = filter(schemaDiff, (schemaItem) =>
        schemaItem.type && FBSectionTypes.includes(schemaItem.type));
      bookmarkState?.removeBookmarks(map(sections, 'name'));
      workspaceState && (workspaceState.schema = schema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schema, workspaceState]);

    React.useEffect(() => {
      if (!workspaceState) { return; }
      workspaceState.approvals = document?.approvals as FBInlineApprovalBody[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document?.approvals]);

    React.useEffect(() => {
      if (!workspaceState) { return; }
      workspaceState.setAutosave(autosave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autosave]);

    // *TODO: find a way to reset constructor props
    useEffect(() => {
      if (!workspaceState) { return; }
      workspaceState.changeRequest = changeRequest;
      workspaceState.externalState = store.getState();
    }, [workspaceState, changeRequest]);

    useEffect(() => reaction(
      () => workspaceState?.schema,
      () => {
        const canAddFBFields = workspaceState?.mode === 'design' || workspaceState?.mode === 'formDesign';
        if (!canAddFBFields) { return; }
        workspaceState?.saveDocRev();
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    return Component({
      ...(props as T),
      schema,
      mode,
      dialogState,
      workspaceState,
      snackbarState,
      autosave,
      withoutBottomBar,
      _tabsState,
      isStarterRequired,
    });
  };

  return (props: T) => Comp(props);
};
