import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'components/Common/Element/Button/Button';
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
  const navigate = useNavigate();

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
      <Button onClick={() => navigate(`?name=${name.toLowerCase()}`)}>
        START PLAN
      </Button>
    </div>
  );
};

export default PremiumPlan;
