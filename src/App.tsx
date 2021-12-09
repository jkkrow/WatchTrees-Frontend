import { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from 'components/Layout/Header/Header';
import Footer from 'components/Layout/Footer/Footer';
import GlobalMessageList from 'components/Common/UI/GlobalMessage/List/GlobalMessageList';
import VideoPage from 'pages/Video/VideoPage';
import VideoListPage from 'pages/Video/VideoListPage';
import VerificationPage from 'pages/Auth/VerificationPage';
import AccountPage from 'pages/User/AccountPage';
import UserVideoListPage from 'pages/User/UserVideoListPage';
import UploadPage from 'pages/Upload/UploadPage';
import HistoryPage from 'pages/User/HistoryPage';
import ChannelPage from 'pages/User/ChannelPage';
import LoginPage from 'pages/Auth/LoginPage';
import SendRecoveryPage from 'pages/Auth/SendRecoveryPage';
import ResetPasswordPage from 'pages/Auth/ResetPasswordPage';
import NotFoundPage from 'pages/Error/NotFoundPage';
import ProtectedRoute from 'service/ProtectedRoute';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchTokenOnload } from 'store/thunks/auth-thunk';
import './App.scss';

const App: React.FC = () => {
  const { refreshToken } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTokenOnload());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <GlobalMessageList />
      <Header />
      <main>
        <Switch>
          <Route component={VideoListPage} exact path="/" />
          <Route component={ChannelPage} exact path="/channel/:id" />
          <Route component={VideoPage} exact path="/video/:id" />
          <Route
            component={VerificationPage}
            exact
            path="/auth/verification/:token"
          />
          <ProtectedRoute
            require={!refreshToken}
            component={LoginPage}
            exact
            path="/auth"
          />
          <ProtectedRoute
            require={!refreshToken}
            component={SendRecoveryPage}
            exact
            path="/auth/recovery"
          />
          <ProtectedRoute
            require={!refreshToken}
            component={ResetPasswordPage}
            exact
            path="/auth/reset-password/:token"
          />
          <ProtectedRoute
            require={refreshToken}
            component={AccountPage}
            exact
            path="/user/account"
            redirect="/auth"
          />
          <ProtectedRoute
            require={refreshToken}
            component={UserVideoListPage}
            exact
            path="/user/videos"
            redirect="/auth"
          />
          <ProtectedRoute
            require={refreshToken}
            component={HistoryPage}
            exact
            path="/user/history"
            redirect="/auth"
          />
          <ProtectedRoute
            require={refreshToken}
            component={UploadPage}
            exact
            path="/upload"
            redirect="/auth"
          />
          <ProtectedRoute
            require={refreshToken}
            component={UploadPage}
            exact
            path="/upload/:id"
            redirect="/auth"
          />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
