import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';

import store from 'store/index';
import ThemeProvider from 'providers/ThemeProvider';
import App from './App';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
