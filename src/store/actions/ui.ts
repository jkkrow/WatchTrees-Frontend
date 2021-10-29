import { AppDispatch } from 'store';
import { Message, uiActions } from 'store/reducers/ui';

export const loadMessage = (message: Message) => {
  return (dispatch: AppDispatch) => {
    dispatch(uiActions.setMessage(message));
  };
};

export const clearMessage = (message: Message) => {
  return (dispatch: AppDispatch) => {
    dispatch(uiActions.clearMessage(message));
  };
};
