import GoBack from 'components/Common/UI/GoBack/GoBack';
import PaypalProvider from 'components/Payment/Paypal/Provider/PaypalProvider';
import PaypalSubscription from 'components/Payment/Paypal/Subscription/PaypalSubscription';
import { useAppSelector } from 'hooks/common/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PremiumPlan } from 'store/slices/user-slice';
import './PremiumCheckout.scss';

interface PremiumCheckoutProps {
  plan: PremiumPlan;
}

const PremiumCheckout: React.FC<PremiumCheckoutProps> = ({ plan }) => {
  const { userData } = useAppSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    !userData && navigate('/auth');
  }, [userData, navigate]);

  return userData ? (
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
        <PaypalSubscription plan={plan} />
      </PaypalProvider>
    </div>
  ) : null;
};

export default PremiumCheckout;
