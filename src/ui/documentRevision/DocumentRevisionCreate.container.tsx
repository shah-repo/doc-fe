import { makeStyles } from '@material-ui/core';
import React, { useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { translate } from '../../common/intl';
import { documentRevisionsActions } from '../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from '../../state/ducks/documentRevisions/types';
import { documentsActions, documentsSelectors } from '../../state/ducks/documents';
import { ApplicationState } from '../../state/reducers';
import { AlertDialog } from '../components/dialogs';
import { documentVersionPath } from '../document.revision/utils/paths';
import FBDataStore from '../form.builder/FBStore/FBDataStore';
import useAsync from '../hooks/useAsync';
import useDialog from '../hooks/useDialog';
import { DocumentCloneType } from './Clone.container';
import DocumentRevisionForm from './forms/DocumentRevisionForm.container';
import { toDocumentRevisionFormValuesForOutput, toDocumentRevisionFormValuesWithRevisionChange, toNewVersionRequestBody } from './forms/transform';
import { DocumentRevisionFormValues } from './forms/types';
import { checkIsDocumentEquipment } from './helpers/checkDocumentGroup';
import useMissingSecurityGroups from './helpers/useMissingSecurityGroups';

interface DispatchProps {
  create: typeof documentRevisionsActions.create
  setDocId: typeof documentsActions.setDocumentProposedId
  loadDocumentProposedId: typeof documentsActions.loadDocumentProposedId
  loadDocument: typeof documentRevisionsActions.loadDocument
}

interface OwnProps {
  documentRevision: DocumentRevision
  type?: DocumentCloneType
  isNewVersion?: boolean
  isSliderView?: boolean
}

interface StateProps {
  proposedDocId: string
}

type DocumentRevisionCreateContainerProps =
  & StateProps
  & OwnProps
  & DispatchProps
  & RouteComponentProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  proposedDocId: documentsSelectors.getProposedDocId(state),
});

export const DEFAULT_INITIAL_VALUES = (): DocumentRevisionFormValues => ({
  name: '',
  description: '',
  attachments: [],
  referenceTo: [],
  revisionChangeType: RevisionChangeType.NextRevision,
  document: {
    docId: '',
    documentType: { id: '' },
  },

  formTemplate: { outputDocumentTypes: [], schema: [] },
  securityGroups: [],
  lifecyclePhaseId: '',
  securityEmployees: [],
  operators: [],
});

const useStyles = makeStyles({
  message: {
    whiteSpace: 'pre-wrap',
  },
});

const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create,
  history,
  documentRevision,
  setDocId,
  type = 'none',
  loadDocumentProposedId,
  proposedDocId,
  loadDocument,
  isNewVersion,
  isSliderView,
}) => {
  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const isEquipment = checkIsDocumentEquipment(documentRevision?.document?.documentType?.groupOptions);
  const calculateSecurityGroups = useMissingSecurityGroups();

  const groupsAlert = useDialog();
  const groupsAlertConfig = useRef<{ documentType: string, groups: string[], values: DocumentRevisionFormValues }>();

  const classes = useStyles();

  const initialValues = useMemo(() => {
    if (type === 'newVersion') {
      return toDocumentRevisionFormValuesWithRevisionChange(documentRevision);
    }
    if (type === 'newOutput') {
      return toDocumentRevisionFormValuesForOutput(documentRevision);
    }
    if (history.location.state) {
      return toDocumentRevisionFormValuesForOutput(history.location.state as DocumentRevision);
    }
    return DEFAULT_INITIAL_VALUES();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentRevision?.id, type, history.location.state]);

  type = history.location.state ?? false ? 'newOutput' : type;

  const async = useAsync<DocumentRevision>({
    onSuccess: (createdDocumentRevision?) => {
      if (createdDocumentRevision) {
        setDoNotPrompt(true);
        loadDocument(createdDocumentRevision.document.id);
        if (isSliderView) {
          FBDataStore.selectedSliderInfo = { documentId: createdDocumentRevision.document.id, documentRevision: createdDocumentRevision };
        } else {
          history.push(
            documentVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id),
          );
        }
      }
    },
  });

  const saveDocumentRevision = (values: DocumentRevisionFormValues) => {
    if (isEquipment && documentRevision?.status === DocumentRevisionStatus.Released) {
      values.formInput = documentRevision.formInput;
    }

    const documentRevisionCreateRequestBody = toNewVersionRequestBody(values);
    const createDocumentRevisionPromise = async.start(create, documentRevisionCreateRequestBody, async) as Promise<unknown>;

    createDocumentRevisionPromise?.then(() => {
      FBDataStore?.setRefreshData({
        ...values,
      });
    });
  };

  const onSubmit = (values: DocumentRevisionFormValues) => {
    const { missingGroups, documentType } = calculateSecurityGroups(values);

    if (documentType && missingGroups?.length > 0) {
      groupsAlertConfig.current = {
        values,
        documentType: documentType.documentTypeName,
        groups: missingGroups.map(group => group.label),
      };
      groupsAlert.open();
      return;
    }

    saveDocumentRevision(values);
  };

  const addSecurityGroupsAndSave = () => {
    const values = groupsAlertConfig.current?.values;

    if (values) {
      const { fixedSecurityGroups } = calculateSecurityGroups(values);

      saveDocumentRevision({
        ...values,
        securityGroups: fixedSecurityGroups ?? values.securityGroups,
      });
    }
  };

  const saveAsIs = () => {
    if (groupsAlertConfig.current?.values) {
      saveDocumentRevision(groupsAlertConfig.current?.values);
    }
  };

  const showRevisionTypeChange = type === 'newVersion' && !!documentRevision;

  return (
    <>
      {groupsAlert.isOpen && (
        <AlertDialog
          handler={groupsAlert}
          title="common.alert"
          confirmLabel="documentRevision.create.missing.security.groups.confirm"
          cancelLabel="documentRevision.create.missing.security.groups.cancel"
          onConfirm={addSecurityGroupsAndSave}
          onCancel={saveAsIs}
          hideCloseButton={false}
          warning
        >
          <div className={classes.message}>
            {translate(
              'documentRevision.create.missing.security.groups.message',
              {
                documentType: groupsAlertConfig.current?.documentType,
                groups: groupsAlertConfig.current?.groups.join(', '),
              },
            )}
          </div>
        </AlertDialog>
      )}
      <DocumentRevisionForm
        asyncState={async.asyncState}
        {...{
          onSubmit,
          initialValues,
          showRevisionTypeChange,
          setDocId,
          doNotPrompt,
          documentRevision,
          loadDocumentProposedId,
          proposedDocId,
          type,
          isNewVersion,
        }}
      />
    </>
  );
};

const DocumentRevisionCreateContainerWithRouter = withRouter(DocumentRevisionCreateContainer);

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  create: documentRevisionsActions.create,
  setDocId: documentsActions.setDocumentProposedId,
  loadDocumentProposedId: documentsActions.loadDocumentProposedId,
  loadDocument: documentRevisionsActions.loadDocument,
})(DocumentRevisionCreateContainerWithRouter);
