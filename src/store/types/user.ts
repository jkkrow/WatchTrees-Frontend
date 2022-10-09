export interface UserData {
  _id: string;
  type: 'native' | 'google';
  name: string;
  email: string;
  picture: string;
  isVerified: boolean;
  premium: UserPremium | null;
}

export interface UserPremium {
  id: string;
  name: PremiumPlan['name'];
  expiredAt: string;
  isCancelled: boolean;
}

export interface ChannelData {
  _id: string;
  name: string;
  picture: string;
  videos: number;
  subscribers: number;
  isSubscribed: boolean;
}

export interface PremiumPlan {
  name: 'Standard' | 'Business' | 'Enterprise';
  price: number;
  description: string[];
}
