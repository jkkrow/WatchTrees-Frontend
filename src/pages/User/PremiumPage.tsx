import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

import PremiumDashboard from 'components/User/Premium/Dashboard/PremiumDashboard';
import PremiumPayment from 'components/User/Premium/Payment/PremiumPayment';

const PremiumPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const selectedPlan = useMemo(() => searchParams.get('name'), [searchParams]);

  return (
    <Fragment>
      <Helmet>
        <title>Premium - WatchTrees</title>
      </Helmet>

      {!selectedPlan && <PremiumDashboard />}
      {selectedPlan && <PremiumPayment />}
    </Fragment>
  );
};

export default PremiumPage;
