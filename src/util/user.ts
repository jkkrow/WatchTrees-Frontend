import { UserData } from 'store/types/user';

export const isPremium = (userData: UserData | null) => {
  return (
    !!userData &&
    userData.isVerified &&
    !!userData.premium &&
    new Date(userData.premium.expiredAt) > new Date()
  );
};

export const isPremiumButCancelled = (userData: UserData | null) => {
  return isPremium(userData) && userData?.premium?.isCancelled;
};
