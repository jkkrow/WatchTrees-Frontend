import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import axios from "axios";

import store from "store/index";
import App from "./App";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
