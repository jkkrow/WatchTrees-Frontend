import { Fragment, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, useNavigate } from 'react-router-dom';

import PremiumDashboard from 'components/Payment/Premium/Dashboard/PremiumDashboard';
import PremiumCheckout from 'components/Payment/Premium/Checkout/PremiumCheckout';
import { useAppSelector } from 'hooks/common/store';
import { PremiumPlan } from 'store/slices/user-slice';
import { isPremium } from 'util/user';

const plans: PremiumPlan[] = [
  {
    name: 'standard',
    price: 19,
    description: [
      'Fully available video upload',
      'Supports video convert with CMAF format',
    ],
  },
];

const PremiumPage: React.FC = () => {
  const { userData } = useAppSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedPlan = useMemo(() => {
    const name = searchParams.get('name');
    return plans.find((plan) => plan.name === name);
  }, [searchParams]);

  useEffect(() => {
    if (!userData || isPremium(userData)) {
      navigate('/user/account');
    }
  }, [userData, navigate]);

  const successHandler = (subscriptionId: string) => {
    navigate(`/receipt/${subscriptionId}`, {
      state: {
        type: 'subscription',
        message: "You're now available of premium features",
      },
    });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Premium - WatchTrees</title>
      </Helmet>

      {!selectedPlan && <PremiumDashboard plans={plans} />}
      {selectedPlan && (
        <PremiumCheckout plan={selectedPlan} onSuccess={successHandler} />
      )}
    </Fragment>
  );
};

export default PremiumPage;
