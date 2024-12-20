import { Subscription } from '../../../../../state/ducks/company/types';

export interface SubscriptionItemProps {
  subscription: Subscription
  onToggle: (state: boolean, subscription: Subscription) => void
}
