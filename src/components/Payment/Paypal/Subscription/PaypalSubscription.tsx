import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppThunk } from 'hooks/common/store';
import { PremiumPlan } from 'store/slices/user-slice';
import { createSubscription } from 'store/thunks/payment-thunk';
import './PaypalSubscription.scss';

interface PaypalSubscriptionProps {
  plan: PremiumPlan;
}

const PaypalSubscription: React.FC<PaypalSubscriptionProps> = ({ plan }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const { dispatchThunk } = useAppThunk();

  const createSubscriptionHandler = async () => {
    const { subscription } = await dispatchThunk(
      createSubscription(plan.name),
      { response: { message: false } }
    );
    return subscription.id;
  };

  const captureSubscriptionHandler = async () => {};

  return (
    <div className="paypal-subscription">
      <LoadingSpinner on={isPending} />
      <div className="paypal-subscription__button">
        <PayPalButtons
          style={{
            color: 'black',
            layout: 'horizontal',
            height: 35,
          }}
          createSubscription={createSubscriptionHandler}
          onApprove={captureSubscriptionHandler}
        />
      </div>
    </div>
  );
};

export default PaypalSubscription;
