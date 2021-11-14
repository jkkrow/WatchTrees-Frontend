import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Response from 'components/Common/UI/Response/Response';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import { useForm } from 'hooks/form-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { sendRecoveryEmail } from 'store/thunks/auth-thunk';
import { VALIDATOR_EMAIL } from 'util/validators';

const SendRecoveryEmailPage: React.FC = () => {
  const { loading, error, message } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { formState, setFormInput } = useForm({
    email: { value: '', isValid: false },
  });

  const submitHandler = (): void => {
    if (!formState.isValid) return;

    dispatch(sendRecoveryEmail(formState.inputs.email.value));
  };

  return (
    <AuthLayout>
      <Response type={error ? 'error' : 'message'} content={error || message} />
      {!message && (
        <Form onSubmit={submitHandler}>
          <Input
            id="email"
            formInput
            autoFocus
            autoComplete="email"
            label="Email *"
            validators={[VALIDATOR_EMAIL()]}
            onForm={setFormInput}
          />
          <Button loading={loading}>SEND RECOVERY EMAIL</Button>
        </Form>
      )}
    </AuthLayout>
  );
};

export default SendRecoveryEmailPage;
