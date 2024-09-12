import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import cx from 'classnames';
import React, { ChangeEvent } from 'react';
import { ReactComponent as Active } from '../../../../../assets/images/radioActive.svg';
import { ReactComponent as InActive } from '../../../../../assets/images/radioInActive.svg';
import { translate } from '../../../../../common/intl';
import { Checkbox } from '../../../../components/forms/fields-next';
import Text from '../../../../components/Text';
import { styles } from './ExportToEmailModal.styles';

interface ExportToEmailModalProps {
  value: boolean
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const attachments = [
  {
    type: 'pdf',
    name: 'Enlil.pdf',
  },
  { name: 'Inspection Instructions.docx', type: 'docx' },
  { name: 'Inspection results spreadsheet.xlsx', type: 'xlsx' },
];

const ExportToEmailModal: React.FunctionComponent<ExportToEmailModalProps> = ({
  value,
  handleChange,
}) => {
  const classes = styles();

  return (
    <Box
      className={classes.paper}
    >
      <Box>
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
              <Checkbox
                classes={{
                  root: 'classes.checkbox',
                  checked: 'classes.checked',
                }}
                checked={true}
                className={classes.check}
                data-cy="select-item-only"
              />
            }
            className={classes.checkboxContainer}
            label={translate('share.item.only')}
          />
          <FormControlLabel
            control={
              <Checkbox
                classes={{
                  root: 'classes.checkbox',
                  checked: 'classes.checked',
                }}
                checked={true}
                className={classes.check}
                data-cy="select-attachments"
              />
            }
            className={classes.checkboxContainer}
            label={translate('share.attachments')}
          />
          <FormControlLabel
            control={
              <Checkbox
                classes={{
                  root: 'classes.checkbox',
                  checked: 'classes.checked',
                }}
                checked={true}
                className={classes.check}
                data-cy="select-include-date"
              />
            }
            className={classes.checkboxContainer}
            label={translate('share.include.effective.date')}
          />
        </Box>
      </Box>
      <Box className={classes.attachmentsContainer} my={3.75} >
        <Typography
          variant="h2"
          component="h2"
          className={classes.attachmentsContainerTitle}
        >
          <Text translation="share.select.attachment.with.effective.date" />
        </Typography>
        <Box>
          <List className={classes.attachmenstList}>
            {attachments.map((attachment, index) => {
              return (
                <ListItem
                  className={classes.attachmentListItem}
                >
                  <ListItemIcon className={classes.listItemIcon} >
                    <Box>
                      <Checkbox
                        checked={true}
                        tabIndex={-1}
                        disableRipple
                        data-cy={`select-attachment-${index}`}
                      />
                      <FontAwesomeIcon icon={solid('paperclip')} size="lg" className={classes.attachmentIcon} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText>
                    <Typography
                      className={classes.listItemText}
                    >
                      {attachment.name}
                    </Typography>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
      <Typography
        variant="h2"
        component="h2"
        className={cx(classes.auditContenttitle, classes.contenttitle)}
      >
        <Text translation="common.send.to.email.prompt" />
      </Typography>
      <RadioGroup value={value} onChange={handleChange} className={classes.radioGroup}>
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
            <Checkbox
              disabled
              classes={{
                root: 'classes.checkbox',
                checked: 'classes.checked',
              }}
              checked={true}
              className={classes.check}
              data-cy="select-send-email"
            />
          }
          className={classes.checkboxContainer}
          label={translate('common.send.to.email')}
        />
      </Box>
    </Box>
  );
};
export default ExportToEmailModal;
