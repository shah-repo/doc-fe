import React, { useState } from 'react';
import useStyles from './styles';
import { IconButton } from '../../../../../../components/forms/fields-next';
import { translate } from '../../../../../../../common/intl';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  parentDocId: string
  parentReleaseDate: string
  relatedDocId: string
}

const NeedSyncMessage: React.FC<Props> = (props) => {
  const { parentDocId, parentReleaseDate, relatedDocId } = props;

  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.icon}>
          <FontAwesomeIcon icon={regular('rotate-exclamation')} />
        </div>
        <IconButton
          kind="ghost"
          className={classes.closeButton}
          onClick={() => setIsVisible(false)}
        >
          <FontAwesomeIcon icon={regular('xmark')} />
        </IconButton>
      </div>
      <div className={classes.title}>
        {translate('form.builder.related.equipments.need.sync.error.title')}
      </div>
      <div className={classes.content}>
        <div>
          {translate(
            'form.builder.related.equipments.need.sync.error.message',
            {
              docId: (<strong>{parentDocId}</strong>) as unknown as string,
              date: parentReleaseDate,
            },
          )}
        </div>
        <div>
          {translate(
            'form.builder.related.equipments.need.sync.error.message.2',
            {
              docId: (<strong>{relatedDocId}</strong>) as unknown as string,
            },
          )}
        </div>
      </div>
    </div>
  );
};

export default NeedSyncMessage;
