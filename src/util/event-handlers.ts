export const beforeunloadHandler = (event) => {
  event.preventDefault();
  event.returnValue = '';
};
