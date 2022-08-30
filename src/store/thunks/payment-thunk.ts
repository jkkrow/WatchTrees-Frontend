import { AppThunk } from 'store';
import { PremiumPlan } from 'store/slices/user-slice';

export const fetchClientToken = (): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.get('/payment/client-token');

    return data;
  };
};

export const checkoutSubscription = (
  nonce: string,
  plan: PremiumPlan['name']
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post(`/payment/subscription/${plan}`, {
      nonce,
    });

    return data;
  };
};
