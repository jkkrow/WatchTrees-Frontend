import PremiumPlan from '../Plan/PremiumPlan';
import { ReactComponent as FilmIcon } from 'assets/icons/film.svg';
import './PremiumDashboard.scss';

const PremiumDashboard: React.FC = () => {
  return (
    <div className="premium-dashboard">
      <h2>Subscrbe for Premium Account</h2>
      <p>Upgrade your account to be available for various features</p>
      <PremiumPlan
        label={<FilmIcon />}
        name={'Standard'}
        price={19.99}
        description={[
          'Fully available video upload',
          'Supports video convert with CMAF format',
        ]}
      />
    </div>
  );
};

export default PremiumDashboard;
