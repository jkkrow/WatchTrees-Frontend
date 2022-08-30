import { useRef, useState } from 'react';
import dropin, { Dropin } from 'braintree-web-drop-in';

import Button from 'components/Common/Element/Button/Button';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import { useAppThunk } from 'hooks/common/store';
import { useEffect } from 'react';
import { fetchClientToken } from 'store/thunks/payment-thunk';
import './PaymentForm.scss';

interface PaymentFormProps {
  request: (nonce: string) => Promise<void>;
  requestLoading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  request,
  requestLoading,
}) => {
  const { dispatchThunk, data, loaded } = useAppThunk();

  const [braintreeInstance, setBraintreeInstance] = useState<Dropin>();
  const [isReady, setIsReady] = useState(false);

  const dropinContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatchThunk(fetchClientToken());
  }, [dispatchThunk]);

  useEffect(() => {
    (async () => {
      if (!dropinContainer.current || !data) return;

      const instance = await dropin.create({
        authorization: data.clientToken,
        container: dropinContainer.current,
        paypal: { flow: 'vault' },
        preselectVaultedPaymentMethod: false,
      });

      instance.on('paymentMethodRequestable', () => {
        setIsReady(true);
      });
      instance.on('noPaymentMethodRequestable', () => {
        setIsReady(false);
      });

      setBraintreeInstance(instance);
    })();
  }, [data]);

  const requestPaymentHandler = async () => {
    if (!braintreeInstance) return;

    const payload = await braintreeInstance.requestPaymentMethod();

    // ajax call
    await request(payload.nonce);

    braintreeInstance.teardown();
    setBraintreeInstance(undefined);
  };

  return (
    <div className="payment-form">
      <LoadingSpinner on={!loaded} />
      <div ref={dropinContainer}></div>
      {loaded && (
        <Button
          onClick={requestPaymentHandler}
          disabled={!isReady}
          loading={requestLoading}
        >
          Checkout
        </Button>
      )}
    </div>
  );
};

export default PaymentForm;
