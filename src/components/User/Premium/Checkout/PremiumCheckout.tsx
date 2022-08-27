import GoBack from 'components/Common/UI/GoBack/GoBack';
import PaymentForm from 'components/Payment/Form/PaymentForm';
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
        <h4 data-label="Name">{plan.name}</h4>
        <h4 data-label="Price">${plan.price}/Month</h4>
      </div>
      <PaymentForm />
    </div>
  ) : null;
};

export default PremiumCheckout;
