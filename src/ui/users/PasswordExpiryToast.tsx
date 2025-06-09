import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../common/intl';
import { toastInfo } from '../components/notifications';
import { RESET_PASSWORD_URL } from '../constants/urls';

export function showPasswordExpiryToast (
  daysUntilPasswordExpires: number,
): void {
  toastInfo(
    <div>
      {
        translate(daysUntilPasswordExpires === 0 ? 'password.expiring.today' : 'password.expiring',
          { daysUntilPasswordExpires },
        )
      }{' '}
      <Link to={RESET_PASSWORD_URL}>
        {translate('password.expiring.link')}
      </Link>
    </div>,
    { autoClose: 10000 },
  );
}
