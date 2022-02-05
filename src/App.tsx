import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import VideoPage from 'pages/Video/VideoPage';
import VideoListPage from 'pages/Video/VideoListPage';
import HistoryPage from 'pages/Video/HistoryPage';
import ChannelPage from 'pages/Video/ChannelPage';

import Header from 'components/Layout/Header/Header';
import Footer from 'components/Layout/Footer/Footer';
import LoadingSpinner from 'components/Common/UI/Loader/LoadingSpinner';
import GlobalMessageList from 'components/Common/UI/GlobalMessage/List/GlobalMessageList';
import ProtectedRoute from 'service/ProtectedRoute';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { authActions } from 'store/slices/auth-slice';
import { fetchTokenOnload } from 'store/thunks/auth-thunk';
import 'styles/index.scss';

const MyVideoListPage = lazy(() => import('pages/Video/MyVideoListPage'));
const UploadPage = lazy(() => import('pages/Upload/UploadPage'));
const LoginPage = lazy(() => import('pages/Auth/LoginPage'));
const AccountPage = lazy(() => import('pages/User/AccountPage'));
const VerificationPage = lazy(() => import('pages/Auth/VerificationPage'));
const SendRecoveryPage = lazy(() => import('pages/Auth/SendRecoveryPage'));
const ResetPasswordPage = lazy(() => import('pages/Auth/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('pages/Error/NotFoundPage'));
const FavoritesPage = lazy(() => import('pages/Video/FavoritesPage'));

const App: React.FC = () => {
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const userData = useAppSelector((state) => state.user.userData);
  const uploadTree = useAppSelector((state) => state.upload.uploadTree);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTokenOnload());
  }, [dispatch]);

  useEffect(() => {
    refreshToken
      ? localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
      : localStorage.removeItem('refreshToken');
  }, [refreshToken]);

  useEffect(() => {
    userData
      ? localStorage.setItem('userData', JSON.stringify(userData))
      : localStorage.removeItem('userData');
  }, [userData]);

  useEffect(() => {
    const beforeunloadHandler = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
      event.returnValue = '';
    };

    uploadTree
      ? window.addEventListener('beforeunload', beforeunloadHandler)
      : window.removeEventListener('beforeunload', beforeunloadHandler);
  }, [uploadTree]);

  useEffect(() => {
    window.addEventListener('storage', (event) => {
      if (event.key !== 'refreshToken') return;

      if (event.oldValue && !event.newValue) {
        dispatch(authActions.signout());
      }
    });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <GlobalMessageList />
      <Header />
      <main>
        <Suspense fallback={<LoadingSpinner overlay />}>
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
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
