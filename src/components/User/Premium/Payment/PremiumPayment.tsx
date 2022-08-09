import { PayPalButtons } from '@paypal/react-paypal-js';

import { ReactComponent as ArrowLeftIcon } from 'assets/icons/arrow-left.svg';
import './PremiumPayment.scss';

const PremiumPayment: React.FC = () => {
  return (
    <div className="premium-payment">
      {/* <ArrowLeftIcon style={{ position: 'absolute', left: 0 }} /> */}

      {/* <h2>Summary</h2> */}
      {/* <div></div> */}
      <PayPalButtons
        style={{
          color: 'black',
          layout: 'horizontal',
        }}
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: process.env.REACT_APP_PAYPAL_PLAN_STANDARD_ID!,
          });
        }}
        onApprove={async (data, actions) => {
          console.log(data);
        }}
      />
    </div>
  );
};

export default PremiumPayment;
