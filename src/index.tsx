import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import axios from 'axios';

import store from 'store/index';
import ThemeProvider from 'providers/ThemeProvider';
import App from './App';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

const initialOptions = {
  'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID!,
  currency: 'USD',
  vault: true,
  intent: 'subscription',
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <PayPalScriptProvider options={initialOptions}>
          <App />
        </PayPalScriptProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
