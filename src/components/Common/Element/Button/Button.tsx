import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import './Button.scss';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  inversed?: boolean;
  small?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  small,
  loading,
  disabled,
  invalid,
  inversed,
  children,
}) => {
  return (
    <button
      className={`btn${invalid ? ' invalid' : ''}${
        inversed ? ' inversed' : ''
      }`}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        position: loading ? 'relative' : undefined,
        width: small ? 'initial' : '',
      }}
    >
      {children}
      <LoadingSpinner on={!!loading} overlay />
    </button>
  );
};

export default Button;
