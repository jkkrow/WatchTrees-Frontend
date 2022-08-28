import PremiumPlan from '../Plan/PremiumPlan';
import { ReactComponent as FilmIcon } from 'assets/icons/film.svg';
import { PremiumPlan as PremiumPlanType } from 'store/slices/user-slice';
import './PremiumDashboard.scss';

interface PremiumDashboardProps {
  plans: PremiumPlanType[];
}

const PremiumDashboard: React.FC<PremiumDashboardProps> = ({ plans }) => {
  return (
    <div className="premium-dashboard">
      <h2>Subscribe for Premium Account</h2>
      <p>Upgrade your account to be available for various features</p>

      <div className="premium-dashboard__plans">
        {plans.map((plan) => (
          <PremiumPlan
            key={plan.name}
            label={<FilmIcon />}
            name={plan.name}
            price={plan.price}
            description={plan.description}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumDashboard;
