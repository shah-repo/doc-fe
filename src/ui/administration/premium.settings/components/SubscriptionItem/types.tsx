import { PremiumFeatureSubscription } from '../../../../../state/ducks/company/types';

export interface SubscriptionItemProps {
  canUpdateFeatures: boolean
  subscription: PremiumFeatureSubscription
  onToggle: (state: boolean, subscription: PremiumFeatureSubscription) => void
}
