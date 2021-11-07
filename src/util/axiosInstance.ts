import axios from 'axios';
import { useAppSelector, useAppDispatch } from 'hooks/store-hook';

const useAxios = () => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const refreshTokenStorage = localStorage.getItem('refreshToken');

    const refreshToken = refreshTokenStorage
      ? JSON.parse(refreshTokenStorage)
      : null;

    if (refreshToken) {
    }
  });
};
