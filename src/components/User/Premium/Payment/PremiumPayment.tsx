import { PayPalButtons } from '@paypal/react-paypal-js';

import GoBack from 'components/Common/UI/GoBack/GoBack';
import { useAppSelector } from 'hooks/common/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PremiumPlan } from 'store/slices/user-slice';
import './PremiumPayment.scss';

interface PremiumPaymentProps {
  plan: PremiumPlan;
}

const PremiumPayment: React.FC<PremiumPaymentProps> = ({ plan }) => {
  const { userData } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    !userData && navigate('/auth');
  }, [userData, navigate]);

  return userData ? (
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
              plan_id: plan.id,
              custom_id: userData._id,
            });
          }}
          onApprove={async (data, actions) => {
            console.log(data);
          }}
        />
      </div>
    </div>
  ) : null;
};

export default PremiumPayment;
