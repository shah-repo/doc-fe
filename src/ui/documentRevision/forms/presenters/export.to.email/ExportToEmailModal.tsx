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
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { ReactComponent as Active } from '../../../../../assets/images/radioActive.svg';
import { ReactComponent as InActive } from '../../../../../assets/images/radioInActive.svg';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import {
  Checkbox,
  FormControlLabel,
} from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { attachmentsInfo } from './ExportToEmail';
import { styles } from './ExportToEmailModal.styles';

interface ExportToEmailModalProps {
  value?: boolean
  revisionId?: string
}

const ExportToEmailModal: React.FunctionComponent<ExportToEmailModalProps>
  = React.forwardRef(({ revisionId }, ref) => {
    const classes = styles();
    const fetchAttachments = useActionCreator(
      documentRevisionsActions.getAttachmentsByDocRevId,
    );
    const [attachments, setAttachments] = useState<attachmentsInfo[]>();
    const [watermarkAttachments, setWatermarkAttachments]
      = useState<string[]>();
    const attachmentsAsync = useAsync<attachmentsInfo[]>({
      onSuccess: (attachments) => {
        setAttachments(attachments);
      },
      onError: () => {
        toastError(translate('common.send.to.email.error'));
      },
    });

    useEffect(() => {
      attachmentsAsync.start(fetchAttachments, revisionId, attachmentsAsync);
    }, []);

    const formik = useFormik({
      initialValues: {
        itemOnly: false,
        includeAttachments: false,
        includeDate: false,
        sendEmail: true,
        includeAuditLogs: false,
        watermarkAttachments: [] as string[],
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSubmit: (values) => {},
    });

    useImperativeHandle(ref, () => ({
      getValues: () => {
        return { ...formik?.values, watermarkAttachments };
      },
    }));

    const handleAttachmentToggle = (attachmentId: string) => {
      const updatedAttachments = watermarkAttachments?.includes(attachmentId)
        ? watermarkAttachments.filter((i) => i !== attachmentId)
        : [...(watermarkAttachments ?? []), attachmentId];
      setWatermarkAttachments(updatedAttachments);
    };

    return (
      <FormikProvider value={formik}>
        <Box className={classes.paper}>
          <Typography
            variant="h2"
            component="h2"
            className={classes.contenttitle}
          >
            <Text translation="common.download.pdf" />
          </Typography>

          <Box display="flex" justifyContent="space-between">
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
                  as={Checkbox}
                  className={classes.check}
                  data-cy="select-attachments"
                />
              }
              className={classes.checkboxContainer}
              label={translate('share.attachments')}
            />
            <FormControlLabel
              control={
                <Field
                  name="includeDate"
                  type="checkbox"
                  as={Checkbox}
                  className={classes.check}
                  data-cy="select-include-date"
                />
              }
              className={classes.checkboxContainer}
              label={translate('share.include.effective.date')}
            />
          </Box>

          {formik.values.includeDate && <Box className={classes.attachmentsContainer} my={3.75}>
            <Typography
              variant="h2"
              component="h2"
              className={classes.attachmentsContainerTitle}
            >
              <Text translation="share.select.attachment.with.effective.date" />
            </Typography>
            <List className={classes.attachmenstList}>
              {attachments?.map((attachment, index) => (
                <ListItem
                  key={index}
                  className={classes.attachmentListItem}
                  button
                  onClick={() => handleAttachmentToggle(attachment.id)}
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    <Box>
                      <Field
                        name="watermarkAttachments"
                        as={Checkbox}
                        checked={watermarkAttachments?.includes(attachment.id)}
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
                    <Typography className={classes.listItemText}>
                      {attachment.name}.{attachment.type}
                    </Typography>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>}

          <Typography
            variant="h2"
            component="h2"
            className={cx(classes.auditContenttitle, classes.contenttitle)}
          >
            <Text translation="common.send.to.email.prompt" />
          </Typography>

          <RadioGroup
            value={formik.values.includeAuditLogs}
            onChange={formik.handleChange}
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
              className={classes.radioContainer}
              label={
                <Typography variant="body2" className={classes.radioLabel}>
                  <Text translation="common.false" />
                </Typography>
              }
            />
          </RadioGroup>

          <Box>
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
      </FormikProvider>
    );
  });
export default ExportToEmailModal;
