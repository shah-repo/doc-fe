import React from 'react';
import { translate } from '../../../../../../../common/intl';
import useStyles from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { light } from '@fortawesome/fontawesome-svg-core/import.macro';

interface Props {
  parentDocId: string
}

const SyncedSuccessMessage: React.FC<Props> = (props) => {
  const { parentDocId } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <FontAwesomeIcon
        className={classes.icon}
        icon={light('check-circle')}
      />
      <div>
        <div>
          <strong>{translate('form.builder.related.equipments.need.sync.success.title')}</strong>
        </div>
        <div>
          {translate(
            'form.builder.related.equipments.need.sync.success.message',
            {
              docId: (<strong>{parentDocId}</strong>) as unknown as string,
            },
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncedSuccessMessage;
