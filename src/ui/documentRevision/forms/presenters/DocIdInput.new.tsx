import { InputAdornment, Tooltip, TooltipProps } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DOCUMENT_NUMBERING_STYLE } from '../../../../state/ducks/documentRevisions/documentType/types';
import { documentsActions, documentsSelectors } from '../../../../state/ducks/documents';
import { DocIdRequestBody } from '../../../../state/ducks/documents/types';
import { AsyncStatus } from '../../../../state/types';
import InputField from '../../../components/forms/fields/Input';
import { toastError } from '../../../components/notifications';
import { styles as AutoCompleteStyles } from '../../../form.builder/styles/FBAutocomplete.styles';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import { useDocId } from '../../../hooks/docCustomization/useCustomization';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { stripAllWhitespace } from '../transform';
import useStyles from './styles/DocIdInput.styles';

interface Props {
  isDisabled: boolean
  docId?: string
  documentAcronym: string
  documentTypeId?: string
  numberingStyle?: DOCUMENT_NUMBERING_STYLE
  isShownOnDialog?: boolean
  documentId?: string
  helpText?: string
  handleDocIdUpdated?: (docId: string) => void
  docRevId?: string
}

const DocIdInputNew: React.FC<Props> = ({
  documentTypeId = '',
  isDisabled,
  docId = '',
  documentAcronym,
  numberingStyle,
  isShownOnDialog = false,
  documentId,
  helpText,
  docRevId,
  handleDocIdUpdated,
}) => {
  const classes = useStyles();
  const loadProposedDocIdState = useSelector(documentsSelectors.getLoadProposedDocIdAsyncState);
  const formik = useFormikContext();
  const dispatch = useDispatch();
  const [docIdEntered, setDocIdEntered] = useState<string>(docId);
  const [isEditingDocId, setIsEditingDocId] = useState(false);
  const [isDocIdTruncated, setIsDocIdTruncated] = useState(false);
  const [isDocIdTooltipOpen, setIsDocIdTooltipOpen] = useState(false);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const tooltipClassOverrides: NonNullable<TooltipProps['classes']> = {
    tooltip: classes.customTooltip,
    arrow: classes.customArrow,
  };
  const savedDocIdRef = useRef(docId);
  const inputElementRef = useRef<HTMLInputElement | null>(null);

  const { isVisible, label, tooltipConfig, validation: validators }
    = useDocId(documentTypeId);

  const sendDocIdUpdateRequestAction = useActionCreator(documentsActions.sendDocIdUpdateRequest);
  const sendDocIdUpdateRequestAsync = useAsync({
    onSuccess: () => {
      setIsRequestInProgress(false);
      savedDocIdRef.current = docIdEntered;
      docRevId && dispatch(documentRevisionsActions.reload(docRevId));
    },
    onError: (message: string | undefined) => {
      setIsRequestInProgress(false);
      setDocIdEntered(savedDocIdRef.current);
      toastError(message);
    },
  });

  useEffect(() => {
    if (loadProposedDocIdState.status === AsyncStatus.Error) {
      toastError(loadProposedDocIdState.message);
    }
  }, [loadProposedDocIdState]);

  useEffect(() => {
    savedDocIdRef.current = docId;
    setDocIdEntered(docId);
  }, [docId]);

  const updateDocIdTruncation = useCallback(() => {
    const input = inputElementRef.current;

    if (!input) {
      setIsDocIdTruncated(false);
      return;
    }

    requestAnimationFrame(() => {
      setIsDocIdTruncated(input.scrollWidth > input.clientWidth + 1);
    });
  }, []);

  useLayoutEffect(() => {
    if (!isEditingDocId) {
      updateDocIdTruncation();
    }
  }, [
    docIdEntered,
    documentAcronym,
    isEditingDocId,
    updateDocIdTruncation,
  ]);

  useEffect(() => {
    window.addEventListener('resize', updateDocIdTruncation);

    return () => {
      window.removeEventListener('resize', updateDocIdTruncation);
    };
  }, [updateDocIdTruncation]);

  const handleDocIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = stripAllWhitespace(event.target.value);
    setDocIdEntered(value);

    handleDocIdUpdated?.(value);
  };
  const handleDocIdFocus = () => {
    setIsDocIdTooltipOpen(false);
    setIsEditingDocId(true);
  };

  const handleDocIdBlur = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsEditingDocId(false);
    const value = stripAllWhitespace(event.target.value);
    if (value === docId) {
      requestAnimationFrame(updateDocIdTruncation);
      return;
    }

    if (!isShownOnDialog) {
      const updatedDocId = `${documentAcronym}${value}`;
      // Make a call to update the docId on the document
      if (documentId) {
        const body: DocIdRequestBody = {
          docId: updatedDocId,
        };
        setIsRequestInProgress(true);
        sendDocIdUpdateRequestAsync.start(
          sendDocIdUpdateRequestAction,
          documentId,
          body,
          sendDocIdUpdateRequestAsync,
        );
      } else {
        formik.setFieldValue('document.docId', updatedDocId);
      }
    }

    requestAnimationFrame(updateDocIdTruncation);
  };

  const fullDocId = `${documentAcronym}${docIdEntered}`;
  const canEvaluateTooltip = Boolean(fullDocId) && !isEditingDocId;
  const isTooltipEligible = canEvaluateTooltip && isDocIdTruncated;

  const closeDocIdTooltip = () => {
    setIsDocIdTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    const input = inputElementRef.current;

    if (!canEvaluateTooltip || !input) {
      setIsDocIdTooltipOpen(false);
      return;
    }

    const isTruncatedNow = input.scrollWidth > input.clientWidth + 1;
    setIsDocIdTruncated(isTruncatedNow);
    setIsDocIdTooltipOpen(isTruncatedNow);
  };

  const handleTooltipClose = () => {
    closeDocIdTooltip();
  };

  useEffect(() => {
    if (!isTooltipEligible && isDocIdTooltipOpen) {
      closeDocIdTooltip();
    }
  }, [isTooltipEligible, isDocIdTooltipOpen]);

  if (!isVisible && !isShownOnDialog) {
    return null;
  }

  const inputProps = {
    id: 'document.docId',
    disabled: isDisabled,
    startAdornment: <InputAdornment position="start" classes={{ positionStart: classes.adornmentStart }}>{documentAcronym}</InputAdornment>,
    value: docIdEntered,
    onChange: handleDocIdChange,
    onFocus: handleDocIdFocus,
    onClick: closeDocIdTooltip,
    onBlur: handleDocIdBlur,
    inputRef: inputElementRef,
    classes: {
      input: classes.outlinedInput,
    },
  };

  return (
    <>
      {isRequestInProgress && (
        <span>{translate('common.updating.doc.id')}</span>
      )}
      <CustomLabelTooltip {...{ tooltipConfig }}>
        <Tooltip
          title={fullDocId}
          arrow
          placement="top-start"
          PopperProps={inputElementRef.current ? { anchorEl: inputElementRef.current } : undefined}
          classes={tooltipClassOverrides}
          open={isTooltipEligible && isDocIdTooltipOpen}
          onOpen={handleTooltipOpen}
          onClose={handleTooltipClose}
          disableHoverListener={!canEvaluateTooltip}
          disableFocusListener
          disableTouchListener
        >
          <div className={classes.inputWrapper}>
            <InputField
              name="document.docId"
              label={label}
              inputProps={inputProps}
              validate={validators}
              inputStyleProps={classes.input}
              labelProps={AutoCompleteStyles.labelStyle}
              helpText={isDisabled ? '' : helpText}
            />
          </div>
        </Tooltip>
      </CustomLabelTooltip>
    </>
  );
};

export default DocIdInputNew;
