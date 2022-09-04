import { useEffect, lazy, Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from 'pages/Video/HomePage';
import RecentPage from 'pages/Video/RecentPage';
import FeaturedPage from 'pages/Video/FeaturedPage';
import SearchPage from 'pages/Video/SearchPage';
import VideoPage from 'pages/Video/VideoPage';
import HistoryPage from 'pages/Video/HistoryPage';
import ChannelPage from 'pages/Video/ChannelPage';

import Header from 'components/Layout/Header/Header';
import Main from 'components/Layout/Main/Main';
import Footer from 'components/Layout/Footer/Footer';
import GlobalMessageList from 'components/Layout/GlobalMessage/List/GlobalMessageList';
import RouteProvider from 'providers/RouteProvider';
import { useAppThunk, useAppSelector } from 'hooks/common/store';
import {
  useStorageWatcher,
  useAuthWatcher,
  useUploadWatcher,
} from 'hooks/common/watch';
import { setAuthOnload } from 'store/thunks/auth-thunk';
import { updateUserData } from 'store/thunks/user-thunk';
import { isPremium } from 'util/user';
import 'styles/index.scss';

const CreatedVideosPage = lazy(() => import('pages/Video/CreatedVideosPage'));
const UploadPage = lazy(() => import('pages/Upload/UploadPage'));
const LoginPage = lazy(() => import('pages/Auth/LoginPage'));
const AccountPage = lazy(() => import('pages/User/AccountPage'));
const SubscribesPage = lazy(() => import('pages/User/SubscribesPage'));
const SubscribersPage = lazy(() => import('pages/User/SubscribersPage'));
const VerificationPage = lazy(() => import('pages/Auth/VerificationPage'));
const SendRecoveryPage = lazy(() => import('pages/Auth/SendRecoveryPage'));
const ResetPasswordPage = lazy(() => import('pages/Auth/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('pages/Error/NotFoundPage'));
const FavoritesPage = lazy(() => import('pages/Video/FavoritesPage'));
const PremiumPage = lazy(() => import('pages/User/PremiumPage'));

const App: React.FC = () => {
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const userData = useAppSelector((state) => state.user.userData);
  const { dispatchThunk } = useAppThunk();

  useStorageWatcher('refreshToken', refreshToken);
  useStorageWatcher('userData', userData);
  useAuthWatcher();
  useUploadWatcher();

  useEffect(() => {
    (async () => {
      const isLoggedIn = await dispatchThunk(setAuthOnload());
      isLoggedIn && (await dispatchThunk(updateUserData()));
    })();
  }, [dispatchThunk]);

  return (
    <Fragment>
      <Header />
      <GlobalMessageList />
      <Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/featured" element={<FeaturedPage />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/history" element={<HistoryPage />} />

          <Route path="/auth/recovery" element={<SendRecoveryPage />} />
          <Route
            path="/auth/verification/:token"
            element={<VerificationPage />}
          />
          <Route
            path="/auth/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          <Route element={<RouteProvider on={!userData} redirect="/" />}>
            <Route path="/auth" element={<LoginPage />} />
          </Route>

          <Route
            element={
              <RouteProvider
                on={!!userData && !isPremium(userData)}
                redirect="/user/account"
              />
            }
          >
            <Route path="/premium" element={<PremiumPage />} />
          </Route>

          <Route element={<RouteProvider on={!!userData} redirect="/auth" />}>
            <Route path="/user/account" element={<AccountPage />} />
            <Route path="/user/videos" element={<CreatedVideosPage />} />
            <Route path="/user/subscribes" element={<SubscribesPage />} />
            <Route path="/user/subscribers" element={<SubscribersPage />} />
            <Route path="/user/favorites" element={<FavoritesPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/upload/:id" element={<UploadPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Main>
      <Footer />
    </Fragment>
  );
};

export default App;
