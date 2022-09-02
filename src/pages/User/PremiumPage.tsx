import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

import PremiumDashboard from 'components/User/Premium/Dashboard/PremiumDashboard';
import PremiumCheckout from 'components/User/Premium/Checkout/PremiumCheckout';
import { PremiumPlan } from 'store/slices/user-slice';

const plans: PremiumPlan[] = [
  {
    name: 'standard',
    price: 19,
    description: [
      'Fully available video upload',
      'Supports video convert with CMAF format',
    ],
  },
  // { name: 'business', price: 99 },
  // { name: 'enterprise', price: 199 },
];

const PremiumPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const selectedPlan = useMemo(() => {
    const name = searchParams.get('name');
    return plans.find((plan) => plan.name === name);
  }, [searchParams]);

  return (
    <Fragment>
      <Helmet>
        <title>Premium - WatchTrees</title>
      </Helmet>

      {!selectedPlan && <PremiumDashboard plans={plans} />}
      {selectedPlan && <PremiumCheckout plan={selectedPlan} />}
    </Fragment>
  );
};

export default PremiumPage;
