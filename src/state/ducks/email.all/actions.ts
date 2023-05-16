import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';

const sendEmail = (
  id: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `/dashboard_feed/${id}/send_call_to_action_email`,
    method: 'post',
    handlers,
  });

const sendDueTrainingEmail = (
  id: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `/dashboard_feed/${id}/send_due_training_email`,
    method: 'post',
    handlers,
  });

export default {
  sendEmail,
  sendDueTrainingEmail,
};
