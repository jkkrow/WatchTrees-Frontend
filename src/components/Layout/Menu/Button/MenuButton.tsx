import './MenuButton.scss';

interface MenuButtonProps {
  active: boolean;
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ active, onClick }) => {
  return (
    <div
      className={`menu-button${active ? ' active' : ''} link`}
      onClick={onClick}
    >
      <div className="menu-button__top" />
      <div className="menu-button__center" />
      <div className="menu-button__bottom" />
    </div>
  );
};

export default MenuButton;
