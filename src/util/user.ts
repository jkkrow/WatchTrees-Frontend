import { UserData } from 'store/slices/user-slice';

export const isPremium = (userData: UserData) => {
  return (
    userData.premium.expiredAt &&
    new Date(userData.premium.expiredAt) > new Date()
  );
};

export const isPremiumButCancelled = (userData: UserData) => {
  return isPremium(userData) && !userData.premium.active;
};
