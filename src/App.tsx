import { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import VideoListPage from 'pages/Video/VideoListPage';
import VerifyEmailPage from 'pages/Auth/VerifyEmailPage';
import AccountPage from 'pages/User/AccountPage';
import UserVideoListPage from 'pages/User/UserVideoListPage';
import UploadVideoPage from 'pages/Upload/UploadVideoPage';
import HistoryPage from 'pages/User/HistoryPage';
import LoginPage from 'pages/Auth/LoginPage';
import SendRecoveryEmailPage from 'pages/Auth/SendRecoveryEmailPage';
import ResetPasswordPage from 'pages/Auth/ResetPasswordPage';
import Header from 'components/Layout/Header/Header';
import Footer from 'components/Layout/Footer/Footer';
import { useInterval } from 'hooks/timer-hook';
import { useAppDispatch, useAuthSelector } from 'hooks/store-hook';
import {
  logout,
  updateRefreshToken,
  updateAccessToken,
} from 'store/actions/auth';
import './App.scss';

const App: React.FC = () => {
  const { refreshToken, userData } = useAuthSelector();
  const dispatch = useAppDispatch();

  const [accessTokenInterval] = useInterval();

  /*
   * AUTH CYCLE
   */

  useEffect(() => {
    const refreshTokenJSON = localStorage.getItem('refreshToken');

    if (!refreshTokenJSON) return;

    const refreshToken = JSON.parse(refreshTokenJSON);

    if (refreshToken.expiresIn > Date.now()) {
      dispatch(updateRefreshToken(refreshToken.value));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!refreshToken) return;

    accessTokenInterval(() => {
      dispatch(updateAccessToken(refreshToken.value));
    }, 1000 * 60 * 14);
  }, [dispatch, refreshToken, accessTokenInterval]);

  return (
    <BrowserRouter>
      <Header />
      <main>
        {userData && (
          <Switch>
            <Route exact path="/" component={VideoListPage} />
            <Route
              exact
              path="/auth/verify-email/:token"
              component={VerifyEmailPage}
            />

            <Route exact path="/account" component={AccountPage} />
            <Route exact path="/my-videos" component={UserVideoListPage} />
            <Route exact path="/new-video" component={UploadVideoPage} />
            <Route exact path="/history" component={HistoryPage} />
            <Redirect exact to="/" />
          </Switch>
        )}
        {!userData && (
          <Switch>
            <Route exact path="/" component={VideoListPage} />
            <Route
              exact
              path="/auth/verify-email/:token"
              component={VerifyEmailPage}
            />

            <Route exact path="/auth" component={LoginPage} />
            <Route
              exact
              path="/auth/send-recovery-email"
              component={SendRecoveryEmailPage}
            />
            <Route
              exact
              path="/auth/reset-password/:token"
              component={ResetPasswordPage}
            />
            <Redirect exact to="/auth" />
          </Switch>
        )}
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
