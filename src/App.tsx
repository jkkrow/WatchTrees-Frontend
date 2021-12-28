import { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from 'components/Layout/Header/Header';
import Footer from 'components/Layout/Footer/Footer';
import GlobalMessageList from 'components/Common/UI/GlobalMessage/List/GlobalMessageList';
import VideoPage from 'pages/Video/VideoPage';
import VideoListPage from 'pages/Video/VideoListPage';
import MyVideoListPage from 'pages/Video/MyVideoListPage';
import HistoryPage from 'pages/Video/HistoryPage';
import ChannelPage from 'pages/Video/ChannelPage';
import UploadPage from 'pages/Upload/UploadPage';
import LoginPage from 'pages/User/LoginPage';
import AccountPage from 'pages/User/AccountPage';
import VerificationPage from 'pages/User/VerificationPage';
import SendRecoveryPage from 'pages/User/SendRecoveryPage';
import ResetPasswordPage from 'pages/User/ResetPasswordPage';
import NotFoundPage from 'pages/Error/NotFoundPage';
import ProtectedRoute from 'service/ProtectedRoute';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { fetchTokenOnload } from 'store/thunks/user-thunk';
import './App.scss';
import FavoritesPage from 'pages/Video/FavoritesPage';

const App: React.FC = () => {
  const { refreshToken } = useAppSelector((state) => state.user);

  const { dispatch } = useAppDispatch();

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
          <Route component={VideoPage} exact path="/video/:id" />
          <Route component={ChannelPage} exact path="/channel/:id" />
          <Route component={HistoryPage} exact path="/history" />
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
            component={MyVideoListPage}
            exact
            path="/user/videos"
            redirect="/auth"
          />
          <ProtectedRoute
            require={refreshToken}
            component={FavoritesPage}
            exact
            path="/user/favorites"
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
