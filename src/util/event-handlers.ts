export const beforeunloadHandler = (event: BeforeUnloadEvent): void => {
  event.preventDefault();
  event.returnValue = '';
};
