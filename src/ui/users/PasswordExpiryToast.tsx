import React from 'react';
import { IntlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import { toastInfo } from '../components/notifications';
import { RESET_PASSWORD_URL } from '../constants/urls';

export function showPasswordExpiryToast (
  intl: IntlShape,
  daysUntilPasswordExpires: number,
): void {
  toastInfo(
    <div>
      {
        daysUntilPasswordExpires === 0
          ? intl.formatMessage({ id: 'password.expiring.today' })
          : intl.formatMessage(
            { id: 'password.expiring' },
            { daysUntilPasswordExpires },
          )
      }{' '}
      <Link to={RESET_PASSWORD_URL}>
        {intl.formatMessage({ id: 'password.expiring.link' })}
      </Link>
    </div>,
    { autoClose: 10000 },
  );
}
