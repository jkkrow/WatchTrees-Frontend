import { PayPalButtons } from '@paypal/react-paypal-js';

import GoBack from 'components/Common/UI/GoBack/GoBack';
import { PremiumPlan } from 'store/slices/user-slice';
import './PremiumPayment.scss';

interface PremiumPaymentProps {
  plan: PremiumPlan;
}

const PremiumPayment: React.FC<PremiumPaymentProps> = ({ plan }) => {
  return (
    <div className="premium-payment">
      <GoBack />

      <div className="premium-payment__summary">
        <h2>Checkout Summary</h2>
        <h4 data-label="Name">{plan.name}</h4>
        <h4 data-label="Price">${plan.price}/Month</h4>
      </div>

      <div className="premium-payment__checkout">
        <PayPalButtons
          style={{
            color: 'black',
            layout: 'horizontal',
            height: 35,
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: process.env.REACT_APP_PAYPAL_PLAN_STANDARD_ID!,
            });
          }}
          onInit={() => {}}
          onApprove={async (data, actions) => {
            console.log(data);
          }}
        />
      </div>
    </div>
  );
};

export default PremiumPayment;
