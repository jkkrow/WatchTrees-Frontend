import { useRef, useState } from 'react';
import dropin, { Dropin } from 'braintree-web-drop-in';

import GoBack from 'components/Common/UI/GoBack/GoBack';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppSelector, useAppThunk } from 'hooks/common/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PremiumPlan } from 'store/slices/user-slice';
import { fetchClientToken } from 'store/thunks/payment-thunk';
import './PremiumPayment.scss';

interface PremiumPaymentProps {
  plan: PremiumPlan;
}

const PremiumPayment: React.FC<PremiumPaymentProps> = ({ plan }) => {
  const { userData } = useAppSelector((state) => state.user);
  const { dispatchThunk, data, loading } = useAppThunk();

  const [braintreeInstance, setBraintreeInstance] = useState<Dropin>();

  const dropinContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    !userData && navigate('/auth');
  }, [userData, navigate]);

  useEffect(() => {
    dispatchThunk(fetchClientToken());
  }, [dispatchThunk]);

  useEffect(() => {
    (async () => {
      if (!dropinContainer.current || !data) return;

      const instance = await dropin.create({
        authorization: data.clientToken,
        container: dropinContainer.current,
      });

      setBraintreeInstance(instance);
    })();
  }, [data]);

  return userData ? (
    <div className="premium-payment">
      <GoBack />
      <LoadingSpinner on={loading} overlay />

      <div className="premium-payment__summary">
        <h2>Checkout Summary</h2>
        <h4 data-label="Name">{plan.name}</h4>
        <h4 data-label="Price">${plan.price}/Month</h4>
      </div>

      <div className="premium-payment__checkout">
        <div ref={dropinContainer}></div>
      </div>
    </div>
  ) : null;
};

export default PremiumPayment;
