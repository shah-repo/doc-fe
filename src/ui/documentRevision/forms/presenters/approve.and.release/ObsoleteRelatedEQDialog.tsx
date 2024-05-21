import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, CircularProgress, Dialog, DialogContent, Grid, Typography } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { styles } from '../../../../change.request/dialogs/styles';
import Text from '../../../../components/Text';
import { FB } from '../../../../form.builder';
import { DialogHandler } from '../../../../hooks/useDialog';
import RelatedEquipmentsState from '../related.equipments/state';

interface Props {
  documentRevision: DocumentRevision
  handler: DialogHandler
  onAnswer: (shouldObsolete: boolean) => void
}

const ObsoleteRelatedEQDialog: React.FC<Props> = ({
  handler,
  onAnswer,
  documentRevision,
}) => {
  const classes = styles();

  const closeDialog = () => {
    handler.close();
  };

  const handleYesClick = () => {
    onAnswer(true);
    closeDialog();
  };

  const handleNoClick = () => {
    onAnswer(false);
    closeDialog();
  };

  const docId = documentRevision?.document?.docId;

  const relatedEquipmentsState = FB.useRef<RelatedEquipmentsState>(RelatedEquipmentsState, {
    parentSpecificationId: documentRevision.id,
  });

  useEffect(() => {
    relatedEquipmentsState.getRelatedEquipments();
  }, [relatedEquipmentsState]);

  const relatedEquipments = useObserver(() => relatedEquipmentsState.relatedEquipments);
  const loading = useObserver(() => relatedEquipmentsState.loading);

  return (
    <Dialog open={handler.isOpen} onClose={closeDialog}>
      <DialogContent>
        <Grid container className={classes.contentContainer}>
          <Grid item className={classes.alertIcon}>
            <FontAwesomeIcon icon={regular('circle-exclamation')} size="xl" style={{ color: '#ffc000', fontSize: '25px' }} />
          </Grid>
          <Grid item>
            <Typography data-cy="dialog-header" className={classes.alertTitle} style={{ marginTop: '4px' }}>
              <Text translation="form.builder.related.equipments.title" />!
            </Typography>
            <Typography data-cy="dialog-message" className={classes.contentText}>
              {
                translate('document.equipment.specification.relatedParts.obsolete.message1', {
                  esId: (<strong>{docId}</strong>) as unknown as string,
                })
              }
            </Typography>
            {loading && (
              <Box className={classes.loading}>
                <CircularProgress size={20} />
                <Text translation="common.loading" />
              </Box>
            )}
            {!loading && (
              <Box style={{ textIndent: '8px' }}>
                {relatedEquipments.map((equipment, index) => (
                  <Typography key={index} className={classes.contentText}>
                    {index + 1}.  {equipment?.docId}
                  </Typography>
                ))}
              </Box>
            )}
            <Typography data-cy="dialog-message" className={classes.contentText}>
              <Text translation="document.equipment.specification.relatedParts.obsolete.message2" />
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <Box className={classes.dialogAction}>
        <Button
          variant="contained"
          className={`${classes.cancelButton} ${classes.buttonLabel}`}
          onClick={handleNoClick}
          id="dialog-cancel"
          data-cy="dialog-cancel"
        >
          <Text translation="common.false" />
        </Button>
        <Button
          type="button"
          variant="contained"
          className={`${classes.submitButton} ${classes.buttonLabel}`}
          id="dialog-continue"
          data-cy="dialog-continue"
          onClick={handleYesClick}
        >
          <Text translation="common.true" />
        </Button>
      </Box>
    </Dialog>
  );
};

export default ObsoleteRelatedEQDialog;
