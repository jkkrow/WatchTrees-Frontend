import { AppThunk } from 'store';

export const fetchClientToken = (): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.get('/payment/client-token');

    return data;
  };
};
