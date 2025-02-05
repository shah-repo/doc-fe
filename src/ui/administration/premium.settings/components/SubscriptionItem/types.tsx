import { PremiumFeatureSubscription } from '../../../../../state/ducks/company/types';

export interface SubscriptionItemProps {
  subscription: PremiumFeatureSubscription
  onToggle: (state: boolean, subscription: PremiumFeatureSubscription) => void
}
