import { AppThunk } from 'store';
import { userActions, PremiumPlan } from 'store/slices/user-slice';

export const createSubscription = (planName: PremiumPlan['name']): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/payment/subscriptions/', {
      planName,
    });

    return data;
  };
};

export const captureSubscription = (subscriptionId: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post(
      `/payment/subscriptions/${subscriptionId}/capture`
    );

    dispatch(userActions.setUserData({ premium: data.premium }));

    return data;
  };
};
