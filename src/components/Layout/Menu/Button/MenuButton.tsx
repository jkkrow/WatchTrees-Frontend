import { useEffect, useState } from 'react';
import './MenuButton.scss';

interface MenuButtonProps {
  active: boolean;
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ active, onClick }) => {
  const [isUsed, setIsUsed] = useState(false);

  useEffect(() => {
    if (isUsed || !active) return;

    setIsUsed(true);
  }, [active, isUsed]);

  return (
    <div className="menu-button btn" onClick={onClick}>
      <div
        className={`menu-button__container${active ? ' on' : ''}${
          isUsed && !active ? ' off' : ''
        }`}
      >
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default MenuButton;
