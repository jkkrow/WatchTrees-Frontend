import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'components/Common/Element/Button/Button';
import { useAppSelector } from 'hooks/common/store';
import './PremiumPlan.scss';

interface PremiumPlanProps {
  label?: ReactNode;
  name: string;
  price: number;
  description: string[];
}

const PremiumPlan: React.FC<PremiumPlanProps> = ({
  label,
  name,
  price,
  description,
}) => {
  const userData = useAppSelector((state) => state.user.userData!);
  const navigate = useNavigate();

  const isSubscribing = !!userData.premium && userData.premium.name === name;

  const navigateHandler = () => {
    navigate(`?name=${name}`);
  };

  return (
    <div className="premium-plan">
      <div className="premium-plan__label">{label}</div>
      <h2 className="premium-plan__name">{name}</h2>
      <h3 className="premium-plan__price">${price}</h3>
      <ul className="premium-plan__description">
        {description.map((desc) => (
          <li key={desc}>{desc}</li>
        ))}
      </ul>
      <Button disabled={isSubscribing} onClick={navigateHandler}>
        {isSubscribing ? 'Currently Subscribed' : 'Start Plan'}
      </Button>
    </div>
  );
};

export default PremiumPlan;
