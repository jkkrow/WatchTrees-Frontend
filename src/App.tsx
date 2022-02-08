import { useEffect, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import VideoPage from 'pages/Video/VideoPage';
import VideoListPage from 'pages/Video/VideoListPage';
import HistoryPage from 'pages/Video/HistoryPage';
import ChannelPage from 'pages/Video/ChannelPage';

import Header from 'components/Layout/Header/Header';
import Main from 'components/Layout/Main/Main';
import Footer from 'components/Layout/Footer/Footer';
import GlobalMessageList from 'components/Layout/GlobalMessage/List/GlobalMessageList';
import RequireAuth from 'service/RequireAuth';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import {
  useStorageWatcher,
  useAuthWatcher,
  useUploadWatcher,
} from 'hooks/watch-hook';
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
  const dispatch = useAppDispatch();

  useStorageWatcher('refreshToken', refreshToken);
  useStorageWatcher('userData', userData);
  useAuthWatcher();
  useUploadWatcher();

  useEffect(() => {
    dispatch(fetchTokenOnload());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Main>
        <GlobalMessageList />
        <Routes>
          <Route path="/" element={<VideoListPage />} />
          <Route path="video/:id" element={<VideoPage />} />
          <Route path="channel/:id" element={<ChannelPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="auth" element={<LoginPage />} />
          <Route path="auth/recovery" element={<SendRecoveryPage />} />
          <Route
            path="auth/verification/:token"
            element={<VerificationPage />}
          />
          <Route
            path="auth/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route element={<RequireAuth />}>
            <Route path="user/account" element={<AccountPage />} />
            <Route path="user/videos" element={<MyVideoListPage />} />
            <Route path="user/favorites" element={<FavoritesPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="upload/:id" element={<UploadPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
