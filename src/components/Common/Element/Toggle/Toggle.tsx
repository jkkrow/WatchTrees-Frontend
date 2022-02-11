import './Toggle.scss';

interface ToggleProps {
  name?: string;
  initialChecked?: boolean;
  onClick: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ name, initialChecked, onClick }) => {
  const toggleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onClick(event.target.checked);
  };

  return (
    <div className="toggle">
      {name}
      <label>
        <input
          type="checkbox"
          hidden
          defaultChecked={initialChecked}
          onChange={toggleHandler}
        />
        <div className="toggle__container">
          <div className="toggle__button" />
        </div>
      </label>
    </div>
  );
};

export default Toggle;
