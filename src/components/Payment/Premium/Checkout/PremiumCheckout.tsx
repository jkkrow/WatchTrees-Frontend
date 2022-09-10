import GoBack from 'components/Common/UI/GoBack/GoBack';
import PaypalProvider from 'components/Payment/Paypal/Provider/PaypalProvider';
import PaypalSubscription from 'components/Payment/Paypal/Subscription/PaypalSubscription';
import { PremiumPlan } from 'store/slices/user-slice';
import './PremiumCheckout.scss';

interface PremiumCheckoutProps {
  plan: PremiumPlan;
  onSuccess: (subscriptionId: string) => void;
}

const PremiumCheckout: React.FC<PremiumCheckoutProps> = ({
  plan,
  onSuccess,
}) => {
  return (
    <div className="premium-checkout">
      <GoBack />

      <div className="premium-checkout__summary">
        <h2>Checkout Summary</h2>
        <h4 data-label="Name">
          {plan.name[0].toUpperCase() + plan.name.substring(1)}
        </h4>
        <h4 data-label="Price">${plan.price}/month</h4>
      </div>

      <PaypalProvider>
        <PaypalSubscription plan={plan} onSuccess={onSuccess} />
      </PaypalProvider>
    </div>
  );
};

export default PremiumCheckout;
