import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import Response from 'components/Common/UI/Response/Response';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import { useForm } from 'hooks/form-hook';
import { useAppThunk } from 'hooks/store-hook';
import { sendRecovery } from 'store/thunks/auth-thunk';
import { VALIDATOR_EMAIL } from 'util/validators';
import 'styles/auth.scss';

const SendRecoveryPage: React.FC = () => {
  const {
    dispatchThunk,
    loading,
    error,
    data: message,
  } = useAppThunk<string | null>(null);

  const { formState, setFormInput } = useForm({
    email: { value: '', isValid: false },
  });

  const submitHandler = (): void => {
    if (!formState.isValid) return;

    dispatchThunk(sendRecovery(formState.inputs.email.value), {
      errorMessage: false,
    });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Recover Password - WatchTrees</title>
      </Helmet>
      <div className="auth-page">
        <Response
          type={error ? 'error' : 'message'}
          content={error || message}
        />
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
      </div>
    </Fragment>
  );
};

export default SendRecoveryPage;
