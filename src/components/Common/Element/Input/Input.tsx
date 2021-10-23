import { useEffect, useReducer } from 'react';

import { validate, ValidatorAction } from 'util/validators';
import './Input.scss';

interface State {
  value: string;
  isValid: boolean;
  isBlured: boolean;
}

type Action =
  | { type: 'CHANGE'; value: string }
  | { type: 'FORM_CHANGE'; value: string; validators: ValidatorAction[] }
  | { type: 'FORM_BLUR' };

const inputReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.value,
      };

    case 'FORM_CHANGE':
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case 'FORM_BLUR':
      return {
        ...state,
        isBlured: true,
      };
    default:
      return state;
  }
};

interface InputProps {
  formInput?: boolean;
  isValidated?: boolean;
  type?: 'text' | 'password' | 'number' | 'textarea';
  id: string;
  label?: string;
  value?: string;
  initialValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  validators?: ValidatorAction[];
  message?: string;
  rows?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler;
  onForm: (id: string, value: string, isValid: boolean) => void;
}

const Input: React.FC<InputProps> = ({
  formInput,
  isValidated,
  type = 'text',
  id,
  label,
  value,
  initialValue,
  placeholder,
  autoFocus,
  autoComplete = 'off',
  validators,
  message,
  rows,
  onChange,
  onTextAreaChange,
  onBlur,
  onForm,
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue || '',
    isValid: formInput ? false : true,
    isBlured: false,
  });

  useEffect(() => {
    if (formInput) {
      onForm(id, inputState.value, inputState.isValid);
    }
  }, [formInput, onForm, id, inputState]);

  const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    formInput
      ? dispatch({
          type: 'FORM_CHANGE',
          value: event.target.value,
          validators: validators!,
        })
      : dispatch({
          type: 'CHANGE',
          value: event.target.value,
        });
  };

  const textareaChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    formInput
      ? dispatch({
          type: 'FORM_CHANGE',
          value: event.target.value,
          validators: validators!,
        })
      : dispatch({
          type: 'CHANGE',
          value: event.target.value,
        });
  };

  const inputBlurHandler: React.FocusEventHandler = () => {
    dispatch({ type: 'FORM_BLUR' });
  };

  const element =
    type === 'textarea' ? (
      <textarea
        id={id}
        rows={rows || 5}
        placeholder={placeholder || label}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        value={value || inputState.value}
        onChange={onTextAreaChange || textareaChangeHandler}
        onBlur={onBlur || inputBlurHandler}
      />
    ) : (
      <input
        id={id}
        type={type}
        placeholder={placeholder || label}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        value={value || inputState.value}
        onChange={onChange || inputChangeHandler}
        onBlur={onBlur || inputBlurHandler}
      />
    );

  return (
    <div
      className={`input__container${
        isValidated && !inputState.isValid ? ' invalid' : ''
      }`}
    >
      {element}
      {label && <label htmlFor={id}>{label}</label>}
      {message && (
        <div>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
