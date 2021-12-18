import './Radio.scss';

interface RadioProps {
  name: string;
  options: string[];
  initialValue?: string;
  onRadioChange: (value: string) => void;
}

const Radio: React.FC<RadioProps> = ({
  name,
  options,
  initialValue,
  onRadioChange,
}) => {
  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRadioChange(event.target.value);
  };

  return (
    <div className="radio__list">
      {options.map((option, index) => (
        <label key={option} className="radio__item">
          <input
            type="radio"
            name={name}
            defaultChecked={
              initialValue ? option === initialValue : index === 0
            }
            value={option}
            onChange={radioHandler}
          />
          <span className="radio__checkmark" />
          <span>{option[0].toUpperCase() + option.substring(1)}</span>
        </label>
      ))}
    </div>
  );
};

export default Radio;
