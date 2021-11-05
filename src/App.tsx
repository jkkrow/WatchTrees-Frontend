import { useEffect, useRef } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from 'components/Layout/Header/Header';
import Footer from 'components/Layout/Footer/Footer';
import GlobalMessageList from 'components/Common/UI/GlobalMessage/List/GlobalMessageList';
import ProtectedRoute from 'service/ProtectedRoute';
import VideoListPage from 'pages/Video/VideoListPage';
import VerifyEmailPage from 'pages/Auth/VerifyEmailPage';
import AccountPage from 'pages/User/AccountPage';
import UserVideoListPage from 'pages/User/UserVideoListPage';
import UploadVideoPage from 'pages/Upload/UploadVideoPage';
import HistoryPage from 'pages/User/HistoryPage';
import LoginPage from 'pages/Auth/LoginPage';
import SendRecoveryEmailPage from 'pages/Auth/SendRecoveryEmailPage';
import ResetPasswordPage from 'pages/Auth/ResetPasswordPage';
import NotFoundPage from 'pages/Error/NotFoundPage';
import { useInterval } from 'hooks/timer-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import {
  logout,
  updateRefreshToken,
  updateAccessToken,
} from 'store/actions/auth-action';
import './App.scss';

const App: React.FC = () => {
  const { refreshToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const refreshCycle = useRef(false);

  const [accessTokenInterval] = useInterval();

  useEffect(() => {
    if (!refreshToken || refreshCycle.current) return;

    const i = Date.now();
    const j = i + 86400000 * 6;

    if (refreshToken.expiresIn > i && refreshToken.expiresIn < j) {
      dispatch(updateRefreshToken(refreshToken.value));
    } else if (refreshToken.expiresIn > j) {
      dispatch(updateAccessToken(refreshToken.value));
    } else {
      dispatch(logout());
    }

    refreshCycle.current = true;
  }, [dispatch, refreshToken]);

  useEffect(() => {
    if (!refreshToken) return;

    accessTokenInterval(() => {
      dispatch(updateAccessToken(refreshToken.value));
    }, 1000 * 60 * 14);
  }, [dispatch, refreshToken, accessTokenInterval]);

  return (
    <BrowserRouter>
      <GlobalMessageList />
      <Header />
      <main>
        <Switch>
          <Route exact path="/" component={VideoListPage} />
          <Route
            exact
            path="/auth/verify-email/:token"
            component={VerifyEmailPage}
          />
          <ProtectedRoute
            require={!refreshToken}
            exact
            path="/auth"
            component={LoginPage}
          />
          <ProtectedRoute
            require={!refreshToken}
            exact
            path="/auth/send-recovery-email"
            component={SendRecoveryEmailPage}
          />
          <ProtectedRoute
            require={!refreshToken}
            exact
            path="/auth/reset-password/:token"
            component={ResetPasswordPage}
          />
          <ProtectedRoute
            require={refreshToken}
            redirect="/auth"
            exact
            path="/account"
            component={AccountPage}
          />
          <ProtectedRoute
            require={refreshToken}
            redirect="/auth"
            exact
            path="/my-videos"
            component={UserVideoListPage}
          />
          <ProtectedRoute
            require={refreshToken}
            redirect="/auth"
            exact
            path="/new-video"
            component={UploadVideoPage}
          />
          <ProtectedRoute
            exact
            path="/history"
            redirect="/auth"
            require={refreshToken}
            component={HistoryPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
