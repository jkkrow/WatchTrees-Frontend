import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import AuthLayout from 'components/Auth/Layout/AuthLayout';
import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import { useForm } from 'hooks/form-hook';
import { useAppThunk } from 'hooks/store-hook';
import { sendRecovery } from 'store/thunks/auth-thunk';
import { VALIDATOR_EMAIL } from 'util/validators';

const SendRecoveryPage: React.FC = () => {
  const { dispatchThunk, loading } = useAppThunk();

  const { formState, setFormInput } = useForm({
    email: { value: '', isValid: false },
  });

  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!formState.isValid) return;

    await dispatchThunk(sendRecovery(formState.inputs.email.value), {
      response: { timer: 5000 },
    });

    navigate('/auth');
  };

  return (
    <Fragment>
      <Helmet>
        <title>Recover Password - WatchTrees</title>
      </Helmet>
      <AuthLayout>
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
      </AuthLayout>
    </Fragment>
  );
};

export default SendRecoveryPage;
