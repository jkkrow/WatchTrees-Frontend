import { useState, Children, cloneElement } from 'react';

import './Form.scss';

interface FormProps {
  className?: string;
  style?: React.CSSProperties;
  onSubmit: (event: React.FormEvent) => void;
}

const Form: React.FC<FormProps> = ({
  className,
  style,
  children,
  onSubmit,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitHandler = (event: React.FormEvent): void => {
    event.preventDefault();
    setIsSubmitted(true);

    onSubmit(event);
  };

  return (
    <form
      className={`form${className ? className : ''}`}
      style={style}
      onSubmit={submitHandler}
    >
      {Children.map(children, (child: any) =>
        cloneElement(child, { isValidated: isSubmitted })
      )}
    </form>
  );
};

export default Form;
