import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_INPUT":
      let isFormValid = true;

      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }

        if (inputId === action.inputId) {
          isFormValid = isFormValid && action.isValid;
        } else {
          isFormValid = isFormValid && state.inputs[inputId].isValid;
        }
      }

      return {
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: isFormValid,
      };

    case "SET_DATA":
      return {
        inputs: action.inputData,
        isValid: action.isFormValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: false,
  });

  const setFormInput = useCallback((inputId, value, isValid) => {
    dispatch({
      type: "SET_INPUT",
      inputId,
      value,
      isValid,
    });
  }, []);

  const setFormData = useCallback((inputData, isFormValid) => {
    dispatch({
      type: "SET_DATA",
      inputData,
      isFormValid,
    });
  }, []);

  return { formState, setFormInput, setFormData };
};
