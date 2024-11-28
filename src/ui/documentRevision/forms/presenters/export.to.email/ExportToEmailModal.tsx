import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import cx from 'classnames';
import { Field, FormikProvider, useFormik } from 'formik';
import React, { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ReactComponent as Active } from '../../../../../assets/images/radioActive.svg';
import { ReactComponent as InActive } from '../../../../../assets/images/radioInActive.svg';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { PDF } from '../../../../components/common/view.file/utils/constants';
import {
  Checkbox,
  FormControlLabel,
} from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import OverflowContent from '../../../../components/OverflowContent';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { AttachmentsInfo } from './ExportToEmail';
import { styles } from './ExportToEmailModal.styles';

interface ExportToEmailModalProps {
  value?: boolean
  revisionId?: string
  arId?: string
  isNoOptionSelected?: boolean
  hideEffectiveDateOption?: boolean
  setNoOptionSelected?: React.Dispatch<React.SetStateAction<boolean>>
}

interface AttachmentPayload {
  id: string
  name: string
}

interface ExportToEmailDialogProps {
  itemOnly: boolean
  includeAttachments: boolean
  includeDate: boolean
  sendEmail: boolean
  includeAuditLogs: boolean
  watermarkAttachments: AttachmentPayload[]

}

interface ExportToEmailDialogRef {
  getValues: () => ExportToEmailDialogProps
}

export type ExportToEmailDialogRefType = ExportToEmailDialogRef | null | undefined;

const ExportToEmailModal = forwardRef<ExportToEmailDialogRefType, ExportToEmailModalProps>(({ revisionId, isNoOptionSelected, arId, setNoOptionSelected, hideEffectiveDateOption }, ref) => {
  const classes = styles();
  const fetchAttachments = useActionCreator(
    documentRevisionsActions.getAttachmentsByDocRevId,
  );
  const fetchArAttachments = useActionCreator(
    documentRevisionsActions.getAttachmentsByARId,
  );
  const [attachments, setAttachments] = useState<AttachmentsInfo[]>();
  const [watermarkAttachments, setWatermarkAttachments]
      = useState<AttachmentPayload[]>();
  const sortAttachmentsByPrimary = (attachments?: AttachmentsInfo[]) => attachments?.sort((a: AttachmentsInfo, b: AttachmentsInfo) => Number(b.isPrimaryAttachment) - Number(a.isPrimaryAttachment));
  const getUpdatedAttchmentPayload = (attachments?: AttachmentsInfo[]) => sortAttachmentsByPrimary(attachments)?.map(({ id, name, type }) => ({ id, name: `${name}.${type}` }));
  const attachmentsAsync = useAsync<AttachmentsInfo[]>({
    onSuccess: (attachments) => {
      setAttachments(sortAttachmentsByPrimary(attachments?.filter(attachment => attachment.type === PDF)));
      setWatermarkAttachments(getUpdatedAttchmentPayload(attachments?.filter(attachment => attachment.type === PDF && attachment.isPrimaryAttachment)));
    },
    onError: () => {
      toastError(translate('common.send.to.email.error'));
    },
  });

  useEffect(() => {
    if (hideEffectiveDateOption) {
      return;
    }

    if (arId) {
      attachmentsAsync.start(fetchArAttachments, arId, attachmentsAsync);
    } else {
      attachmentsAsync.start(fetchAttachments, revisionId, attachmentsAsync, true);
    }
  }, []);

  const formik = useFormik<ExportToEmailDialogProps>({
    initialValues: {
      itemOnly: true,
      includeAttachments: true,
      includeDate: true,
      sendEmail: true,
      includeAuditLogs: false,
      watermarkAttachments: [] as AttachmentPayload[],
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: (values) => {},
  });

  const { values, setFieldValue } = formik;

  useEffect(() => {
    const { itemOnly, includeDate, includeAttachments } = values;
    if (!itemOnly && !includeDate && !includeAttachments) {
        setNoOptionSelected?.(true);
    } else {
      if (isNoOptionSelected) {
          setNoOptionSelected?.(false);
      }
    }

    if (!includeAttachments) {
      setFieldValue('includeDate', false);
    }
  }, [values]);

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return {
        ...formik?.values,
        watermarkAttachments: formik?.values.includeDate
          ? watermarkAttachments
          : [],
      } as ExportToEmailDialogProps;
    },
  }));

  const isCurrentAttachmentExists = (attachment: AttachmentsInfo) => {
    return watermarkAttachments?.some((i) => i.id === attachment.id);
  };

  const handleAttachmentToggle = (attachment: AttachmentsInfo) => {
    const updatedAttachments = isCurrentAttachmentExists(attachment)
      ? watermarkAttachments?.filter((i) => i.id !== attachment.id)
      : [...(watermarkAttachments ?? []), ...(getUpdatedAttchmentPayload([attachment]) ?? [])];
    setWatermarkAttachments(updatedAttachments as AttachmentPayload[]);
  };

  const handleIncludeAuditHistoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('includeAuditLogs', event.target.value !== 'false');
  };

  return (
    <FormikProvider value={formik}>
      <Box className={classes.paper} data-cy="share-dialog">
        <Typography
          variant="h2"
          component="h2"
          className={classes.contenttitle}
        >
          <Text translation="common.download.pdf" />
        </Typography>

        <Box display="flex" justifyContent={hideEffectiveDateOption ? 'start' : 'space-between'}>
          <FormControlLabel
            control={
              <Field
                name="itemOnly"
                type="checkbox"
                as={Checkbox}
                className={classes.check}
                data-cy="select-item-only"
              />
            }
            className={classes.checkboxContainer}
            label={translate('share.item.only')}
          />
          <FormControlLabel
            control={
              <Field
                name="includeAttachments"
                type="checkbox"
                checked={formik.values.includeAttachments}
                as={Checkbox}
                className={classes.check}
                data-cy="select-attachments"
              />
            }
            className={classes.checkboxContainer}
            label={translate('share.attachments')}
          />
          {!hideEffectiveDateOption && <FormControlLabel
            control={
              <Field
                name="includeDate"
                type="checkbox"
                as={Checkbox}
                disabled={!values.includeAttachments}
                className={classes.check}
                data-cy="select-include-date"
              />
            }
            className={classes.checkboxContainer}
            label={translate('share.include.effective.date')}
          />}
        </Box>

        {formik.values.includeDate && !hideEffectiveDateOption && <Box className={classes.attachmentsContainer} mt={3.75}>
          <Typography
            variant="h2"
            component="h2"
            className={classes.attachmentsContainerTitle}
          >
            <Text translation={attachments?.length ? 'share.select.attachment.with.effective.date' : 'common.no.attachments'} />
          </Typography>
          <List className={classes.attachmenstList}>
            {attachments?.map((attachment, index) => {
              const attachmentName = `${attachment.name}.${attachment.type}`;

              return (
                <ListItem
                  key={index}
                  className={classes.attachmentListItem}
                  button
                  onClick={() => handleAttachmentToggle(attachment)}
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    <Box>
                      <Field
                        key={isCurrentAttachmentExists(attachment)}
                        name="watermarkAttachments"
                        as={Checkbox}
                        checked={isCurrentAttachmentExists(attachment)}
                        tabIndex={-1}
                        disableRipple
                        data-cy={`select-attachment-${index}`}
                      />
                      <FontAwesomeIcon
                        icon={solid('paperclip')}
                        size="lg"
                        className={classes.attachmentIcon}
                      />
                    </Box>
                  </ListItemIcon>
                  <ListItemText>
                    <OverflowContent title={attachmentName}>
                      <span className={classes.listItemText}>
                        {attachmentName}{attachment?.isPrimaryAttachment && <span className={classes.primary}> ({translate('share.download.popup.attachment.primary')}) </span>}
                      </span>
                    </OverflowContent>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Box>}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex="0 0 50%">
            <Typography
              variant="h2"
              component="h2"
              className={cx(classes.auditContenttitle, classes.contenttitle)}
            >
              <Text translation="common.send.to.email.prompt" />
            </Typography>

            <RadioGroup
              value={formik.values.includeAuditLogs}
              onChange={handleIncludeAuditHistoryChange}
              name="includeAuditLogs"
              className={classes.radioGroup}
            >
              <FormControlLabel
                value={true}
                control={
                  <Radio
                    classes={{ root: classes.radio }}
                    checkedIcon={<Active />}
                    icon={<InActive />}
                    disableRipple
                  />
                }
                checked={formik.values.includeAuditLogs}
                className={classes.radioContainer}
                label={
                  <Typography variant="body2" className={classes.radioLabel}>
                    <Text translation="common.true" />
                  </Typography>
                }
              />
              <FormControlLabel
                value={false}
                control={
                  <Radio
                    classes={{ root: classes.radio }}
                    checkedIcon={<Active />}
                    icon={<InActive />}
                    disableRipple
                  />
                }
                checked={!formik.values.includeAuditLogs}
                className={classes.radioContainer}
                label={
                  <Typography variant="body2" className={classes.radioLabel}>
                    <Text translation="common.false" />
                  </Typography>
                }
              />
            </RadioGroup>
          </Box>
          <Box flex="0 0 50%">
            <FormControlLabel
              control={
                <Field
                  name="sendEmail"
                  type="checkbox"
                  as={Checkbox}
                  disabled
                  checked={true}
                  className={classes.check}
                  data-cy="select-send-email"
                />
              }
              value={true}
              className={classes.checkboxContainer}
              label={translate('common.send.to.email')}
            />
          </Box>
        </Box>

      </Box>
    </FormikProvider>
  );
});
export default ExportToEmailModal;
