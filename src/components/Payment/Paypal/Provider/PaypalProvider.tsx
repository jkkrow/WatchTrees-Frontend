import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PaypalProvider: React.FC = ({ children }) => {
  return (
    <PayPalScriptProvider
      options={{
        'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID!,
        vault: true,
        intent: 'subscription',
        currency: 'USD',
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default PaypalProvider;
